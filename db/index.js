var MongoClient = require('mongodb').MongoClient;

class MongoConnector {
    constructor(config) {
        this.__config = config;
        this.conn;
        this.db;
        if(config.auth){
            this.__config.uri = `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/${config.dbname}?authSource=admin`;
        }
        else{
            this.__config.uri = `mongodb://${config.host}:${config.port}/${config.dbname}?authSource=admin`;
        }
    }
    init(){
        return new Promise((resolve,reject)=>{
            let __config = this.__config;
            MongoClient.connect(__config.uri,  (err, database)=> {
                if (err) {
                    console.error("Error in connecting db",err)
                    return reject(err);
                }
                else {
                    this.conn = database;
                    this.db = this.conn.db(__config.dbname)
                    database.on('error',  (er)=> {
                        console.error('this.init, error connecting mongodb:', er);
                        this.conn = null;
                        return reject(er);
                    });
                    database.on('close',  ()=> {
                        console.debug('this.init, connection closed:', {uri: __config.uri});
                        return resolve(true);
                    });
                    database.on('reconnect',  ()=> {
                        console.info('this.init, re-connected to db:', {uri: __config.uri});
                        this.conn = database;
                        return resolve(true);
                    });
                }
            });
        })
        
    }
    async findOne(collectionName, find_params={}){
        try{
            return await this.db.collection(collectionName).findOne(find_params)
        }
        catch(error){
            return error
        }
    }
    async find(collectionName, find_params={}){
        try{
            return await this.db.collection(collectionName).find(find_params).toArray()
        }
        catch(error){
            return error
        }
    }
    async update(collectionName ,find_params={},update_params={}){
        try{
            await this.db.collection(collectionName).updateOne(find_params,{"$set":update_params});
            return true
        }
        catch(error){
            return error
        }
    }
    async insert(collectionName ,document){
        try{
            return await this.db.collection(collectionName).insert(document,{w:1});
        }
        catch(error){
            return error
        }
    }
    async upsert(collectionName ,find_params={},update_params={}){
        try{
            return await this.db.collection(collectionName).update(find_params,{"$set":update_params},{upsert:true});
        }
        catch(error){
            return error
        }
    }
}

module.exports = MongoConnector;
