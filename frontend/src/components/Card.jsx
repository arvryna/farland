import './card.css';
import React from 'react'

const Card = ({ collection, title, image }) => {
    return (
        <div class="container">
            <div class="card">
                <img alt='ipfs-service-unavailable' src="https://ipfs.io/ipfs/bafybeigxwl5uth3tbexaai4vb6x324go6gfoovzq57svunz44gpacjbvta"></img>
                <div class="card_collection">{title}</div>
                <div class="card_title"> {collection} </div>
            </div>
        </div>
    )
}

export default Card