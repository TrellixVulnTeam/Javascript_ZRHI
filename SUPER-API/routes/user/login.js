"use strict"
const users = require('../../meta_data/users.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fs = require('fs');


// TODO: Doesn't work??
const {
    PRIVATE_KEY,
    PRIVATE_KEY_ALGORITHM
} = process.env

const login = async (req, res) => {
    const {user, pass} = req.body
    const userExists = users.find((u) => u.user === user)

    if(!userExists){
        return res.status(400).json({message: "Wrong username or password."})
    }

    // Check hash
    let check = bcrypt.compareSync(pass, userExists.hash);


    if(!check) return res.status(400).json(
        {
            message: "Wrong username or password"
        })
    
    let token;
    var privateKey = fs.readFileSync("private-key.pem", 'utf8');

    //TODO: check other optons got jwt token
    const jwtOptions = {
        issuer: "super-api",
        subject: `${userExists.user}`,
        audience: "[all]",
        algorithm: 'RS256',
        expiresIn: "7d"

    }

    const jwtPayload = {
        user: userExists.user,
    }

    try {
        token = await jwt.sign(jwtPayload, privateKey, jwtOptions);
        console.log(token)
    } catch (error){
        console.error(error)
    }

    console.log("TOKEN/", token)

    let pubKey = fs.readFileSync('public-key.pem', 'utf8')


    try {
        var decoded = jwt.verify(token, pubKey);
        console.log(decoded)
    } catch (error){
        console.error(error)
    }

    return  res.status(200).json({message: "Login successful.", token})
}

module.exports = login