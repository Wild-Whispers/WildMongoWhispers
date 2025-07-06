"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildMongo = void 0;
const mongodb_1 = require("mongodb");
/**
 * The WildMongo wrapper class for the WIldMongoWhispers utility
 * @property {MongoClient} client - The active MongoDB client
 * @property {Db} database - The current working Mongo database
 * @property {string} connectionStatus - The Mongo pool connection status
 */
class WildMongo {
    /**
     * WildMongo constructor
     * @param database The name of the desired database to use
     * @param mongoURI Your Mongo URI
     */
    constructor(database, mongoURI) {
        this.connectionStatus = "closed";
        this.client = new mongodb_1.MongoClient(mongoURI);
        this.database = this.client.db(database);
    }
    /**
     * Manually open the current Mongo pool connection
     * Only use this if you understand how Mongo connection pools work
     */
    OpenPoolConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            console.log(`[${new Date().toISOString()}] Mongo pool connection closed.`);
        });
    }
    /**
     * Manually closes the current Mongo pool connection
     * Only use this if you understand how Mongo connection pools work
     */
    ClosePoolConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            console.log(`[${new Date().toISOString()}] Mongo pool connection closed.`);
        });
    }
    /**
     * Manually set or reset the database you are actively working in
     * @param database The name of the desired database to use
     */
    setDatabase(database) {
        return __awaiter(this, void 0, void 0, function* () {
            this.database = this.client.db(database);
        });
    }
    /**
     * Manually set or reset the client you are actively working in
     * @param mongoURI Your Mongo URI
     * @returns Promise<MongoClient>
     */
    setClient(mongoURI) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = new mongodb_1.MongoClient(mongoURI);
            return this.client;
        });
    }
    /**
     * Insert one record into the specified collection
     * @param collection The collection to insert into
     * @param dataObj The data to update or insert
     * @returns Promise<InsertOneResult<any>>
     */
    insertOne(collection, dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionStatus === "closed") {
                yield this.client.connect();
                this.connectionStatus = "open";
            }
            let result = yield this.database.collection(collection).insertOne(dataObj);
            return result;
        });
    }
    /**
     * Update a record based on a given filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to update. Only documents that satisfy this condition will be updated.
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @returns Promise<UpdateResult<Any>>
     */
    updateOne(collection_1, filter_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, filter, dataObj, upsert = true) {
            if (this.connectionStatus === "closed") {
                yield this.client.connect();
                this.connectionStatus = "open";
            }
            let result = yield this.database.collection(collection).updateOne(filter, dataObj, { upsert: upsert });
            return result;
        });
    }
    /**
     * Find a specific record to update based on a given filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to update. Only documents that satisfy this condition will be updated.
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @returns Promise<WithId<Document>>
     */
    findOneAndUpdate(collection_1, filter_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, filter, dataObj, upsert = true) {
            if (this.connectionStatus === "closed") {
                yield this.client.connect();
                this.connectionStatus = "open";
            }
            let result = yield this.database.collection(collection).findOneAndUpdate(filter, dataObj, { upsert: upsert, returnDocument: "after" });
            return result;
        });
    }
    /**
     * Fetch results from your database based on a filter
     * @param collection The collection to update
     * @param filter A query object used to match the document(s) to fetch. Only documents that satisfy this condition will be fetched.
     * @returns Promise<Array<any>>
     */
    find(collection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionStatus === "closed") {
                yield this.client.connect();
                this.connectionStatus = "open";
            }
            let result = yield this.database.collection(collection).find(filter).toArray();
            return result;
        });
    }
}
exports.WildMongo = WildMongo;
