const fetch = require("fetch");
const urls = ['M7171_en', 'M7151_en', 'M7131_en'];
let allFetchedDataArray = [], allFetchedDataObject = {};

const getDataAsJSON = async url => {
    const baseUrl = url;
    const options = {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    }
    const theRequest = await fetch(baseUrl, options);
    const theResponse = await theRequest.json();
    return theResponse;
}



const getAllUrlsAsJSON = async (address, allLinks) => {
    const baseUrl = address;
    const allUrls = [...allLinks];

    const allPromises = await Promise.all(allUrls.map(async url => {
        const theRequestParsed = await getDataAsJSON(`${baseUrl}${url}`);
        allFetchedDataArray.push(theRequestParsed);
        allFetchedDataObject[url] = theRequestParsed;
        return theRequestParsed;
    }));
    
    return allPromises;
}

const logEverything = async (theBaseUrl, ArrayOfLinks) => {
    const theUrl = theBaseUrl || '';
    const theLinks = ArrayOfLinks || [];
    const theFinalRequest = await getAllUrlsAsJSON(theUrl, theLinks);
    console.log({theFinalRequest});
    console.log("%c and the logged data is: ", "color: yellow; font-size: 20px; font-weight: bold;");
    console.log({allFetchedDataArray, allFetchedDataObject});
    return "The data was successfully retrieved!";
}

logEverything("https://touch-kubota.trio-hosting.de/api/", urls);
