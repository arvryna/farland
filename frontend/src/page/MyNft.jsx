import React from 'react'
import { Link } from 'react-router-dom';
import Gallery from '../components/Gallery'
import { useEffect, useState } from 'react';
import './myNft.css';

const HOST = process.env.REACT_APP_HOST

const MyNfts = ({ account, contractAddress }) => {
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const response = await fetch(`${HOST}/nfts?address=${account}`);
                const nftResponse = await response.json();
                if (nftResponse !== null) {
                    nftResponse.sort((a, b) => b.created_at - a.created_at);
                    setNfts(nftResponse);
                }

            } catch (error) {
                console.error('Error fetching NFTs:', error);
            }
        };

        fetchNFTs();
    }, [account]);

    return (
        <div class="container-nftcore">
            {account ? (
                <div className='nftpage-container'>
                    <div className='header'>
                        <div className='Title'>My NFTs</div>
                        <div className='buttons'>
                            <Link className="menu" to={"/collections/new"}>Create Collection</Link>
                            <Link className="menu" to={"/nft/new"}>Mint NFT</Link>
                        </div>
                    </div>
                    {nfts.length > 0 ? (<>
                        <Gallery nfts={nfts} />
                    </>) : (
                        <p>You don't have any NFTs created, please Mint.</p>)
                    }

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