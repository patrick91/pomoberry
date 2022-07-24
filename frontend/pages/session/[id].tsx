import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import type { NextPage } from "next";

import dynamic from "next/dynamic";
const Timer = dynamic(
  // @ts-ignore
  () => import("../../components/timer/timer").then((mod) => mod.Timer),
  {
    ssr: false,
  }
);

const Session: NextPage = () => {
  return <Timer />;
};

export default Session;
