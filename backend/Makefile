build:
	rm -rf build
	mkdir build
	go build -o build/farland main.go
	echo "Binary is built"

package:
	rm -rf build
	mkdir build
	go build -o build/farland main.go
	sudo cp build/farland /usr/local/bin/
	echo "binary is now locally available"

# First run build target and then call deploy script
deploy:
	rm -rf build
	mkdir build
	go build -o build/farland main.go
	echo "Binary is built"
	sh pack.sh

test:
