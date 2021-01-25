import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";
import { getUserInfo } from "./auth";
import typeDefs from "./schema";
import resolvers from "./resolvers";

async function start() {
  try {
    await mongoose.connect('mongodb+srv://stas:1logitech1@cluster0-goibx.mongodb.net/movies?retryWrites=true&w=majority', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to DB.");
    const server = await new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        userInfo: getUserInfo(req.headers.authorization || ""),
      }),
    });

    server.listen(4000)
    console.log("GraphQl API running on port 4000.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
