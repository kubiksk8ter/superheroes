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
            superPower: String
       ):Superhero
    }
`;
let idcount = db.superheroes.length;
const resolvers = {
    Query: {
        superheroes: () => db.superheroes
    },
    Mutation: {
        createSuperhero: (parent, args) => {
            const superhero = {
                id: `${1 + idcount}`,
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPower: args.superPower
            };
            db.superheroes.push(superhero);
            return db.superheroes;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);


