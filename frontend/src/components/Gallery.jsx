import React from 'react'
import './gallery.css';

import Card from './Card';

const Gallery = ({ nfts }) => {
    return (
        <div class="container">
            {nfts ? (<>
                {
                    nfts.map((nft, index) => (
                        (nft.event_type === undefined || nft.event_type === 2) ? (
                            <Card
                                key={index}
                                title={`Token #${nft.token_id}`}
                                collection={nft.collection_address.slice(0, 20)}
                                image={nft.token_uri}
                            />
                        ) : null
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