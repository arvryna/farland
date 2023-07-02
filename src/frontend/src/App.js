
import { Route, Routes } from "react-router-dom";
import Marketplace from "./page/Marketplace";
import Stats from "./page/Stats";
import MyCollections from "./page/MyCollections";
import MyNfts from "./page/MyNfts";
import Navbar from "./components/Navbar";

function App() {
  return (<>
    <Navbar />
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
