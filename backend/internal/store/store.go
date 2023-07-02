package store

import (
	"time"

	"github.com/arvryna/farland/internal/dto"
)

type Store struct {
	events []*dto.Event
}

func NewStore() *Store {
	return &Store{}
}

// Just collects all events in a single storage,
// an append only log
func (s *Store) AppendEvent(event *dto.Event) {
	event.CreatedAt = time.Now().Unix()

	// we can safely update this without any locks,
	// since only one single thread is writing this store
	s.events = append(s.events, event)
}

func (s *Store) GetEvents() []*dto.Event {
	return s.events
}
