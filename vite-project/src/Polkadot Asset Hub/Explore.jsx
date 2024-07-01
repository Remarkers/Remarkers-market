import React, { useEffect, useState } from "react";
import '/src/index.css';
import Axios from 'axios';
import {
  Card,
  Typography,
  Spinner,
  IconButton,
  Carousel,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import polkadotpunks from '/src/assets/Polkadot Punks.gif'
import biodiversity from '/src/assets/Polkadot Punks.png'
import lunarpunks from '/src/assets/Polkadot Punks (1).gif'

export default function PAHExplore() {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'volume', direction: 'descending' });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getData = async () => {
    const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}getData`);
    setData(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 600px)').matches);
    };

    // Initial check on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const TABLE_HEAD = ["Collection", "Volume", "Floor", "Top sale", "Supply", "Listed", "Owners"];

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
  
        // Handle non-numeric fields
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
  
        // Numeric comparison for specific keys
        if (sortConfig.key === 'volume' || sortConfig.key === 'floor' || sortConfig.key === 'highestSale' || sortConfig.key === 'maxSupply' || sortConfig.key === 'nftCount' || sortConfig.key === 'distribution') {
          valA = parseFloat(valA);
          valB = parseFloat(valB);
        }
  
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);
  

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  

  const handleReload = () => {
    setIsLoading(true);
    setError(false);
    getData();
  };

  return (
    <>
      <br />
      <Typography variant="h2" color="black" style={{marginLeft: "20px"}}>
        Trending
      </Typography>
      <br />
       <Carousel loop={true} autoplay={true} className="rounded-xl">
        <a href="https://remarkers-market.vercel.app/Polkadot%20Asset%20Hub/marketplace/7/Polkadot%20Punks">
      <img
        src={polkadotpunks}
        alt="image 1"
        className="h-200 w-full object-cover object-center"
      />
      </a>
      <a href="https://remarkers-market.vercel.app/Polkadot%20Asset%20Hub/marketplace/13/The%20sub0%202023%20Biodiversity%20Collection">
      <img
        src={biodiversity}
        alt="image 2"
        className="h-200 w-full object-cover object-center"
      />
      </a>
      <a href="https://remarkers-market.vercel.app/Polkadot%20Asset%20Hub/marketplace/155/Lunar%20Punks">
      <img
        src={lunarpunks}
        alt="image 3"
        className="h-200 w-full object-cover object-center"
      />
      </a>
    </Carousel>
    <br />
      <div className="relative w-full md:w-1/2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search Collection"
          className="pl-10 pr-4 py-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <br />
      <br />
      <br />
      {data.length > 0 ? (
        <Card className={isMobile ? 'max-w-full overflow-scroll' : 'h-full w-full overflow-scroll'}>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 flex items-center"
                    >
                      {head}
                      <IconButton
                        variant="text"
                        size="sm"
                        color="gray"
                        onClick={() => handleSort(index === 0 ? 'name' : head.toLowerCase().replace(' ', ''))}
                      >
                        {sortConfig.key === (index === 0 ? 'name' : head.toLowerCase().replace(' ', '')) ? (
                          sortConfig.direction === 'ascending' ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpIcon className="w-4 h-4 opacity-20" />
                        )}
                      </IconButton>
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData
                .filter(({ burned, id, name }) => !burned && id && !id.startsWith('u') && name && name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(({ id, name, description, image, owner, maxSupply, distribution, floor, highestSale, royalty, nftCount, createdDate, volume }, index) => {
                  const ipfsHash = image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, '') || '';
                  const ipfsUri = `ipfs://${ipfsHash}`;

                  return name && description && image ? (
                    <tr className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50" key={id}>
                      <td className="p-4">
                      <Link
      to={`/Polkadot%20Asset%20Hub/marketplace/${id}/${name}`}
    >
                          <div className="card-content-container">
                            <div className="image-container">
                              {isLoading && !error && <Spinner color="pink" />}
                              {error && (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                    onClick={handleReload}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </>
                              )}
                              <MediaRenderer
                                src={ipfsUri}
                                className="card-image"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  display: isLoading || error ? 'none' : 'block',
                                }}
                                alt=""
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                  setIsLoading(false);
                                  setError(true);
                                }}
                              />
                            </div>
                            <div className="text-container">
                              <Typography color="blue-gray" className="font-medium font-bold card-content">
                                {name.length > 30 ? `${name.substring(0, 30)}...` : name}
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4">
                        <Typography variant="h7" color="gray" className="font-normal">
                          {volume} DOT
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography as="a" href="#" variant="h7" color="gray" className="font-medium">
                          {floor} DOT
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography as="a" href="#" variant="h7" color="gray" className="font-medium">
                          {highestSale} DOT
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography as="a" href="#" variant="h7" color="gray" className="font-medium">
                          {maxSupply ? maxSupply : nftCount}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography as="a" href="#" variant="h7" color="gray" className="font-medium">
                          {nftCount}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography as="a" href="#" variant="h7" color="gray" className="font-medium">
                          {distribution}
                        </Typography>
                      </td>
                    </tr>
                  ) : null;
                })}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Spinner className="h-8 w-8" color="pink" />
        </div>
      )}
    </>
  );
}