import React from 'react'
import './gallery.css';

import Card from './Card';

const Gallery = ({ nfts }) => {
    return (
        <div class="container">
            {nfts ? (<>
                {
                    nfts.map((nft, index) => (
                        <Card title={`Token #${nft.token_id}`} collection={nft.collection_address} image={nft.token_uri} />
                    ))
                }
            </>
            ) : (<>
                <p>
                    There are no NFTs created yet!.
                </p>
            </>
            )}
        </div>
    )
}

export default Gallery