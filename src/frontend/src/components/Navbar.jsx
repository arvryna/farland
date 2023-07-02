import React from 'react'
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='logo'>
                <Link to={"/"}>Farland</Link>

            </div>
            <div className='display-menu'>
                <Link className="menu" to={"/collections"}>My Collections</Link>
                <Link className="menu" to={"/nft"}>My Nfts</Link>
                <Link className="menu" to={"/stats"}>Stats</Link>
            </div>
        </div>
    )
}

export default Navbar