import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  split,
  useSubscription,
} from "@apollo/client";
import type { NextPage } from "next";
import { useCountdown } from "../../hooks/use-countdown";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8000/graphql",
  })
);

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink!,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const TIMER_SUBSCRIPTION = gql`
  subscription {
    timerUpdated
  }
`;

const TimerSubscription = ({}) => {
  const { data, loading } = useSubscription(TIMER_SUBSCRIPTION, {});
  return (
    <h1 className="text-7xl font-bold underline tabular-nums">
      {!loading && data.timerUpdated}
    </h1>
  );
};

export const Timer = () => {
  return (
    <ApolloProvider client={client}>
      <div className="w-screen h-screen bg-amber-200 flex justify-center items-center">
        <TimerSubscription />
      </div>
    </ApolloProvider>
  );
};
