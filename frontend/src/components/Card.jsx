import './card.css';
import React from 'react'

const Card = ({ collection, title }) => {
    return (
        <div class="container">
            <div class="card">
                <img src="https://cdn.windowsreport.com/wp-content/uploads/2021/12/AC-Valhalla.jpg"></img>
                <div class="card_collection">{title}</div>
                <div class="card_title"> {collection} </div>
            </div>
        </div>
    )
}

export default Card