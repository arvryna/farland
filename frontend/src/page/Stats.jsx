import React from 'react'

const Stats = ({ contractAddress }) => {
    return (
        <div>
            <h2>Stats</h2>
            <ul>
                <li>
                    Deployed Contract:
                    <a href={`https://sepolia.etherscan.io/address/${contractAddress}`}>
                        {contractAddress}
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Stats