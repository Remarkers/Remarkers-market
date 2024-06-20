import React, { useEffect, useState } from "react";
import '/src/index.css'
import Axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Avatar,
    Chip,
    Badge,
    Spinner,
  } from "@material-tailwind/react";
  import {CheckIcon} from "@heroicons/react/24/outline";
  import Identicon from '@polkadot/react-identicon';
  import { Link } from "react-router-dom";
  import { MediaRenderer } from "@thirdweb-dev/react";

export default function PAHExplore( ) {
    const [data, setData] = useState([])
    const [isMobile, setIsMobile] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const getData = async() => {
        const response = await Axios.get("http://localhost:3001/getData")
        setData(response.data)
    }
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
    useEffect(()=> {
        getData()
    }, []);
    console.log(data)
    const TABLE_HEAD = ["Collection", "Volume", "Floor", "Top sale", "Supply", "Listed", "Owners"];

  const handleReload = () => {
    setIsLoading(true);
    setError(false);
  };



    return (
        <>
                   {data.length > 1 ? (
        
                        <Card className={isMobile ? 'mobilecatalog-card' : 'h-full w-full overflow-scroll'}>
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                {data
            .filter(({ burned, id }) => !burned && id && !id.startsWith('u'))
            .map(({ id, name, description, image, owner, maxSupply, distribution, floor, highestSale, royalty, nftCount, createdDate, volume }, index) => {
                const ipfsHash = image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, '') || '';
                const ipfsUri = `ipfs://${ipfsHash}`;
        
                const handleCardClick = () => {
                    localStorage.setItem('selectedCollectionId', JSON.stringify(id));
                    localStorage.setItem('selectedCollectionImage', JSON.stringify(image));
                    localStorage.setItem('selectedCollectionDescription', JSON.stringify(description));
                    localStorage.setItem('selectedCollectionOwner', JSON.stringify(owner));
                    localStorage.setItem('maxSupply', JSON.stringify(maxSupply));
                    localStorage.setItem('image', JSON.stringify(image));
                    localStorage.setItem('Holders', JSON.stringify(distribution));
                    localStorage.setItem('floor', JSON.stringify(floor));
                    localStorage.setItem('highestSale', JSON.stringify(highestSale));
                    localStorage.setItem('royalty', JSON.stringify(royalty));
                    localStorage.setItem('nftCount', JSON.stringify(nftCount));
                    localStorage.setItem('createdDate', JSON.stringify(createdDate));
                    localStorage.setItem('volume', JSON.stringify(volume));
                };
        
                return name && description && image ? (
                    <tr className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50" key={id}>
                    <td className="p-4">
                        <Link to={`/Polkadot%20Asset%20Hub/marketplace/${id}/${name}`} onClick={() => handleCardClick()}>
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
                            {volume}
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
                                                })
                                                        }
                                </tbody>
                            </table>
                        </Card>
                        ) : (
                            <div className="flex justify-center items-center h-screen">
                              <Spinner className="h-8 w-8" color="pink" />
                            </div>
                          )}
      
        </>
    )
}
