import { useState, useEffect } from "react";
import { NFTCard } from "./components/nftCard";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for theme toggle

  useEffect(() => {
    // Apply dark or light theme to the body element
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchNFTs = async () => {
    let nfts;
    console.log("Fetching NFTs...");
    const apiKey = "jBuzjHZSUuM1NL5bMRt2pKQUP1UHGHMx";
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`;
    const requestOptions = { method: "GET" };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("Fetching NFTs for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("NFTs:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      console.log("Fetching NFTs for collection...");
      const apiKey = "jBuzjHZSUuM1NL5bMRt2pKQUP1UHGHMx";
      const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=true`;
      const requestOptions = { method: "GET" };
      const nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center p-12 ${inter.className} ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-5xl w-full flex flex-col items-center space-y-4 relative">
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-4">
          {/* NFT Gallery Heading */}
          <h1 className="text-4xl font-bold text-center dark:text-white">NFT Gallery</h1>
          {/* Toggle Button for Dark/Light Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            onChange={(e) => setWalletAddress(e.target.value)}
            value={wallet}
            type="text"
            placeholder="Add your wallet address"
            className="p-2 w-64 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            onChange={(e) => setCollectionAddress(e.target.value)}
            value={collection}
            type="text"
            placeholder="Add the collection address"
            className="p-2 w-64 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={fetchForCollection}
              onChange={(e) => setFetchForCollection(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Fetch for Collection</span>
          </label>
          <button
            onClick={() => {
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else {
                fetchNFTs();
              }
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Let's go
          </button>
        </div>
        {/* NFTs display section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {NFTs.length > 0 &&
            NFTs.map((nft, index) => (
              <NFTCard key={nft?.id?.tokenId || index} nft={nft} />
            ))}
        </div>
      </div>
    </main>
  );
}
