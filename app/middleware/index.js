const MongoClient = require("mongodb").MongoClient;

module.exports = {
    mongoClientAsContext: async (ctx, next) => {
        ctx.MongoClient = MongoClient;
        await next();
    }
};
