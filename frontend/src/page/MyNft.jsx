import React from 'react'
import { Link } from 'react-router-dom';
import Gallery from '../components/Gallery'
import './myNft.css';

const MyNfts = ({ account, contractAddress }) => {

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
                <ui>
                    <h7>Please connect your wallet to see NFTs that you've minted.</h7>
                    <li>We are using <a href="https://sepoliafaucet.com/">Sepolia</a> Testnet</li>
                    <li>Please use Sepolia network in your Metamask(Preferably) wallet</li>
                    <li>
                        Deployed Contract:
                        <a href={`https://sepolia.etherscan.io/address/${contractAddress}`}>
                            {contractAddress}
                        </a>
                    </li>
                </ui>
            )}
        </div>
    )
}

export default MyNfts