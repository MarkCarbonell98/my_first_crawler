
const fetch = require("node-fetch");
const fs = require("fs");
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
    const theRequest = await fetch(baseUrl, options).catch(err => console.log(err));
    const theResponse = await theRequest.json();
    // console.log(theResponse);
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


const writeNewFileAsJSON = (object = {}, nameOfFolder = "") => {
    for(let tractor in object) {
        const modelAsJSON = JSON.stringify({tractor: object[tractor]}, null, 4);
        const locale = object[tractor].locale;
        const tractorNameWithNoLocale = tractor.slice(0, tractor.length -3);
        if(!fs.existsSync(`${__dirname}/${nameOfFolder}`)) {
            fs.mkdir(`${__dirname}/${nameOfFolder}`, err => console.log(err));
            fs.mkdir(`${__dirname}/${nameOfFolder}/${locale}`, err => console.log(err));
            fs.writeFile(`${__dirname}/${nameOfFolder}/${locale}/${tractorNameWithNoLocale}.json`, modelAsJSON, {flag: "w+"}, err => {
                if(err) {
                    console.log(err)
                }
            });
        } else {
            fs.writeFile(`${__dirname}/${nameOfFolder}/${locale}/${tractorNameWithNoLocale}.json`, modelAsJSON, {flag: "w+"}, err => {
                if(err) {
                    console.log(err);
                }
            });
        }
        console.log(`The file ${tractorNameWithNoLocale} was written successfully!`);
    }
}

const triggerAndWriteRequest = async (theBaseUrl, ArrayOfLinks, nameOfDirectory) => {
    const theUrl = theBaseUrl || '';
    const theLinks = ArrayOfLinks || [];
    const theFinalRequest = await getAllUrlsAsJSON(theUrl, theLinks);
    writeNewFileAsJSON(allFetchedDataObject, nameOfDirectory);
    console.log("The data was successfully retrieved and written into files!");
}


//parameters: url, array with all routes, final directory name
triggerAndWriteRequest("https://touch-kubota.trio-hosting.de/api/", urls, "Models_JSON");


