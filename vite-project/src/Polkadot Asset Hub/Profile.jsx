import React, { useEffect, useState } from "react";
import Identicon from '@polkadot/react-identicon';
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
  Spinner,


} from "@material-tailwind/react";
import Axios from 'axios';
import { Link } from "react-router-dom";
import { ArrowRightIcon, ArrowLeftIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress, web3EnablePromise } from '@polkadot/extension-dapp';
import { ToastContainer, toast } from 'react-toastify';
import { MediaRenderer } from "@thirdweb-dev/react";
import subscan from '/src/assets/subscan.png'
import {encodeAddress, decodeAddress} from '@polkadot/util-crypto'
import { Connection } from "../Connection";


export default function PAHProfile( ) {
    const Account = (JSON.parse(localStorage.getItem("Account")))
    const theme = JSON.parse(localStorage.getItem("theme"))
    const [activeTab, setActiveTab] = React.useState("Owned");
    const [owner, setOwner] = useState()
    const [price, setPrice] = useState()
    const [sendSize, setSendSize] = useState()
    const [createdCollection, setCreatedCollection] = useState()
    const [metadata, setItemMetadata] = useState()
    const [swap, setSwap] = useState()
    const [api, setApi] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isMobile, setIsMobile] = useState();
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = React.useState();
    const [recipient, setRecipient] = useState()
    const [calls, setCalls] = useState([]);
    const [collectionId, setCollectionId] = useState()
    const [itemId, setItemId] = useState()
    const [open, setOpen] = React.useState(false);
    const [openItemIndex, setOpenItemIndex] = useState(null); // State to track which item is open
    const [added, setAdded] = useState()

    // Function to handle clicking on an item
    const handleItemClick = (index) => {
      // Toggle the open state for the clicked item
      setOpenItemIndex(openItemIndex === index ? null : index);
    };

 
    const toggleOpen = () => setOpen((cur) => !cur);


    const setSelectedItem = (value) => setSelected(value);

    const sendHandleOpen = (value) => setSendSize(value);

    const walletConnected = () => {
      return JSON.parse(localStorage.getItem("walletConnected"))
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

    const owned = async() => {
        try {
          setLoading(true)
            const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}owned?address=${JSON.stringify(Account?.address)}&page=${active.toString()}`);
            setOwner(response.data.data.result); // Store the data directly as an array of objects
            setItemMetadata(response.data.data.metadata)
            setLoading(false)
            setPrice(response.data.data.result.price)
            setSwap(response.data.data.swap)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      }

      const created = async() => {
        try {
            const response = await Axios.get(`${import.meta.env.VITE_VPS_BACKEND_API}created?address=${JSON.stringify(Account?.address)}`);
            setCreatedCollection(response.data.data); // Store the data directly as an array of objects
            console.log("created", response.data.data)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      }

    useEffect(()=> {
        owned();
        created();
    }, [])

    console.log(owner)
    console.log(price)
    console.log("swap", swap)

    const jsonData = owner && JSON.parse(owner);
    const itemMetadata = (owner && jsonData.data);
    console.log("Item Metadata:", itemMetadata);
    const ProfileTabs = [
        {
          label: "Owned",
          value: "Owned",
        },
        {
          label: "Created",
          value: "Created",
        },
        {
          label: "Swaps",
          value: "Swaps",
        },
      ];

      const [active, setActive] = React.useState(1);
 
    const getItemProps = (index) =>
      ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => {setActive(index),  owned()},
      });
      
    const next = () => {
      setActive(active + 1);
      owned()
      setItemMetadata(null)
    };
   
    const prev = () => {
      setActive(active - 1);
      owned()
      setItemMetadata(null)
    };

    const TABLE_HEAD = ["Offered Item", "Desired Item", "Price Offered", "Price Desired", "Cancel Swap"];
    const connectedAccount = JSON.parse(localStorage.getItem('Account'));
    const cancelSwap = async(collectionId, itemId) => {
      const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
      try {
        toast.info(`Cancelling Swap` , {
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
  
        // Sign and send the transaction
        const send = await api.tx.nfts.cancelSwap(collectionId, itemId)
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
                    render: 'successfully cancelled',
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000, // Close the toast after 5 seconds
                    closeOnClick: true,
                  });
                }, 30000); // Example delay for the async action (e.g., 25 seconds)=
                owned()
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

    const callHandler = async() => {
      const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
      // Assuming you have 'api', 'collectionId', 'ItemId', and 'recipient' available in this context
      try {
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
      console.log("datatrnasfer", collectionId, itemId, recipient)

      setCalls(prevCalls => [
        ...prevCalls,
        api.tx.nfts.transfer(collectionId, itemId, recipient)
      ]);
    }catch(e) {
      console.log(e)
    }
    }

    const transfer = async () => {
      const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
      // Assuming you have 'api', 'collectionId', 'ItemId', and 'recipient' available in this context
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

        const batch = api.tx.utility.batchAll(calls);
    
        // await api.tx.nfts
        // .transfer(collectionId, collectionId, recipient)

        // Sign and send the transaction
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
    
    
      return (
          <>
                <Dialog open={sendSize === "xl"} size="xl" handler={sendHandleOpen}>
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
          Send Items
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
          </IconButton>
        </DialogHeader>
        <DialogBody className='h-[30rem] w-full overflow-scroll'>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <Card className="w-full">
              {metadata? metadata.map((item, index) => (
                <div key={index} style={{ marginRight: '10px' }} onClick={() => {
                  // handle item click
                }}>
                  <List>
                    <ListItem selected={selected} onClick={() => {
                      setSelectedItem();
                      toggleOpen();
                      console.log("itemIDs", item.collectionId, item.itemId, recipient)
                      setCollectionId(item.collectionId)
                      setItemId(item.itemId)
                      console.log("calls", calls)
                      handleItemClick(index)
                      setAdded(false)
                      // setOfferedItem(item.itemId);
                      // setOfferedCollection(item.collectionId);
                    }}>
                       {item && (
        <MediaRenderer src={`ipfs://${item?.image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "")}`}                 className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }} />
      )}
                      <Typography color="blue-gray" className="font-medium" style={{ marginLeft: "20px" }}>
                        {item && item.name}
                      </Typography>
                      <Chip variant="ghost" value={item.itemId}  style={{marginLeft: "200px"}}/>
                    </ListItem>
                  </List>
                  {openItemIndex === index && (
            <Collapse open={openItemIndex === index}>
              <Card className="my-4 mx-auto w-full">
                <CardBody>
                  <Input label="Recipient" onChange={(e) => setRecipient(e.target.value)} />
                  {
                    added? (
                      <>
                      <Typography style={{ float: "right", marginTop: "20px" }}>
                      Added Jay
                      </Typography>
                      </>
                    ) : (
                      <>
                      <Button onClick={() => { callHandler(), setAdded(true) }} color="green" size="md" style={{ float: "right", marginTop: "20px" }}> Add </Button>
                      </>
                    )
                  }
                </CardBody>
              </Card>
            </Collapse>
          )}
                </div>
              )) : (
                <>
                        <div className="flex justify-center items-start h-screen">
          <div className="flex justify-center items-center w-full mt-20">
          <Spinner className="h-8 w-8" color="pink" />
          </div>
        </div>
                </>
              )}
            </Card>
          </div>
          <br />
          <div className="flex items-center gap-4" style={{ marginTop: "50px" }}>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
        color="pink"
      >
        <ArrowLeftIcon  strokeWidth={2} className="h-4 w-4" color="pink"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        {
          isMobile? (
            <>
                    <IconButton {...getItemProps(active)} color="pink" variant="outlined" size="sm">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink" size="sm">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink" size="sm">{active + 2}</IconButton>
            </>
          ) : (
            <>
                    <IconButton {...getItemProps(active)} color="pink" variant="outlined">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink">{active + 2}</IconButton>
        <IconButton {...getItemProps(active + 3)} color="pink">{active + 3}</IconButton>
        <IconButton {...getItemProps(active + 4)} color="pink">{active + 4}</IconButton>
        <IconButton {...getItemProps(active + 5)} color="pink">{active + 5}</IconButton>
            </>
          )
        }
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
        </DialogBody>
        <DialogFooter>
          <Button color="pink" onClick={() => {transfer()}}>Confirm Send</Button>
        </DialogFooter>
