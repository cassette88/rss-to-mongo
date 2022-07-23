const axios = require('axios')
const Feedparser = require('feedparser');
const db = require('./db')


const feedparser = new Feedparser();
const entries = []


function rss(url, collection){

// fetch rss feed and pipe to feedparser
axios({
    method: 'get',
    url,
    responseType: 'stream'
})
.then(function (response){
    if (response.status !== 200) {
        throw new Error('Bad status code');
    } else {
        response.data.pipe(feedparser)
    }
}, function(err) {
    console.log('error fetching and parsing')
}
)
// LET FEEDPARSER DO ITS THING HERE
  
    feedparser.on('error', function (error){
    console.log("FeedParser threw an error: " + error)
   })
  
   feedparser.on('readable', function () {
   
    try{
        onReadable(this)
    } catch(err) {
        console.log("There was a problem" + err)
    }     
   })

   feedparser.on('finish', function(){
    onFinish()
   });

function onReadable(stream){
    let item;

    while (item = stream.read()) {
   
     item._id = item.guid;
        entries.push(item)
    }  
}

async function onFinish(){

try
{
    // this option allows additional documents to be inserted if one fails
const options = {ordered: false}
const result = await collection.insertMany(entries, options)
console.log(`${result.insertedCount} documents were added to db`)

} catch(err){
    // mongo will not include duplicates but will signal an err 11000 if there are duplicates
    if (err.code != 11000) 
    {
        throw err; // If not a duplication error, we throw
    }
    if(!entries.length - err.writeErrors.length){
        console.log(`Nothing was added to db this time`)
    } else {
    console.log(`${entries.length - err.writeErrors.length} were added to db`)
    }
}
}
}

module.exports = {rss}