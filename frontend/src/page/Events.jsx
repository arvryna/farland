import React, { useEffect, useState } from 'react';

import './events.css'

const convertEpochToBrowserTime = epochTimestamp => new Date(epochTimestamp * 1000).toLocaleString();


const Events = ({ contract }) => {
    const [eventLogs, setEventLogs] = useState([]);

    useEffect(() => {
        const fetchEventLogs = async () => {
            try {
                const response = await fetch('http://localhost:8080/events'); // Replace with your API endpoint
                const jsonData = await response.json();
                setEventLogs(jsonData);
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
                <ul>
                    <li>
                        Deployed Contract:
                        <a href={`https://sepolia.etherscan.io/address/${contract.address}`}>
                            {contract.address}
                        </a>
                    </li>
                </ul>
            </div>
            <div className="event-logs">
                {eventLogs.map((log, index) => (
                    <div key={index} className='entry'>
                        {log.event_type == 1 ? 'CollectionCreated: ' : 'TokenMinted: '}
                        Name: [{log.name}]
                        Symbol: [{log.symbol}]
                        Collection Address: [{log.collectionAddress}]
                        Time: {convertEpochToBrowserTime(log.created_at)};
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Events