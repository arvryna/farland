package dto

const (
	EventTypeCollection = 1
	EventTypeNFTMint    = 2
)

type EventType int

type Event struct {
	Name              string    `json:"name"`
	Symbol            string    `json:"symbol"`
	TokenId           int64     `json:"token_id"`
	TokenUri          string    `json:"token_uri"`
	CollectionAddress string    `json:"collection_address"`
	OwnerAddress      string    `json:"owner_address"`
	EventType         EventType `json:"event_type"`
	CreatedAt         int64     `json:"created_at"` //Epoch
}

type Collection struct {
	Name              string `json:"name"`
	Symbol            string `json:"symbol"`
	CollectionAddress string `json:"collection_address"`
	OwnerAddress      string `json:"owner_address"`
	CreatedAt         int64  `json:"created_at"` //Epoch
}

type NFT struct {
	TokenId           int64  `json:"token_id"`
	TokenUri          string `json:"token_uri"`
	OwnerAddress      string `json:"owner_address"`
	CollectionAddress string `json:"collection_address"`
	CreatedAt         int64  `json:"created_at"` //Epoch
}
