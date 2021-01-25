import { Movie, MovieModel, UserModel } from "../models";
import { Context, MovieInfo } from "../types";

export async function movies(): Promise<Movie[]> {
  const movies = await MovieModel.find();
  return movies;
}

export async function addMovie(_: void, args: any): Promise<MovieInfo> {
  const { name, duration, release, actors, rating } = args.movieInput
  const movie = new MovieModel({
    name,
    duration,
    release,
    actors,
    rating
  });
  await movie.save();

  return {
    id: movie._id,
    name: movie.name,
    release: movie.release,
    rating: movie.rating,
    actors: movie.actors,
    duration: movie.duration
  };
}

export async function updateMovie(_: void, { id, movieInput }: any, ctx: Context): Promise<MovieInfo> {
  const { name, duration, release, actors, rating } = movieInput
  const userId = ctx.userInfo.id;
  const movie = await MovieModel.findById(id)!
  if (!movie) {
    throw new Error("No movie found!!");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found!!");
  }
  user.votedMovies.push(movie._id);
  await user.save();

  if (!movie.votedIds.includes(userId)) {
    movie.votedIds.push(user.id);
  }

  movie.votedValues.push(rating);
  const votesSum = movie.votedValues.reduce((acc, val) => { return acc + val}, 0)
  const avgRating = votesSum / movie.votedIds.length;

  movie.name = name
  movie.duration = duration
  movie.release = release
  movie.actors = actors
  movie.rating = avgRating

  await movie.save();

  return {
    id: movie._id,
    name: movie.name,
    release: movie.release,
    rating:  movie.rating,
    actors: movie.actors,
    duration: movie.duration,
  };
}

export async function deleteMovie(_: void, args: any, ctx: Context): Promise<boolean> {
  const { id } = args;
  const userId = ctx.userInfo.id;

  const movie = await MovieModel.findById(id);
  if (!movie) {
    throw new Error("No movie found!!");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found!!");
  }
  const index = user.votedMovies.findIndex(id => id === movie._id);
  user.votedMovies.splice(index, 1);
  await user.save();

  await MovieModel.findByIdAndRemove(id);
  return true;
}

export async function deleteMovies(_: void, args: any, ctx: Context): Promise<boolean> {
  const { ids } = args;
  const userId = ctx.userInfo.id;
  const splittedIds = ids[0].split(',');

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found!!");
  }
  user.votedMovies = user.votedMovies.filter( ( el ) => !splittedIds.includes( el ) );
  await user.save();


  await MovieModel.deleteMany({ _id: { $in: splittedIds}} );
  return true;
}
