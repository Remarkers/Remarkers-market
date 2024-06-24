import React, { useState, useEffect } from 'react'
import { web3Accounts, web3AccountsSubscribe, web3FromAddress, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { WsProvider, ApiPromise } from '@polkadot/api';
import Identicon from '@polkadot/react-identicon';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  MenuHandler,
  MenuList,
  Chip,
  Select,
  Option,
} from "@material-tailwind/react";
import {decodeAddress} from  '@polkadot/util-crypto';
import { stringToHex, u8aToHex } from "@polkadot/util";
import { ToastContainer, toast } from 'react-toastify';
import subwalletImg from '/src/assets/download.jpeg';
import talismanLogo from '/src/assets/download (1).jpeg';
import polkadotjsLogo from '/src/assets/download.png';
import novaWalletLogo from '/src/assets/Nova.png';

  export function Connections() {
const [open, setOpen] = React.useState(false);
         
          const handleOpen = () => setOpen((cur) => !cur);
        
          const [currentPage, setCurrentPage] = useState(1);
        
          const nextPage = () => {
            setCurrentPage(currentPage + 1);
          };
        
          const prevPage = () => {
            setCurrentPage(currentPage - 1);
          };
          const selectedAddress = async(account) => {
              localStorage.setItem("Account", JSON.stringify(account));
          }
        
            const NAME = 'Remarker';
            const [api, setApi] = useState();
            const [accounts, setAccount] = useState()
            const [selectedAccount, setselectedAccounts] = useState(JSON.parse(localStorage.getItem("Account")))
console.log(JSON.parse(localStorage.getItem("Account")))
            const [isMobile, setIsMobile] = useState(false);
            localStorage.setItem("api", JSON.stringify(api))

            const network = JSON.parse(localStorage.getItem("Network"))
    
    const providers =
    network === "Polkadot"
      ? {
          Polkadot: "wss://rpc.polkadot.io",
          OnFinality: "wss://polkadot.api.onfinality.io/ws?apikey=023fc078-a5b7-4a72-81c4-40e118b6097b",
          Dwellir: "wss://polkadot-rpc.dwellir.com",
          Pinknode: "wss://public-rpc.pinknode.io/polkadot",
          RadiumBlock: "wss://polkadot.public.curie.radiumblock.co/ws",
          OneRPC: "wss://1rpc.io/dot",
          LuckyFriday: "wss://rpc-polkadot.luckyfriday.io",
          GeoDNS1: "wss://rpc.ibp.network/polkadot",
          GeoDNS2: "wss://rpc.dotters.network/polkadot",
          stakewood: "dot-rpc.stakeworld.io"
        }
      : network === "Polkadot Asset Hub"
      ? {
          PolkadotAssetHub: "wss://polkadot-asset-hub-rpc.polkadot.io"
        }
      :
      network === "Kusama" ? {
        Kusama: "wss://kusama-rpc.polkadot.io"
      }: network === "Kusama Asset Hub" ? {
        KusamaAssetHub: "wss://kusama-asset-hub-rpc.polkadot.ioo"
      } : {}

      ;
    const [endpoint, setEndPoint] = useState(network === "Polkadot"
    ? providers.Polkadot
    : network === "Polkadot Asset Hub"
    ? providers.PolkadotAssetHub
    : network === "Kusama"
    ? providers.Kusama
    : network === "Kusama Asset Hub" ?
    providers.KusamaAssetHub
    : ""  )
            const selectProvider = async(endpoint) => {
              setEndPoint(endpoint)
            }
            useEffect(() => {
              localStorage.setItem("endpoint", endpoint);
            }, [ endpoint]);
            
            console.log(endpoint)
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
          
            const setup = async() => {
              //This wsProvider is for Polkadot based Create dapp for kusama change stateCreate to statemine only
              const wsProvider = new WsProvider(endpoint);
              const api = await ApiPromise.create({ provider: wsProvider})
              setApi(api);
            }
            //connect function
            const SubWallet = async () => {
              const SubWalletExtension = window.injectedWeb3 && window.injectedWeb3['subwallet-js'];
              console.log(SubWalletExtension);
            
              try {
                const extension = await SubWalletExtension.enable();
                const getAccounts = await extension.accounts.get();
            
                if (getAccounts && getAccounts.length > 0) {
                  setAccount(getAccounts)
                  console.log(accounts)
                  nextPage()
                } else {
                  console.error('No accounts found.');
                }
              } catch (error) {
                console.error('Error:', error);
              }
            };
            
            const Talisman = async() => {
              const TalismanWalletExtension = window.injectedWeb3['talisman']
              try {
                const extension = await TalismanWalletExtension.enable();
                const getAccounts = await extension.accounts.get();
            
                if (getAccounts && getAccounts.length > 0) {
                  setAccount(getAccounts)
                  console.log(accounts)
                  nextPage()
                } else {
                  console.error('No accounts found.');
                }
              } catch (error) {
                console.error('Error:', error);
              }
        
            }
            const PolkadotJs = async() => {
              const PolkadotjsWalletExtension = window.injectedWeb3['polkadot-js']
              try {
                const extension = await PolkadotjsWalletExtension.enable();
                const getAccounts = await extension.accounts.get();
            
                if (getAccounts && getAccounts.length > 0) {
                  setAccount(getAccounts)
                  console.log(accounts)
                  nextPage()
                } else {
                  console.error('No accounts found.');
                }
              } catch (error) {
                console.error('Error:', error);
              }
              }
        
              const Novawallet = async () => {
                const Novawallet = await web3Enable('remarker');
                console.log(Novawallet);
              
                try {
                  const getAccounts = await web3Accounts();
              
                  if (getAccounts && getAccounts.length > 0) {
                    setAccount(getAccounts)
                    console.log(accounts)
                    nextPage()
                  } else {
                    console.error('No accounts found.');
                  }
                } catch (error) {
                  console.error('Error:', error);
                }
              };

              const selectAccount = async (selectedAccount) => {
                setselectedAccounts(selectedAccount)
                  localStorage.setItem("walletConnected", JSON.stringify(true));
                
                // Do something with the selected account
              }
              const Disconnect = async() => {
                  localStorage.setItem("walletConnected", JSON.stringify(false));
                handleOpen()
                prevPage()
              }
  
    return { 
      selectedAddress,
      handleOpen,
      selectedAccount,
      isMobile,
      selectProvider,
      endpoint,
      open,
      currentPage,
      SubWallet,
      Talisman,
      PolkadotJs,
      Novawallet,
      prevPage,
      Disconnect,
      accounts, selectAccount, providers }
    }

           export const Create = async() => {
            const account = (JSON.parse(localStorage.getItem("Account")))
              //This wsProvider is for Polkadot based Create dapp for kusama change stateCreate to statemine only
              const endpoint =  localStorage.getItem("endpoint")
              const wsProvider = new WsProvider(endpoint);
              const api = await ApiPromise.create({ provider: wsProvider})
            const publicKey = decodeAddress(account?.address);
            const hexPublicKey = u8aToHex(publicKey);
            console.log(hexPublicKey)
              const allInjected = await web3Enable('my cool dapp');
              // returns an array of { address, meta: { name, source } }
          // meta.source contains the name of the extension that provides this account
          const allAccounts = await web3Accounts();
          
          // finds an injector for an address
          const SENDER = account && account?.address;
          const injector = await web3FromAddress(SENDER);
          
          // the address we use to use for signing, as injected
            const dest = {
              V3 : {
                parents : 0,
                interior : {
                  X1 : {
                   parachain : 1000
                  }
                }
              }
            }
          
            const beneficiary = {
              V3: {
                parents: 0,
                interior: {
                  X1: {
                    AccountId32: {
                      network: null,
                      id :  hexPublicKey ,
                      
                    }
                  }
                }
              }
            }
            const assets = {
              V3: [
                {
                  id: {
                    Concrete: {
                      parents: 0,
                      interior: "Here"
                    }
                  },
                  fun: {
                    //Token amount dot or ksm
                    Fungible : 100500000000
                  }
                }
              ]
            }
            const feeAssetItem = 0;
            const weightLimit = "Unlimited";
          
          api.tx.utility.batchAll([ await api.tx.xcmPallet.limitedTeleportAssets(dest, beneficiary, assets, feeAssetItem, weightLimit)]).signAndSend(SENDER, { signer: injector.signer }, async ({ status }) => {
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
            }

    export function Connection() {
      const {
        selectedAddress,
        handleOpen,
        selectedAccount,
        isMobile,
        open,
        currentPage,
        SubWallet,
        Talisman,
        PolkadotJs,
        Novawallet,
        prevPage,
        Disconnect,
        accounts,
        selectAccount,
      } = Connections();
      const walletConnected = JSON.parse(localStorage.getItem("walletConnected"))
      const theme = JSON.parse(localStorage.getItem("theme"))
      return (
        <>
         {walletConnected ? (
        <Button variant="text" style={{ display: 'flex', alignItems: 'center' }} onClick={handleOpen} ><Identicon
          value={selectedAccount?.address}
          size={32}
          theme="polkadot" className='icon-float-left' /><span style={{ marginLeft: '8px' }} className={theme}>{selectedAccount?.name}</span></Button>
          ) : (
          <><Button onClick={handleOpen} color='pink' variant='md' style={{ display: 'flex', alignItems: 'center' }}>Connect</Button>
                </>
      
          )}
    
       <Dialog size="lg" open={open} handler={handleOpen} className={theme}>
            <DialogHeader className="justify-between">
              <div>
                <Typography variant="h5" className={theme}>
                  Connect a Wallet
                </Typography>
              </div>
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
            <DialogBody className="h-96 overflow-scroll">
              {
                currentPage === 1 && (
                  <><div className="mb-6">
                    <ul className="mt-3  -ml-2 flex flex-col gap-1">
                      <MenuItem className="mb-4 flex items-center justify-center gap-3 !py-4 shadow-md" onClick={SubWallet}>
                        <img
                          src={subwalletImg}
                          alt="Subwallet"
                          className="h-12 w-12" />
                        <Typography
                          className={`uppercase ${theme}`}
                          color="blue-gray"
                          variant="h6"
                        >
                          SubWallet
                        </Typography>
                      </MenuItem>
                      <MenuItem className="mb-1 flex items-center justify-center gap-3 !py-4 shadow-md" onClick={Talisman}>
                        <img
                          src={talismanLogo}
                          alt="Talisman"
                          className="h-12 w-12 rounded-md" />
                        <Typography
                          className={`uppercase ${theme}`}
                          color="blue-gray"
                          variant="h6"
                        >
                          Talisman wallet
                        </Typography>
                      </MenuItem>
                    </ul>
                  </div><div>
                      <ul className="mt-4 -ml-2.5 flex flex-col gap-1">
                        <MenuItem className="mb-4 flex items-center justify-center gap-3 !py-4 shadow-md" onClick={PolkadotJs}>
                          <img
                            src={polkadotjsLogo}
                            alt="Polkadot"
                            className="h-12 w-12 rounded-md border border-blue-gray-50" />
                          <Typography
                            className={`uppercase ${theme}`}
                            color="blue-gray"
                            variant="h6"
                          >
                            Polkadot-js
                          </Typography>
                        </MenuItem>
                        {isMobile && (
                        <MenuItem className="mb-4 flex items-center justify-center gap-3 !py-4 shadow-md" onClick={Novawallet}>
                        <img
                          src={novaWalletLogo}
                          alt="Nova"
                          className="h-12 w-12" />
                        <Typography
                          className={`uppercase ${theme}`}
                          color="blue-gray"
                          variant="h6"
                        >
                          Nova wallet
                        </Typography>
                      </MenuItem>
                        )}
                      </ul>
                    </div>
                    </>
                )
              }
              {
                currentPage === 2 && (
                  <>
                  <Button onClick={prevPage} variant='text' color='pink'  size={isMobile ? 'sm' : undefined}> &#x2190; Back to wallet selection</Button>
                  <Button onClick={Disconnect} color='pink' variant='md' style={{ display: 'flex', alignItems: 'center', float: 'right' }} size={isMobile ? 'sm' : undefined}>Disconnect</Button>
    
                  { accounts.map((account) => (
        <>
        <div key={account.address}>
          <MenuItem className={`mb-4 flex items-center justify-center gap-3 !py-4 shadow-md ${isMobile? 'max-w-full overflow-hidden': undefined}`} onClick={() => {selectAccount(account), selectedAddress(account)}}>
          <Identicon
          value={account?.address}
          size={isMobile? 32: 20}
          theme="polkadot" className='icon' />
            <div className={isMobile? `flex flex-col overflow-hidden max-w-full` : undefined}>
                        <Typography
                          className={`uppercase ${theme} ${isMobile? 'truncate' :undefined}`}
                          color="blue-gray"
                          variant="h6"
                          key={account.name}
                        >
                          {account.name}
                          <Typography
                        className={`lowercase text-nowrap uppercase ${isMobile? 'text-nowrap truncate' : undefined} ${theme}`}
                        color="blue-gray"
                        variant="h12"
                        key={account.address}
                        >
                          {account.address}
                        </Typography>
                        </Typography>
                        </div>
                      </MenuItem>
          </div>
          </>
      ))
    }
                  </>
                )
              }
            </DialogBody>
            <DialogFooter className="justify-between gap-2">
              <Typography variant="small" color="gray" className={`font-normal ${theme}`}>
                New to Polkador wallets?
              </Typography>
              <Button variant="outlined" size="sm" >
                <a href="https://polkadot.network/ecosystem/wallets/" className={theme}>Learn More</a>
              </Button>
            </DialogFooter>
          </Dialog>
      </>
      )
      }
      
      export function Endpoints() {
        const {
          isMobile,
          selectProvider,
          endpoint,
          providers
        } = Connections();
        const walletConnected = JSON.parse(localStorage.getItem("walletConnected"));
        const theme = JSON.parse(localStorage.getItem("theme"))
        const endpointOptions = Object.entries(providers).map(([key, value]) => (
          isMobile? (
            <Option key={key} onClick={() => selectProvider(value)}>
            Hosted by {key}
          </Option>
          ) : (
            <MenuItem key={key} onClick={() => selectProvider(value)}>
              Hosted by {key}
            </MenuItem>
          )
        ));
        return (
          <>
            {/* {
              isMobile? 
              (
                <div className="w-72">
            <Select label="Endpoints" className={theme}>
              {endpointOptions}
            </Select>
          </div>
              )
              : <Menu>
              <MenuHandler>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${theme}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
              </MenuHandler>
              <MenuList className={theme}>
                {endpointOptions}
              </MenuList>
            </Menu>
            }


{walletConnected ? (
      // Wallet is connected
      <Chip
        variant="ghost"
        className={theme}
        size="lg"
        value={` ${Object.keys(providers).find(key => providers[key] === endpoint)}`}
        icon={
          <span className="mx-auto mt-1.5 block h-3 w-3 rounded-full bg-pink-200 content-['']" />
        }
      />
    ) : (
      // Wallet is not connected
      <Chip
        variant="ghost"
        className={theme}
        size="sm"
        value="Offline"
        icon={
          <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />
        }
      />
    )} */}
            
        </>
        )
        }
        
 