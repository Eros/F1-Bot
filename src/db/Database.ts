import {MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI = 'mongodb://localhost:27017';
const dbName = 'f1Bot';

let client: MongoClient;

export class Database {

    constructor() {

    }

    public async connect() {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
        }
    };

    public get db(): MongoClient {
        return client;
    }

    public async disconnect() {
        if (client) {
            await client.close(true);
        }
    };
}