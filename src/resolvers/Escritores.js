import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";


const Escritores = {

    entradas:async (parent, args, ctx, info)=>{

      const name= parent.name;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const existe = await col.findOne({name:name});

      if(existe){
        const col = d.col("entradas");
        const resultados = await col.find({"idEscritor": existe._id}).toArray(); 
        if(resultados) return resultados;
      }
    },

}
export {escritores as default}