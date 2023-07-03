package store

import (
	"fmt"
	"strings"
	"time"

	"github.com/arvryna/farland/internal/dto"
)

type Store struct {
	events      []*dto.Event
	nfts        map[string][]*dto.NFT
	collections map[string][]*dto.Collection
}

func NewStore() *Store {
	nfts := make(map[string][]*dto.NFT)
	colls := make(map[string][]*dto.Collection)
	return &Store{nfts: nfts, collections: colls}
}

// Just collects all events in a single storage,
// an append only log
func (s *Store) AppendEvent(event *dto.Event) {
	event.CreatedAt = time.Now().Unix()

	// we can safely update this without any locks,
	// since only one single thread is writing this store
	s.events = append(s.events, event)
}

func (s *Store) AppendNFT(nft *dto.NFT) {
	nft.CreatedAt = time.Now().Unix()

	key := getNFTKey(nft.OwnerAddress)
	nfts := s.nfts[key]
	nfts = append(nfts, nft)
	s.nfts[key] = nfts
}

func (s *Store) AppendCollection(coll *dto.Collection) {
	coll.CreatedAt = time.Now().Unix()

	key := getCollectionKey(coll.OwnerAddress)
	colls := s.collections[key]
	colls = append(colls, coll)
	s.collections[key] = colls
}

func (s *Store) GetEvents() []*dto.Event {
	return s.events
}

func (s *Store) GetCollections(address string) []*dto.Collection {
	return s.collections[getCollectionKey(address)]

}

func (s *Store) GetNFTs(address string) []*dto.NFT {
	return s.nfts[getNFTKey(address)]
}

// ** Keyspace **
// This generated key will be stored as key for the hashmap
// we store all NFTs of a user in a hash map and all collections in another hashmap
func getNFTKey(address string) string {
	return fmt.Sprintf("nft-%s", strings.ToLower(address))
}

func getCollectionKey(address string) string {
	return fmt.Sprintf("collections-%s", strings.ToLower(address))
}
