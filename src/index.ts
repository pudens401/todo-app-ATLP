import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials:true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080,()=>{
    console.log('server running on http://localhost:8080');
});



const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

mongoose.Promise = Promise;
mongoose.connect(uri);
mongoose.connection.on('error',(error: Error)=> console.log(error));

app.use('/',router())