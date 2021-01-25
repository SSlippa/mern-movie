import mongoose from "mongoose";

export interface Movie extends mongoose.Document {
  _id: string;
  name: string;
  duration: number;
  actors: string[];
  release: string;
  rating: number;
  votedIds: string[];
  votedValues: number[];
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    actors: { type: Array, required: true },
    release: { type: Date, required: true },
    rating: { type: Number, required: false },
    votedIds: { type: Array, required: false },
    votedValues: { type: Array, required: false }
  },
  {
    versionKey: false,
  },
);

export const MovieModel = mongoose.model<Movie>("Movie", UserSchema);
