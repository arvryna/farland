import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './createNft.css'

const CreateNft = ({ contract }) => {
    const [collectionAddress, setCollectionAddress] = useState('');
    const [tokenUri, setTokenUri] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        // lets upload the file to IPFS
        // and finally set tokenUri here

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await contract.mintNFT(collectionAddress, tokenUri)
            console.log(result)
            toast.success("NFT Minte request accepted in blockchain!")
        } catch (error) {
            console.error('Error calling contract function:', error);
            toast.error("NFT creation failed!" + error)
        }

    };

    return (
        <div className='createnft-container'>
            <div className='notes'>
                <h2>Mint NFT</h2>
                <ul>
                    <h4>Please Note:</h4>
                    <li>Collection is mandatory field</li>
                    <li>You should be the owner of that collection</li>
                    <li>You need atleast one collection before minting your first NFT</li>
                    <li>TokenId or NFT Id will be assigned by the contract</li>
                </ul>
            </div>
            <form className='nft-form' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="collection">Collection Name:</label>
                    <select id="collection">
                        <option value="collection1">Collection 1</option>
                        <option value="collection2">Collection 2</option>
                        <option value="collection3">Collection 3</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="image">Choose an image:</label>
                    <input type="file" id="image" onChange={handleImageUpload} />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateNft