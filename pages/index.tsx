import dbConnect from "../lib/dbConnect";
import { useEffect } from "react";
import gql from "graphql-tag";
import { initializeApollo } from "../apollo/client";
import Head from "next/head";
import TodoList from "../components/TodoList";

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

const fetchData = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: READ_TODO,
  });
};

const IndexPage = () => {
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Todo Demo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:title" content="Todo Demo" key="title" />
        <meta
          property="og:description"
          content="TODO CRUD demo with Typescript Nextjs, Apollo GraphQL, mongoose MongoDB and material UI design library MUI."
        />
        <meta name="title" content="Todo Demo" />
        <meta
          name="description"
          content="TODO CRUD demo with Typescript Nextjs, Apollo GraphQL, mongoose MongoDB and material UI design library MUI."
        />
      </Head>
      <TodoList />
    </div>
  );
};

export async function getStaticProps() {
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
