
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Marketplace from "./page/Marketplace";
import Stats from "./page/Stats";
import MyCollections from "./page/MyCollections";
import MyNfts from "./page/MyNfts";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";

function App() {
  const [account, setAccount] = useState(null)

  // Connect to blockchain via Metamask
  const walletHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    // const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)

  }

  return (<>
    <Navbar walletHandler={walletHandler} account={account} />
    <Routes>
      <Route path="/" element={<Marketplace />} />
      <Route path="/collections" element={<MyCollections />} />
      <Route path="/nft" element={<MyNfts />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  </>
  );
}

export default App;
