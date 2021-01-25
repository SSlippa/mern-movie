import mongoose from "mongoose";

export interface User extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  votedMovies: string[];
}

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    votedMovies: { type: Array, required: true },
  },
  {
    versionKey: false,
  },
);

export const UserModel = mongoose.model<User>("User", UserSchema);
