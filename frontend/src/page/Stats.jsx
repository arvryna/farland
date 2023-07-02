import React from 'react'

const Stats = ({ contract }) => {
    return (
        <div>
            <h2>Stats</h2>
            <ul>
                <li>
                    Deployed Contract:
                    <a href={`https://sepolia.etherscan.io/address/${contract.address}`}>
                        {contract.address}
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Stats