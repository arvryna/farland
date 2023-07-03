import React from 'react'
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './createNft.css'
import { NFTStorage } from 'nft.storage'
import { ScaleLoader } from 'react-spinners';

const ipfsAuthtoken = process.env.REACT_APP_NFT_STORAGE_TOKEN
const HOST = process.env.REACT_APP_HOST

const CreateNft = ({ contract, account }) => {
    const [collectionAddress, setCollectionAddress] = useState('');
    const [fileCid, setFileCid] = useState(null);
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const response = await fetch(`${HOST}/collections?address=${account}`);
                const nftResponse = await response.json();
                nftResponse.sort((a, b) => b.created_at - a.created_at);
                setCollections(nftResponse);
            } catch (error) {
                console.error('Error fetching NFTs:', error);
            }
        };

        fetchNFTs();
    }, [collections, account]);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (typeof file == 'undefined') {
            return
        }

        setLoading(true)

        try {
            const authToken = ipfsAuthtoken;
            const client = new NFTStorage({ token: authToken });
            const fileCID = await client.storeBlob(file);

            setFileCid(fileCID)
            setLoading(false)
            toast.success("Image uploaded.")
        } catch (error) {
            console.error('Error uploading file to NFT.Storage:', error);
            toast.error("Image upload failed" + error)
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fileCid === null || fileCid === undefined) {
            toast.error("Image is being uploaded to IPFS, please try Submit again in a few seconds")
            return
        }

        try {
            const tokenUri = `https://ipfs.io/ipfs/${fileCid}`
            console.log(collectionAddress, tokenUri)
            const result = await contract.mintNFT(collectionAddress, tokenUri)
            console.log(result)
            toast.success("NFT Mint request accepted in blockchain!")
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
                    <label htmlFor="collection">Collection: </label>
                    <select
                        id="collection"
                        value={collectionAddress}
                        onChange={(e) => setCollectionAddress(e.target.value)}
                    >
                        {collections.map((collection) => (
                            <option key={collection.name} value={collection.collection_address}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="image">Choose an image:</label>
                    <input type="file" id="image" onChange={handleImageUpload} />
                </div>
                {loading ? (
                    <ScaleLoader color={'#36d7b7'} loading={loading} size={25} />
                ) : <button type="submit">Submit</button>}

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

export default CreateNft