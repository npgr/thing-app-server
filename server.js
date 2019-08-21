const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const axios = require('axios')

//global.token = ''
let token = ''
const schema = require('./schema')

const app = express()

app.use(cors())

function validToken(req, res) {
  //check if exist a valid token
  console.log('GET /validToken')
  //temporary
  return res.json({ validToken: true })
  if (!token) return res.json({ validToken: false, empty: true })
  axios
    .post('https://www.thingiverse.com/login/oauth/tokeninfo', {
      access_token: process.env.THINGVERSE_KEY
    })
    .then(response => {
      response && response.data && console.log('response data: ', response.data)
      const validToken = !!response.data && !response.data.error
      if (!validToken) token = ''
      res.json({ validToken })
    })
    .catch(error => {
      console.log('error: ', error)
      token = ''
      res.json({ validToken: false, error: true })
    })
}

function getToken(req, res) {
  // Get Access Token from thingiverse
  const code = req.params.code
  console.log(`GET /getToken/${code}`)
  axios
    .post('https://www.thingiverse.com/login/oauth/access_token', {
      client_id: 'f7c393852e48395078be',
      client_secret: '485ebf2a42de1169b1b0d8f066f90bda',
      code
    })
    .then(response => {
      console.log('reponse body: ', response.body)
      try {
        token = response.body.split('&')[0].split('=')[1]
        console.log('token: ', token)
        res.json({ token: true })
      } catch (err) {
        console.log('error: unexpected response')
        res.json({
          error: 'unexpected response'
        })
      }
    })
    .catch(error => {
      const errorText = `${error.response.status} ${error.response.statusText}`
      console.log('error: ', errorText)
      res.json({
        error: errorText
      })
    })
}

app.get('/validToken', validToken)
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
