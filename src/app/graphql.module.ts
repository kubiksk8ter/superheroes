import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, defaultDataIdFromObject} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

const uri = 'https://superheroes.jakubholecek.cz:2000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache({
        typePolicies: {
            Superhero: {
                fields: {
                    Superhero: {
                        merge: true                        
                    }
                }
            }
        },       
    }),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
