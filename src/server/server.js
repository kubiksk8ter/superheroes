const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { bootstrap: bootstrapGlobalAgent } = require('global-agent');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const fs = require ('fs');
const https = require('https');
const http = require('http');

// Setup global support for environment variable based proxy configuration.
// bootstrapGlobalAgent();

//PRISMA
const prisma = new PrismaClient();
async function main() {}
main()
  	.catch(e => {
    	throw e;
  	})
.finally(async () => {
    	await prisma.$disconnect()
});

async function startApolloServer() {
  const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'superheroes.jakubholecek.cz' }, //{ ssl: true, port: 443, hostname: 'jakubholecek.cz' }
    development: { ssl: false, port: 4000, hostname: 'localhost' }
  };


  const environment = process.env.NODE_ENV || 'production' ;
  const config = configurations[environment];

  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context: { prisma }
  }); 
  
  // Create the HTTPS or HTTP server, per configuration
  let httpServer;
  // Make sure these files are secured.
  httpServer = https.createServer(
    {
      key: fs.readFileSync(`/var/www/clients/client0/web12/ssl/superheroes.jakubholecek.cz-le.key`),
      cert: fs.readFileSync(`/var/www/clients/client0/web12/ssl/superheroes.jakubholecek.cz-le.crt`)
    },
  );

  await new Promise(resolve => server.listen({ port: config.port }, resolve));
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`
  );
  return { server };
}

startApolloServer();


/*
NODE_EXTRA_CA_CERTS=/var/www/superheroes.jakubholecek.cz/ssl/ \
GLOBAL_AGENT_HTTP_PROXY=http://89.221.222.81:8000 \
node server.js
*/