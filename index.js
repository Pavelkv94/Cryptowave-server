const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const authRouter = require('./auth/authRouter')
const transactionsRouter = require('./transactions/transactionsRouter')

require('dotenv').config()

const PORT = process.env.PORT || 5000;
// const url = "mongodb://127.0.0.1/orcusDataBase"; //For local
const url = `mongodb+srv://${process.env.DB_OWNER}:${process.env.DB_PASS}@clusterfortgbot.hi5sp.mongodb.net/Cryptowave?retryWrites=true&w=majority`
// Установим подключение по умолчанию
mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.log(err);
    });

// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;

// Получение подключения по умолчанию
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const server = express();

server.use(cors({ origin: "*" })); //!------CORS DANGER

server.use(express.json());
server.use(Router);
server.use(authRouter)
server.use(transactionsRouter)

server.use(
    express.static("public", {
        setHeaders: function setHeaders(res, path, stat) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type");
        },
    })
);

const start = async () => {
    try {
        await mongoose.connect(url);
        server.listen(PORT, () =>
            console.log(`Server is running at port ${PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();