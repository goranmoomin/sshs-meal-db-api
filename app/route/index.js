const Router = require("koa-router");
const router = new Router();

router.get("/", require("./today.js"));

module.exports = router;
