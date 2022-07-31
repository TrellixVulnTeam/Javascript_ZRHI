const users = require('./user/index')
const router = require('express').Router()

const checkToken = () => {
    return true
}
// Middleware
router.use("/", (req, res, next) => {
    console.log("middleWARE BOI!!!")
    next()
})

// User routes
router.post("/sign-up", users.signUp)
router.post("/login", users.login)



module.exports = router