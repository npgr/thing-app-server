const thingiverse = require('thingiverse-js')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList
} = require('graphql')

const token = process.env.THINGVERSE_KEY

const loadThings = type =>
  thingiverse(type, { token })
    .then(res => res.body)
    .catch(err => {
      console.log(err)
      console.log(thingiverse.getError(err.response))
    })

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
    license: { type: GraphQLString }
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
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
