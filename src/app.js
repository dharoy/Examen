import { MongoClient } from "mongodb";
import { GraphQLServer ,PubSub} from "graphql-yoga";

import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Escritores from './resolvers/Escritores'
import Usuarios from './resolvers/Usuarios'
import Entradas from './resolvers/Entradas'
import Query from './resolvers/Query'
import "babel-polyfill";

const usr = "dharoy";
const pwd = "1qaz2wsx3edc";
const url = "cluster1-sxbet.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const user = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await user.connect();
  return user;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {user: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  const resolvers = {
    Query,
    Mutation,
    Escritores,
    Entradas,
    Subscription
  };

  const server = new GraphQLServer({ 
    typeDefs : './src/schema.graphql',
    resolvers, 
    context
  });

  const options = {
    port: 8000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const user = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    const pubsub = new PubSub();
    runGraphQLServer({ user,pubsub });
  } catch (e) {
    console.log(e);
    user.close();
  }
};
runApp();