import { currentUser, register, login } from "./auth";
import { addMovie, deleteMovie, deleteMovies, movies, updateMovie } from "./movie";

const resolverMap = {
  Query: {
    currentUser,
    movies
  },
  Mutation: {
    login,
    register,
    addMovie,
    deleteMovie,
    deleteMovies,
    updateMovie
  },
};

export default resolverMap;
