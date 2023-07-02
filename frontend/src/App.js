
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Marketplace from "./page/Marketplace";
import Stats from "./page/Stats";
import MyNfts from "./page/MyNfts";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";

const contractAddress = "0x7B4a36E50aF2BC252f9ECF64A37145E7c16D0158"

function App() {
  const [account, setAccount] = useState(null)

  // Connect to blockchain via Metamask
  const walletHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = provider.getSigner()
  }


  return (<>
    <Navbar walletHandler={walletHandler} account={account} />
    <Routes>
      <Route path="/" element={<Marketplace />} />
      <Route path="/nft" element={<MyNfts />} />
      <Route path="/stats" element={<Stats contractAddress={contractAddress} />} />
    </Routes>
  </>
  );
}

export default App;
