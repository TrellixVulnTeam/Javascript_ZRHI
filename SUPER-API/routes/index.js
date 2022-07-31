const metrics = require('./metrics/index')
const users = require('./user/index')
const router = require('express').Router()

const checkToken = () => {
    return true
}
// Middleware
router.use("/health", (req, res, next) => {
    console.log("middleWARE BOI!!!")
    next()
})

// User routes
router.post("/sign-up", users.signUp)
router.post("/login", users.login)


// TODO add other routes for app metrics maybe?
router.get('/health', metrics.health)

module.exports = router