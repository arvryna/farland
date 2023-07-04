import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './createCollection.css'

const CreateCollection = ({ contract }) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [formError, setFormError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === '' || symbol.trim() === '') {
            setFormError(true);
            return;
        }

        try {
            const result = await contract.createCollection(name, symbol)
            console.log(result)
            toast.success("Collection created successfully!")
        } catch (error) {
            console.error('Error calling contract function:', error);
            toast.error("Collection creation failed!" + error)
        }

        setFormError(false);
    };

    return (
        <div className='collection-container'>
            <div className='notes'>
                <h2>Create Collection</h2>
                <ul>
                    <h4>Please Note:</h4>
                    <li>Once collection is created, it will appear in dropdown when you mint NFT</li>
                    <li>Also the collection details will appear in the events page, with chain txId</li>
                    <li>Events page show the details, as soon as the transaction is confirmed.</li>
                </ul>
            </div>
            <form className="collection-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="symbol">Symbol:</label>
                    <input
                        type="text"
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                    />
                </div>

                {formError && <p>Please fill in both fields.</p>}

                <button type="submit">Submit</button>
            </form>
            <ToastContainer
                position="bottom-left"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default CreateCollection