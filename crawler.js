const fetch = require('node-fetch');
let allTractors = [], pieces = {}, promises = [];
let allFinalTractors = [];
const ids =  ['M7171_en', 'M7151_en', 'M7131_en'];


const getDataAsJSON = async (url) => {
    const baseUrl = url;
    let options1 = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    await fetch(baseUrl, options1)
    .then(res => {
        // console.log(res)
        return res.json();
    })
    .then(data => {
        for(category in data) {
            pieces[category] = data[category];
        }
        allTractors.push(pieces);
        // console.log(allTractors);
        return allTractors;

    })
    .catch(err => {
        return 'something went wrong' + err;
    })
};



// getDataAsJSON('https://touch-kubota.trio-hosting.de/api/M7171_en');
// console.log(allTractors);
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

    let promsie = getDataAsJSON('https://touch-kubota.trio-hosting.de/api/M7171_en');
    console.log(promsie);

//array with all ids 
const getAllIDsFromJSON = async url => {
    await asyncForEach(ids, async value => {
        let promise = await getDataAsJSON(`${url}${value}`);
        promises.push(promise);
        console.log(`${url}${value}`);
        // promises.push(promise);
    })
    // console.log(promises);
    console.log('done');
}

getAllIDsFromJSON('https://touch-kubota.trio-hosting.de/api/');
console.log(promises);
// console.log(getDataAsJSON('https://touch-kubota.trio-hosting.de/api/M7171_en'));
