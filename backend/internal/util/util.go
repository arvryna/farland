package util

import (
	"os"
	"os/signal"
	"syscall"
)

func Wait() {
	var sig = make(chan os.Signal, 2)
	signal.Notify(sig, os.Interrupt, syscall.SIGQUIT, syscall.SIGTERM)
	<-sig
}
