import React, { useEffect, useState } from "react";
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
    Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  ButtonGroup,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  MenuItem,
  Menu,
  MenuHandler,
  MenuList,
  Collapse,
  Input,
  Select, Option,
  Drawer,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Switch,
  Spinner,
  ListItemSuffix,



} from "@material-tailwind/react";
import Identicon from '@polkadot/react-identicon';
import Axios from 'axios';
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon, ArrowRightIcon, ArrowLeftIcon  } from "@heroicons/react/24/outline";
import {encodeAddress, decodeAddress} from '@polkadot/util-crypto'
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { ToastContainer, toast } from 'react-toastify';
import { symbol } from "zod";
import { u8aToHex, stringToHex, stringToU8a } from '@polkadot/util'
import { MediaRenderer } from "@thirdweb-dev/react";
import { useParams } from 'react-router-dom';

export default function PAHItems() {
    const [data, setData] = useState([]); // Initialize data as an empty array
    const [itemConfig, setItemConfig] = useState([])
    const [size, setSize] = React.useState(null);
    const [swapSize, setSwapSize] = React.useState(null);
    const [item, selectedItems] = useState(null)
    const [value, copy] = useCopyToClipboard();
    const [idcopied, setIdcopied] = React.useState(false);
    const [ownercopied, setOwnercopied] = React.useState(false);
    const [collectionIdCopied, setCollectionIdCopied] = React.useState(false);
    const [collectionOwnerCopied, setCollectionOwnerCopied] = React.useState(false);
    const [price, setPrice] = useState()
    const [sendOpen, setSendOpen] = useState()
    const [listOpen, setListOpen] = useState()
    const [activeTab, setActiveTab] = React.useState("Items");
    const [itemsActiveTab, setItemsActiveTab] = React.useState("Overview");
    const [collectionActivities, setCollectionActivity] = useState()
    const [holders, setHolders] = useState()
    const [activityopen, setActivityOpen] = React.useState(false);
    const [statusOpen, setStatusOpen] = React.useState(false);
    const [ownersCount, setOwnersCount] = useState()
    const [recipient, setRecipient] = useState('');
    const [api, setApi] = useState()
    const [itemPrice, setItemPrice] = useState() 
    const [whitelist, setWhitelist] = useState(false)
    const [whiteListAddress, setWhiteListAddress] = useState()
    const [integerPrice, setIntegerPrice] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [itemMetadata, setItemMetadata] = useState();
    const [owner, setOwner] = useState()
    const [ownedPrice, setOwnedPrice] = useState()
    const [ownedmetadata, setOwnedMetadata] = useState()
    const [offeredItem, setOfferedItem] = useState()
    const [offeredCollection, setOfferedCollection] = useState()
    const [offeredpage, setOfferedpage] = useState(1)
    const [sendPrice, setSendPrice] = useState(null)
    const [receivePrice, setReceivePrice] = useState(null)
    const [setSwapPrice, setSetSwapPrice] = useState(null)
    const [direction, setDirection] = useState(null);
    const [swapData, setSwapData] = useState(null)
    const [selectedToken, setSelectedToken] = useState(null)
    const[tokenPrice, setTokenPrice] = useState(null)
    const [selectedTokenLogo, setselectedTokenLogo] = useState()
      const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedJsondata, setJsondata] = useState(null);
  const [swapLoading, setSwapLoading] = useState()
  const [fetchLoading, setFetchLoading] = useState()

    const [selected, setSelected] = React.useState();
  const setSelectedItem = (value) => setSelected(value);

    const handleReload = () => {
      setIsLoading(true);
      setError(false);
    };

    const handleButtonClick = (item) => {
      setIsLoading(true);
      setError(false);
      // Assuming `item` is defined elsewhere and accessible
      setImgUrl(`https://cloudflare-ipfs.com/ipfs/${item?.image ? item.image.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "") : ""}`);
    };
 
    const statusToggleOpen = () => setStatusOpen((cur) => !cur);

    const optionValues = {RecentlyMinted: "Recently Minted", EarliestMinted: "Earliest Minted", PriceLowToHigh: "Price Low To High", PriceHighToLow: "Price High To Low"}
    const [filterOption, setFilterOption] = useState(optionValues.RecentlyMinted)
 
    const activityHandleOpen = () => setActivityOpen(!activityopen);
    const [filterOpen, setFilterOpen] = React.useState(false);
 
  const openDrawer = () => setFilterOpen(true);
  const closeDrawer = () => setFilterOpen(false);

    const [descriptionOpen, setDescriptionOpen] = React.useState(false);
 
    const descriptionHandleOpen = () => setDescriptionOpen(!descriptionOpen);


    const [buyOpen, setBuyOpen] = React.useState(false);
 
    const buyOpenHandleOpen = () => setBuyOpen(!buyOpen);

    const sendToggleOpen = () => setSendOpen((cur) => !cur);
    const listToggleOpen = () => setListOpen((cur) => !cur);
 
  const handleOpen = (value) => setSize(value);
  const swapHandleOpen = (value) => setSwapSize(value);

  const [isBuyChecked, setIsBuyChecked] = useState(false);
  const [isOwnedChecked, setIsOwnedChecked] = useState(false);
  
  // Handler for Buy checkbox
  const toggleBuyCheckbox = () => {
    setIsBuyChecked(!isBuyChecked);  // Toggle the state based on its current state
  };
  
  // Handler for Owned checkbox
  const toggleOwnedCheckbox = () => {
    setIsOwnedChecked(!isOwnedChecked);  // Toggle the state based on its current state
  };

    const dataUrl = ((renderURL, JsonData) => {
    setSelectedImageUrl(renderURL);
    setJsondata(JsonData)})
  

  const selectedItem = localStorage.setItem('selectedCollectionItems', JSON.stringify(item && item.Id));
      // Assuming additional data is stored and used similarly
      const { id, name } = useParams();
      const nameData = name;
      const imageData = JSON.parse(localStorage.getItem('selectedCollectionImage'));
      const descriptionData = JSON.parse(localStorage.getItem('selectedCollectionDescription'));
      const ownerData = JSON.parse(localStorage.getItem('selectedCollectionOwner'));
      const connectedAccount = JSON.parse(localStorage.getItem('Account'));
      const address = connectedAccount.address
      const maxSupply = JSON.parse(localStorage.getItem('maxSupply'));
      const collectionId = id;
      const ItemId = JSON.parse(localStorage.getItem('selectedCollectionItems'));
      const distribution = JSON.parse(localStorage.getItem('Holders'));
const floor = JSON.parse(localStorage.getItem('floor'));
const highestSale = JSON.parse(localStorage.getItem('highestSale'));
const royalty = JSON.parse(localStorage.getItem('royalty'));
const nftCount = JSON.parse(localStorage.getItem('nftCount'));
const createdDate = JSON.parse(localStorage.getItem('createdDate'));
const volume = JSON.parse(localStorage.getItem('volume'));

      const decodedAddress = decodeAddress(address);

// Re-encode with the Polkadot prefix (e.g., 0 for Polkadot Mainnet)
const polkadotAddress = encodeAddress(decodedAddress, 0);
console.log("holder", itemConfig)


