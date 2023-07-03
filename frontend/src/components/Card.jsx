import './card.css';
import React from 'react'

const Card = ({ collection, title, image }) => {
    return (
        <div class="container">
            <div class="card">
                <img alt='ipfs-service-unavailable' src={image}></img>
                <div class="card_collection">{title}</div>
                <div class="card_title"> {collection} </div>
            </div>
        </div>
    )
}

export default Card