const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { jwtKey } = require("../keys")
const router = express.Router();
const User = mongoose.model("User");

router.post("/signUp", async (req, res) => {

    const { name, username, password } = req.body

    try {
        const user = new User({ name, username, password })
        await user.save();
        const token = jwt.sign({ userId: user._id }, jwtKey)
        res.send({ token })
    } catch (err) {
        return res.status(422).send(err.message)
    }


})

router.post("/signin", async function (req, res) {
    const {username, password} = req.body
    if(!username || !password) {
        return res.status(422).send({error: "must provide username or password1"})
    }
    const user = await User.findOne({username})
    if (!user) {
        return res.status(422).send({error: "must provide username or password2"})
    }
    try{
        await user.comparePassword(password)
        const token = jwt.sign({ userId: user._id }, jwtKey)
        res.send({ token })
    }catch (err) {
        return res.status(422).send({error: "must provide username or password3"})
    }
})

router.post("/favorites", async function(req, res) {
    const {_id, favoritesIds} = req.body
    const user = await User.findOneAndUpdate(_id, {
        $push: {
            favoritesIds
        }
    })

    res.json(user)
})

router.post("/commitments", async function(req, res) {
    const {_id, commitments} = req.body
    const user = await User.findOneAndUpdate(_id, {
        $push: {
            commitments
        }
    })

    res.json(user)
})

router.get("/findAll", async function(req, res) {
    const user = await User.find()

    res.json(user)
})

router.get("/findUsername/:username", async function(req, res) {
    const username = req.params.username
    const user = await User.findOne({username})

    res.send(res.json(user))
    
})

module.exports = router