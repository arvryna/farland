package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"

	"github.com/arvryna/farland/internal/dto"
	"github.com/arvryna/farland/internal/server"
	"github.com/arvryna/farland/internal/store"
	"github.com/arvryna/farland/internal/util"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

type CollectionCreatedEvent struct {
	CollectionAddress common.Address
	Name              string
	Symbol            string
}

type TokenMintedEvent struct {
	CollectionAddress common.Address
	Recipient         common.Address
	TokenID           *big.Int
	TokenURI          string
}

// Lets fetch these from the env
const NodeSocketURL = "wss://eth-sepolia.g.alchemy.com/v2/24_7GNLl5REZ_MKoQn1quNggvsh3F3D4"
const ContractAddress = "0x7B4a36E50aF2BC252f9ECF64A37145E7c16D0158"

func main() {
	// Set up WSS connection to Ethereum node
	client, err := ethclient.Dial(NodeSocketURL)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Listening to events on =>", NodeSocketURL)

	store := store.NewStore()
	server := server.NewServer(store)

	go server.Start(":8080")
	go eventListener(client, store)

	// Improvement: We can add some logic here to handle graceful shutdown.
	util.Wait()
}

func eventListener(client *ethclient.Client, storage *store.Store) {

	// Improvement: Can be fetched at runtime (skipping this to save time)
	contractABI := `[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"collectionAddress","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"}],"name":"CollectionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"collectionAddress","type":"address"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"tokenUri","type":"string"}],"name":"TokenMinted","type":"event"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"createCollection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"collectionAddress","type":"address"},{"internalType":"string","name":"tokenUri","type":"string"}],"name":"mintNFT","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
	contractAbi, err := abi.JSON(strings.NewReader(contractABI))
	if err != nil {
		log.Fatal(err)
	}

	// Contract address and ABI
	contractAddress := common.HexToAddress(ContractAddress)
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal(err)
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

				collectionCreated := CollectionCreatedEvent{
					CollectionAddress: event["collectionAddress"].(common.Address),
					Name:              event["name"].(string),
					Symbol:            event["symbol"].(string),
				}

				fmt.Println(">> Collection Created:", collectionCreated)

				// Storing the events
				storage.AppendEvent(&dto.Event{
					Name:              collectionCreated.Name,
					Symbol:            collectionCreated.Symbol,
					EventType:         dto.EventTypeCollection,
					CollectionAddress: collectionCreated.CollectionAddress.Hex(),
				})

			case mintEvent:
				event := make(map[string]interface{})
				err := contractAbi.UnpackIntoMap(event, "TokenMinted", vLog.Data)
				if err != nil {
					log.Printf("Failed to decode TokenMinted event: %v", err)
					continue
				}

				mintedEvent := TokenMintedEvent{
					TokenID:           event["tokenId"].(*big.Int),
					TokenURI:          event["tokenUri"].(string),
					CollectionAddress: event["collectionAddress"].(common.Address),
					Recipient:         event["recipient"].(common.Address),
				}

				fmt.Println(">> New NFT Minted", mintedEvent)
			}
		}
	}
}
