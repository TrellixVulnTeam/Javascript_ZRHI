const express = require('express')
const router = require('./routes/index')

const app = express()

// ENV VARS
require('dotenv').config()

// Hide the fact this is an express server
app.disable('x-powered-by')

//parses incoming requests with JSON payloads
app.use(express.json({ strict: true }))

// Routes
app.use("/app", router)


/* IF REQUESTS FALL THROUGH HERE WE SERVE TWO CUSTOM MESSAGES FOR 404 AND 500 */
// Custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

// Custom 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
})