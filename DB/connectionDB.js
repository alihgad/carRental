import { MongoClient } from "mongodb";
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
client.connect().then(()=>{
    console.log('successfully connected')
}).catch(err => console.log('error connecting'));


const db = client.db('carRental');

export default db