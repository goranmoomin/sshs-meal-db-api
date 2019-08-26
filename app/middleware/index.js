const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PW + "@ds145562.mlab.com:45562/sshs-meal-api";

let client = null;

module.exports = {
    mongoClientAsContext: async (ctx, next) => {
        if(!client || !client.isConnected()) {
            client = await MongoClient.connect(url);
        }

        ctx.state.client = client;
        await next();
    }
};
