const thingiverse = require('thingiverse-js')
const axios = require('axios')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList
} = require('graphql')

// I use the App Token instead the bearer Token because
// Thingiverse still not approve this app for Oauth

// The best practice for using App token is the commented line code Below ,
// instead of I put directly the value for facilitate your tests
// const token = process.env.THINGVERSE_KEY
const token = 'ed930400a63c5ebf73e24ff8050790bb'

const checkValidToken = () =>
  axios
    .get('http://localhost:5000/validToken')
    .then(res => res.data.validToken || false)
    .catch(error => {
      console.log('error: ', error)
      return false
    })

//The function below is in case whe have Oauth Bearer Token, Not possible for now
const loadThingsV2 = (method, url) => {
  axios({
    method,
    url,
    // token for this case is a global var
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => res.body)
    .catch(error => {
      console.log('error: ', error)
      return false
    })
}

const loadThings = url => {
  if (!token) return []
  return thingiverse(url, { token })
    .then(res => res.body)
    .catch(err => {
      console.log(err)
      console.log(thingiverse.getError(err.response))
      return []
    })
}

const ThingType = new GraphQLObjectType({
  name: 'Thing',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    public_url: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    creator: { type: CreatorType },
    is_private: { type: GraphQLBoolean },
    is_purchased: { type: GraphQLBoolean },
    is_published: { type: GraphQLBoolean },
    // detail fields
    description: { type: GraphQLString },
    license: { type: GraphQLString },
    added: { type: GraphQLString },
    modified: { type: GraphQLString },
    default_image: { type: ImageType }
  })
})

const CreatorType = new GraphQLObjectType({
  name: 'Creator',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    url: { type: GraphQLString },
    public_url: { type: GraphQLString },
    thumbnail: { type: GraphQLString }
  })
})

const ImageType = new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    id: { type: GraphQLInt },
    url: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    validToken: {
      type: GraphQLBoolean,
      resolve(parent, args) {
        return checkValidToken()
      }
    },
    popular: {
      type: GraphQLList(ThingType),
      resolve(parent, args) {
        return loadThings('popular')
      }
    },
    newest: {
      type: GraphQLList(ThingType),
      resolve(parent, args) {
        return loadThings('newest')
      }
    },
    featured: {
      type: GraphQLList(ThingType),
      resolve(parent, args) {
        return loadThings('featured')
      }
    },
    thing: {
      type: ThingType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return loadThings(`things/${args.id}`)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