</Dialog>
          { walletConnected() && Account? (
            <>
          <br />
          <br />
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <Identicon
          value={encodeAddress(Account?.address, 0)}
          size={isMobile? 70 : 100}
          theme="polkadot"
          className='icon-float-center'
      />
      </div>
      <br />
      <div style={isMobile? { display: 'flex', alignItems: 'center', justifyContent: 'center',  fontSize: '20px'} : { display: 'flex', alignItems: 'center', justifyContent: 'center',  fontSize: '25px'}}>
      <span style={{ marginLeft: '8px', textAlign: 'center' }} className={``}>
        {
          isMobile? (
            <>
                  {    Account && encodeAddress(Account?.address, 0) &&     Account && encodeAddress(Account?.address, 0).length > 10 ? `${    Account && encodeAddress(Account?.address, 0).substring(0, 11)}...${    Account && encodeAddress(Account?.address, 0).slice(-11)}` :     Account && encodeAddress(Account?.address, 0)}
            </>
          ) : (
            <>
            {encodeAddress(Account?.address, 0)}
            </>
          )
        }
      </span>
      {
        isMobile? (
          <>
                              <IconButton variant="text" onClick={() => {navigator.clipboard.writeText(encodeAddress(Account?.address, 0)), toast.info(`Address copied` , {
                position: "top-right",
                autoClose: 25009,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
</svg>

          </IconButton>
          </>
        ) : (
          <>
                    <IconButton variant="text" onClick={() => {navigator.clipboard.writeText(encodeAddress(Account?.address, 0)), toast.info(`Address copied` , {
                position: "top-right",
                autoClose: 25009,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
</svg>

          </IconButton>
          </>
        )
      }
  </div>
  {
    isMobile? (
      <>
            <div style={{display: "flex", alignItems: "center"}}>
        <a href={`https://assethub-polkadot.subscan.io/account/${encodeAddress(Account?.address, 0)}`}>
      <Button variant="filled" color="white" className="rounded-full" style={{marginLeft: "70px"}}><img src={subscan} style={{width: "50px"}}/></Button>
      </a>
      <a href={`https://statemint.statescan.io/#/accounts/${encodeAddress(Account?.address, 0)}`}>
      <Button variant="filled" color="white" className="rounded-full lowercase" style={{marginLeft: "10px", width: "110px"}}> Statescan</Button>
      </a>
      </div>
      </>
    ) : (
      <>
      <div style={{display: "flex", alignItems: "center"}}>
        <a href={`https://assethub-polkadot.subscan.io/account/${encodeAddress(Account?.address, 0)}`}>
      <Button variant="filled" color="white" className="rounded-full" style={{marginLeft: "600px"}}><img src={subscan} style={{width: "50px"}}/></Button>
      </a>
      <a href={`https://statemint.statescan.io/#/accounts/${encodeAddress(Account?.address, 0)}`}>
      <Button variant="filled" color="white" className="rounded-full lowercase" style={{marginLeft: "10px", width: "110px"}}> Statescan</Button>
      </a>
      </div>
      </>
    )
  }
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginRight: "20px" }}>
  {/* Activity and Analitics ICON Button */}
            {/* <IconButton color="pink" >
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

<Tabs value={activeTab} style={{width: "300px"}} >
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-pink-500 shadow-none rounded-none",
        }}
      >
        {ProfileTabs.map(({ label, value }) => (
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
    {activeTab === "Owned" && (
      <>
      {
        connectedAccount.address === "5G1JYfaUF9s8TmTsnsFPfLejsdv9EdqZMZgcmZbMCqMUEsmc" ? (
          <>
          {
        isMobile? (
          <>
                <Button
  color="blue"
  style={{ marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}
  size="sm"
  variant="gradient"
  onClick={() => sendHandleOpen("xl")}
>
  <div style={{ display: "flex", alignItems: "center"}}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20} style={{marginRight: "10px"}}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
  Send
  </div>
</Button>
<Button
  color="red"
  style={{ marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}
  size="sm"
  variant="gradient"
  disabled
>
  <div style={{ display: "flex", alignItems: "center"}}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20} style={{marginRight: "10px"}} >
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

Burn
  </div>
</Button>
          </>
        ) : (
          <>
                <Button
  color="blue"
  style={{ marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}
  size="sm"
  variant="gradient"
  onClick={() => sendHandleOpen("xl")}
>
  <div style={{ display: "flex", alignItems: "center"}}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20} style={{marginRight: "10px"}}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
  Send
  </div>
</Button>
<Button
  color="red"
  style={{ marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}
  size="sm"
  variant="gradient"
  disabled
>
  <div style={{ display: "flex", alignItems: "center"}}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width={20} style={{marginRight: "10px"}} >
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>

Burn
  </div>
</Button>
          </>
        )
      }
                </>
        ) : null
      }
{metadata? (  <>
    <div >
      {metadata && metadata.map((item, index) => {
const ipfsHash = item.image ? item.image.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") : "";
const ipfsUri = ipfsHash ? `ipfs://${ipfsHash}` : "";
const handleReload = () => {
  setIsLoading(true);
  setError(false);
};
      return (
        <div key={index} style={{ marginRight: '10px' }} onClick={() => {
          localStorage.setItem('selectedCollectionName', JSON.stringify(item.collectionName));
            localStorage.setItem('selectedCollectionId', JSON.stringify(item.collectionId));
            localStorage.setItem('selectedCollectionItems', JSON.stringify(item.itemId));
            }} className={isMobile? "Profile-Item-card" : "Item-card"}>
                            <Link to={`/Polkadot%20Asset%20Hub/Details/${item.collectionId}/${item.itemId}`}>
          <Card      key={index}>
            <CardHeader shadow={false} floated={false} className={isMobile?  "h-50" : "h-100"}>
        {isLoading && !error && <Spinner color="pink" />}
        {error && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" onClick={handleReload}>
  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
</svg>

          </>
        )}
            <MediaRenderer src={ipfsUri}
                className="h-full w-full object-cover" style={isMobile? {maxWidth: "130px", maxHeight: "130px" ,borderRadius: "10px",  display: isLoading || error ? 'none' : 'block' } : {borderRadius: "10px",  display: isLoading || error ? 'none' : 'block' }}
                          alt=""
                          onLoad={() => setIsLoading(false)}
                          onError={() => {
                            setIsLoading(false);
                            setError(true);
                          }}/>
            </CardHeader>
            <CardBody>
              <div className="mb-2 flex items-center justify-between">
                <Typography color="black" className="font-medium truncate text-nowrap">
                  {item && item.name}
                </Typography>
              </div>
            </CardBody>
            <br />
            <CardFooter className="pt-0">
            {item &&item.price? (
              <>
              <Typography variant="h6" color="pink">{`${item && item.price} DOT`}</Typography>
              </>
            ) : (
               <>
               Not Listed
               </>
            )}
              {/* Optional Footer Content */}
            </CardFooter>
          </Card>
          </Link>
        </div>
      )})}
    </div>
    <br />
    <div className="flex items-center gap-4" style={isMobile? { marginTop: "50px"} : {marginLeft: "100px", marginTop: "50px"}}>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        size={isMobile? "sm" : undefined}
        disabled={active === 1}
        color="pink"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="pink"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        {
          isMobile? (
            <>
                    <IconButton {...getItemProps(active)} color="pink" variant="outlined" size="sm">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink" size="sm">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink" size="sm">{active + 2}</IconButton>
            </>
          ) : (
            <>
                    <IconButton {...getItemProps(active)} color="pink" variant="outlined">{active}</IconButton>
        <IconButton {...getItemProps(active + 1 )} color="pink">{active + 1}</IconButton>
        <IconButton {...getItemProps(active + 2)} color="pink">{active + 2}</IconButton>
        <IconButton {...getItemProps(active + 3)} color="pink">{active + 3}</IconButton>
        <IconButton {...getItemProps(active + 4)} color="pink">{active + 4}</IconButton>
        <IconButton {...getItemProps(active + 5)} color="pink">{active + 5}</IconButton>
            </>
          )
        }
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        size={isMobile? "sm" : undefined}
        color="pink"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="pink"/>
      </Button>
    </div>
  </>) : (
    <>
    {
      loading? (
        <> 
        <div className="flex justify-center items-start h-screen">
          <div className="flex justify-center items-center w-full mt-20">
          <Spinner className="h-8 w-8" color="pink" />
          </div>
        </div>
        </>
      ) : (
        <>
        {
          metadata? (
            <>
        <div className="flex justify-center items-start h-screen">
          <div className="flex justify-center items-center w-full mt-20">
          <Spinner className="h-8 w-8" color="pink" />
          </div>
        </div>
            </>
          ) : (
            <>
            <div className="flex justify-center items-start h-screen">
  <div className="flex justify-center items-center w-full mt-20"> {/* Adjust mt-20 to your desired margin */}
    <Typography variant="h5">
      Nothing to see here ?
    </Typography>
  </div>
</div>
            </>
          )
        }
        </>
      )
    }

    </>
  )}
  </>
)}
{activeTab === "Created" && createdCollection && (
  <>
{createdCollection.length > 0? (  <div>
    {createdCollection.map((item, index) => {
const ipfsHash = item.itemData?.image?.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") ?? "";
const ipfsUri = `ipfs://${ipfsHash}`;

      return (
      <Link to={`/Polkadot%20Asset%20Hub/marketplace/${item.Id}/${item.itemData.name}`} key={index}>
        <Card onClick={() => {
          localStorage.setItem('selectedCollectionId', JSON.stringify(item.Id));
          localStorage.setItem('selectedCollectionName', JSON.stringify(item.itemData.name));
          localStorage.setItem('selectedCollectionImage', JSON.stringify(item.itemData.image));
          localStorage.setItem('selectedCollectionDescription', JSON.stringify(item.itemData.description));
        }} className={isMobile? "Profile-Item-card": "Item-card"}>
          <CardHeader shadow={false} floated={false} className={isMobile?  "h-50" : "h-100"}>
          {isLoading && !error && <Spinner color="pink" />}
        {error && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" onClick={handleReload}>
  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
</svg>

          </>
        )}
          <MediaRenderer src={ipfsUri}
                className="h-full w-full object-cover" style={isMobile? {maxWidth: "130px", maxHeight: "130px" ,borderRadius: "10px",  display: isLoading || error ? 'none' : 'block' } : {borderRadius: "10px",  display: isLoading || error ? 'none' : 'block' }}
                alt=""
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError(true);
                }}/>
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-medium truncate text-nowrap">
                {item.itemData.name}
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {/* Optional Footer Content */}
          </CardFooter>
        </Card>
      </Link>
    )})}
  </div>): (
    <>
    {
      createdCollection.length === 0 ? (
        <>
                            <div className="flex justify-center items-start h-screen">
  <div className="flex justify-center items-center w-full mt-20"> {/* Adjust mt-20 to your desired margin */}
    <Typography variant="h5">
      Nothing to see here ?
    </Typography>
  </div>
</div>
        </>
      ) : (
        <>
                    <div className="flex justify-center items-start h-screen">
  <div className="flex justify-center items-center w-full mt-20"> {/* Adjust mt-20 to your desired margin */}
    <Spinner className="h-8 w-8" color="pink" />
  </div>
</div>
        </>
      )
    }

    </>
  )}
  </>
)}

