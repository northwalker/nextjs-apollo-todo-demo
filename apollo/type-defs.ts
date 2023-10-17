import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Todo {
    _id: ID!
    text: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    todos: [Todo]
    todo(_id: ID!): Todo
  }

  type Mutation {
    createTodo(text: String!, completed: Boolean!): Todo
    updateTodo(_id: ID!, text: String, completed: Boolean): Todo
    deleteTodo(_id: ID!): Boolean
  }
`;
