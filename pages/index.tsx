import gql from "graphql-tag";
import { initializeApollo } from "../apollo/client";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";
import Todos from "../components/Todos";

const TodoQuery = gql`
  query {
    todos {
      _id
      text
      status
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

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: TodoQuery,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

export default Index;
