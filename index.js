const express = require("express");
const bodyParser = require("body-parser")
const {mongoUrl} = require("./keys")
const app = express()
const mongoose = require("mongoose")

require("./models/User")
const requireToken = require("./middleware/requireToken")

const routes = require("./routes/routes")
app.use(bodyParser.json())
app.use(routes)


mongoose.connect(
        mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex : true,
        useFindAndModify: false
    }
)

    mongoose.connection.on("connected", ()=>{
    console.log("i'm in")
})
mongoose.connection.on("error", (err)=>{
    console.log("i'm not connected ",err)
})


app.get("/", requireToken, (req, res) => {
    res.send("your username is " + req.user.username)
})

app.listen(3300, () => {
    console.log("server is running " + 3300)
})