import dbConnect from "../lib/dbConnect";
import gql from "graphql-tag";
import { initializeApollo } from "../apollo/client";
import TodoList from "../components/TodoList";
import Head from "next/head";
import { useEffect } from "react";

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

const init = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: READ_TODO,
  });
};

const IndexPage = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Head>
        <title>Todo Demo</title>
        <meta property="og:title" content="Todo Demo" key="title" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <TodoList />
    </div>
  );
};

export async function getServerSideProps() {
  await dbConnect();

  // const apolloClient = initializeApollo();
  // await apolloClient.query({
  //   query: READ_TODO,
  // });

  // return {
  //   props: {
  //     initialApolloState: apolloClient.cache.extract(),
  //   },
  // };

  return {
    props: {},
  };
}

export default IndexPage;
