import React from 'react'

import './myNft.css';
import { ethers } from "ethers";
import { Link } from 'react-router-dom';

import Gallery from '../components/Gallery'

const MyNfts = ({ account }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    return (
        <div class="container">
            {account ? (
                <div className='nftpage-container'>
                    <div className='header'>
                        <div className='Title'>My NFTs</div>
                        <div className='buttons'>
                            <Link className="menu" to={"/collections/new"}>Create Collection</Link>
                            <Link className="menu" to={"/nft/new"}>Mint NFT</Link>
                        </div>
                    </div>
                    <Gallery />
                </div>
            ) : (
                <h7>Connect your wallet to see NFTs that you've minted.</h7>
            )}
        </div>
    )
}

export default MyNfts