console.log('Polkadot Address:', polkadotAddress);
  
      const imageUrl = imageData ? `https://cloudflare-ipfs.com/ipfs/${imageData.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}` : null;

    const IdData = JSON.parse(localStorage.getItem('selectedCollectionId'));
    const image = JSON.parse(localStorage.getItem('image'));
    const Account = (JSON.parse(localStorage.getItem("Account")))
    const owned = async() => {
      try {
          const response = await Axios.get(`http://localhost:3001/owned?address=${JSON.stringify(Account?.address)}&page=${ownedactive.toString()}`);
          setOwner(response.data.data.result); // Store the data directly as an array of objects
          setOwnedMetadata(response.data.data.metadata)
          setOwnedPrice(response.data.data.result.price)
          // setSwap(response.data.data.swap)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const swap = async(item) => {
      try {
        setSwapLoading(true)
        const response = await Axios.get(`http://localhost:3001/swap?data=${item.Id}&collectionId=${IdData}`);
        const res = response.data.data;
        const resarray = res && res.map(item => item)[0];
        setSwapData( resarray); // Store the data directly as an array of objects
        setSwapLoading(false)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const getData = async (value) => {
        try {
            const response = await Axios.get(`http://localhost:3001/itemData?data=${IdData}&image=${image}&page=${active.toString()}&orderBy=${value === "Recently Minted"? "blockNumber_DESC": value === "Earliest Minted"? "blockNumber_ASC": value === "Price Low To High"? "price_ASC" : value === "Price High To Low"? "price_DESC" : "blockNumber_DESC"}`);
            setData(response.data.data); // Store the data directly as an array of objects
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const giveItemId = async(item) => {
      try {
        const response = await Axios.get(`http://localhost:3001/itemId?data=${item.Id}&collectionId=${IdData}`);
        setItemConfig(response.data.data); // Store the data directly as an array of objects
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const getItemPrice = async(item) => {
      try {
        setFetchLoading(true)
        const response = await Axios.get(`http://localhost:3001/itemPrice?data=${item.Id}&collectionId=${IdData}&price=${item.price}`);
        setPrice(response.data.data.priceDotUsd); // Store the data directly as an array of objects
        setIntegerPrice(response.data.data.price)
        setFetchLoading(false)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const collectionActivity = async() => {
      try {
        const response = await Axios.get(`http://localhost:3001/collectionActivity?collectionId=${IdData}`);
        setCollectionActivity( response && response.data.data.data.list); // Store the data directly as an array of objects
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const Holders = async() => {
      try {
        const response = await Axios.get(`http://localhost:3001/Holders?collectionId=${IdData}&page=${subscanPage.toString()}`);
        setHolders(response.data.data.data.list); // Store the data directly as an array of objects
        setOwnersCount(response.data.data.data.count)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }
    
    const metadata = async(item) => {
      try {
        const response = await Axios.get(`http://localhost:3001/metadata?metadata=${item.metadata}`);
        setItemMetadata(JSON.parse(response.data.data)); // Store the data directly as an array of objects
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

    const [active, setActive] = React.useState(1);
 
    const getItemProps = (index) =>
      ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => {setActive(index), getData()},
      });
      
    const next = () => {
      {setActive(active + 1), getItemProps(), getData()};
    };
   
    const prev = () => {
      {setActive(active - 1),getItemProps(), getData()};
    };

    const [ownedactive, setOwnedActive] = React.useState(1);
 
    const getOwnedItemProps = (index) =>
      ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => {setOwnedActive(index),  owned()},
      });
      
    const ownedNext = () => {
      setOwnedActive(ownedactive + 1);
      owned()
    };
   
    const ownedPrev = () => {
   
      setOwnedActive(ownedactive - 1);
      owned()
    };

    const [subscanPage, setsubscanPage] = React.useState(1);
 
    const getPage = (index) =>
      ({
        variant: subscanPage === index ? "filled" : "text",
        color: "gray",
        onClick: () => {setsubscanPage(index), Holders()},
      });
      
    const nextPage = () => {
      setsubscanPage(subscanPage + 1);
      Holders()

    };
   
    const prevPage = () => {
      if (subscanPage === 1) return;
   
      setsubscanPage(subscanPage - 1);
      Holders()
    };

    useEffect(() => {
        getData();
        // collectionActivity();
        Holders();
        owned();
    }, []); // Dependency array is empty, so this effect runs only once

    // Logging to see the structure of the data
    console.log(data);
    console.log(itemConfig);
    console.log(holders);
    console.log(itemMetadata);
    console.log(item);
    console.log("Swap DATA", swapData);
    console.log("price", price)

function timeSince(date) {
  return formatDistanceToNow(date, { addSuffix: true });
}


    const tabs = [
      {
        label: "Overview",
        value: "Overview",
      },
      {
        label: "Activity",
        value: "Activity"
      },
      // {
      //   label: "Charts",
      //   value: "Charts",
      // },
      {
        label: "Swaps",
        value: "Swaps",
      }
    ];
    const CollectionTabs = [
      {
        label: "Items",
        value: "Items",
      },
      {
        label: "Owners",
        value: "Owners",
      },
    ];
    const TABLE_HEAD = ["Item", "Event", "Date"];
    const HOLDER_HEAD = ["Address", "Balance"];
    console.log(collectionActivities)
if(data){
    const prices = data && data.map(item => item && item.price);

// Filter out undefined or falsy prices
const filteredPrices = prices.filter(price => price);

// Calculate the lowest price
const lowestPrice = filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
// Transaction
const transfer = async () => {
  // Assuming you have 'api', 'collectionId', 'ItemId', and 'recipient' available in this context
  if (!recipient) {
    alert("Please enter a recipient address.");
    return;
  }
  try {
    toast.info(`Sending your nft` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);

    // Sign and send the transaction
    const send = await api.tx.nfts
      .transfer(collectionId, ItemId, recipient)
      .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    });
    
  } catch (error) {
    await api.disconnect()
    toast.error(`Transaction failed' ${error}` , {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }
};

const list = async() => {
    // Assuming you have 'api', 'collectionId', 'ItemId', and 'recipient' available in this context
    if (!itemPrice) {
      alert("Please enter NFT price");
      return;
    }
    try {
      toast.info(`listing your nft` , {
        position: "top-right",
        autoClose: 25009,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      // Create a new WebSocket provider
      const wsProvider = new WsProvider(endpoint);
  
      // Create the API instance
      const api = await ApiPromise.create({ provider: wsProvider });
  
      // Now you have the 'api' object ready for use
      console.log('API initialized successfully:', api);
  
      // You can set the 'api' object to the state or use it directly as needed
      setApi(api);
  
      // Enable the extension
      await web3Enable('remarker');
  
      // Get all accounts from the extension
      const allAccounts = await web3Accounts();
      const price = itemPrice * 10000000000
  
      // Find the injector for the connected account
      const injector = await web3FromAddress(connectedAccount.address);
      // Sign and send the transaction
      const send = await api.tx.nfts.setPrice(collectionId, ItemId, price, whiteListAddress)
        .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
          if (status.isInBlock) {
            toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
          } else {
            toast.info(`Current status: ${status.type}` , {
              position: "top-right",
              autoClose: 25009,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
          }
      }).catch((error) => {
        toast.error(`Transaction failed' ${error}` , {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      });
      
    } catch (error) {
      await api.disconnect()
      console.error('Transfer failed:', error);
    }
}

const deList = async() => {
  try {
    toast.info(`Delisting your nft` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    const price = null
    // Sign and send the transaction
    const send = await api.tx.nfts.setPrice(collectionId, ItemId, price, whiteListAddress)
      .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    });
    
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}

const burn = async() => {
  try {
    toast.info(`Burning your nft` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    // Sign and send the transaction
    const send = await api.tx.nfts.burn(collectionId, ItemId)
      .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    });
    
  } catch (error) {
    await api.disconnect()
    console.error('Transfer failed:', error);
  }
}

const handleSendInputChange = (e) => {
  setSendPrice(e.target.value);
}

const handleReceiveInputChange = (e) => {
  setReceivePrice(e.target.value);
}

const createSwap = async() => {
  try {
    toast.info(`Creating swap` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    // const bid_price = integerPrice * 10000000000
    // console.log(bid_price)
    // Sign and send the transaction
    const send = await api.tx.nfts.createSwap(offeredCollection,
      offeredItem,
       collectionId,
      ItemId,
      direction? {
       amount: direction === "send"? sendPrice * 10000000000 : direction  === "receive"? receivePrice * 10000000000 : null,
       direction: direction === "send"? "Send" : direction  === "receive"? "Receive" : null
     } : null,
      "2592000"
    )
.signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    });
    
  } catch (error) {
    await api.disconnect()
    console.error('Transfer failed:', error);
  }
}

const claimSwap = async(offeredCollection, offeredItem, desiredCollection, desiredItem, price) => {
  console.log("Claim Swap", offeredCollection, offeredItem, desiredCollection, desiredItem, price)
  try {
    toast.info(`Claiming swap ` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    // Sign and send the transaction
    const send = await api.tx.nfts.claimSwap(desiredCollection, desiredItem, offeredCollection, offeredItem,
      price? {
       amount: Number(price.amount.replace(/,/g, '')) * 10000000000,
       direction: price.direction === "Send"? "Send" : price.direction  === "Receive"? "Receive" : null
     } : null,
    )
.signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    });
    
  } catch (error) {
    await api.disconnect()
    console.error('Transfer failed:', error);
  }
}

console.log("Owner address ",item && item.owner, polkadotAddress)

const SWAP_TABLE_HEAD = ["Offered Item", "Offered Price", "Desired Price", item && item.currentOwner === polkadotAddress? "Claim Swap" : null];

const tokens = [
  {
    symbol: "DOT",
    logo: "/src/assets/statemint-native-dot.png",
    id: null
  },
  {
    symbol: "USDT",
    logo: "/src/assets/logo.png",
    id: 1984
  },
  {
    symbol: "USDC",
    logo: "/src/assets/usd-coin-usdc-logo.png",
    id: 1337
  },
]

const quotePriceExactTokensForTokens = async (id) => {
  const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
  const wsProvider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log('API initialized successfully');

  try {
    setApi(api)
    // Encode the input parameters
    const multiLocation2 = api.createType('MultiLocation', {
      parents: 0,
      interior: {
        X2: [
          { PalletInstance: 50 },
          { GeneralIndex: id }
        ]
      }
    }).toU8a();

    const multiLocation = api.createType('MultiLocation', {
      parents: 1,
      interior: 'Here'
    }).toU8a();

    const amountValue = BigInt((integerPrice * 1000000000000).toString()); // Example amount value in BigInt
    const amount = api.createType('u128', amountValue).toU8a();
    console.log('Encoded amount:', u8aToHex(amount));
    const bool = api.createType('bool', false).toU8a();

    // Concatenate the Uint8Arrays
    const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length + amount.length + bool.length);
    encodedInput.set(multiLocation, 0);
    encodedInput.set(multiLocation2, multiLocation.length);
    encodedInput.set(amount, multiLocation.length + multiLocation2.length);
    encodedInput.set(bool, multiLocation.length + multiLocation2.length + amount.length);

    // Convert concatenated Uint8Array to hex
    const encodedInputHex = u8aToHex(encodedInput);

    // Call the RPC method with the hex-encoded input
    const response = await api.rpc.state.call('AssetConversionApi_quote_price_exact_tokens_for_tokens', encodedInputHex);

    // Decode the response
    const decodedPrice = api.createType('Option<u128>', response);
    const price = (((decodedPrice.toHuman()).replace(/,/g, "") / 100000000) + ((decodedPrice.toHuman()).replace(/,/g, "") / 100000000) * 0.02).toFixed(3);
    console.log('Quoted Price:', ((decodedPrice.toHuman()).replace(/,/g, "") / 100000000).toFixed(3));
    setTokenPrice(price? (price).substring(0, 5) : null)
  } catch (e) {
    await api.disconnect()
    console.error('Error:', e);
  }
};

const stableCoinBalance = async() => {
  const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
  const wsProvider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log('API initialized successfully');

  try {
    const fetchStableCoinBalance = (await api.query.assets.account(selectedTokenLogo.id, polkadotAddress)).toHuman();
    const balance = fetchStableCoinBalance.balance;
    const balanceToNum = parseFloat(balance.replace(/,/g, ''));
    const isBalanceSufficient = balanceToNum / 1000000;
    console.log("Balance", isBalanceSufficient, tokenPrice);
    await api.disconnect();
    return tokenPrice <= isBalanceSufficient;
  } catch (e) {
    await api.disconnect();
    console.log("error", e);
    return false;
  }
}

const buy = async() => {
  try {
    toast.info(`Buying nft ` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    const bid_price = integerPrice * 10000000000
    console.log(bid_price)
    // Sign and send the transaction

    const stableCoinSwap = {
      path: [
        {
          parents: 0,
          interior: {
            X2: [
              { PalletInstance: 50 },
              { GeneralIndex: selectedTokenLogo.id }
            ]
          }
        },
        {
          parents: 1,
          interior: "Here"
        }
      ],
      amount_in: (tokenPrice * 1000000 + (tokenPrice * 1000000) * 0.02).toString(),
      amount_out_min: (integerPrice * 1000000000).toString(),
      send_to: polkadotAddress.toString(),
      keep_alive: false
    };
    
    // Extract the individual arguments
    const { path, amount_in, amount_out_min, send_to, keep_alive } = stableCoinSwap;
    
    // Create the calls array with the correct method signature
    const calls = [
      api.tx.assetConversion.swapExactTokensForTokens(path, amount_in, amount_out_min, send_to, keep_alive),
      api.tx.nfts.buyItem(collectionId, ItemId, Number(bid_price)),
    ];
    
    // Create and execute the batch
    const batch = api.tx.utility.batchAll(calls);
    
    batch
      .signAndSend(/* account, options */)
      .then(result => {
        console.log('Transfer successful:', result);
      })
      .catch(error => {
        console.error('Transfer failed:', error);
      });
    

    const send = await batch.signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    });
    
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}
const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);

useEffect(() => {
  const checkBalance = async () => {
    if (selectedTokenLogo && (selectedTokenLogo.symbol === "USDT" || selectedTokenLogo.symbol === "USDC")) {
      const result = await stableCoinBalance(selectedTokenLogo, polkadotAddress, tokenPrice);
      setIsBalanceSufficient(result);
    }
  };
  checkBalance();
}, [selectedTokenLogo, polkadotAddress, tokenPrice]);

const assetHubBuy = async() => {
  try {
    toast.info(`Buying nft ` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // Create a new WebSocket provider
    const wsProvider = new WsProvider(endpoint);

    // Create the API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Now you have the 'api' object ready for use
    console.log('API initialized successfully:', api);

    // You can set the 'api' object to the state or use it directly as needed
    setApi(api);

    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    const bid_price = integerPrice * 10000000000
    console.log(bid_price)
    // Sign and send the transaction
    const send = await api.tx.nfts.buyItem(collectionId, ItemId, Number(bid_price))
      .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          toast.success(`Completed at block hash #${status.asInBlock.toString()}` , {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } else {
          toast.info(`Current status: ${status.type}` , {
            position: "top-right",
            autoClose: 25009,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }).catch((error) => {
      toast.error(`Transaction failed' ${error}` , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    });
    
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}

const teleport = async() => {
  const args = {
    dest: {
      V3: {
        parents: 0,
        interior: {
          X1: {
            Parachain: 1000
          }
        }
      }
    },
    beneficiary: {
      V3: {
        parents: 0,
        interior: {
          X1: {
            AccountId32: {
              network: null,
              id: decodeAddress((polkadotAddress))
            }
          }
        }
      }
    },
    assets: {
      V3: [
        {
          id: {
            Concrete: {
              parents: 0,
              interior: "Here"
            }
          },
          fun: {
            Fungible: (integerPrice * 10000000000) + (0.02 * 10000000000)
          }
        }
      ]
    },
    fee_asset_item: 0,
    weight_limit: "Unlimited"
  };

  const endpoint = "wss://rpc.polkadot.io";
  const wsProvider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log('API initialized successfully');

  try {
    toast.info(`Buying nft ` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    setApi(api)
    // Enable the extension
    await web3Enable('remarker');

    // Get all accounts from the extension
    const allAccounts = await web3Accounts();

    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
      const { dest, beneficiary, assets, fee_asset_item, weight_limit } = args;
      toast.info(`1 of 2 confirmations` , {
        position: "top-right",
        autoClose: 25009,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    const send = await api.tx.xcmPallet.limitedTeleportAssets(dest, beneficiary, assets, fee_asset_item, weight_limit)
    .signAndSend(connectedAccount.address, { signer: injector.signer }, ({ status }) => {
      if (status.isInBlock) {
        toast.info(`2 of 2 confirmations` , {
          position: "top-right",
          autoClose: 25009,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
          assetHubBuy()
      } else {
        toast.info(`Current status: ${status.type}` , {
          position: "top-right",
          autoClose: 25009,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }
  }).catch((error) => {
    toast.error(`Transaction failed' ${error}` , {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });

  });
    
  }catch(e) {
    api.disconnect()
    toast.error(`Error: ${e}` , {
      position: "top-right",
      autoClose: 25009,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    console.error("error", e)
  }
}

const [dotBalance, setDotBalance] = useState(null);

const fetchDotBalance = async () => {
  try {
    const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
    const wsProvider = new WsProvider(endpoint);
    const api = await ApiPromise.create({ provider: wsProvider });
  
    console.log('API initialized successfully');
    const { data: { free: balance } } = await api.query.system.account(polkadotAddress);
    const balanceDot = parseFloat(balance.toString()) / 10 ** 10;
    console.log(`Balance in DOT: ${balanceDot}`);
    const isBalanceSufficient = balanceDot >= integerPrice;
    await api.disconnect();
    
    if (isBalanceSufficient) {
      setDotBalance(true);
    } else {
      const endpoint = "wss://rpc.polkadot.io";
      const wsProvider = new WsProvider(endpoint);
      const api = await ApiPromise.create({ provider: wsProvider });
      
      console.log('API initialized successfully');
      try {
        const { data: { free: balance } } = await api.query.system.account(polkadotAddress);
        const balanceDot = parseFloat(balance.toString()) / 10 ** 10;
        console.log(`Balance in DOT: ${balanceDot}`);
        const isBalanceSufficient = balanceDot >= integerPrice;
        await api.disconnect();
        
        if (isBalanceSufficient) {
          setDotBalance(false);
        } else {
          setDotBalance(null);
        }
      } catch (e) {
        await api.disconnect();
        console.error("error", e);
        setDotBalance(null);
      }
    }
  } catch (e) {
    console.log("Error", e);
    setDotBalance(null);
  }
};

useEffect(() => {
  fetchDotBalance();
}, [polkadotAddress, integerPrice]);
const ipfsHashimageUrl = imageData.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") || "";
const ipfsUri = `ipfs://${ipfsHashimageUrl}`;

const ipfsItemHash = item && item.image && item.image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") || "";
const ipfsItemUri = `ipfs://${ipfsItemHash}`;


    return (
        <div>
          <Dialog size="l" open={buyOpen} handler={buyOpenHandleOpen} className="h-full w-full overflow-scroll">
          <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: '500px', maxHeight: '10px' }} 
      />
            <DialogHeader className="justify-between">
            <Typography variant="h5">Select Token</Typography>
        <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={buyOpenHandleOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </DialogHeader>
            <DialogBody className='h-[30] overflow-scroll'>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
            <Card className="w-full">
              {tokens && tokens.map((item, index) => (
                <div key={index} style={{ marginRight: '10px' }} onClick={() => {
                  // handle item click
                }}>
                  <List>
                    <ListItem selected={selectedToken} onClick={() => {
                      setSelectedToken()
                      setselectedTokenLogo(item)
                      stableCoinBalance()
                      quotePriceExactTokensForTokens(item.id)
                      setTokenPrice(null)
                      fetchDotBalance()
                    }}>
                      <img
                        src={item.logo}
                        alt="card-image"
                        className="h-10 w-10 rounded-lg object-cover object-center"
                      />
                      <Typography color="blue-gray" className="font-medium" style={{ marginLeft: "20px" }}>
                        {item && item.symbol}
                      </Typography>
                    </ListItem>
                  </List>
                </div>
              ))}
            </Card>
          </div>
          <div style={{marginTop: "250px"}}>
          {selectedTokenLogo ? (
  <>
    {selectedTokenLogo.symbol !== "DOT" && (selectedTokenLogo.symbol === "USDT" || selectedTokenLogo.symbol === "USDC") ? (
      <>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {tokenPrice ? (
            <Typography color="gray" variant="h5">
              Price
            </Typography>
          ) : null}
            {tokenPrice? (<Typography style={{ marginLeft: "10px" }} color="gray" variant="h5">{tokenPrice} </Typography>) : <Typography
                        as="div"
                        variant="paragraph"
                        className="mb-2 h-5 w-20 rounded-full bg-gray-300"
                      >
                        &nbsp;
                        </Typography>
                      }
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {selectedTokenLogo && selectedTokenLogo.logo ? (
              <img
                src={selectedTokenLogo.logo}
                alt="card-image"
                className="h-6 w-6 rounded-lg object-cover object-center"
                style={{ marginLeft: "20px" }}
              />
            ) : null}
            {selectedTokenLogo && selectedTokenLogo.logo ? (
              <Typography style={{ marginLeft: "10px" }} color="gray" variant="h5">
                {selectedTokenLogo.symbol}
              </Typography>
            ) : null}
          </div>
        </div>
      </>
    ) : (
      <>
              <div style={{ display: 'flex', overflowX: 'auto' }}>
       <Typography color="gray" variant="h5">
      {price? price : null}
      </Typography>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
      <img
                src={selectedTokenLogo.logo}
                alt="card-image"
                className="h-6 w-6 rounded-lg object-cover object-center"
                style={{ marginLeft: "20px" }}
              />
        </div>
        <Typography style={{ marginLeft: "10px" }} color="gray" variant="h5">
                {selectedTokenLogo.symbol}
              </Typography>
        </div>
      </>
    )}
  </>
) : null}
{dotBalance === false?                       <Typography variant="h6" style={{float: "right"}}>
                        2 confimations required
                      </Typography> : null}

            </div>
            </DialogBody>
            <DialogFooter>
            {selectedTokenLogo ? (
  <>
    {selectedTokenLogo.symbol === "USDT" || selectedTokenLogo.symbol === "USDC" ? (
      isBalanceSufficient ? (
        <Button color="pink" onClick={buy}>Confirm Purchase</Button>
      ) : (
        <>
        {
          !isBalanceSufficient? (
            <Button color="pink" disabled={true}>Insufficient {selectedTokenLogo.symbol}</Button>
          ) : null
        }
        </>
      )
    ) : (
      <>
        {selectedTokenLogo.symbol === "DOT" ? (
          <>
            {dotBalance === true ? (
              <Button color="pink" onClick={assetHubBuy}>Confirm Purchase</Button>
            ) : (
              <>
                {dotBalance === false ? (
                  <>
                    <Button color="pink" onClick={teleport}>Confirm Purchase</Button>
                  </>
                ) : (
                  <>
                    {dotBalance === null ? (
                      <>
                        <Button color="pink" disabled={true}>Insufficient {selectedTokenLogo.symbol}</Button>
                      </>
                    ) : null}
                  </>
                )}
              </>
            )}
          </>
        ) : null}
      </>
    )}
  </>
) : null}

            </DialogFooter>
          </Dialog>
            <div style={{ display: "flex", alignItems: "center" }}>
            {isLoading && !error && (
  <div className="relative flex items-center justify-center absolute top-0 left-0"
  style={{ maxWidth: '300px' , maxHeight: "300px"}}>

  </div>
)}

{error && (
<></>
)}
            <MediaRenderer src={ipfsUri}
                                       size="xxl"
                                       variant="rounded"
                                       style={{ width: "300px", height: "300px", marginLeft: "20px", marginTop: "20px", borderRadius: "10px" }}    onClick={() => dataUrl(renderURL, JsonData)}
                                       onLoad={() => setIsLoading(false)}
                                       onError={() => {
                                         setIsLoading(false);
                                         setError(true);
                                       }}/>
                <div style={{ marginLeft: "50px" }}>
                    <Typography variant="h5">
                        {nameData}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium" variant="h6" style={{ display: 'flex', alignItems: 'center', marginTop: "5px" }}>
                <Typography color="blue-gray" className="font-medium" variant="h6" style={{ marginRight: '10px',  }}>
                     by
                </Typography>
                <Identicon
                    value={ownerData}
                    size={20}
                    theme="polkadot" className='icon-float-left' /> {    ownerData.length > 10 ? `${    ownerData.substring(0, 10)}...${    ownerData.slice(-10)}` :     ownerData}
            </Typography>
                    <Typography variant="h9" style={{marginTop: "20px"}}>
            {descriptionData.length > 200 ? (
  <>
    {`${descriptionData.substring(0, 200)}...`}
    <Button onClick={descriptionHandleOpen} size="sm" variant="outlined" color="pink" className="lowercase">
      Read more
    </Button>
  </>
) : (
  descriptionData
)}


            </Typography>
            <br />
            <br />
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
  <div>
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {volume === null? 0 : volume} DOT
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
      All volume
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {floor && floor === null? 0 : floor} DOT
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
      Floor
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {distribution === null? 0 : distribution}
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
    Owners
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {highestSale && highestSale === null? 0 : highestSale} DOT
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
    Top Sale
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {royalty === null? 0: royalty} %
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
      Royality
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
    { !maxSupply || maxSupply === 0 || maxSupply.length === 0 ? "Unlimited" : maxSupply }
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
      Total supply
    </Typography>
  </div>
  <div style={{ marginLeft: "20px" }}> {/* Add margin for spacing */}
    <Typography style={{ marginTop: "30px" }} variant="h5" color="pink">
      {filteredPrices.length} {nftCount? "/" : null} {nftCount}
    </Typography>
    <Typography style={{ marginTop: "5px" }} variant="h7">
    Listed / Minted
    </Typography>
  </div>
</div>


                </div>
            </div>
            
            <Dialog open={descriptionOpen} handler={descriptionHandleOpen} className="h-full w-full overflow-scroll">
        <DialogHeader className="justify-between"><Typography variant="h5">Description</Typography>
        <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={descriptionHandleOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
        </DialogHeader>
        <DialogBody>
          {descriptionData}
        </DialogBody>
        <DialogFooter>
        </DialogFooter>
      </Dialog>
            
      <Dialog open={activityopen} handler={activityHandleOpen} size={"xl"} className="h-full w-full overflow-scroll">
        <DialogHeader className="justify-between"><Typography variant="h5"> Activity
          </Typography>
          <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={activityHandleOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>

        </DialogHeader>
        <DialogBody>
        <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            { collectionActivities && collectionActivities.map(activity => (
              <tr key={activity.event_id}>
                <td>
                  {data.map((item, index) => {
                    if (item.Id === activity.item_id) {
                      return (
<>
  <div className="flex items-center">
  <Avatar src={`https://cloudflare-ipfs.com/ipfs/${item.image ? item.image.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "") : ""}`} className="h-10 w-10 object-cover" alt="item-image" variant="rounded" />
    <Typography color="blue-gray" className="font-medium ml-2" variant="h6">
      {item.name}
    </Typography>
  </div>
</>
                      );
                    }
                    return null; // Return null if no items match
                  })}
                </td>
                <td>
                  <Typography variant="h6" color="blue-gray" className="font-normal">
                    {activity.event_id}
                  </Typography>
                </td>
                <td>
                <Typography variant="h6" color="blue-gray" className="font-normal">
  {timeSince(new Date(activity.block_timestamp * 1000))}
</Typography>

</td>

              </tr>
            ))}
          </tbody>
        </table>
      </Card>
        </DialogBody>
        <DialogFooter>
          
        </DialogFooter>
      </Dialog>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginRight: "20px" }}>
      {/* Activity and Analitics */}
            {/* <IconButton color="pink" onClick={activityHandleOpen} >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clipRule="evenodd" />
</svg>


      </IconButton>
      <IconButton color="pink" >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
</svg>


      </IconButton> */}
      </div>


            <br />
            <Tabs value={activeTab} style={{width: "300px"}} >
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-pink-500 shadow-none rounded-none",
        }}
      >
        {CollectionTabs.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-pink-500" : ""}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
    </Tabs>
            <hr />
            <br />

            {
              activeTab === "Items"? (
                <>
                <div style={{ display: "flex", alignItems: "center" }}>
                <Button color="pink" size="md" style={{marginLeft: "20px"}} onClick={openDrawer}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ marginRight: "8px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg> Filter
  </div>
</Button>
<div className="flex items-center gap-4" style={{marginLeft: "100px"}}>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
        color="pink"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="pink"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        <IconButton {...getItemProps(active)} color="pink" variant="outlined">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink">{active + 2}</IconButton>
        <IconButton {...getItemProps(active + 3)} color="pink">{active + 3}</IconButton>
        <IconButton {...getItemProps(active + 4)} color="pink">{active + 4}</IconButton>
        <IconButton {...getItemProps(active + 5)} color="pink">{active + 5}</IconButton>
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        color="pink"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="pink"/>
      </Button>
    </div>
    <div style={{ marginLeft: "auto", minWidth: "200px" }}> {/* Add margin for spacing and set a minimum width */}
    <Select label=" Sort" value={filterOption} onChange={(value) => {setFilterOption(value), getData(value), setData([])}}>
      <Option value={optionValues.RecentlyMinted}>Recently Minted</Option>
      <Option value={optionValues.EarliestMinted}>Earliest Minted</Option>
      <Option value={optionValues.PriceHighToLow}> Price High To Low</Option>
      <Option value={optionValues.PriceLowToHigh}>Price Low To High</Option>
    </Select>
  </div>
</div>
 

<Drawer open={filterOpen} onClose={closeDrawer} className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Filter
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Typography variant="h6" onClick={statusToggleOpen}>
        <div style={{ display: "flex", alignItems: "center" }}>
          Status
          <div style={{ marginLeft: "auto" }}>
            {
              statusOpen? (
                <>
                <IconButton variant="text">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
</svg>

                </IconButton>
                </>
              ) : (
                <>
                <IconButton variant="text" >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
          </IconButton>
                </>
              )
            }
          </div>
          </div>
        </Typography>
        <Collapse open={statusOpen}>
<Card>
<List>
      <ListItem className="p-0">
        <label htmlFor="vertical-list-react" className="flex w-full cursor-pointer items-center px-3 py-2">
          <div className="mr-3">
            <Checkbox
              id="vertical-list-react"
              ripple={false}
              checked={isBuyChecked}
              onChange={toggleBuyCheckbox}
              className="hover:before:opacity-0"
              containerProps={{ className: "p-0" }}
              color="pink"
            />
          </div>
          <Typography color="blue-gray" className="font-medium">
            Buy now
          </Typography>
        </label>
      </ListItem>
      <ListItem className="p-0">
        <label htmlFor="vertical-list-vue" className="flex w-full cursor-pointer items-center px-3 py-2">
          <div className="mr-3">
            <Checkbox
              id="vertical-list-vue"
              ripple={false}
              checked={isOwnedChecked}
              onChange={toggleOwnedCheckbox}
              className="hover:before:opacity-0"
              containerProps={{ className: "p-0" }}
              color="pink"
            />
          </div>
          <Typography color="blue-gray" className="font-medium">
            Owned
          </Typography>
        </label>
      </ListItem>
    </List>
    </Card>
      </Collapse>
        
      </Drawer>


    <br />
    <br />
                
            {/* Here's where you can map over your data and render Cards for each item */}
            {
              data.length < 1 ? (
                <>
                     <div className="flex justify-center items-center h-screen">
        <Spinner className="h-8 w-8" color="pink" />
      </div>
                </>
              ) :
            ( <>{
  data.filter(item => item && (!item.burned) && (!isBuyChecked || (isBuyChecked && item.price)) && (!isOwnedChecked || (isOwnedChecked && item && item.currentOwner === polkadotAddress)))
    .map((item, index) => {
      const ipfsHash = item && item.image.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") || "";
        const ipfsUri = `ipfs://${ipfsHash}`;
      return (
      <Card
        key={index}
        className="Item-card"
        onClick={() => {
          selectedItems(item);
          handleOpen("xl");
          giveItemId(item);
          swap(item);
          getItemPrice(item);
          metadata(item);
        }}
      >
        <CardHeader shadow={false} floated={false} className="h-100">
        {isLoading && !error && (
  <div className="relative w-full h-full flex items-center justify-center absolute top-0 left-0">
    <Spinner color="pink" />
  </div>
)}

{error && (
  <div className="relative w-full h-full flex items-center justify-center absolute top-0 left-0" onClick={() => handleButtonClick(item)}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" onClick={() => {handleButtonClick(item), handleReload}}>
      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
    </svg>
  </div>
)}

<MediaRenderer src={ipfsUri}   alt=""
  className="h-full w-full object-cover"
  onClick={() => dataUrl(renderURL, JsonData)}
  style={{ display: isLoading && error ? 'none' : 'block', borderRadius: "10px" }}
  onLoad={() => setIsLoading(false)}
  onError={() => {
    setIsLoading(false);
    setError(true);
  }} />

        </CardHeader>
        <CardBody>
        <Typography variant="h5" color="blue-gray">
  {item && item.name && item.name.length > 30 ? `${item.name.slice(0, 30)}...` : item.name}
</Typography>


        </CardBody>
        <hr className="bold-hr" />
        <CardFooter>
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
  {item.price ? 
    <span style={{ color: '#D81B60' }}>{`${item.price} DOT`}</span> 
    : 
    <span style={{ color: 'gray' }}>Not Listed</span>
  }
  {item.price && 
    <Typography style={{ color: '#D81B60'}}>
      <img src="/src/assets/Polkadot_Token_PinkOnWhite.png" style={{ width: "23px", marginLeft: "5px" }} alt="Polkadot Token" />
    </Typography>
  }
</Typography>

        </CardFooter>
      </Card>
    )})
}</>)}
<br />
<br />
<br />
<div className="flex items-center gap-4" style={{marginLeft: "400px"}}>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
        color="pink"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="pink"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        <IconButton {...getItemProps(active)} color="pink" variant="outlined">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink">{active + 2}</IconButton>
        <IconButton {...getItemProps(active + 3)} color="pink">{active + 3}</IconButton>
        <IconButton {...getItemProps(active + 4)} color="pink">{active + 4}</IconButton>
        <IconButton {...getItemProps(active + 5)} color="pink">{active + 5}</IconButton>
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        color="pink"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="pink"/>
      </Button>
    </div>



            </>

) : null
}

{
  activeTab === "Owners"? (
    <>
      <>
      <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {HOLDER_HEAD.map((head) => (
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
        {holders && holders.map(owners => (
              <tr key={owners}>
                <td>
                <Card className="mt-6 w-100">
      <CardBody>
      <div style={{ display: 'flex', alignItems: 'center' }}>
  <Identicon
    value={owners.holder.address}
    size={50}
    theme="polkadot"
    className='icon-float-left' />
  <Typography variant="h5" color="blue-gray" className="mb-2" style={{ marginLeft: '10px' }}>
    {owners.holder.address}
  </Typography>
</div>

      </CardBody>
      <CardFooter className="pt-0">
      </CardFooter>
    </Card>
                </td>
                <td>
  <Typography variant="h5" color="blue-gray" className="mb-2" style={{ marginLeft: '10px' }}>
    {owners.balance}
  </Typography>
                </td>
              </tr>
                  ))}
        </tbody>
      </table>
    </Card>
      </>
    <div className="flex items-center gap-4" style={{ float: "right", marginRight: "209px", marginTop: "30px"}}>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prevPage}
        disabled={subscanPage === 1}
        color="pink"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="pink"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        <IconButton {...getPage(subscanPage)} color="pink" variant="outlined">{subscanPage}</IconButton>
        <IconButton {...getPage(subscanPage + 1 )} color="pink">{subscanPage + 1}</IconButton>
        <IconButton {...getPage(subscanPage + 2)} color="pink">{subscanPage + 2}</IconButton>
        <IconButton {...getPage(subscanPage + 3)} color="pink">{subscanPage + 3}</IconButton>
        <IconButton {...getPage(subscanPage + 4)} color="pink">{subscanPage + 4}</IconButton>
        <IconButton {...getPage(subscanPage + 5)} color="pink">{subscanPage + 5}</IconButton>
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={nextPage}
        color="pink"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="pink"/>
      </Button>
    </div>
    </>
  ) : null
}
            <Dialog open={size === "xl"} size={"xl"} handler={handleOpen}>
            <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: '500px', maxHeight: '10px' }} 
      />
        <DialogHeader className="justify-between">
         <div> <typography> {item && <div>{item.name}<Link to={`/Polkadot%20Asset%20Hub/Details/${collectionId}/${item.Id}`}> <IconButton color="blue-gray"
                size="sm"
                variant="text">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>

          </IconButton> </Link></div>} </typography>
         <Typography variant="h6" color="pink">{nameData}</Typography> </div>
        <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={handleOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
        </DialogHeader>
        <Tabs value={itemsActiveTab}>
  <TabsHeader>
    {tabs.map(({ label, value }) => (
      label === "Activity"? <Tab key={value} value={value} className="pink-tabs bg-gray" disabled={true}>
      {label}
    </Tab> :
      <Tab key={value} value={value} className="pink-tabs" onClick={() => setItemsActiveTab(value)}>
        {label}
      </Tab>
    ))}
  </TabsHeader>
</Tabs>

        <DialogBody className='h-[30rem] overflow-scroll'>
        {
  itemsActiveTab ==="Overview"? (
    <>
          {item && item.currentOwner === polkadotAddress? (
            <>
            {price? (
              <>
              <div style={{float: "right", marginTop: "50px"}}>
          <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
            <br />
    <br />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{marginRight: "40px"}}>
      <Identicon
                           value={    item && item.currentOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
                           <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6">Owned</Typography>
    <Typography >{    item && item.currentOwner &&     item && item.currentOwner.length > 10 ? `${    item && item.currentOwner.substring(0, 7)}...${    item && item.currentOwner.slice(-7)}` :     item && item.currentOwner}</Typography>
    </div>
                   </div>
                   <div>
                   <Identicon
                           value={    item && item.issuer}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
    <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6" >Created</Typography>
    <Typography >{    item && item.issuer.length > 10 ? `${    item && item.issuer.substring(0, 7)}...${    item && item.issuer.slice(-7)}` :     item && item.issuer}</Typography>
    </div>
                   </div>
                   </div>
  </Typography>
  <br />
  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />
                   <IconButton variant="text" style={{float: "right"}} onClick={burn}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

                   </IconButton>
                   <Typography variant="h6" color="pink" style={{ display: 'flex', alignItems: 'center' }}>
  <span>{price}</span>
  <span><img src="/src/assets/Polkadot_Token_PinkOnWhite.png" style={{ width: "23px", marginLeft: "5px" }} alt=""/></span>
</Typography>

  </Typography>
<br />
      </CardBody>
      <CardFooter className="pt-0">
      <Button size="md" variant="filled" color="red" onClick={deList}>Cancel sell</Button> <Button size="md" variant="filled" color="green" onClick={listToggleOpen}>Change price</Button> 
      <Collapse open={listOpen}>
<div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Price"
        icon={ <img src="/src/assets/Polkadot_Token_PinkOnWhite.png " alt=""/>}
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />
          <Typography variant="h6" className="flex items-center" color="gray">
              <Switch
                defaultChecked={whitelist}
                onChange={() => setWhitelist(!whitelist)}
                color="blue"
              />
              <span className="ml-4">Whitelist Buyer</span>
            </Typography>
            {whitelist? (
                <>
                <br />
                <Typography variant="h6" color="gray">
                  {" "}
                  Whitelist{" "}
                </Typography>
                <br />
                <div className="w-96">
                  <Input label="Whitelist Address" value={whiteListAddress}
        onChange={(e) => setWhiteListAddress(e.target.value)} />
                </div>
              </>
            ): (
                null
            )}
      <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={list}>
        Confirm Change
      </Button>
    </div>
      </Collapse>
      <Button fullWidth variant="filled" color="blue" style={{marginTop: "10px"}} onClick={sendToggleOpen}>
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 inline-block align-middle mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
    <span class="inline-block align-middle">Send</span>
  </span>
</Button>
<Collapse open={sendOpen}>
<div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Recipient"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>}
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={transfer}>
        Confirm Send
      </Button>
    </div>
      </Collapse>

      </CardFooter>
    </Card>
                 </div>
              </>
            ) : (
              <> 
                                              <div style={{float: "right", marginTop: "50px"}}>
          <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
            <br />
    <br />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{marginRight: "40px"}}>
      <Identicon
                           value={    item && item.currentOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
                           <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6">Owned</Typography>
    <Typography >{    item && item.currentOwner &&     item && item.currentOwner.length > 10 ? `${    item && item.currentOwner.substring(0, 7)}...${    item && item.currentOwner.slice(-7)}` :     item && item.currentOwner}</Typography>
    </div>
                   </div>
                   <div>
                   <Identicon
                           value={    item && item.issuer}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
    <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6" >Created</Typography>
    <Typography >{    item && item.issuer.length > 10 ? `${    item && item.issuer.substring(0, 7)}...${    item && item.issuer.slice(-7)}` :     item && item.issuer}</Typography>
    </div>
                   </div>
                   </div>
  </Typography>
  <br />
              {
                fetchLoading? (

                  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />

                   
    <Typography as="div"
        variant="h1"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300">  &nbsp;</Typography>
    <br />
  </Typography>
      </CardBody>
      <CardFooter className="pt-0">
      <Typography variant="h4" as="div"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300">&nbsp;</Typography>
      <Typography variant="h3" as="div"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300">&nbsp;</Typography>
      <Typography variant="h2" as="div"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300">&nbsp;</Typography>
      </CardFooter>
    </Card>
                ) : (
                  <>
  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />
                   <IconButton variant="text" style={{float: "right"}} onClick={burn}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

                   </IconButton>

                   
    <Typography variant="h6" color="pink">  Not for sale</Typography>
    <br />
  </Typography>
      </CardBody>
      <CardFooter className="pt-0">
      <Button fullWidth size="md" variant="filled" color="green" onClick={listToggleOpen}>List for sale</Button>
      <Collapse open={listOpen}>
<div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Price"
        icon={ <img src="/src/assets/Polkadot_Token_PinkOnWhite.png " alt=""/>}
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />
          <Typography variant="h6" className="flex items-center" color="gray">
              <Switch
                defaultChecked={whitelist}
                onChange={() => setWhitelist(!whitelist)}
                color="blue"
              />
              <span className="ml-4">Whitelist Buyer</span>
            </Typography>
            {whitelist? (
                <>
                <br />
                <Typography variant="h6" color="gray">
                  {" "}
                  Whitelist{" "}
                </Typography>
                <br />
                <div className="w-96">
                  <Input label="Whitelist Address" value={whiteListAddress}
        onChange={(e) => setWhiteListAddress(e.target.value)} />
                </div>
              </>
            ): (
                null
            )}
      <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={list}>
        Confirm List
      </Button>
    </div>
      </Collapse>
      <Button fullWidth variant="filled" color="blue" style={{marginTop: "10px"}} onClick={sendToggleOpen}>
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 inline-block align-middle mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
    <span class="inline-block align-middle">Send</span>
  </span>
</Button>
<Collapse open={sendOpen}>
<div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Recipient"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>}
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={transfer}>
        Confirm Send
      </Button>
    </div>
      </Collapse>
      </CardFooter>
    </Card>
              </>
            )}
                             </div>
                  </>
                )
              }
            </>
          ) : (
            <>
            {fetchLoading? (
              <>
              <div style={{float: "right", marginTop: "50px"}}>
                    <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{marginRight: "40px"}}>
      <Identicon
                           value={    item && item.currentOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
                           <div style={{float: "right", marginLeft: "20px"}}>
    <Typography  variant="h6">Owned</Typography>
    <Typography >{    item && item.currentOwner &&     item && item.currentOwner.length > 10 ? `${    item && item.currentOwner.substring(0, 7)}...${    item && item.currentOwner.slice(-7)}` :     item && item.currentOwner}</Typography>
    </div>
                   </div>
                   <div>
                   <Identicon
                           value={    item && item.issuer}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
    <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6">Created</Typography>
    <Typography >{    item && item.issuer.length > 10 ? `${    item && item.issuer.substring(0, 7)}...${    item && item.issuer.slice(-7)}` :     item && item.issuer}</Typography>
    </div>
                   </div>
                   </div>
  </Typography>
  <br />
              {
                fetchLoading? (
                  <>
                   <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h3" color="blue-gray">
                   <br />
                   <Typography  as="div" variant="h6" className="mb-4 h-3 w-56 rounded-full bg-gray-300" style={{ display: 'flex', alignItems: 'center' }}>
  <span>&nbsp;</span>
</Typography>
  </Typography>
<br />
      </CardBody>
      <CardFooter className="pt-0">
      <Typography
        as="div"
        variant="h4"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="h3"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      </CardFooter>
    </Card>
                  </>
                ) : (
                  <>
                    <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
     <br />
    <Typography variant="h6" color="pink">  Not listed</Typography>
  </Typography>
  <Button color="pink" size="md" variant="outlined" style={{marginTop: "20px", float: "right" }} onClick={() => {owned() , handleOpen(), swapHandleOpen("xl")}}> Make Swap</Button>
      </CardBody>
      <CardFooter className="pt-0">
      </CardFooter>
    </Card>
                  </>
                )
              }
                 </div>
                 </>
                 ) : (
                  <>
                  <div style={{float: "right", marginTop: "50px"}}>
                <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
          Buy now <br />
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: "40px"}}>
            <Identicon
                                 value={    item && item.currentOwner}
                                 size={40}
                                 theme="polkadot" style={{float: "left"}} />
                                 <div style={{float: "right", marginLeft: "20px"}}>
          <Typography variant="h6">Owned</Typography>
          <Typography >{    item && item.currentOwner &&     item && item.currentOwner.length > 10 ? `${    item && item.currentOwner.substring(0, 7)}...${    item && item.currentOwner.slice(-7)}` :     item && item.currentOwner}</Typography>
          </div>
                         </div>
                         <div>
                         <Identicon
                                 value={    item && item.issuer}
                                 size={40}
                                 theme="polkadot" style={{float: "left"}} />
          <div style={{float: "right", marginLeft: "20px"}}>
          <Typography variant="h6" >Created</Typography>
          <Typography >{    item && item.issuer.length > 10 ? `${    item && item.issuer.substring(0, 7)}...${    item && item.issuer.slice(-7)}` :     item && item.issuer}</Typography>
          </div>
                         </div>
                         </div>
        </Typography>
        <br />
              { fetchLoading? (
                <>
                <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h3" color="blue-gray">
                   <br />
                   <Typography  as="div" variant="h6" className="mb-4 h-3 w-56 rounded-full bg-gray-300" style={{ display: 'flex', alignItems: 'center' }}>
  <span>&nbsp;</span>
</Typography>
  </Typography>
<br />
      </CardBody>
      <CardFooter className="pt-0">
      <Typography
        as="div"
        variant="h4"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="h3"
        className="mb-4 h-3 w-56 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      </CardFooter>
    </Card>
                </>
              ):(
  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />
                   <Typography variant="h6" color="pink" style={{ display: 'flex', alignItems: 'center' }}>
  <span>{price}</span>
  <span><img src="/src/assets/Polkadot_Token_PinkOnWhite.png" style={{ width: "23px", marginLeft: "5px" }} alt=""/></span>
</Typography>
  </Typography>
<br />
      </CardBody>
      <CardFooter className="pt-0">
      <Button color="pink" onClick={() => {handleOpen(), buyOpenHandleOpen("xl")}}>Buy now</Button>
      <Button color="pink" size="md" variant="outlined" style={{marginTop: "20px", float: "right" }} onClick={() => {owned() , handleOpen(), swapHandleOpen("xl")}}> Make Swap</Button>
      </CardFooter>
    </Card>)}
    </div>
                 </>
                 )}
            </>
          )}
          <Card className="w-full  max-w-lg mx-auto shadow-lg overflow-hidden">
    <CardBody className="w-full ">
    <MediaRenderer src={ipfsItemUri} alt=""
                style={{ width: '100%', height: 'auto' }} />
    </CardBody>
    <CardFooter className="pt-0 text-center">
      
    </CardFooter>
</Card>

<Card className="mt-20 w-full   ">
        <CardBody>
        <div className="flex items-center">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
  </svg>
  <Typography color="blue-gray" className="font-medium text-3xl">
    Attributes
  </Typography>
</div>

        </CardBody>
        <CardFooter className="pt-0">
        {itemMetadata && itemMetadata.attributes? (
        <div>
          <div className="traits">
  {itemMetadata.attributes.map((attribute, index) => (
    <div key={index} className="traits-item">
      <Card>
        <CardBody>
          <Typography variant="h6" color="pink" className="mb-2">
            {attribute.trait_type}
          </Typography>
          <Typography>
            {attribute.value}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0"></CardFooter>
      </Card>
    </div>
  ))}
</div>

        </div>
      ) : null}
</CardFooter>
</Card>

<Card className="mt-6 w-1000">
        <CardBody>
        <div className="flex items-center">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
  <Typography color="blue-gray" className="font-medium text-3xl">
    Details
  </Typography>
</div>

        </CardBody>
        <CardFooter className="pt-0">
        <Button
      onMouseLeave={() => setIdcopied(false)}
      onClick={() => {
        copy(item && item.Id);
        setIdcopied(true);
      }}
      color="pink"
      variant="outlined"
      className=" flex items-center gap-x-3 px-4 py-2.5 lowercase" // Adjust height and width here
    >
      <Typography        className="border-r border-gray-400/50 pr-3 font-normal"
        variant="small">
            Item id : {item && item.Id}
           
          </Typography>
      {idcopied ? (
            <CheckIcon className="h-4 w-4 text-pink" />
          ) : (
            <DocumentDuplicateIcon className="h-4 w-4 text-pink" />
          )}
    </Button>
    <br />
    <Button
  onMouseLeave={() => setOwnercopied(false)}
  onClick={() => {
    copy(    item && item.currentOwner);
    setOwnercopied(true);
  }}
  color="pink"
  variant="outlined"
  className="flex items-center gap-x-3 px-4 py-2.5 lowercase"
>
  <Typography variant="small" className="border-r border-gray-400/50 pr-3 font-normal">
    Item Owner : {    item && item.currentOwner}
  </Typography>
  {ownercopied ? (
    <CheckIcon className="h-4 w-4 text-pink" />
  ) : (
    <DocumentDuplicateIcon className="h-4 w-4 text-pink" />
  )}
</Button>
<br />
<Button
  onMouseLeave={() => setCollectionIdCopied(false)}
  onClick={() => {
    copy(IdData);
    setCollectionIdCopied(true);
  }}
  color="pink"
  variant="outlined"
  className="flex items-center gap-x-3 px-4 py-2.5 lowercase"
>
  <Typography variant="small" className="border-r border-gray-400/50 pr-3 font-normal">
    Collection id : {IdData}
  </Typography>
  {collectionIdCopied ? (
    <CheckIcon className="h-4 w-4 text-pink" />
  ) : (
    <DocumentDuplicateIcon className="h-4 w-4 text-pink" />
  )}
</Button>
<br />
<Button
  onMouseLeave={() => setCollectionOwnerCopied(false)}
  onClick={() => {
    copy(    item && item.issuer);
    setCollectionOwnerCopied(true);
  }}
  color="pink"
  variant="outlined"
  className="flex items-center gap-x-3 px-4 py-2.5 lowercase"
>
  <Typography variant="small" className="border-r border-gray-400/50 pr-3 font-normal">
    Collection Owner : {    item && item.issuer}
  </Typography>
  {collectionOwnerCopied ? (
    <CheckIcon className="h-4 w-4 text-pink" />
  ) : (
    <DocumentDuplicateIcon className="h-4 w-4 text-pink" />
  )}
</Button>

          
</CardFooter>
</Card>
</>
  ) : null
}
{
  itemsActiveTab === "Activity" ? (
    <>
      <h1>Activity</h1>
    </>
  ) : null
}
{
  itemsActiveTab === "Swaps" ? (
    <>
       {swapData ? (<Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {SWAP_TABLE_HEAD.map((head) => (
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
          {swapData? ( swapData.map((data, index) => {
            const isLast = index === swapData.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
            return (
              <tr key={index}>
                <td className={classes}>
                <Link to={`/Polkadot%20Asset%20Hub/Details/${data.swapDetails.offeredCollection}/${data.swapDetails.offeredItem}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => {
            localStorage.setItem('selectedCollectionId', JSON.stringify(data.swapDetails.offeredCollection));
            localStorage.setItem('selectedCollectionItems', JSON.stringify(data.swapDetails.offeredItem));
                }} >
                   {data && (
        <MediaRenderer src={`ipfs://${data.responseData.image.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "")}`}                 className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }} />
      )}
                                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    style={{marginLeft: "20px"}}
                  >
                    {data.responseData.name}
                  </Typography>
                  </div>
                  </Link>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                  {data.swapDetails.swapData.price === null? 0 : `${data.swapDetails.swapData.price.direction === "Send" ? data.swapDetails.swapData.price.amount : 0} DOT`}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                  {data.swapDetails.swapData.price === null? 0 : `${data.swapDetails.swapData.price.direction === "Receive"? data.swapDetails.swapData.price.amount : 0} DOT`}
                  </Typography>
                </td>
                {item && item.currentOwner === polkadotAddress? (
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Button color="pink"  size="sm" className="rounded-full lowercase" onClick={() => {
                    claimSwap(data.swapDetails.offeredCollection, data.swapDetails.offeredItem, data.swapDetails.swapData.desiredCollection, data.swapDetails.swapData.desiredItem, data.swapDetails.swapData.price? data.swapDetails.swapData.price : null)
                  }}>Claim Swap</Button>
                </td>
                ) : null }
              </tr>
            );
          })) : null}
        </tbody>
      </table>
    </Card>) : (
      <>
      {
        swapLoading? (
          <>
           <>
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-5 w-full rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-5 w-full rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-5 w-full rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-5 w-full rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      </>
          </>
        ) : (
          <>
          </>
        )
      }
      </>
    )}
    </>
  ) : null
}


        </DialogBody>
        <DialogFooter>
        </DialogFooter>
      </Dialog>
      <Dialog open={swapSize === "xl"} size="xl" handler={swapHandleOpen}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: '500px', maxHeight: '10px' }} 
      />
  {
    offeredpage === 1 ? (
      <>
        <DialogHeader className="justify-between">
          Offered Item
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={swapHandleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className='h-[30rem] w-full overflow-scroll'>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <Card className="w-full">
              {ownedmetadata && ownedmetadata.map((item, index) => (
                <div key={index} style={{ marginRight: '10px' }} onClick={() => {
                  // handle item click
                }}>
                  <List>
                    <ListItem selected={selected} onClick={() => {
                      setSelectedItem();
                      setOfferedItem(item.itemId);
                      setOfferedCollection(item.collectionId);
                    }}>
                                             {item && (
        <MediaRenderer src={`ipfs://${item?.image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "")}`}                 className="h-10 w-10 rounded-lg object-cover object-center"  style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }}/>
      )}
                      <Typography color="blue-gray" className="font-medium" style={{ marginLeft: "20px" }}>
                        {item && item.name}
                      </Typography>
                    </ListItem>
                  </List>
                </div>
              ))}
            </Card>
          </div>
          <br />
          <div className="flex items-center gap-4" style={{ marginTop: "50px" }}>
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={ownedPrev}
              disabled={ownedactive === 1}
              color="pink"
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="pink" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <IconButton {...getOwnedItemProps(ownedactive)} color="pink" variant="outlined">{ownedactive}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 1)} color="pink">{ownedactive + 1}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 2)} color="pink">{ownedactive + 2}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 3)} color="pink">{ownedactive + 3}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 4)} color="pink">{ownedactive + 4}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 5)} color="pink">{ownedactive + 5}</IconButton>
            </div>
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={ownedNext}
              color="pink"
            >
              Next
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="pink" />
            </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="pink" onClick={() => setOfferedpage(2)}>Continue</Button>
        </DialogFooter>
      </>
    ) : null
  }
  {
    offeredpage === 2 ? (
      <>
        <DialogHeader className="justify-between">
          Price
        <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={swapHandleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
          <DialogBody  className='h-[30rem] w-full overflow-scroll'>
          <Switch
            color="pink"
            onChange={() => {setSetSwapPrice(!setSwapPrice), setDirection(null)}}
            label="Swap Price"
          />
          <br />
          <br />
          {
            !setSwapPrice? (
          <div className="w-72">
          <Select
        label="Direction"
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        onChange={(value) => setDirection(value)}
      >
        <Option value="send">Send</Option>
        <Option value="receive">Receive</Option>
      </Select>
    </div>
        ) : null
      }
      <br />
    {direction === "send" ? (
        <>
          <Typography variant="h4" color="pink">
            Send DOT
          </Typography>
          <br />
            <Input
              min="0"
              type="number"
              label="Offered Price"
              icon={<img src="/src/assets/statemint-native-dot.png" />}
              onChange={handleSendInputChange}
            />
        </>
      ) : null}
      {
        direction === "receive"? (
          <>
          <br />
          <Typography variant="h4" color="pink">
            Receive DOT
          </Typography>
          <br />
            <Input
              type="number"
              label="Desired Price"
              icon={<img src="/src/assets/statemint-native-dot.png" />}
              onChange={handleReceiveInputChange}
              min="0"
            />
        </>
        ) : null
      }
        
            {/* Dialog body for page 2 */}
          </DialogBody>
          <Button onClick={() => setOfferedpage(1)} variant='text' color='pink' style={{float: "left"}}> &#x2190; Previous</Button>
          <DialogFooter>
            <Button color="pink" onClick={() => createSwap()}>Confirm</Button>
            {/* Dialog footer for page 2 */}
          </DialogFooter>
      </>
    ) : null
  }
</Dialog>

                
        </div>
    );
  }
}
