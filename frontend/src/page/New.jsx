import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const New = ({ entity }) => {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [formError, setFormError] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (name.trim() === '' || symbol.trim() === '') {
            setFormError(true);
            return;
        }

        // Lets make call to Smart contract over here
        // also lets show the popup using

        setFormError(false);
        toast.success("Collection created successfully!")
    };

    return (
        <div className='container'>
            <div className='header'>
                New {entity}
            </div>

            <form onSubmit={handleSubmit}>
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
                autoClose={1500}
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

export default New