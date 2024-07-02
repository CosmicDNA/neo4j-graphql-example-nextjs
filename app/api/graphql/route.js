import { gql, ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import neo4j from 'neo4j-driver'
import { Neo4jGraphQL } from '@neo4j/graphql'

const typeDefs = gql`
  type Movie {
    title: String
    actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
  }

  type Actor {
    name: String
    movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
  }
`

const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = process.env

const driver = neo4j.driver(
  // "neo4j://localhost:7687",
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
)

const neoSchema = new Neo4jGraphQL({ typeDefs, driver })

const apolloServer = new ApolloServer({
  schema: await neoSchema.getSchema(),
  playground: true,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
})

const startServer = apolloServer.start()

const handler = async (req, res) => {
  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql'
  })(req, res)
}

export { handler as GET, handler as POST }
