const {MongoClient} = require('mongodb')


let db;

async function getDb(){
    
const uri = "<connection string uri>"
const client = new MongoClient(uri);
try {
db = await client.connect();
console.log("Connected to Mongo!")
return db;
}
catch(error){
    console.log(error)
}
}

async function connect(){
    if (db){
        return db;
    } else {
        try {
        let database = await getDb()
        return database;
        }
        catch(err){
            console.log(err)
        }
    }
}


module.exports = {getDb, connect} ;