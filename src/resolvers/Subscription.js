import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";


const Subscription = {

    tellEscritor:{

      suscribirse: async (parent, args, ctx, info) => {
          const {id} = args;
          const {pubsub} = ctx;
          
          return pubsub.asyncIterator(id);
      }
  },

  tellEntradaTitulo:{

    suscribirse: async (parent, args, ctx, info) => {
      const {titulo} = args;
      const {pubsub} = ctx;
      
      return pubsub.asyncIterator(titulo);
  }
  },
}
export {Subscription as default}