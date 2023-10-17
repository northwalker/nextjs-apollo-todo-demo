import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";
import dbConnect from "../lib/dbConnect";
import gql from "graphql-tag";
import { initializeApollo } from "../apollo/client";
import Todos from "../components/Todos";

const READ_TODO = gql`
  query {
    todos {
      _id
      text
      completed
      createdAt
      updatedAt
    }
  }
`;

const Index = () => {
  return (
    <div>
      <Todos />
    </div>
  );
};

export async function getStaticProps() {
  await dbConnect();

  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: READ_TODO,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Index;
