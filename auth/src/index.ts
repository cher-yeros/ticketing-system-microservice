import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import cors from "cors";
import http from "http";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import dotenv from "dotenv";
import { Request, Response } from "express";
import schema from "./schema";
import connectDatabase from "./utils/connection";
import { UserAttrs as UserModel } from "./models/user.model";
import { GraphQLError } from "graphql";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

interface MyContext {
  req: Request;
  res: Response;
  // pubSub: PubSub;
  token?: string;
}

var corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

(async () => {
  // const schema4 = await loadMySchemas();

  const server = new ApolloServer<MyContext>({
    schema: schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    formatError: (formattedError, error) => {
      const { message, extensions } = formattedError;

      return { message };
    },
  });

  server.start().then(() => {
    app.use(
      "/graphql",
      [cors<cors.CorsRequest>(corsOptions), json(), cookieParser()],
      expressMiddleware(server, {
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const { token } = req.cookies;

          return { req, res, token };
        },
      })
    );

    new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT }, resolve)
    ).then(() => {
      console.log(
        `\n🚀  Server ready at http://${process.env.MY_NW_IP}:${process.env.PORT}/graphql`
      );

      connectDatabase().then(() => {});
    });
  });
})();

// https://github.com/cher-yeros/e-commerce-product-and-orders.git
// https://github.com/cher-yeros/e-commerce-payment-and-notification.git
