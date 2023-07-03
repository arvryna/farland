// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTCollectionCreator is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    event CollectionCreated(address collectionAddress, string name, string symbol, address recipient);
    event TokenMinted(address collectionAddress, address recipient, uint256 tokenId, string tokenUri);

    function createCollection(string memory name, string memory symbol) external {
        NFTCollection collection = new NFTCollection(name, symbol, msg.sender);
        emit CollectionCreated(address(collection), name, symbol, msg.sender);
    }

    function mintNFT(address collectionAddress, string memory tokenUri) external nonReentrant {
        NFTCollection collection = NFTCollection(collectionAddress);

        // Collection owner validation
        require(msg.sender == collection.owner(), "can't mint NFT, caller doesn't own the collection");

        uint256 tokenId = generateTokenId();
        collection.safeMint(msg.sender, tokenId, tokenUri);
        emit TokenMinted(collectionAddress, msg.sender, tokenId, tokenUri);
    }

    function generateTokenId() internal returns (uint256){
        _tokenIdCounter.increment();
        return _tokenIdCounter.current();
    }

}

contract NFTCollection is ERC721URIStorage {
    address private _owner;

    constructor(string memory name, string memory symbol, address collectionOwner) ERC721(name, symbol) {
        _owner = collectionOwner;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function safeMint(address recipient, uint256 tokenId, string memory tokenUri) external {
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenUri);
    }
}
