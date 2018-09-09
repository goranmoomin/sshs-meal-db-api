const fsPromises = require("fs").promises;
const assert = require("assert");
const fetch = require("node-fetch");

module.exports = async ctx => {
    const tmpdate = new Date();
    const date = new Date(tmpdate.getTime() + tmpdate.getTimezoneOffset() * 60000 + 9 * 3600000);
    const datestr = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0");
    const url = "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PW + "@ds145562.mlab.com:45562/sshs-meal-api";
    let data;
    try {
        data = JSON.parse(await fsPromises.readFile("." + datestr, "utf-8"));
    } catch(e) {
        const MongoClient = ctx.MongoClient;
        const client = await MongoClient.connect(url);
        const db = client.db("sshs-meal-api");
        const collection = db.collection(datestr);

        data = await collection.find().toArray();
        if(data.length != 0) {
            fsPromises.writeFile("." + datestr, JSON.stringify(data));
        } else {
            const res = await fetch("https://sshs-meal-api.now.sh/");
            const monthlyData = await res.json();
            collection.insertMany(data = monthlyData.message);
        }
        client.close();
    }

    ctx.body = {
        status: "success",
        message: data.find(o => o.date === date.getDate())
    };
};
