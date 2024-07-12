import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    CardHeader,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Chip,
    Switch,
    Tooltip,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Badge,
} from '@material-tailwind/react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress, web3EnablePromise } from '@polkadot/extension-dapp';
import { ToastContainer, toast } from 'react-toastify';
import { stringToHex } from '@polkadot/util';
import { CheckIcon } from "@heroicons/react/24/outline";
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import dotLogo from '/src/assets/statemint-native-dot.png';
import polkadotAssetHubLogo from '/src/assets/1688559044_assethub.svg';

export default function PAHTeleport() {
    const [chains, setChains] = useState([
        {
            name: "Polkadot",
            logo: dotLogo,
        },
        {
            name: "Polkadot Asset Hub",
            logo: polkadotAssetHubLogo,
        },
    ]);
    const [amount, setAmount] = useState("");
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

    const swapChains = () => {
        setChains([chains[1], chains[0]]);
    };

    const handleInput = (event) => {
        setAmount(event.target.value);
    };

    const connectedAccount = JSON.parse(localStorage.getItem('Account'));
    const address = connectedAccount? connectedAccount.address : null;
    const decodedAddress = address ? decodeAddress(address) : null;
    const polkadotAddress = decodedAddress? encodeAddress(decodedAddress, 0) : null;

    const teleport = async () => {
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
                            Fungible: (amount * 10000000000)
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
            toast.info(`Teleporting`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
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
            const send = await api.tx.xcmPallet.limitedTeleportAssets(dest, beneficiary, assets, fee_asset_item, weight_limit)
                .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
                    if (status.isInBlock) {
                        toast.success(`Completed at block hash #${status.asInBlock.toString()}`, {
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
                              render: 'successfully teleported',
                              type: 'success',
                              isLoading: false,
                              autoClose: 5000, // Close the toast after 5 seconds
                              closeOnClick: true,
                            });
                          }, 30000); // Example delay for the async action (e.g., 25 seconds)=
                    } else {
                        toast.info(`Current status: ${status.type}`, {
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
                    toast.error(`Transaction failed: ${error}`, {
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

        } catch (e) {
            api.disconnect();
            toast.error(`Error: ${e}`, {
                position: "top-right",
                autoClose: 25009,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.error("error", e);
        }
    }

   
    const teleportToAH = async () => {
        const args = {
            dest: {
                V3: {
                    parents: 1,
                    interior: "Here"
                }
            },
            beneficiary: {
                V3: {
                    parents: 0,
                    interior: {
                        X1: {
                            AccountId32: {
                                network: null,
                                id: decodeAddress(polkadotAddress)
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
                                parents: 1,
                                interior: "Here"
                            }
                        },
                        fun: {
                            Fungible: (amount * 10000000000)
                        }
                    }
                ]
            },
            feeAssetItem: 0,
            weightLimit: "Unlimited"
        };

        const endpoint = "wss://polkadot-asset-hub-rpc.polkadot.io";
        const wsProvider = new WsProvider(endpoint);
        const api = await ApiPromise.create({ provider: wsProvider });

        console.log('API initialized successfully');

        try {
            toast.info(`Teleporting`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
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

            const { dest, beneficiary, assets, feeAssetItem, weightLimit } = args;
            
            // Check if the xcmPallet module is available and use it
            if (api.tx.polkadotXcm) {
                const send = await api.tx.polkadotXcm.limitedTeleportAssets(dest, beneficiary, assets, feeAssetItem, weightLimit)
                    .signAndSend(connectedAccount.address, { signer: signer }, ({ status }) => {
                        if (status.isInBlock) {
                            toast.success(`Completed at block hash #${status.asInBlock.toString()}`, {
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
                                  render: 'successfully teleported',
                                  type: 'success',
                                  isLoading: false,
                                  autoClose: 5000, // Close the toast after 5 seconds
                                  closeOnClick: true,
                                });
                              }, 30000); // Example delay for the async action (e.g., 25 seconds)=
                        } else {
                            toast.info(`Current status: ${status.type}`, {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }
                    }).catch((error) => {
                        toast.error(`Transaction failed: ${error}`, {
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
            } else {
                toast.error("xcmPallet module not available", {
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
        } catch (e) {
            console.error("Error:", e);
            toast.error(`Error: ${e}`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            api.disconnect();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(connectedAccount) {
        if (chains[0].name === "Polkadot") {
            teleport();
        } else {
           if((chains[0].name === "Polkadot Asset Hub")){
            teleportToAH();
           } else {
            toast.error("Please swap the chains to teleport from Polkadot to Polkadot Asset Hub", {
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
        }
    }else{
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
    }
    };


    return (
        <>
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
            <Typography variant="h1" style={{ marginLeft: "20px", marginTop: "20px" }}>
                XCM Teleport
            </Typography>
            <Typography variant="h5" className="font-sans" style={{ marginLeft: "20px", marginTop: "30px" }}>
                Bridge DOT between Polkadot & Polkadot Asset Hub
            </Typography>
            <div style={{ marginTop: "100px" }}>
                {
                    isMobile? (
                        <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
  <Button color="pink" className={isMobile ? "rounded-full h-20 w-50" : "rounded-full h-50 w-100"} style={isMobile ? { marginRight: "20px" } : { padding: '10px 20px', marginLeft: "300px" }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="h-10 w-10 rounded-full object-cover object-center">
        <img
          src={chains[0].logo}
          alt={chains[0].name}
          style={{ height: '100%', width: '100%', borderRadius: '50%' }}
        />
      </div>
      <Typography variant="h5" style={{ marginLeft: '20px' }}>
        {chains[0].name}
      </Typography>
    </div>
  </Button>

  <IconButton variant="text" style={{ padding: '10px', margin: isMobile ? '10px 0' : '0 50px' }} onClick={swapChains}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ height: '24px', width: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  </IconButton>

  <Button color="black" className={isMobile ? "rounded-full h-20 w-50" : "rounded-full h-50 w-100"} style={isMobile ? { marginLeft: "20px" } : { padding: '10px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="h-10 w-10 rounded-full object-cover object-center">
        <img
          src={chains[1].logo}
          alt={chains[1].name}
          style={{ height: '100%', width: '100%', borderRadius: '50%' }}
        />
      </div>
      <Typography variant="h5" style={{ marginLeft: '20px' }}>
        {chains[1].name}
      </Typography>
    </div>
  </Button>
</div>

                        </>
                    )
                    : (
                        <>
                        
                <Button color="pink" className={isMobile? "rounded-full h-20 w-50" : "rounded-full h-50 w-100"} style={isMobile? {marginRight: "20px"} :{ padding: '10px 20px', marginLeft: "300px" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="h-10 w-10 rounded-full object-cover object-center">
                            <img
                                src={chains[0].logo}
                                alt={chains[0].name}
                                style={{ height: '100%', width: '100%', borderRadius: '50%' }}
                            />
                        </div>
                        <Typography variant="h5" style={{ marginLeft: '20px' }}>
                            {chains[0].name}
                        </Typography>
                    </div>
                </Button>

                <IconButton variant="text" style={isMobile?  { padding: '10px' } :{ padding: '10px', marginLeft: "100px" }} onClick={swapChains}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ height: '24px', width: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                </IconButton>

                <div style={{ float: "right", marginRight: "300px" }}>
                    <Button color="black" className="rounded-full h-50 w-100" style={isMobile? {marginLeft: "20px"} : { padding: '10px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="h-10 w-10 rounded-full object-cover object-center">
                                <img
                                    src={chains[1].logo}
                                    alt={chains[1].name}
                                    style={{ height: '100%', width: '100%', borderRadius: '50%' }}
                                />
                            </div>
                            <Typography variant="h5" style={{ marginLeft: '20px' }}>
                                {chains[1].name}
                            </Typography>
                        </div>
                    </Button>

                </div>
                </>
                    )
                }
                <form onSubmit={handleSubmit}>
                    <div className="w-[32rem]" style={isMobile? { marginLeft: "30px", marginTop: "50px", marginRight: "20px" } : { marginLeft: "300px", marginTop: "50px", marginRight: "300px" }}>
                    <Input 
    label="Send Amount" 
    onChange={handleInput} 
    type="number" 
/>
                    </div>

                    <Button className="w-[32rem]" style={isMobile? { marginLeft: "100px", marginTop: "50px", marginRight: "0px", marginBottom: "100px" }  : { marginLeft: "550px", marginTop: "50px", marginRight: "300px", marginBottom: "100px" }} color="pink" type="submit">Confirm Teleport</Button>
                </form>
            </div>
        </>
    );
}
