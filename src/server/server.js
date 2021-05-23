const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require ('fs');
const db = require('./db');
 
const typeDefs = gql`
    type Query {
        superheroes:[Superhero]
        superhero(id:ID):Superhero
    }
    type Superhero {
       id: ID!,
       firstName: String,
       lastName: String,
       superheroName: String,
       dateOfBirth: String,
       superPowers: String
    }
    type Mutation {
       createSuperhero(
            firstName: String,
            lastName: String,
            superheroName: String,
            dateOfBirth: String,
            superPowers: String
       ):Superhero
       deleteSuperhero (id:ID!): Superhero
    }
`;
let idcount = db.superheroes.length;
const resolvers = {
    Query: {
        superheroes: () => db.superheroes
    },
    Mutation: {
        createSuperhero: (parent, args) => {
            let ID = parseInt(1 + idcount++);
            const superhero = {
                id: ID,
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPowers: args.superPowers
            };
            db.superheroes.push(superhero);
            return db.superheroes;
        },
        deleteSuperhero: (parent,{id}) => {
            let ID = parseInt(id);
            db.superheroes = db.superheroes.filter((Superhero) => Superhero.id !== ID);
            return id;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);


