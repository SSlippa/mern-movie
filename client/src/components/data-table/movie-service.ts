export interface Movie {
  id: string;
  name: string;
  release: Date;
  duration: number;
  actors: string[];
  rating: number;
}


export default class MovieService {
  graphqlURL = 'http://localhost:4000/';
  fetchOptions = {
    method: "POST",
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      "Content-Type": "application/json",
    }
  }

  getMovies(): Promise<any> {
    const query = {
      query: `
        query {
          movies {
            id
            name
            duration
            actors
            release
            rating
           }
        }
      `
    }
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then(res => {
      return res.json();
    });
  }

  createMovie(movie: Movie) {
    const query = {
      query: `
        mutation CreateNewMovie($name: String!, $release: String!, $duration: Int!, $actors: [String]!, $rating: Int) {
          addMovie(movieInput: {name: $name, release: $release, duration: $duration, actors: $actors, rating: $rating}) {
            id
            name
            duration
            actors
            release
            rating
          }
        }
      `,
      variables: {
        name: movie.name,
        release: movie.release.toDateString(),
        duration: movie.duration,
        actors: movie.actors,
        rating: movie.rating,
      }
    }
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then((res) => {
      return res.json();
    });
  }

  deleteMovie(movieId: string) {
    const query = {
      query: `
        mutation {
          deleteMovie(id: "${movieId}")
        }
      `
    };
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then((res) => {
      return res.json();
    });
  }

  deleteMovies(ids: string[]) {
    const query = {
      query: `
        mutation {
          deleteMovies(ids: "${ids}")
        }
      `
    };
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then((res) => {
      return res.json();
    });
  }

  updateMovie(movie: Movie) {
    const query = {
      query: `
        mutation EditMovie($id: ID!, $name: String!, $release: String!, $duration: Int!, $actors: [String]!, $rating: Int) {
          updateMovie(id: $id, movieInput: {name: $name, release: $release, duration: $duration, actors: $actors, rating: $rating}) {
            id
            name
            duration
            actors
            release
            rating
          }
        }
      `,
      variables: {
        id: movie.id,
        name: movie.name,
        release: movie.release,
        duration: movie.duration,
        actors: movie.actors,
        rating: movie.rating,
      }
    }
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then((res) => {
      return res.json();
    });
  }

}
