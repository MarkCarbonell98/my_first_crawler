
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

    for(let model in object) {
        console.log(object[model]);
        let modelAsJSON = JSON.stringify({model: object[model]}, null, 4);
        if(!fs.existsSync(`${__dirname}/${nameOfFolder}`)) {
            fs.mkdir(`${__dirname}/${nameOfFolder}`, err => console.log(err));
            fs.writeFile(`${__dirname}/${nameOfFolder}/${model}.json`, modelAsJSON, {flag: "w+"}, err => {
                if(err) {
                    console.log(err)
                }
            });
        } else {
            fs.writeFile(`${__dirname}/${nameOfFolder}/${model}.json`, modelAsJSON, {flag: "w+"}, err => {
                if(err) {
                    console.log(err)
                }
            });
        }
        console.log('file Written Successfully');
    }
}
// writeNewFileAsJSON(allFetchedDataObject);

const triggerAndWriteRequest = async (theBaseUrl, ArrayOfLinks, nameOfDirectory) => {
    const theUrl = theBaseUrl || '';
    const theLinks = ArrayOfLinks || [];
    const theFinalRequest = await getAllUrlsAsJSON(theUrl, theLinks);

    console.log({theFinalRequest});

    console.log("%c and the logged data is: ", "color: yellow; font-size: 20px; font-weight: bold;");

    console.log({allFetchedDataArray, allFetchedDataObject});
    writeNewFileAsJSON(allFetchedDataObject, nameOfDirectory)
    
    return "The data was successfully retrieved and written into files!";
}


//parameters: url, array with all routes, final directory name
triggerAndWriteRequest("https://touch-kubota.trio-hosting.de/api/", urls, "Models_JSON");