{
    activeTab === "Swaps" && (
      <>
     {swap? ( <div>
        {/* Customize the rendering as per your requirements */}
        <br />
        <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
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
        {swap && swap
    .filter(item => item !== null)
    .map((item, index) => {
      const offeredItemImage = (item?.offeredItemImage ?? "").replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "");
      const offeredItemImageIpfsUri = `ipfs://${offeredItemImage}`;
      const ipfsHash = item && item.desiredItemImage ? item.desiredItemImage.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, "") : "";
      const ipfsUri = `ipfs://${ipfsHash}`;
      return (
              <tr key={index}>
                <td className="p-4 border-b border-blue-gray-50">
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => {
          localStorage.setItem('selectedCollectionName', JSON.stringify(item.offeredCollectionName));
            localStorage.setItem('selectedCollectionId', JSON.stringify(item.offeredCollection));
            localStorage.setItem('selectedCollectionItems', JSON.stringify(item.offeredItem));
            }} >
                             <MediaRenderer src={offeredItemImageIpfsUri}
                                className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }}
                                alt=""
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                  setIsLoading(false);
                                  setError(true);
                                }}/>
                                                                      <Link to={`/Polkadot%20Asset%20Hub/Details/${item.offeredCollection}/${item.offeredItem}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    style={{marginLeft: "20px"}}
                  >
                    {item.offeredItemnName}
                  </Typography>
                  </Link>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50 bg-blue-gray-50/50">
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => {
          localStorage.setItem('selectedCollectionName', JSON.stringify(item.desiredCollectionName));
            localStorage.setItem('selectedCollectionId', JSON.stringify(item.desiredCollection));
            localStorage.setItem('selectedCollectionItems', JSON.stringify(item.desiredItem));
            }}>
               <MediaRenderer src={ipfsUri}
                className="h-10 w-10 rounded-lg object-cover object-center" style={{borderRadius: "10px",  display: isLoading || error ? 'none' : 'block', width: "50px", height: "50px" }}
                alt=""
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError(true);
                }}/>
                <Link to={`/Polkadot%20Asset%20Hub/Details/${item.desiredCollection}/${item.desiredItem}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    style={{marginLeft: "20px"}}
                  >
                    {item.desiredItemName}
                  </Typography>
                  </Link>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item.send === null? 0 : `${item.send} DOT`}
                  </Typography>
                </td>
                <td className="p-4 border-b border-blue-gray-50 bg-blue-gray-50/50">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {item.receive === null? 0 : `${item.receive} DOT`}
                  </Typography>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                <Button size="sm" className="rounded-full lowercase" color="red"  onClick={() => cancelSwap(item.offeredCollection, item.offeredItem)}>Cancel Swap</Button>
                </td>
              </tr>
    )})}
        </tbody>
      </table>
    </Card>
      </div>): (
        <>
            <div className="flex justify-center items-start h-screen">
  <div className="flex justify-center items-center w-full mt-20"> {/* Adjust mt-20 to your desired margin */}
    <Spinner className="h-8 w-8" color="pink" />
  </div>
</div>

        </>
      )}
      </>
    )
}
</>
          ) : (
            <>
            <div className="flex items-center justify-center mt-40 ">
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
              <Typography variant="h3" color="gray" className="mb-40">
                Connect wallet
              </Typography>
            </div>
            {/* <div className="flex items-center justify-center mt-10 mb-40 " onClick={() => {walletConnected(),
                toast.info(`Connect your wallet`, {
                  position: "top-right",
                  autoClose: 2500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
              }}>
              <Connection/>
            </div> */}
            </>
          )
}
          </>
      )
}
