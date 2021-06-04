const { gql } = require('apollo-server');

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

module.exports = typeDefs;