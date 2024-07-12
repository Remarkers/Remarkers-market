import React, { useEffect, useState } from "react";
import Axios from 'axios';
import
{
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

} from '@material-tailwind/react'
import {encodeAddress, decodeAddress} from '@polkadot/util-crypto'
import Identicon from '@polkadot/react-identicon';
import { Link } from "react-router-dom";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress, web3EnablePromise } from '@polkadot/extension-dapp';
import { ToastContainer, toast } from 'react-toastify';
import { MediaRenderer } from "@thirdweb-dev/react";
import { CheckIcon, DocumentDuplicateIcon, ArrowRightIcon, ArrowLeftIcon  } from "@heroicons/react/24/outline";
import { u8aToHex, stringToHex, stringToU8a } from '@polkadot/util'
import { useParams } from 'react-router-dom';
import dotLogo from '/src/assets/statemint-native-dot.png';
import usdtLogo from '/src/assets/logo.png';
import usdcLogo from '/src/assets/usd-coin-usdc-logo.png';
import dotWhiteLogo from '/src/assets/Polkadot_Token_PinkOnWhite.png';
import { add } from "date-fns";

export default function PAHDetails() {
    const [metadata, setMetadata] = useState()
    const [itemOwner, setItemOwner] = useState()
    const [collectionOwner, setCollectionOwner] = useState()
    const [price, setPrice] = useState()
    const [recipient, setRecipient] = useState('');
    const [api, setApi] = useState()
    const [itemPrice, setItemPrice] = useState() 
    const [whitelist, setWhitelist] = useState(false)
    const [whiteListAddress, setWhiteListAddress] = useState()
    const [integerPrice, setIntegerPrice] = useState()
    const [size, setSize] = React.useState(null);
    const [sendDialog, setSendDialog] = React.useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [swapData, setSwapData] = useState(null)
    const [swapSize, setSwapSize] = React.useState(null);
    const [offeredpage, setOfferedpage] = useState(1)
    const [owner, setOwner] = useState()
    const [ownedPrice, setOwnedPrice] = useState()
    const [ownedmetadata, setOwnedMetadata] = useState()
    const [ownedactive, setOwnedActive] = React.useState(1);
    const [setSwapPrice, setSetSwapPrice] = useState(null)
    const [direction, setDirection] = useState(null);
    const [offeredCollection, setOfferedCollection] = useState()
    const [offeredItem, setOfferedItem] = useState()
    const [sendPrice, setSendPrice] = useState(null)
    const [receivePrice, setReceivePrice] = useState(null)
    const [buyOpen, setBuyOpen] = React.useState(false);
    const [selectedToken, setSelectedToken] = useState(null)
    const [selectedTokenLogo, setselectedTokenLogo] = useState()
    const[tokenPrice, setTokenPrice] = useState(null)
    const [selectedCollectionName, setSelectedCollectionName] = useState()
    const [swapLoading, setSwapLoading] = useState()
    const [fetchLoading, setFetchLoading] = useState()
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedJsondata, setJsondata] = useState(null);
    const [isMobile, setIsMobile] = useState();

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
    

    const { collectionId, itemId } = useParams();
    const sendHandleOpen= (value) => setSendDialog(value);
    const handleOpen = (value) => setSize(value);
    const swapHandleOpen = (value) => setSwapSize(value);

    const ItemId = itemId.replace(/,/g, '');

  const handleReload = () => {
  setIsLoading(true);
  setError(false);
};

const buyOpenHandleOpen = () => setBuyOpen(!buyOpen);


const handleSendInputChange = (e) => {
  setSendPrice(e.target.value);
}

const handleReceiveInputChange = (e) => {
  setReceivePrice(e.target.value);
}


const [selected, setSelected] = React.useState();
const setSelectedItem = (value) => setSelected(value);

const connectedAccount = JSON.parse(localStorage.getItem('Account'));
const address = connectedAccount? connectedAccount.address : null;

const decodedAddress = address ? decodeAddress(address) : null;

