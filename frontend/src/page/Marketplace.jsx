import React from 'react'
import Gallery from '../components/Gallery'

import { useState, useEffect } from 'react';

const HOST = process.env.REACT_APP_HOST

const Marketplace = () => {
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const response = await fetch(`${HOST}/events`);
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
    }, []);

    return (<>
        <h4>NFT Marketplace</h4>
        <Gallery nfts={nfts} />
    </>
    )
}

export default Marketplace