import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";


const Usuarios = {

    entradas:async (parent, args, ctx, info)=>{

      const name= parent.name;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("usuarios");
      const existe = await col.findOne({name:name});

      if(existe){
        const col = d.col("entradas");
        const resultados = await col.find({"idUsuario": existe._id}).toArray(); 
        if(resultados) return resultados;
      }
    },

}
export {usuarios as default}