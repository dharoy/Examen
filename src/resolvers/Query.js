import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";


const Query = {

    getEscritor:async (parent, args, ctx, info) => {  
      const { name } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const users = await col.findOne({name:name});

      if(users){ return users 
     
      }else{
       throw new Error( name + ' no se puede encontrar.');
      }
    },

    getUsuario:async (parent, args, ctx, info) => {  
      const { name } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("usuario");
      const users = await col.findOne({name:name});

      if(users){ return users 
     
      }else{
       throw new Error( name + ' no se puede encontrar.');
      }
    },

    getEntradas:async (parent, args, ctx, info) => { 
      const { name } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const users = await col.findOne({name:name});

      if(users){
        const col = d.col("entradas");
        const resultados = await col.find({"idEscritor": users._id}).toArray(); 

        return resultados;

      }else{
        throw new Error( name + ' no se puede encontrar.');
      }
    },      
}
export {Query as default}