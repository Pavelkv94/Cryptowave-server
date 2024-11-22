import { monitorPrice } from "./bot/monitorPrice";
import { runBot } from "./bot/runBot";
import { db } from "./db/db";
import { initApp } from "./initApp";

const app = initApp();

const url = process.env.DB_URL || "mongodb://0.0.0.0:27017";

db.connect(url);

runBot();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log("...server started in port " + PORT);
});

setInterval(() => monitorPrice(), 3600 * 1000);
