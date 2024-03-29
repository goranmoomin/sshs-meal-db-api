const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const Koa = require("koa");
const responseTime = require("koa-response-time");
const router = require("./route/index.js");
const cors = require("koa-cors");
const middleware = require("./middleware/index.js");

const app = new Koa();
const PORT = process.env.PORT || 8000;

app.use(responseTime()).use(cors()).use(middleware.mongoClientAsContext).use(async (ctx, next) => {
    await next();
}).use(router.routes()).use(router.allowedMethods());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
