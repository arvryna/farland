package server

import (
	"net/http"

	"github.com/arvryna/farland/internal/store"
	"github.com/gin-gonic/gin"
)

type Server struct {
	storage *store.Store
}

func NewServer(s *store.Store) *Server {
	return &Server{s}
}

// PORT number :":9090" (example)
func (s *Server) Start(port string) {
	router := gin.Default()
	// Enable CORS middleware
	router.Use(corsMiddleware())

	s.registerRoutes(router)

	router.Run(port)
}

func (s *Server) registerRoutes(router *gin.Engine) {
	router.GET("/events", func(c *gin.Context) {
		c.JSON(http.StatusOK, s.storage.GetEvents())
	})

	router.GET("/collections", func(c *gin.Context) {
		address := c.Query("address")
		c.JSON(http.StatusOK, s.storage.GetCollections(address))
	})

	router.GET("/nfts", func(c *gin.Context) {
		address := c.Query("address")
		c.JSON(http.StatusOK, s.storage.GetNFTs(address))
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
