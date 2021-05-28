const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require ('fs');
//PRISMA
const prisma = new PrismaClient();
async function main() {
    /*
  	const allSuperheroes = await prisma.superhero.findMany()
	const newSuperhero = await prisma.superhero.create({
      		data: {
         		firstName: 'Kuba',
          		lastName: 'Kubikula',
          		superheroName: 'Kubulus',
          		dateOfBirth: '11.12.1986',
          		superPowers: 'xxx'
      		}
  	});
  	console.log(allSuperheroes);
     */}
main()
  	.catch(e => {
    	throw e;
  	})
.finally(async () => {
    	await prisma.$disconnect()
});

const typeDefs = gql`
    type Query {
        superheroes:[Superhero]
        superhero(id:ID):Superhero
    }
    type Superhero {
       id:ID!
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
       updateSuperhero (
            id: ID!,
            firstName: String,
            lastName: String,
            superheroName: String,
            dateOfBirth: String,
            superPowers: String,            
       ): Superhero
    }
`;
const resolvers = {
    Query: {
        //info: () => 'This is the API of a Superheroes UX',
        superheroes: async (parent, args, context) => {
            return context.prisma.superhero.findMany();
        }
    },
    Mutation: {
        createSuperhero: (parent, args, context, info) => {
            const newSuperhero = context.prisma.superhero.create({
                data: {
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPowers: args.superPowers
                }
                });  
            return newSuperhero;
        },
        deleteSuperhero: (parent,{id}, context, info) => {
            let ID = parseInt(id);
            const superhero = context.prisma.superhero.delete({
                where: { id:ID }
            });
            return superhero;
        },
        updateSuperhero: (parent, args, context, info) => {
            let ID = parseInt(args.id);
            const superhero = context.prisma.superhero.update({
                where: { id: ID },
                data: {
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPowers: args.superPowers 
                }
            });
            return superhero;
        }            
    }       
};

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context: {
    prisma
  }
});
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);