// Re-encode with the Polkadot prefix (e.g., 0 for Polkadot Mainnet)
const polkadotAddress = decodedAddress ? encodeAddress(decodedAddress, 0) : null;
console.log("holder", itemOwner)

console.log('Polkadot Address:', polkadotAddress);

const ownedNft = async() => {
  try {
      const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}owned?address=${JSON.stringify(address)}&page=${ownedactive.toString()}`);
      setOwner(response.data.data.result); // Store the data directly as an array of objects
      setOwnedMetadata(response.data.data.metadata)
      setOwnedPrice(response.data.data.result.price)
      // setSwap(response.data.data.swap)
} catch (error) {
    console.error('Error fetching data:', error);
}
}
    
    const owned = async() => {
        try {
          setFetchLoading(true)
            const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}metadatas?item=${ItemId}&collection=${collectionId}`);
            setMetadata(response.data.data.itemJson); // Store the data directly as an array of objects
            setCollectionOwner(response.data.data.collectionOwner);
            setItemOwner(response.data.data.itemOwner);
            setPrice(response.data.data.price && response.data.data.price.price === 0? null : response.data.data.price && response.data.data.price.priceDotUsd);
            setIntegerPrice(response.data.data.price && response.data.data.price.price === 0 ? null : response.data.data.price && response.data.data.price.price)
            setSelectedCollectionName(response.data.data.collectionName)

            setFetchLoading(false)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      }
      const swap = async() => {
        try {
          setSwapLoading(true)
          const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}swap?data=${ItemId}&collectionId=${collectionId}`);
          const res = response.data.data;
          const resarray = res && res.map(item => item)[0];
          setSwapData( resarray); // Store the data directly as an array of objects
          setSwapLoading(false)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      }
      useEffect(() => {
        owned();
        swap();
        ownedNft();
      }, []);
      
    

      console.log(metadata)
      console.log(itemOwner)
      console.log(collectionOwner)
      console.log("price",price)
      console.log("integerPrice",integerPrice)

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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);

    // Sign and send the transaction
    const send = await api.tx.nfts
      .transfer(collectionId, ItemId, recipient)
      .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully sent',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
      toast.info(`Listing your nft` , {
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
  const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }
  
      // Get all accounts from the extension
  
  
      // Find the injector for the connected account
      const injector = await web3FromAddress(connectedAccount.address);
      const price = itemPrice * 10000000000
      // Sign and send the transaction
      const send = await api.tx.nfts.setPrice(collectionId, ItemId, price, whiteListAddress)
        .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
              const toastId = toast.info('Transaction is processing', {
                position: "top-right",
                autoClose: false, // Set autoClose to false to keep the toast visible
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                isLoading: true, // This shows the loading indicator
              });
            
              // Simulate an async action, e.g., sending an NFT
              setTimeout(() => {
                toast.update(toastId, {
                  render: 'successfully listed',
                  type: 'success',
                  isLoading: false,
                  autoClose: 5000, // Close the toast after 5 seconds
                  closeOnClick: true,
                });
              }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    const price = 0
    // Sign and send the transaction
    const send = await api.tx.nfts.setPrice(collectionId, ItemId, price, whiteListAddress)
      .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully delisted',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    // Sign and send the transaction
    const send = await api.tx.nfts.burn(collectionId, ItemId)
      .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully burned',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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

const assetHubBuy = async() => {
  try {
    toast.info(`Buying nft` , {
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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    const bid_price = integerPrice * 10000000000
    console.log(bid_price)
    // Sign and send the transaction
    const send = await api.tx.nfts.buyItem(collectionId, ItemId, Number(bid_price))
      .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully bought',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
const buy = async() => {
  try {
    toast.info(`Buying nft` , {
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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


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
      amount_in: (tokenPrice * 1000000).toString(),
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
    

    const send = await batch.signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully bought',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
const ipfsHash = metadata && metadata.image.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") || "";
const ipfsUri = `ipfs://${ipfsHash}`;

const data = [
  {
    label: "Description",
    value: "Description",
    desc: `${metadata && metadata.description}`,
  },
  {
    label: "Attributes",
    value: "Attributes",
    desc: ``,
  },

  {
    label: "Swaps",
    value: "Swaps",
    desc: ``,
  },
];
const SWAP_TABLE_HEAD = ["Offered Item", "Offered Price", "Desired Price", itemOwner === polkadotAddress? "Claim Swap" : null];

const [active, setActive] = React.useState(1);

const getItemProps = (index) =>
  ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => {setActive(index), getData()},
  });

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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


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
.signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully created',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
        await api.disconnect()
  }
}

