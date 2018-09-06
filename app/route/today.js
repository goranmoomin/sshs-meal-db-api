const fsPromises = require("fs").promises;
const assert = require("assert");

module.exports = async ctx => {
    const tmpdate = new Date();
    const date = new Date(tmpdate.getTime() + tmpdate.getTimezoneOffset() * 60000 + 9 * 3600000);
    const datestr = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0");
    let data;
    try {
        data = JSON.parse(await fsPromises.readFile("." + datestr, "utf-8"));
    } catch(e) {
        const MongoClient = ctx.MongoClient;
        const client = await MongoClient.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PW + "@ds145562.mlab.com:45562/sshs-meal-api");
        const db = client.db("sshs-meal-api");
        const collection = db.collection(datestr);

        data = await collection.find().toArray();
        fsPromises.writeFile("." + datestr, JSON.stringify(data));
    }

    ctx.body = {
        status: "success",
        message: data.find(o => o.date === date.getDate())
    };
};
