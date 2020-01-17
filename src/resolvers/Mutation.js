import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";


const Mutation = {

    addEscritor:async (parent, args, ctx, info) => {  
      const { name,pass } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const users = await col.findOne({name:name});

      if(!users){
        const token = uuid.v4();
        const resultados = await col.insertOne({name,pass,token});

        return {
          name,            
          pass,
          token,
          _id:resultados.ops[0]._id
        };
      }
    },

    addUsuario:async (parent, args, ctx, info) => {  
      const { name,pass } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("usuarios");
      const users = await col.findOne({name:name});

      if(!users){
        const token = uuid.v4();
        const resultados = await col.insertOne({name,pass,token});

        return {
          name,            
          pass,
          token,
          _id:resultados.ops[0]._id
        };
      }
    },

    publicarEntradantrada:async (parent, args, ctx, info) => {  
      const { name,token,date,titulo,contenido } = args;
      const { user,pubsub } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const users = await col.findOne({name:name,token:token});

      if(users){
        const col = d.col("entradas");
        const idEscritor = users._id;
        const resultados = await col.insertOne({idEscritor,date,titulo,contenido});

        pubsub.publish(
          idEscritor,
          {
            tellEscritor: {
              idEscritor,            
              date,
              titulo,
              contenido,
              _id:resultados.ops[0]._id

            }
          }
        );

        pubsub.publish(
          titulo,
          {
            tellEntradatitulo: {
              idEscritor,            
              date,
              titulo,
              contenido,
              _id:resultados.ops[0]._id

            }
          }
        );
        
        return {
          idEscritor,            
          date,
          titulo,
          contenido,
          _id:resultados.ops[0]._id
        };

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },

    login:async (parent, args, ctx, info) => {
      const { name,pass } = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const cole = d.cole("usuarios");
      let users = await col.findOne({name:name,pass:pass});
      let users = await cole.findOne({name:name,pass:pass});

      if(users){
        await col.updateOne({"name": name }, { $set: { "token": uuid.v4() }});
        users = await col.findOne({name:name,pass:pass});
 
        return users;

      }else if(users){
        await cole.updateOne({"name": name }, { $set: { "token": uuid.v4() }});
        users = await cole.findOne({name:name,pass:pass});

        return users;

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },

    logout:async (parent, args, ctx, info) => {
      const { name,token} = args;
      const { user } = ctx;
      const d = user.d("B2");
      const col = d.col("escritores");
      const cole = d.col("usuarios");
      let users = await col.findOne({name:name,token:token});
      let users = await cole.findOne({name:name,token:token});

      if(users){
        await col.updateOne({"name": name }, { $set: { "token": null}});
        users = await col.findOne({name:name});
        
        return users;

      }else if(users){
        await cole.updateOne({"name": name }, { $set: { "token": null}});
        users = await cole.findOne({name:name});
        
        return users;

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },

    quitarEscritor:async (parent, args, ctx, info) => {
      const { name,token } = args;
      const { user } = ctx;
      const d = user.d("B2");
      let col = d.col("escritores");
      const users = await col.findOne({name:name,token:token});

      if(users){
        const id = users._id;
        await col.deleteOne({name:{$eq:name}}); 

        col = d.col("entradas");
        await col.remove({idEscritor:{$eq:id}},false);

        return users.name + " ha sido eliminado";

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },

    quitarUsuario:async (parent, args, ctx, info) => {
      const { name,token } = args;
      const { user } = ctx;
      const d = user.d("B2");
      let col = d.col("usuarios");
      const users = await col.findOne({name:name,token:token});

      if(users){
        const id = users._id;
        await col.deleteOne({name:{$eq:name}}); 

        col = d.col("entradas");
        await col.remove({idUsuario:{$eq:id}},false);

        return users.name + " ha sido eliminado";

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },

    quitarEntrada:async (parent, args, ctx, info) => {  
      const { name,token,id} = args;
      const { user } = ctx;
      const d = user.d("B2");
      let col = d.col("escritores");
      const users = await col.findOne({name:name,token:token});

      if(users){
        let col = d.col("entradas");
        await col.deleteOne({_id:{$eq:ObjectID(id)}});

        return "se ha eliminado la factura.";

      }else{
        throw new Error('No se puede encontrar el usuario.');
      }
    },
}
export {Mutation as default}