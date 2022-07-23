const rss = require('./bin/feedparser')
const db = require('./bin/db')
const express = require('express')
const app = express()

// Grab a feed
const url = `https://www.nasa.gov/rss/dyn/breaking_news.rss`

// Choose mongodb database 
const space = 'space'
// Choose mongodb collection 
const nasa = 'nasa'

// Connect to mongo database

let mongoClient;
let collection;

async function connect(){
    mongoClient = await db.getDb();
    let database = mongoClient.db(space)
    collection = database.collection(nasa)
 // pass rss feed and mongo database collection to feedparser  
    rss.rss(url,collection)
}

// view saved rss in browser using express

app.get('/', function (req, res) {

    // use projection to limit fields shown. optional but helps readability
    const projection = { date: 1, title: 1, description:1, link:1}
    
    let col = collection
    col.find().project(projection).toArray((err, result) => {

        if(err){
            console.log(err)
        } else {
            res.send(result)
        }
    })

  })
  

// start express server on port 3001 and connect to mongo database
  app.listen(3001, () => {
    console.log(`Server is up on port 3001`);
    connect()
  })


