import React, { useEffect, useState } from 'react';

import './events.css'

const convertEpochToBrowserTime = epochTimestamp => new Date(epochTimestamp * 1000).toLocaleString();


const Events = ({ contract }) => {
    const [eventLogs, setEventLogs] = useState([]);

    useEffect(() => {
        const fetchEventLogs = async () => {
            try {
                const response = await fetch('http://localhost:8080/events'); // Replace with your API endpoint
                const events = await response.json();
                events.sort((a, b) => b.created_at - a.created_at);
                setEventLogs(events);
            } catch (error) {
                console.error('Error fetching event logs:', error);
            }
        };

        fetchEventLogs();
    }, []);

    return (
        <div className='event-container'>
            <div className='event-header'>
                <h2>Events</h2>
            </div>
            <div className="event-logs">
                {eventLogs.map((log, index) => (
                    <div key={index} className='entry'>

                        {log.event_type === 1 ? (
                            <p>  * Collection Created:
                                Name: [
                                <a href={`https://testnets.opensea.io/collection/${log.name.toLowerCase()}`}>
                                    {log.name}
                                </a>
                                ]
                                Symbol: [{log.symbol}]
                                <a href={`https://sepolia.etherscan.io/address/${log.collection_address}`}>
                                    {log.collection_address}
                                </a>
                                CreatedAt: {convertEpochToBrowserTime(log.created_at)};
                            </p>) : (
                            <p>
                                * Token Minted:
                                TokenId: [{log.token_id}]
                                TokenUri: [{log.token_uri}] using
                                <a href={`https://sepolia.etherscan.io/address/${log.collection_address}`}>
                                    [Collection]
                                </a>
                                Created By:
                                <a href={`https://sepolia.etherscan.io/address/${log.owner_address}`}>
                                    [Token Owner]
                                </a>
                                CreatedAt: [{convertEpochToBrowserTime(log.created_at)}]

                            </p>
                        )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Events