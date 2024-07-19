import React, { useState } from 'react'
import './App.css'
import { web3Accounts, web3FromAddress, web3Enable } from '@polkadot/extension-dapp';
import { stringToHex, u8aToHex } from "@polkadot/util";
import { WsProvider, ApiPromise } from '@polkadot/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {decodeAddress} from  '@polkadot/util-crypto';
import logo from './assets/logo-black.png'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Typography,
  Spinner,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  typography
} from "@material-tailwind/react";
import { Create } from './Connection';

//collection id
// const u32 = "7";

// //witnessdata of the Create
// const witnessData = {
//   ownedItem: 0,
//   CreatePrice: 10
// };


// //Firebase fetch api get item id
// //adding firebase api link into response

// ///nft metadata upload nft metadata json file to ipfs copy link like this///
// //input json metadata ipfs link here
// const cloudflare_url = "ipfs://bafybeicf7md3hsba3m2thhhnrfyct4dyu36bysw7ol7lw5agopf5vbxeqe/";
// const json = ".json";
// const metadata = cloudflare_url + u33 + json;
// const Bytes = stringToHex(metadata);




 
// //main app
function Createfunc() {
//   const [size, setSize] = React.useState(null);
 
//   const handleOpen = (value) => setSize(value);
//   const [selectedImageUrl, setSelectedImageUrl] = useState(null);
//   const [selectedJsondata, setJsondata] = useState(null);
//   const theme = JSON.parse(localStorage.getItem("theme"))

//   const data = ((renderURL, JsonData) => {
//     setSelectedImageUrl(renderURL);
//     setJsondata(JsonData)
//     handleOpen("xl");
//     console.log(renderURL, JsonData.name, JsonData.description, JsonData.attributes)
//     return (
//       <>
//       <img src={renderURL} alt="" />
//       {JsonData.name}
//       </>
// //     )
// //   }
//   )
//   const DisplayData = JsonData.map(
//     (JsonData)=>{
//       const [isLoading, setIsLoading] = useState(true);
//       const [error, setError] = useState(false);

//       let imgUrl = JsonData.image?.slice(JsonData.image.indexOf(":"),JsonData.image?.lastIndexOf("/"));
// let slice = JsonData.image?.slice(JsonData.image.lastIndexOf("/"),JsonData.image?.length)
// let renderURL = `https${imgUrl}.ipfs.dweb.link${slice}`;
// const handleReload = () => {
//   setIsLoading(true);
//   setError(false);
// };
//         return(
//           <>
//         {isLoading && !error && <Spinner color="pink" />}
//         {error && (
//           <>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" onClick={handleReload}>
//   <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
// </svg>

//           </>
//         )}
//         <img
//           src={renderURL}
//           alt=""
//           onClick={() => data(renderURL, JsonData)}
//           style={{ display: isLoading || error ? 'none' : 'block' }}
//           onLoad={() => setIsLoading(false)}
//           onError={() => {
//             setIsLoading(false);
//             setError(true);
//           }}
//         />
//       </>
//         )
//     }
// )


  ///bridge Dot to Asset Hub for Ksm to Asset hub change wsProvider to wss://kusama-rpc.polkadot.io

  /*async function teleport() {
    const publicKey = decodeAddress(selectedAccount.address);
  const hexPublicKey = u8aToHex(publicKey);
  console.log(hexPublicKey)
    const provider = new WsProvider('wss://rpc.polkadot.io');
     const api = await ApiPromise.create({ provider });
    setApi(api);
    const allInjected = await web3Enable('my cool dapp');
    // returns an array of { address, meta: { name, source } }
// meta.source contains the name of the extension that provides this account
const allAccounts = await web3Accounts();

// finds an injector for an address
const SENDER = selectedAccount.address;
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

api.tx.utility.batchAll([ await api.tx.xcmPallet.limitedTeleportAssets(dest, beneficiary, assets, feeAssetItem, weightLimit)]).signAndSend(SENDER, { signer: signer }, async ({ status }) => {
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
  //Create Function 
async function Create(){
  //kusama wsProvider wss://kusama-rpc.polkadot.io
  const wsProvider = new WsProvider("wss://stateCreate.api.onfinality.io/ws?apikey=023fc078-a5b7-4a72-81c4-40e118b6097b");
    const api = await ApiPromise.create({ provider: wsProvider})
    setApi(api);
  // (this needs to be called first, before other requests)
const allInjected = await web3Enable('my cool dapp');

// returns an array of { address, meta: { name, source } }
// meta.source contains the name of the extension that provides this account
const allAccounts = await web3Accounts();

// the address we use to use for signing, as injected
const SENDER = selectedAccount.address;

// finds an injector for an address
const injector = await web3FromAddress(SENDER);

// sign and send our transaction - notice here that the address of the account
// (as retrieved injected) is passed through as the param to the `signAndSend`,
// the API then calls the extension to present to the user and get it signed.
// Once complete, the api sends the tx + signature via the normal process

    const MultiAddress = SENDER;

await api.tx.nfts.Create(u32, u33, MultiAddress,  witnessData ).signAndSend(SENDER, { signer: signer }, async ({ status }) => {
    if (status.isInBlock) {

      // type: ed25519, ssFormat: 42 (all defaults
      const keyring = new Keyring({ type: 'sr25519'});
      const pair = keyring.addFromUri(MNEMONIC);
      
      await api.tx.nfts.setMetadata(u32, u33, Bytes )
          .signAndSend(pair);
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

//increasing item id to next once transaction is confirmed
        u33++

               //changing firebase stored item id to next
      //adding firebase api link again for change in response
  const res = await fetch("https://yupiio-default-rtdb.firebaseio.com/u33.json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "u33": u33
    })
  });
  console.log(res)*/
  //redirecting user to the nft page on kodadot
  /* const kodadot = "https://canary.kodadot.xyz/ahp/gallery/7-";
      let u33 = u33 - 1 ;
      const link = kodadot + u33;
  window.location.href = (link);*/
      
    /*} else {
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
  
      
// });
// */ 
//   return (
//     <>
//     <div >
//     {/* <div>
//     <div className="grid grid-cols-5 gap-4 sm:grid-cols-2 md:grid-cols-12 ">
//     {DisplayData}

//     <Dialog open={size === "xl"} size={"xl"} handler={handleOpen}>
//         <DialogHeader className="justify-between">
//          <div> <typography> {selectedJsondata && <div>{selectedJsondata.name}</div>} </typography> </div>
//         <IconButton
//                 color="blue-gray"
//                 size="sm"
//                 variant="text"
//                 onClick={handleOpen}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   className="h-5 w-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </IconButton>
//         </DialogHeader>
//         <DialogBody className='h-[30rem] overflow-scroll'>
//         {selectedImageUrl && <img src={selectedImageUrl} alt="" />}
//         <Card className="mt-6 w-100 md:absolute top-0 md:right-20 md:mr-60">
//         <CardBody>
//           <strong>Estimated Fee: 10 DOT</strong>
//           <h3>Metadata Fee: 0.2 DOT</h3>
//           </CardBody>
//           <CardFooter className="pt-0">
//             <Button className='Create' onClick={Create} >Create item</Button>
//           </CardFooter>
//         </Card>
//         <Card className="mt-6 w-80 md:absolute top-0 right-0 md:ml-20">
//         <CardBody>
//         <h1 className='float-right text-3xl text-black'>Description</h1>
//         <br />
//         </CardBody>
//         <CardFooter className="pt-0">
//         {selectedJsondata && <div className='float-right text-sm'>{selectedJsondata.description}</div>}
//         </CardFooter>
// </Card>
// <Card className="mt-6 w-80 md:absolute bottom-1 right-0">
//         <CardBody>
//         <h1 className='float-right text-3xl text-black'>Attributes</h1>
//         </CardBody>
//         <CardFooter className="pt-0">
//         {selectedJsondata && (
//         <div>
//           {selectedJsondata.attributes.map((attribute, index) => (
//             <div key={index} className='flex gap-2'>
//               <Chip variant="ghost" value={attribute.trait_type} />
//               <p>:</p>
//               <Chip variant="outlined" value={attribute.value} />
//             </div>
//           ))}
//         </div>
//       )}
// </CardFooter>
// </Card>
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="red"
//             onClick={handleOpen}
//             className="mr-1"
//           >
//             <span>Close</span>
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </div>
//         <ToastContainer position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// theme="colored" />
//       </div> */}
// {/*<h2 className='count'>{u33} / 3000 Createed</h2>
// <h2 className='Price'> Create Price : 10  DOT</h2>
//       <div className='teleport-style'>
// <button onClick={teleport} className='teleport'>Teleport</button>
// </div>
// <br></br>
// <div className='Createitem'>
// <button onClick={Create} className='Create' >Create Item</button>
// </div>

// <hr className='hr2'></hr>
// <small>©Remarker, 2024.</small>
// <div>
//   <footer>
//   <a href="https://twitter.com/polkadot_punks"><img className='logo' src={logo} alt="Logo" /> </a>
//   </footer>
//           </div>*/}
//           </div>
//     </>
//   )
}
export default Createfunc
