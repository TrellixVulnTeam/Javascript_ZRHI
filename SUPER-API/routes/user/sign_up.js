"use strict"
const users = require('../../meta_data/users.js')
const bcrypt = require('bcrypt')

const signUp = (req, res, next) => {
    // TODO: no duplicate users
    const {user, pass} = req.body
    let hash = null

    try {
        hash = bcrypt.hashSync(pass, 10); // TODO: env var here?
    }catch (err){
        console.error(err)
    }
    //TODO DB instead
    users.push({
        user,
        hash
    });
    console.log(users)

    return res.sendStatus(204)
}


module.exports = signUp