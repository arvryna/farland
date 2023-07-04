package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"

	"github.com/arvryna/farland/internal/dto"
	"github.com/arvryna/farland/internal/nft"
	"github.com/arvryna/farland/internal/server"
	"github.com/arvryna/farland/internal/store"
	"github.com/arvryna/farland/internal/util"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

// Lets fetch these from the env
const ContractAddress = "0xdd603b907512369155621b80a52d5da6af0b5c7e"

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(".env not found")
	}

	nodeToken := os.Getenv("NODE_TOKEN")
	nodeSocketURL := "wss://eth-sepolia.g.alchemy.com/v2/" + nodeToken

	// Set up WSS connection to Ethereum node
	client, err := ethclient.Dial(nodeSocketURL)

	if err != nil {
		log.Fatal("can't start the node", err)
	}

	fmt.Println("Listening to events on =>", nodeSocketURL)

	store := store.NewStore()
	server := server.NewServer(store)

	go server.Start(":8080")
	go eventListener(client, store)

	// Improvement: We can add some logic here to handle graceful shutdown.
	util.Wait()
}

func eventListener(client *ethclient.Client, storage *store.Store) {
	contractAbi, err := abi.JSON(strings.NewReader(nft.ContractABI))
	if err != nil {
		log.Fatal("can't parse contract abi", err)
	}

	// Contract address and ABI
	contractAddress := common.HexToAddress(ContractAddress)
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal("Subscription failed: ", err)
	}

	// Events to look for.

	newCollectionEvent := contractAbi.Events["CollectionCreated"].ID.Hex()
	mintEvent := contractAbi.Events["TokenMinted"].ID.Hex()
	for {
		select {
		case err := <-sub.Err():
			log.Fatal(err)
		case vLog := <-logs:

			switch vLog.Topics[0].Hex() {
			case newCollectionEvent:
				event := make(map[string]interface{})
				err := contractAbi.UnpackIntoMap(event, "CollectionCreated", vLog.Data)
				if err != nil {
					log.Printf("Failed to decode CollectionCreated event: %v", err)
					continue
				}

				collectionCreated := dto.CollectionCreatedEvent{
					Name:              event["name"].(string),
					Symbol:            event["symbol"].(string),
					CollectionAddress: event["collectionAddress"].(common.Address),
					Recipient:         event["recipient"].(common.Address),
				}

				fmt.Println(">> Collection Created:", collectionCreated)

				// Storing the events
				storage.AppendEvent(&dto.Event{
					Name:              collectionCreated.Name,
					Symbol:            collectionCreated.Symbol,
					EventType:         dto.EventTypeCollection,
					CollectionAddress: collectionCreated.CollectionAddress.Hex(),
					OwnerAddress:      collectionCreated.Recipient.Hex(),
				})

				storage.AppendCollection(&dto.Collection{
					Name:              collectionCreated.Name,
					Symbol:            collectionCreated.Symbol,
					CollectionAddress: collectionCreated.CollectionAddress.Hex(),
					OwnerAddress:      collectionCreated.Recipient.Hex(),
				})

			case mintEvent:
				event := make(map[string]interface{})
				err := contractAbi.UnpackIntoMap(event, "TokenMinted", vLog.Data)
				if err != nil {
					log.Printf("Failed to decode TokenMinted event: %v", err)
					continue
				}

				mintedEvent := dto.TokenMintedEvent{
					TokenID:           event["tokenId"].(*big.Int),
					TokenURI:          event["tokenUri"].(string),
					CollectionAddress: event["collectionAddress"].(common.Address),
					Recipient:         event["recipient"].(common.Address),
				}

				fmt.Println(">> New NFT Minted", mintedEvent)

				// Storing the events
				storage.AppendEvent(&dto.Event{
					TokenId:           mintedEvent.TokenID.Int64(),
					TokenUri:          mintedEvent.TokenURI,
					EventType:         dto.EventTypeNFTMint,
					OwnerAddress:      mintedEvent.Recipient.Hex(),
					CollectionAddress: mintedEvent.CollectionAddress.Hex(),
				})

				storage.AppendNFT(&dto.NFT{
					TokenId:           mintedEvent.TokenID.Int64(),
					TokenUri:          mintedEvent.TokenURI,
					OwnerAddress:      mintedEvent.Recipient.Hex(),
					CollectionAddress: mintedEvent.CollectionAddress.Hex(),
				})
			}
		}
	}
}
