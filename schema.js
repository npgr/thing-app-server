const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = require('graphql')

const ThingType = new GraphQLObjectType({
  name: 'Thing',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString }
  })
})

module.exports = new GraphQLSchema()
