const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')

const app = express()

app.use(cors())

function checkToken(req, res) {
  //check if exist a valid token
  res.json({ validToken: true })
}

function getToken(req, res) {
  // Get Access Token from thingiverse
  res.json({ code: req.params.code })
}

app.get('/checkToken', checkToken)
app.get('/getToken/:code', getToken)
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
