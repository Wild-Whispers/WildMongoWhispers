import { MongoClient, Db, InsertOneResult, UpdateResult, WithId, Document } from "mongodb";

/**
 * The WildMongo wrapper class for the WIldMongoWhispers utility
 * @property {MongoClient} client - The active MongoDB client
 * @property {Db} database - The current working Mongo database
 * @property {string} connectionStatus - The Mongo pool connection status
 */
export class WildMongo {
    public client: MongoClient;
    public database: Db;
    private connectionStatus: string = "closed";

    /**
     * WildMongo constructor
     * @param database The name of the desired database to use
     * @param mongoURI Your Mongo URI
     */
    constructor(database: string, mongoURI: string) {
        this.client = new MongoClient(mongoURI);
        this.database = this.client.db(database);
    }

    /**
     * Manually open the current Mongo pool connection
     * Only use this if you understand how Mongo connection pools work
     */
    async OpenPoolConnection(): Promise<void> {
        await this.client.connect();

        console.log(`[${new Date().toISOString()}] Mongo pool connection closed.`);
    }

    /**
     * Manually closes the current Mongo pool connection
     * Only use this if you understand how Mongo connection pools work
     */
    async ClosePoolConnection(): Promise<void> {
        await this.client.close();

        console.log(`[${new Date().toISOString()}] Mongo pool connection closed.`);
    }

    /**
     * Manually set or reset the database you are actively working in
     * @param database The name of the desired database to use
     */
    async setDatabase(database: string): Promise<void> {
        this.database = this.client.db(database);
    }

    /**
     * Manually set or reset the client you are actively working in
     * @param mongoURI Your Mongo URI
     * @returns Promise<MongoClient>
     */
    async setClient(mongoURI: string): Promise<MongoClient> {
        this.client = new MongoClient(mongoURI);

        return this.client;
    }

    /**
     * Insert one record into the specified collection
     * @param collection The collection to insert into
     * @param dataObj The data to update or insert
     * @returns Promise<InsertOneResult<any>>
     */
    async insertOne(collection: string, dataObj: Object): Promise<InsertOneResult<any>> {
        if (this.connectionStatus === "closed") {
            await this.client.connect();
            this.connectionStatus = "open";
        }

        let result = await this.database.collection(collection).insertOne(dataObj);
        
        return result;
    }

    /**
     * Update a record based on a given filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to update. Only documents that satisfy this condition will be updated.
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @returns Promise<UpdateResult<Any>>
     */
    async updateOne(collection: string, filter: Object, dataObj: Object, upsert=true): Promise<UpdateResult<any>> {
        if (this.connectionStatus === "closed") {
            await this.client.connect();
            this.connectionStatus = "open";
        }

        let result = await this.database.collection(collection).updateOne(filter, dataObj, { upsert: upsert });
        
        return result;
    }

    /**
     * Find a specific record to update based on a given filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to update. Only documents that satisfy this condition will be updated.
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @returns Promise<WithId<Document>>
     */
    async findOneAndUpdate(collection: string, filter: Object, dataObj: Object, upsert=true): Promise<WithId<Document>> {
        if (this.connectionStatus === "closed") {
            await this.client.connect();
            this.connectionStatus = "open";
        }

        let result = await this.database.collection(collection).findOneAndUpdate(filter, dataObj, { upsert: upsert, returnDocument: "after" });
        
        return result;
    }

    /**
     * Fetch results from your database based on a filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to fetch. Only documents that satisfy this condition will be fetched.
     * @returns Promise<Array<any>>
     */
    async find(collection: string, filter: Object): Promise<Array<any>> {
        if (this.connectionStatus === "closed") {
            await this.client.connect();
            this.connectionStatus = "open";
        }

        let result = await this.database.collection(collection).find(filter).toArray();
        
        return result;
    }
}