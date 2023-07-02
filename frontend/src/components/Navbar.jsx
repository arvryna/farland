import React from 'react'
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ walletHandler, account }) => {
    return (
        <div className='navbar'>
            <div className='logo'>
                <Link to={"/"}>Farland</Link>

            </div>
            <div className='display-menu'>
                <Link className="menu" to={"/nft"}>My Nfts</Link>
                <Link className="menu" to={"/stats"}>Stats</Link>
                {account ? (
                    <a className='menu' href={`https://sepolia.etherscan.io/address/${account}`}>
                        <button>
                            {account.slice(0, 5)}...{account.slice(40, 42)}
                        </button>
                    </a>
                ) : (
                    <button onClick={walletHandler}>Connect Wallet</button>
                )}
            </div>
        </div >
    )
}

export default Navbar