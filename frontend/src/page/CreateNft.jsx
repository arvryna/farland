import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './createNft.css'
import axios from 'axios';

const ipfsAuthtoken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQwZjk4Yjg4QjM3NjhlNDU5MzhhZjA4OEU3Njg0YjM1MDg1NWZlODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM2OTU1NTc5OSwibmFtZSI6ImZhcmxhbmQifQ.UXzMBQ9eicfNLGrohv1O6coBoyToqwK_xz54Pc9uJjM'

const CreateNft = ({ contract }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [collectionAddress, setCollectionAddress] = useState('');
    const [ipfsMetaCid, setIpfsMetaCid] = useState(null);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (typeof file == 'undefined') {
            return
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const imageUploadRes = await axios.post('https://api.nft.storage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: ipfsAuthtoken,
                },
            });

            const imageCID = imageUploadRes.data.value.cid;

            const metaToUpload = {
                name: name,
                description: desc,
                image: `https://ipfs.io/ipfs/${imageCID}`,
            };

            // Uploading the meta json to Ipfs
            const metaUploadResponse = await axios.post('https://api.nft.storage/upload', metaToUpload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: ipfsAuthtoken,
                },
            });

            setIpfsMetaCid(metaUploadResponse.data.value.cid);
            toast.success("Image upload success!")

        } catch (error) {
            console.error('Error uploading image to IPFS:', error);
            toast.error("Image upload failed!" + error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ipfsMetaCid === null || ipfsMetaCid === undefined) {
            toast.error("Image is being uploaded to IPFS, please try Submit again in a few seconds")
            return
        }

        try {
            const tokenUri = `https://ipfs.io/ipfs/${ipfsMetaCid}`
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
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="desc">Description: </label>
                    <input
                        type="text"
                        id="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="collection">Collection: </label>
                    <input
                        type="text"
                        id="collection"
                        value={collectionAddress}
                        onChange={(e) => setCollectionAddress(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="image">Choose an image:</label>
                    <input type="file" id="image" onChange={handleImageUpload} />
                </div>

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

export default CreateNft