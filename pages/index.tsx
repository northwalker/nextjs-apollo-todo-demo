import dbConnect from "../lib/dbConnect";
import { useEffect } from "react";
import gql from "graphql-tag";
import { initializeApollo } from "../apollo/client";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
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
        <meta property="og:title" content="Todo Demo" key="title" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
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
