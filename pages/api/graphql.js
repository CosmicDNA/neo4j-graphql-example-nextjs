// import { ApolloServer } from '@apollo/server'
import { Neo4jGraphQL } from '@neo4j/graphql'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import neo4j from 'neo4j-driver'
import { ApolloServer } from '@apollo/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8').toString()

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

const server = new ApolloServer({
  schema: await neoSchema.getSchema()
})

export default startServerAndCreateNextHandler(server)