const tokens = [
  {
    symbol: "DOT",
    logo: dotLogo,
    id: null
  },
  {
    symbol: "USDT",
    logo: usdtLogo,
    id: 1984
  },
  {
    symbol: "USDC",
    logo: usdcLogo,
    id: 1337
  },
]

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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


    // Find the injector for the connected account
    const injector = await web3FromAddress(connectedAccount.address);
    // Sign and send the transaction
    const send = await api.tx.nfts.claimSwap(desiredCollection, desiredItem, offeredCollection, offeredItem,
      price? {
       amount: Number(price.amount.replace(/,/g, '')) * 10000000000,
       direction: price.direction === "Send"? "Send" : price.direction  === "Receive"? "Receive" : null
     } : null,
    )
.signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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
            const toastId = toast.info('Transaction is processing', {
              position: "top-right",
              autoClose: false, // Set autoClose to false to keep the toast visible
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              isLoading: true, // This shows the loading indicator
            });
          
            // Simulate an async action, e.g., sending an NFT
            setTimeout(() => {
              toast.update(toastId, {
                render: 'successfully claimed',
                type: 'success',
                isLoading: false,
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: true,
              });
            }, 30000); // Example delay for the async action (e.g., 25 seconds)=
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
    toast.info(`Buying nft` , {
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
const wallet = localStorage.getItem("walletName");
        let signer;
    
        if (wallet === "nova") {
          // Enable the extension
          await web3Enable('remarker');
          const allAccounts = await web3Accounts();
          const injector = await web3FromAddress(connectedAccount.address);
    
          // Get all accounts from the extension
      
    
          // Find the injector for the connected account
      
    
          signer = injector.signer;
        } else {
          // Check if the wallet extension exists in window.injectedWeb3
          const Connectivity = window.injectedWeb3 && window.injectedWeb3[wallet];
          if (!Connectivity) {
            throw new Error(`${wallet} wallet extension not found.`);
          }
    
          // Enable the extension and get accounts
          const extension = await Connectivity.enable();
          const getAccounts = await extension.accounts.get();
    
          signer = extension.signer;
        }

    // Get all accounts from the extension


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
    .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
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

const dataUrl = ((renderURL, JsonData) => {
  setSelectedImageUrl(renderURL);
  setJsondata(JsonData)})

    return (
        <>
            {
                metadata? (
                    <>
                            <div style={isMobile? undefined :{float: "right", marginRight: "300px"}} className={isMobile? "max-w-full" : undefined}>
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
                        alt={`${item.symbol}`}
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
{
  selectedTokenLogo && selectedTokenLogo.symbol === "DOT" ? (
    <> 
    {dotBalance === false?                       <Typography variant="h6" style={{float: "right"}}>
                        2 confimations required
                      </Typography> : null}
    </>
  ) : (
    null
  )
}

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
          {
                isMobile? 
                (
                  <>
                             {isLoading && !error && (
            <>
                                            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-8 w-8" color="pink" />
              </div>
            </>
           )
          }
        {error && (
null
        )}
                      <MediaRenderer src={ipfsUri}
      onClick={() => dataUrl(renderURL, JsonData)}
                                              style={{width: "auto", marginLeft: "30px", borderRadius: "10px"}}
                                              className="mt-5 ml-2"
                                        alt=""
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(true);
            setError(true);
          }} />
    <br />
                  </>
                ) : null
               }
 {itemOwner === polkadotAddress? (
            <>
            {integerPrice? (
              <>
              <div style={isMobile? {marginLeft: "10px", marginTop: "40px"} : {float: "right", marginTop: "50px"}} className={isMobile? "overflow-scroll": undefined}>
              <Typography variant="h4">{metadata.name}</Typography>
 <Link to={`/Polkadot%20Asset%20Hub/marketplace/${collectionId}/${selectedCollectionName}`}>
 <Typography variant="h6" color="pink">{selectedCollectionName}</Typography>
 </Link>
          <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
            <br />
    <br />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{marginRight: "40px"}}>
      <Identicon
                           value={itemOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
                           <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6">Owned</Typography>
    <Typography >{itemOwner && itemOwner.length > 10 ? `${itemOwner.substring(0, 7)}...${itemOwner.slice(-7)}` : itemOwner}</Typography>
    </div>
                   </div>
                   <div>
                   <Identicon
                           value={collectionOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
    <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6" >Created</Typography>
    <Typography >{collectionOwner.length > 10 ? `${collectionOwner.substring(0, 7)}...${collectionOwner.slice(-7)}` : collectionOwner}</Typography>
    </div>
                   </div>
                   </div>
  </Typography>
  <br />
  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />
                   <IconButton variant="text" onClick={burn} style={{float: "right"}}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

                   </IconButton>
                   <Typography variant="h6" color="pink" style={{ display: 'flex', alignItems: 'center' }}>
  <span>{price && price}</span>
  <span><img src={dotWhiteLogo} style={{ width: "23px", marginLeft: "5px" }} alt=""/></span>
</Typography>
  </Typography>
<br />
      </CardBody>
      <CardFooter className="pt-0">
      <Button size="md" variant="filled" color="red" onClick={deList}>Cancel sell</Button> <Button size="md" variant="filled" color="green" onClick={() => handleOpen("lg")}>Change price</Button> 
      <Dialog
        open={size === "lg"}
        size={"lg"}
        handler={handleOpen}
      >
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
        <DialogHeader className="justify-between"><div> <Typography variant="h5">Change Price</Typography> </div>
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
              </IconButton></DialogHeader>
        <DialogBody>
        <div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Price"
        icon={ <img src={dotWhiteLogo} alt=""/>}
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
                <div className="w-100">
                  <Input label="Whitelist Address" value={whiteListAddress}
        onChange={(e) => setWhiteListAddress(e.target.value)} />
                </div>
              </>
            ): (
                null
            )}
    </div>
        </DialogBody>
        <DialogFooter>
        <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={list}>
        Confirm Change
      </Button>
        </DialogFooter>
      </Dialog>
      <Button fullWidth variant="filled" color="blue" style={{marginTop: "10px"}} onClick={() => sendHandleOpen("lg")} >
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 inline-block align-middle mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
    <span class="inline-block align-middle">Send</span>
  </span>
</Button>
<Dialog
        open={sendDialog === "lg"}
        size={"lg"}
        handler={sendHandleOpen}
      >
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
        <DialogHeader className="justify-between"><div> <Typography variant="h5">Send</Typography> </div>
        <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={sendHandleOpen}
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
              </IconButton></DialogHeader>
        <DialogBody>
        <div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Recipient"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>}
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
        </DialogBody>
        <DialogFooter>
        <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={transfer}>
        Confirm Send
      </Button>
        </DialogFooter>
      </Dialog>

      </CardFooter>
    </Card>
                 </div>
              </>
            ) : (
              <> 
              <div style={isMobile? {marginLeft: "10px", marginTop: "40px"} : {float: "right", marginTop: "50px"}} className={isMobile? "overflow-scroll": undefined}>
              <Typography variant="h4">{metadata.name}</Typography>
 <Link to={`/Polkadot%20Asset%20Hub/marketplace/${collectionId}/${selectedCollectionName}`}>
 <Typography variant="h6" color="pink">{selectedCollectionName}</Typography>
 </Link>
          <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
            <br />
    <br />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{marginRight: "40px"}}>
      <Identicon
                           value={itemOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
                           <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6">Owned</Typography>
    <Typography >{itemOwner && itemOwner.length > 10 ? `${itemOwner.substring(0, 7)}...${itemOwner.slice(-7)}` : itemOwner}</Typography>
    </div>
                   </div>
                   <div>
                   <Identicon
                           value={collectionOwner}
                           size={40}
                           theme="polkadot" style={{float: "left"}} />
    <div style={{float: "right", marginLeft: "20px"}}>
    <Typography variant="h6" >Created</Typography>
    <Typography >{collectionOwner.length > 10 ? `${collectionOwner.substring(0, 7)}...${collectionOwner.slice(-7)}` : collectionOwner}</Typography>
    </div>
                   </div>
                   </div>
  </Typography>
  <br />
  {
                integerPrice? (

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
  <Card className="mt-6 w-50">
      <CardBody>
      <Typography variant="h5" color="blue-gray" style={{marginLeft: "20px"}}>
                   <br />
                   <IconButton variant="text" onClick={burn} style={{float: "right"}}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

                   </IconButton>
                   
    <Typography variant="h6" color="pink">  Not for sale</Typography>
  </Typography>
      </CardBody>
      <CardFooter className="pt-0">
      <Button fullWidth size="md" variant="filled" color="green" onClick={() => handleOpen("lg")}>List for sale</Button>
      <Dialog
        open={size === "lg"}
        size={"lg"}
        handler={handleOpen}
      >
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
        <DialogHeader className="justify-between"><div> <Typography variant="h5">List for sale</Typography> </div>
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
              </IconButton></DialogHeader>
        <DialogBody>
        <div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Price"
        icon={ <img src={dotWhiteLogo} alt=""/>}
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
                <div className="w-100">
                  <Input label="Whitelist Address" value={whiteListAddress}
        onChange={(e) => setWhiteListAddress(e.target.value)} />
                </div>
              </>
            ): (
                null
            )}
    </div>
        </DialogBody>
        <DialogFooter>
        <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={list}>
        Confirm List
      </Button>
        </DialogFooter>
      </Dialog>
      <Button fullWidth variant="filled" color="blue" style={{marginTop: "10px"}} onClick={() => sendHandleOpen("lg")} >
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 inline-block align-middle mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
    <span class="inline-block align-middle" >Send</span>
  </span>
</Button>
      </CardFooter>
    </Card>
                )}
    <Dialog
        open={sendDialog === "lg"}
        size={"lg"}
        handler={sendHandleOpen}
      >
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
        <DialogHeader className="justify-between"><div> <Typography variant="h5">Send</Typography> </div>
        <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={sendHandleOpen}
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
              </IconButton></DialogHeader>
        <DialogBody>
        <div className="w-98" style={{marginTop: "30px"}}>
<Input
        label="Recipient"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>}
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
        </DialogBody>
        <DialogFooter>
        <Button size="sm" variant="filled" color="green" style={{ float: "right", marginTop: "20px" }} onClick={transfer}>
        Confirm Send
      </Button>
        </DialogFooter>
      </Dialog>
                 </div>
              </>
            )}
            </>
          ) : (
            <>
{fetchLoading? (
  <div style={isMobile? {marginLeft: "10px", marginTop: "40px"}: { float: "right", marginTop: "50px" }} className={isMobile? "overflow-scroll": undefined}>
     <Typography variant="h4">{metadata.name}</Typography>
 <Link to={`/Polkadot%20Asset%20Hub/marketplace/${collectionId}/${selectedCollectionName}`}>
 <Typography variant="h6" color="pink">{selectedCollectionName}</Typography>
 </Link>
 <br />
    <Typography variant="h5" color="blue-gray" style={{ marginLeft: "20px" }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: "40px" }}>
          <Identicon value={itemOwner} size={40} theme="polkadot" style={{ float: "left" }} />
          <div style={{ float: "right", marginLeft: "20px" }}>
            <Typography variant="h6">Owned</Typography>
            <Typography>
              {itemOwner && itemOwner.length > 10 ? `${itemOwner.substring(0, 7)}...${itemOwner.slice(-7)}` : itemOwner}
            </Typography>
          </div>
        </div>
        <div>
          <Identicon value={collectionOwner} size={40} theme="polkadot" style={{ float: "left" }} />
          <div style={{ float: "right", marginLeft: "20px" }}>
            <Typography variant="h6">Created</Typography>
            <Typography>
              {collectionOwner.length > 10 ? `${collectionOwner.substring(0, 7)}...${collectionOwner.slice(-7)}` : collectionOwner}
            </Typography>
          </div>
        </div>
      </div>
    </Typography>
    <br />
    {
                price? (
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
        <Typography variant="h5" color="blue-gray" style={{ marginLeft: "20px" }}>
          <br />
          <Typography variant="h6" color="pink" style={{ display: 'flex', alignItems: 'center' }}>
            <span>{price}</span>
            <span><img src={dotWhiteLogo} style={{ width: "23px", marginLeft: "5px" }} alt="" /></span>
          </Typography>
        </Typography>
        <br />
      </CardBody>
      <CardFooter className="pt-0">
        <Button color="pink" onClick={() => {if(connectedAccount){buyOpenHandleOpen("xl")}else{        toast.info(`Connect your wallet`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })}}}>Buy now</Button>
        <Button color="pink" size="md" variant="outlined" style={{ marginTop: "20px", float: "right" }} onClick={() => { if(connectedAccount){ ownedNft(); swapHandleOpen("xl") } else{        toast.info(`Connect your wallet`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })}}}>Make Swap</Button>
      </CardFooter>
    </Card>
    </>
                )
              }
  </div>
) : (
  <div style={isMobile? {marginLeft: "10px", marginTop: "40px"} :{ float: "right", marginTop: "50px" }} className={isMobile? "overflow-scroll": undefined}>
     <Typography variant="h4">{metadata.name}</Typography>
 <Link to={`/Polkadot%20Asset%20Hub/marketplace/${collectionId}/${selectedCollectionName}`}>
 <Typography variant="h6" color="pink">{selectedCollectionName}</Typography>
 </Link>
 <br />
    <Typography variant="h5" color="blue-gray" style={{ marginLeft: "20px" }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: "40px" }}>
          <Identicon value={itemOwner} size={40} theme="polkadot" style={{ float: "left" }} />
          <div style={{ float: "right", marginLeft: "20px" }}>
            <Typography variant="h6">Owned</Typography>
            <Typography>
              {itemOwner && itemOwner.length > 10 ? `${itemOwner.substring(0, 7)}...${itemOwner.slice(-7)}` : itemOwner}
            </Typography>
          </div>
        </div>
        <div>
          <Identicon value={collectionOwner} size={40} theme="polkadot" style={{ float: "left" }} />
          <div style={{ float: "right", marginLeft: "20px" }}>
            <Typography variant="h6">Created</Typography>
            <Typography>
              {collectionOwner.length > 10 ? `${collectionOwner.substring(0, 7)}...${collectionOwner.slice(-7)}` : collectionOwner}
            </Typography>
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
                <>
                {
                  price? (
                    <>
                        <Card className="mt-6 w-50">
      <CardBody>
        <Typography variant="h5" color="blue-gray" style={{ marginLeft: "20px" }}>
          <br />
          <Typography variant="h6" color="pink" style={{ display: 'flex', alignItems: 'center' }}>
            <span>{price}</span>
            <span><img src={dotWhiteLogo} style={{ width: "23px", marginLeft: "5px" }} alt="" /></span>
          </Typography>
        </Typography>
        <br />
      </CardBody>
      <CardFooter className="pt-0">
        <Button color="pink" onClick={() => {if(connectedAccount){buyOpenHandleOpen("xl")}else{        toast.info(`Connect your wallet`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })}}}>Buy now</Button>
        <Button color="pink" size="md" variant="outlined" style={{ marginTop: "20px", float: "right" }} onClick={() => { if(connectedAccount){ ownedNft(); swapHandleOpen("xl")}else {        toast.info(`Connect your wallet`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })} }}>Make Swap</Button>
      </CardFooter>
    </Card>
                    </>
                  ) : (
                    <>
                    <Card className="mt-6 w-50">
      <CardBody>
        <Typography variant="h5" color="blue-gray" style={{ marginLeft: "20px" }}>
          <br />
          <Typography variant="h6" color="pink">Not listed</Typography>
        </Typography>
        <Button color="pink" size="md" variant="outlined" style={{ marginTop: "20px", float: "right" }} onClick={() => { ownedNft(); swapHandleOpen("xl") }}>Make Swap</Button>
      </CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
                    </>
                  )
                }
                </>)}
  </div>
)}

            </>
          )}
               </div>
               <br />
    <div style={{marginLeft: "40px", marginTop: "40px"}}>

    {
                isMobile? null : (
                  <>
                             {isLoading && !error && (
            <>
                                            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-8 w-8" color="pink" />
              </div>
            </>
           )
          }
        {error && (
null
        )}
                      <MediaRenderer src={ipfsUri}
      onClick={() => dataUrl(renderURL, JsonData)}
                                              style={{maxWidth:"500px", minWidth: "500px", maxHeight: "500px", minHeight: "500px", borderRadius: "10px"}}
                                        alt=""
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(true);
            setError(true);
          }} />
    <br />
                  </>
                )
               }
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
        <MediaRenderer src={`ipfs://${item?.image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "")}`}                 className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }} />
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
              {
                isMobile? (
                  <>
                                <IconButton {...getOwnedItemProps(ownedactive)} color="pink" variant="outlined">{ownedactive}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 1)} color="pink">{ownedactive + 1}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 2)} color="pink">{ownedactive + 2}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 3)} color="pink">{ownedactive + 3}</IconButton>
                  </>
                ) : (
                  <>
                                <IconButton {...getOwnedItemProps(ownedactive)} color="pink" variant="outlined">{ownedactive}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 1)} color="pink">{ownedactive + 1}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 2)} color="pink">{ownedactive + 2}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 3)} color="pink">{ownedactive + 3}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 4)} color="pink">{ownedactive + 4}</IconButton>
              <IconButton {...getOwnedItemProps(ownedactive + 5)} color="pink">{ownedactive + 5}</IconButton>
                  </>
                )
              }
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
              icon={<img src={dotLogo} />}
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
              icon={<img src={dotLogo} />}
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

    { isLoading? (
  null
    ) : (<> <div style={isMobile? undefined :{ marginLeft: "600px"}}>
      <Card>
        <CardHeader>

        </CardHeader>
    <Tabs id="custom-animation" value="html">
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
                            <CardBody>
                            </CardBody>
            {desc}
            {value === "Attributes" && (
              metadata && metadata.attributes ? (
                <div>
                  <div className="traits">
                    {metadata.attributes.map((attribute, index) => (
                      <div key={index} className="mobile-traits-item">
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
              ) : null
            )}
            {
              value === "Swaps" && (
                <div>
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
        <MediaRenderer src={`ipfs://${data.responseData.image.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "")}`}                 className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }}/>
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
                {itemOwner === polkadotAddress? (
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Button color="pink"  size="sm" className="rounded-full lowercase" onClick={() => {
                    claimSwap(data.swapDetails.offeredCollection, data.swapDetails.offeredItem, data.swapDetails.swapData.desiredCollection, data.swapDetails.swapData.desiredItem, data.swapDetails.swapData.price? data.swapDetails.swapData.price : null)
                  }}>Claim Swap</Button>
                </td>
                ) : (
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
                ) }
              </tr>
            );
          })) : null}
        </tbody>
      </table>
    </Card>) : null}
                </div>
              )
            }
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
        <CardFooter>
          
        </CardFooter>
      </Card>
    </div></>)}
                    </>
                ) : (
<div className="flex justify-center items-center h-screen">
      <Spinner className="h-8 w-8" color="pink" />
    </div>
                )
            }
        
        </>
    )
}