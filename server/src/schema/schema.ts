import { gql } from 'apollo-server'

const typeDef = gql`
    type User {
        id: ID!
        username: String!
        votedMovies: [String]!
    }
    
    type Movie {
        id: ID!
        name: String!
        duration: Int!
        actors: [String]!
        release: String!
        rating: Int
    }
    
    input MovieInput {
        name: String!
        duration: Int!
        actors: [String]!
        release: String!
        rating: Int
    }
    
    type Query {
        currentUser: User!
        movies: [Movie]
    }

    type LoginResponse {
        token: String
        user: User
        votedMovies: [String]
    }

    type Mutation {
        register(username: String!, password: String!): User!
        login(username: String!, password: String!): LoginResponse!
        deleteMovie(id: ID!): Boolean
        deleteMovies(ids: [ID]!): Boolean
        addMovie(movieInput: MovieInput): Movie!
        updateMovie(id: ID!, movieInput: MovieInput): Movie!
    }    
`;
export default typeDef;
