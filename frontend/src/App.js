
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Marketplace from "./page/Marketplace";
import Events from "./page/Events";
import MyNft from "./page/MyNft";
import Navbar from "./components/Navbar";
import nftAbi from './nft-abi.json'
import { ethers } from "ethers";
import CreateCollection from "./page/CreateCollection"
import CreateNft from "./page/CreateNft";

const contractAddress = "0xdd603b907512369155621b80a52d5da6af0b5c7e"
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractAddress, nftAbi, signer)

function App() {
  const [account, setAccount] = useState(null)

  // Connect to blockchain via Metamask
  const walletHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
  }

  return (<>
    <Navbar walletHandler={walletHandler} account={account} />
    <Routes>
      <Route path="/" element={<Marketplace />} />
      <Route path="/nft" element={<MyNft account={account} contractAddress={contractAddress} />} />
      <Route path="/events" element={<Events contract={contract} />} />
      <Route path="/collections/new" element={<CreateCollection contract={contract} />} />
      <Route path="/nft/new" element={<CreateNft contract={contract} />} />
    </Routes>
  </>
  );
}

export default App;
