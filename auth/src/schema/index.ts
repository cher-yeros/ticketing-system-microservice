import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLScalarType, Kind } from "graphql";
import { merge } from "lodash";
import { authResolvers, authSchema } from "./auth";

const dateScalar = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime();
      }
      throw Error("GraphQL Date Scalar serializer expected a `Date` object");
    },
    parseValue(value) {
      if (typeof value === "number") {
        return new Date(value);
      }
      throw new Error("GraphQL Date Scalar parser expected a `number`");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
};

const baseSchema = `#graphql
    scalar Date
    scalar JSON

    type Query {
        _ : Boolean
    }

    type Mutation {
        _ : Boolean
    }

    type Subscription {
        _ : Boolean
    }

`;

const schema = makeExecutableSchema({
  typeDefs: [baseSchema, authSchema],
  resolvers: merge(dateScalar, authResolvers),
});

export default schema;
