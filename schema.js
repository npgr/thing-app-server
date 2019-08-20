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

//const token = process.env.THINGVERSE_KEY

const checkValidToken = () =>
  axios
    .get('/validToken')
    .then(response => {
      return response.validToken || false
    })
    .catch(error => {
      return false
    })

const loadThings = type => {
  if (!token) return []
  return thingiverse(type, { token })
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
