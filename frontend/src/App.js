
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Marketplace from "./page/Marketplace";
import Stats from "./page/Stats";
import MyNft from "./page/MyNft";
import Navbar from "./components/Navbar";
import New from "./page/New";

const contractAddress = "0x7B4a36E50aF2BC252f9ECF64A37145E7c16D0158"

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
      <Route path="/nft" element={<MyNft account={account} />} />
      <Route path="/stats" element={<Stats contractAddress={contractAddress} />} />
      <Route path="/collections/new" element={<New entity={"Collection"} />} />
      <Route path="/nft/new" element={<New entity={"NFT"} />} />
    </Routes>
  </>
  );
}

export default App;