import { ApiPromise, WsProvider } from '@polkadot/api';
import express, { response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Import 'fetch' for Node.js environment
import { createClient } from 'redis';
import { string } from 'zod';
import Axios from 'axios';
import mysql from 'mysql2';
import e from 'express';


const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect()

// Define the collections function
const collections = async () => {
    // const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    // const api = await ApiPromise.create({ provider: wsProvider });
    // const collectionMetadataOf = await api.query.nfts.collectionMetadataOf.entries();
    const collectionsData = [];

    // for (const [{ args: [id] }, value] of collectionMetadataOf) {
        // const metadata = JSON.parse(`${value}`);
        // const hexWithoutPrefix = metadata.data.startsWith('0x') ? metadata.data.slice(2) : metadata.data;
        // const bytes = new Uint8Array(hexWithoutPrefix.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        // const decoder = new TextDecoder('utf-8');
        // const decodedString = decoder.decode(bytes);
        // const collection = (await api.query.nfts.collection(id)).toHuman()
        // const owner = collection.owner
        // const items = collection.items
        // const collectionConfigOf = (await api.query.nfts.collectionConfigOf(id)).toHuman()
        // const maxSupply = collectionConfigOf.maxSupply
        //     // const cidUrl = `https://cloudflare-ipfs.com/ipfs/${decodedString}`;
        //     const jsonUrl = `https://cloudflare-ipfs.com/ipfs/${decodedString.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}`;

        //     //  const ipfsUrl = `https://cloudflare-ipfs.com/${decodedString.replace(":", "")}`;


        try {
            // GraphQL query
const query = `
query MyQuery {
    collectionEntities {
      blockNumber
      burned
      createdAt
      currentOwner
      distribution
      floor
      hash
      highestSale
      id
      image
      issuer
      max
      media
      metadata
      name
      recipient
      ownerCount
      royalty
      supply
      type
      updatedAt
      volume
      nftCount
      meta {
        description
      }
    }
  }  
`;

// GraphQL endpoint URL
const endpoint = 'https://squid.subsquid.io/speck/graphql';

// Send POST request to GraphQL endpoint
    // Send POST request to GraphQL endpoint and wait for response
    const subsquidResponse = await Axios.post(endpoint, { query });
    
    // Store response data in a constant variable
    const responseData = subsquidResponse.data.data.collectionEntities;

    // Now you can use the responseData variable as needed
    // console.log(responseData);
    const metadataList = responseData.map(collections => {
        // console.log(collections.node)
        const volume = (parseFloat(collections.volume) / 10000000000).toFixed(2);
        const topsale = (parseFloat(collections.highestSale) / 10000000000).toFixed(2);
        const floorPrice = (collections.id === "7" ? Number(collections.floor) : Number(collections.floor) / 10000000000).toFixed(2);
        collectionsData.push({burned: collections.burned, id: collections.id, name: collections.name, description: collections.meta && collections.meta.description, image: collections.image, owner: collections.currentOwner, maxSupply: collections.max, distribution: collections.distribution, floor: floorPrice,  highestSale: topsale, royalty: collections.royalty, nftCount: collections.supply, createdDate: collections.updatedAt, volume: volume });
        console.log(collectionsData)
    })
            // const response = await fetch(jsonUrl);
            // if (!response.ok) {
            //     throw new Error(`Failed to fetch: ${response.statusText}`);
            // }
            // const collectionJson = await response.json();
            // const name = collectionJson.name;
            // const description = collectionJson.description;
            // const image = collectionJson.image
            // // console.log(name, description, image, owner, items, maxSupply);
            // collectionsData.push({ id: collections.node.id, name: collections.node.name, description: collections.node.meta && collections.node.meta.description, image: collections.node.image, owner: collections.node.currentOwner, items: collections.node.nftCount, maxSupply: collections.node.max  });
            // console.log(collectionsData)
        } catch (error) {
            console.log("Error fetching JSON:", error);
            // Push placeholder data or handle error as needed
            collectionsData.push({ id: null, name: null, description: null, image: null, owner: null, items: null, maxSupply: null });
        }
    // }

// console.log(collectionsData);
    return collectionsData;
};
const items = async (receivedData, image, page, orderBy) => {
    if (!receivedData || receivedData === undefined) {
        console.log("error received data not provided")
    }else {
    const collectionId = String(receivedData); // Ensure it's a string
    const itemsPerPage = 20; // Define the number of items per page
    const limit = itemsPerPage; // Limit is the number of items per page
    const offset = (page - 1) * itemsPerPage; // Offset is calculated based on the current page
    const query = `
    query MyQuery {
        collectionEntityById(id: "${collectionId}") {
            nfts(limit: ${limit}, orderBy: ${orderBy}, offset: ${offset}) {
                id
              }
        }
    }
    `;
    
    // Use this query to make your GraphQL call
    

    const endpoint = 'https://squid.subsquid.io/speck/graphql';

    try {
        const subsquidResponse = await Axios.post(endpoint, { query });
        const responseData = subsquidResponse.data.data.collectionEntityById.nfts;
        console.log(responseData)
        console.log(limit)
        console.log(offset)
        // Map over responseData asynchronously and fetch metadata for each item
        const itemMetadataList = await Promise.all(responseData.map(async (itemData) => {
            const itemId = String(itemData.id);
        
            const query = `
                query MyQuery {
                    nftEntityById(id: ${JSON.stringify(itemId)}) {
                        blockNumber
                        burned
                        createdAt
                        currentOwner
                        hash
                        id
                        image
                        media
                        lewd
                        issuer
                        metadata
                        name
                        price
                        recipient
                        royalty
                        sn
                        updatedAt
                        version
                        meta {
                            animationUrl
                            attributes {
                                display
                                value
                                trait
                            }
                            description
                            id
                            image
                            name
                            type
                        }
                    }
                }
            `;
            const subsquidResponse = await Axios.post(endpoint, { query });
            const responseData = subsquidResponse.data.data.nftEntityById;
            if(responseData.image === image ) {
                const jsonUrl = `https://cloudflare-ipfs.com/ipfs/${responseData.metadata.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}`;
                try {
                    const response = await fetch(jsonUrl);
                
                    if (!response.ok) {
                      console.log(response.status)
                    }
                    const price = parseFloat(responseData.price) / 10000000000;

                
                    const data = await response.json();
                    if(data){
                    responseData.image = data.image;
                    responseData.name = data.name;
                    responseData.meta.description = data.description;
                    responseData.meta.attributes = data.attributes;
                    responseData.image = data.image;
                    const itemMetadata = {
                        Id: responseData.sn,
                        name: responseData.name,
                        description: responseData.meta.description,
                        image: responseData.image,
                        edition: null,
                        date: responseData.createdAt,
                        attributes: responseData.meta.attributes,
                        price: price === 0 ? null : price,
                        owner: responseData.issuer,
                        burned: responseData.burned,
                        currentOwner: responseData.currentOwner,
                        issuer: responseData.issuer,
                        metadata: responseData.metadata,
                    };
                    console.log(itemMetadata);
                    return itemMetadata;
                }
                  } catch (error) {
                    console.error('There was a problem fetching the data:', error);
                  }
            }
            else {
                const price = parseFloat(responseData.price) / 10000000000;

            const itemMetadata = {
                Id: responseData.sn,
                name: responseData.name,
                description: responseData.meta.description,
                image: responseData.image,
                edition: null,
                date: responseData.createdAt,
                attributes: responseData.meta.attributes,
                price: price === 0 ? null : price,
                owner: responseData.issuer,
                burned: responseData.burned,
                currentOwner: responseData.currentOwner,
                issuer: responseData.issuer,
                metadata: responseData.metadata,
            };
            console.log(itemMetadata);
            return itemMetadata;
        }
        }));
        return itemMetadataList;
    } catch (error) {
        throw new Error(`Failed to fetch item data: ${error.message}`);
    }
        }
};
await items()

app.get('/itemData', async (req, res) => {
    const receivedData = req.query.data;
    const image = req.query.image;
    const page = req.query.page;
    const orderBy = req.query.orderBy;
    if (!receivedData) {
        return res.status(400).json({ message: 'No data provided' });
    }
    if(receivedData) {

    try {
        const itemsResult = await items(receivedData, image, page, orderBy);
        res.json({ message: 'Received and processed the data successfully', data: itemsResult });
    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}
});

const itemMetadata = async(receivedData)  => {
    const jsonUrl = `https://cloudflare-ipfs.com/ipfs/${ receivedData && receivedData.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}`;
    try{
            const response = await fetch(jsonUrl);
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log(data)
            return data
    }catch(e) {
        console.log("error", e)
    }
    
}
await itemMetadata()

app.get('/metadata', async (req, res) => {
    const receivedData = req.query.metadata;
    if (!receivedData) {
        return res.status(400).json({ message: 'No data provided' });
    }
    try {
        const itemsResult = await itemMetadata(receivedData);
        res.json({ message: 'Received and processed the data successfully', data: JSON.stringify(itemsResult) });
    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
});

const itemconfig = async(receivedData, collectionData) => {
    app.get('/itemId', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.data);
            const collectionData = JSON.parse(req.query.collectionId);
            console.log("Received Data:", receivedData);  // Debugging log
            const itemsResult = await itemconfig(receivedData, collectionData);
console.log("Items Processed:", itemsResult); // Debugging log
// Send a success response with the processed items data
res.json({ message: 'Received and processed the data successfully', data: itemsResult });
        } catch (error) {
            console.error("Error in /itemData route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });
    const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    try {
        console.log(receivedData)
        if(collectionData, receivedData) {
            const item = (await api.query.nfts.item(collectionData, receivedData)).toHuman();
            const owner = item && item.currentOwner
            await api.disconnect();
            return owner
        } else {
            console.log("error")
        }
    } catch (error) {
        await api.disconnect();
        console.error("Error fetching item entries:", error);
    }
}
await itemconfig()

const itemPrice = async(receivedData, collectionData, prices) => {
    app.get('/itemPrice', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.data);
            const collectionData = JSON.parse(req.query.collectionId);
            const prices = JSON.parse(req.query.price)
            console.log("Received Data:", receivedData, collectionData, prices);  // Debugging log
            const itemsResult = await itemPrice(receivedData, collectionData, prices);
console.log("Items Processed:", itemsResult); // Debugging log
// Send a success response with the processed items data
res.json({ message: 'Received and processed the data successfully', data: itemsResult });
        } catch (error) {
            console.error("Error in /itemData route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });
    try {
        console.log(receivedData)
        if(collectionData, receivedData, prices) {
            const itemPrice = prices;
            try {
                const getresponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=Polkadot&vs_currencies=USD", {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                  },
                });
            
                const Data = await getresponse.json();
                const dotPrice = Data.polkadot.usd
                const price = async () => {
                    if (isNaN(itemPrice)) {
                        return null;
                    } else {
                        return {priceDotUsd: `${(itemPrice).toLocaleString()} DOT ~$${(itemPrice * dotPrice).toLocaleString()}`, price: itemPrice};
                    }
                };
                return price()   
            } catch (e) {
                console.log("error")
            }
        } else {
            console.log("error")
        }
    } catch (error) {
        console.error("Error fetching item entries:", error);
    }
}
await itemPrice()

// Call collections function and send its result as response
app.get("/getData", async (req, res) => {
    try {
        const resposneData = await collections();
        res.json(resposneData)
    }catch(e){

    }
});

const collectionActivity = async (receivedData) => {
    app.get('/collectionActivity', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.collectionId);
            console.log("Received Data:", receivedData); // Debugging log

            // Call the collectionActivity function with receivedData
            const itemsResult = await collectionActivity(receivedData);
            console.log("Items Processed:", itemsResult); // Debugging log

            // Send a success response with the processed items data
            res.json({ message: 'Received and processed the data successfully', data: itemsResult });
        } catch (error) {
            console.error("Error in /itemData route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });

    const data = {
        "collection_id": receivedData,
        "item_id": null,
        "page": Infinity,
        "row": 100
    }

    try {
        const response = await fetch("https://assethub-polkadot.api.subscan.io/api/scan/nfts/activities", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json(); // Parse response as JSON
        console.log(responseData); // Debugging log

        return responseData
    } catch (e) {
        console.log("error", e);
    }
}

collectionActivity();

const Holders = async (receivedData, page) => {
    app.get('/Holders', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.collectionId);
            const page = Number(req.query.page);
            console.log("Received Data:", {receivedData, page}); // Debugging log

            // Call the collectionActivity function with receivedData
            const itemsResult = await Holders(receivedData, page);
            console.log("Items Processed:", itemsResult); // Debugging log

            // Send a success response with the processed items data
            res.json({ message: 'Received and processed the data successfully', data: itemsResult });
        } catch (error) {
            console.error("Error in /itemData route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });

    const data = {
        "collection_id": receivedData,
        "page": page - 1,
        "row": 10,
    }

    try {
        const response = await fetch("https://assethub-polkadot.api.subscan.io/api/scan/nfts/info/holders", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json(); // Parse response as JSON
        console.log(responseData); // Debugging log

        return responseData
    } catch (e) {
        console.log("error", e);
    }
}

Holders();

const owned = async (receivedData, page) => {
    app.get('/owned', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.address);
            const page = req.query.page;
            console.log("Received Data:", receivedData); // Debugging log

            // Call the collectionActivity function with receivedData
            const itemsResult = await owned(receivedData, page);
            console.log("Response of owned: ", itemsResult); // Debugging log
            
            // Now itemDetails should contain an array of names
            

            // Send a success response with the processed items data
            res.json({ message: 'Received and processed the data successfully', data: itemsResult });
        } catch (error) {
            console.error("Error in /owned route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });

    try {
        const itemPage = (page - 1);
        var myHeaders = new Headers();
        myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
           "address": receivedData,
           "collection_id": null,
           "page": itemPage,
           "row": 10
        });

        var requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: raw,
           redirect: 'follow'
        };

        const response = await fetch("https://assethub-polkadot.api.subscan.io/api/scan/nfts/account/balances", requestOptions);
        const result = await response.text();
        console.log(result); // Debugging log
        const responseData = result.toString();
        const jsonData = responseData && JSON.parse(responseData);
        const itemMetadata = jsonData && jsonData.data;
        const itemMetadataDetails = itemMetadata && itemMetadata.list && await Promise.all(itemMetadata.list.map(async (item, index) => {
            const collectionId = item.collection_id;
            const itemIdString = item.item_id;
            try {
                const itemId = collectionId + "-" + itemIdString;
                const query = `
                    query MyQuery {
                        nftEntityById(id: ${JSON.stringify(itemId)}) {
                            id
                            image
                            collection {
                              id
                              name
                            }
                            price
                            name
                        }
                    }
                `;
                const endpoint = 'https://squid.subsquid.io/speck/graphql';
                const subsquidResponse = await Axios.post(endpoint, { query });
                const responseData = subsquidResponse.data.data.nftEntityById;
                console.log(responseData)
        
                const itemJson = {};
                console.log(itemJson)
                const itemPrice = parseFloat(responseData.price) / 10000000000;
        
                // Add collectionId and itemId to itemJson
                itemJson.collectionId = collectionId;
                itemJson.itemId = itemIdString;
                itemJson.price = itemPrice;
                itemJson.collectionName = responseData.collection.name;
                itemJson.image = responseData.image;
                itemJson.name = responseData.name;
        
                return itemJson;
            } catch (e) {
                console.log("Error in code:", e);
                throw e;
            }
        }));
        
        const swaps = itemMetadata && itemMetadata.list && await Promise.all(itemMetadata.list.map(async (item, index) => {
            const collectionId = item.collection_id;
            const item_Id = item.item_id;
            const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    try {
        const pendingSwaps = (await api.query.nfts.pendingSwapOf(collectionId, item_Id)).toHuman();
        const itemIdString = collectionId + "-" + item_Id;
        try{
        const query = `
                query MyQuery {
                    nftEntityById(id: ${JSON.stringify(itemIdString)}) {
                        id
                        sn
                        image
                        collection {
                          id
                          name
                        }
                        price
                        name
                    }
                }
            `;
            const endpoint = 'https://squid.subsquid.io/speck/graphql';
            const subsquidResponse = await Axios.post(endpoint, { query });
            const responseDatanftEntityById = subsquidResponse.data.data.nftEntityById;
            console.log(responseDatanftEntityById)
        console.log("pending swaps", pendingSwaps)
        try {
            const itemIdString = pendingSwaps.desiredCollection + "-" + pendingSwaps.desiredItem;
            const query = `
                query MyQuery {
                    nftEntityById(id: ${JSON.stringify(itemIdString)}) {
                        id
                        sn
                        image
                        collection {
                          id
                          name
                        }
                        price
                        name
                    }
                }
            `;
            const endpoint = 'https://squid.subsquid.io/speck/graphql';
            const subsquidResponse = await Axios.post(endpoint, { query });
            const responseData = subsquidResponse.data.data.nftEntityById;
            console.log(responseData)
    
            const itemJson = {};
            console.log(itemJson)
            const itemPrice = parseFloat(responseData.price) / 10000000000;

// Add collectionId and itemId to itemJson
itemJson.desiredCollection = pendingSwaps.desiredCollection;
itemJson.desiredItem = pendingSwaps.desiredItem;
itemJson.send = pendingSwaps.price? pendingSwaps.price.direction === "Send" ? ((pendingSwaps.price.amount.replace(/,/g, "") / 10000000000) % 1 === 0 ? (pendingSwaps.price.amount.replace(/,/g, "") / 10000000000).toFixed(0) : (pendingSwaps.price.amount.replace(/,/g, "") / 10000000000).toFixed(3)) : null : null;  // Ensure this line is complete
itemJson.receive = pendingSwaps.price? pendingSwaps.price.direction === "Receive" ? ((pendingSwaps.price.amount.replace(/,/g, "") / 10000000000) % 1 === 0 ? (pendingSwaps.price.amount.replace(/,/g, "") / 10000000000).toFixed(0) : (pendingSwaps.price.amount.replace(/,/g, "") / 10000000000).toFixed(3)) : null : null; // Ensure this line is complete

itemJson.desiredCollectionName = responseData.collection.name;
itemJson.desiredItemImage = responseData.image;
itemJson.desiredItemName = responseData.name;
itemJson.offeredCollection = collectionId;
itemJson.offeredItem = responseDatanftEntityById.sn;
itemJson.offeredCollectionName = responseDatanftEntityById.collection.name;
itemJson.offeredItemnName = responseDatanftEntityById.name;
itemJson.offeredItemImage = responseDatanftEntityById.image;

await api.disconnect();
return itemJson;

        } catch (e) {
            console.log("Error in code:", e);
            throw e;
        }
    }catch(e) {
        console.log("error")
    }

    } catch (error) {
        console.error("Error fetching item entries:", error);
    }
}));

        return {result: responseData, metadata: itemMetadataDetails, swap: swaps};
        
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

owned();

const metadata = async (item, collection) => {
    if(item, collection){
    try {
        const itemId = collection + "-" + item;
        const query = `
            query MyQuery {
                nftEntityById(id: ${JSON.stringify(itemId)}) {
      currentOwner
    price
    metadata
    issuer
    collection {
      name
    }
                }
            }
        `;
        const endpoint = 'https://squid.subsquid.io/speck/graphql';
        const subsquidResponse = await Axios.post(endpoint, { query });
        const responseData = subsquidResponse.data.data.nftEntityById;
        console.log(responseData)
        const fetchedMetadata = `https://cloudflare-ipfs.com/ipfs/${ responseData && responseData.metadata.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}`;
        const response = await fetch(fetchedMetadata);
        console.log(response)

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const itemJson = await response.json();
        const itemPrice = parseFloat(responseData.price) / 10000000000;

        const fetchPrice = async () => {
            try {
                const getResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=Polkadot&vs_currencies=USD", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                });

                const data = await getResponse.json();
                const dotPrice = data.polkadot.usd;

                if (isNaN(itemPrice)) {
                    return null;
                } else {
                    return {
                        priceDotUsd: `${itemPrice.toLocaleString()} DOT ~$${(itemPrice * dotPrice).toLocaleString()}`,
                        price: itemPrice
                    };
                }
            } catch (e) {
                console.log("Error fetching price:", e);
                return null;
            }
        };

        return {
            itemJson: itemJson,
            collectionOwner: responseData.issuer,
            collectionName: responseData.collection.name,
            itemOwner: responseData.currentOwner,
            price: await fetchPrice()
        };
    } catch (e) {
        console.log("Error in code:", e);
        throw e;
    }
}
};

app.get('/metadatas', async (req, res) => {
    try {
        const item = JSON.parse(req.query.item);
        const collection = JSON.parse(req.query.collection);
        console.log("Received Data:", item, collection); // Debugging log

        const itemsResult = await metadata(item, collection);
        console.log("Response of metadata:", itemsResult); // Debugging log

        res.json({ message: 'Received and processed the data successfully', data: itemsResult });
    } catch (error) {
        console.error("Error in /metadatas route:", error);
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
});
metadata()



const created = async (receivedData) => {
    app.get('/created', async (req, res) => {
        try {
            // Parsing data received as a query parameter
            const receivedData = JSON.parse(req.query.address);
            console.log("Received Data:", receivedData); // Debugging log

            // Call the collectionActivity function with receivedData
            const itemsResult = await created(receivedData);
            console.log("Response of  collection Account: ", itemsResult); // Debugging log

            // Send a success response with the processed items data
            res.json({ message: 'Received and processed the data successfully', data:itemsResult });
        } catch (error) {
            console.error("Error in /owned route:", error);
            // Send an error response if something goes wrong
            res.status(500).json({ message: 'Error processing data', error: error.message });
        }
    });

    const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    try {
        const collectionAccountEntries = await api.query.nfts.collectionAccount.entries(receivedData);

        // Process each entry to fetch metadata and return item data
        const items = await Promise.all(collectionAccountEntries.map(async ([key, value]) => {
            const [accountId, tokenId] = key.args; 

            // Convert tokenId to a number
            const tokenIdNumber = tokenId.toNumber(); 
            console.log(tokenIdNumber)
            // Convert key and value to human-readable format
            const keyHuman = key.toHuman();
            const valueHuman = value.toHuman();

            console.log('Key:', keyHuman);
            console.log('Value:', valueHuman);

            const collectionMetadataOf = await api.query.nfts.collectionMetadataOf(tokenId);
            const collectionMetadata = collectionMetadataOf.toHuman();
            const metadataUrl = `https://cloudflare-ipfs.com/ipfs/${collectionMetadata.data.replace(/ipfs:\/\/ipfs|ipfs:\/\//, "")}`;

            try {
                const response = await fetch(metadataUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const itemJson = await response.json();
                console.log(itemJson);
                return { itemData: itemJson, Id: tokenIdNumber };
            } catch (error) {
                console.error("Error fetching JSON:", error);
                return null; // Return null if there is an error
            }
        }));
                    await api.disconnect();
        return items;

    } catch (error) {
        console.error("Error fetching item entries:", error);
    }
}

created();

const swapData = async (collection, items) => {
    const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    try {
        const collections = await api.query.nfts.collection.entries();

        const humanCollections = collections.map(([collectionId, collectionData]) => ({
            collectionId: collectionId.toHuman(),
            items: []  // Each collection has an 'items' array
        }));

        await Promise.all(humanCollections.map(async (collection) => {
            const collectionAccountEntries = await api.query.nfts.pendingSwapOf.entries(collection.collectionId);

            await Promise.all(collectionAccountEntries.map(async ([accountId, swapData]) => {
                const [colId, itemId] = accountId.toHuman(); // Extract collection and item ID from the accountId

                const swapDetails = {
                    offeredCollection: colId,
                    offeredItem: itemId,
                    swapData: swapData.toHuman()
                };

                const queryItemId = swapDetails.offeredCollection + '-' + swapDetails.offeredItem;

                const query = `
                query MyQuery {
                    nftEntityById(id: "${queryItemId}") {
                      image
                      name
                    }
                }`;

                const endpoint = 'https://squid.subsquid.io/speck/graphql';

                try {
                    const subsquidResponse = await Axios.post(endpoint, { query });
                    const responseData = subsquidResponse.data.data.nftEntityById;

                    humanCollections.forEach(col => {
                        if (col.collectionId.includes(swapDetails.swapData.desiredCollection)) {
                            let item = col.items.find(item => item.itemId === swapDetails.swapData.desiredItem);
                            if (!item) {
                                item = { itemId: swapDetails.swapData.desiredItem, swaps: [] };
                                col.items.push(item);
                            }
                            item.swaps.push({ swapDetails, responseData });
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }));
        }));

        const swapMatch = async () => {
            let itemSwapforSlectedItem = [];
            humanCollections.forEach(collections => {
                if (collections.items.length > 0) {
                    const collectioId = Number(collections.collectionId[0]);
                    const itemId = Number(collections.items.map(itemId => itemId.itemId)[0]); // Log only collections with swaps
                    console.log(collection, collectioId, itemId, items)
                    if (collection === collectioId && items === itemId) {
                        console.log("DONE")
                        itemSwapforSlectedItem = collections.items.map(item => item.swaps);
// Step 1: Calculate the amounts
if (collections.items.some(itemId => itemId.swaps.some(item => item.swapDetails.swapData.price !== null))) {
    const amounts = collections.items.map(itemId => 
        itemId.swaps.map(item => {
            const price = item.swapDetails.swapData.price;
            if (price !== null) {
                const result = parseFloat(price.amount.replace(/,/g, "") / 10000000000);
                return result % 1 === 0 ? result.toFixed(0) : result.toFixed(3); // Check if decimal places are zero
            }
            return null; // Handle the case where price is null
        }).filter(amount => amount !== null) // Filter out null values
    );


// Step 2: Update the original structure with the new amounts
collections.items.forEach((itemId, itemIdIndex) => 
    itemId.swaps.forEach((item, itemIndex) => 
        item.swapDetails.swapData.price.amount = amounts[itemIdIndex][itemIndex]
    )
);

// Step 3: Log the updated amounts
console.log(collections.items.map(itemId => 
    itemId.swaps.map(item => 
        item.swapDetails.swapData.price.amount
    )
));
}



                    }
                }
            });
            return itemSwapforSlectedItem;
        }
        return swapMatch();
    } catch (e) {
        console.log(e);
    } finally {
        await api.disconnect();
    }
};

app.get('/swap', async (req, res) => {
    try {
        const items = JSON.parse(req.query.data);
        const collection = JSON.parse(req.query.collectionId);
        console.log("Received Data:", items, collection); // Debugging log

        swapData(collection, items)
            .then((itemsResult) => {
                console.log("Response of swap:", itemsResult); // Debugging log
                res.json({ message: 'Received and processed the data successfully of swap', data: itemsResult });
            })
            .catch((error) => {
                console.error("Error in /swap route:", error);
                res.status(500).json({ message: 'Error processing swap', error: error.message });
            });
    } catch (error) {
        console.error("Error in /swap route:", error);
        res.status(500).json({ message: 'Error processing swap', error: error.message });
    }
});


  
  



// Start the server
app.listen(port, () => console.log("Server is running"));

// Export app for testing purposes
export default app;
