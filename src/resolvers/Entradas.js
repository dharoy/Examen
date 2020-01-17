import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";

const Entradas = {

    escritor:async (parent, args, ctx, info)=>{
     
      const id= parent.idEscritor;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const resultados = await col.findOne({ _id: ObjectID(id) });

      return resultados;
    },
}
export {Entradas as default}