
export default class LoginService {
  graphqlURL = 'http://localhost:4000/';
  fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }

  userSignup(username: string, password: string): Promise<any> {
    const query = {
      query: `
        mutation CreateNewUser($username: String!, $password: String!) {
          register(username: $username, password: $password) {
            id
            username
          }
        }
      `,
      variables: {
        username,
        password
      }
    }

    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then(res => {
      return res.json();
    });
  }

  userLogin(username: string, password: string): Promise<any> {
    const query = {
      query: `
        mutation LoginUser($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            votedMovies
          }
        }
      `,
      variables: {
        username,
        password
      }
    }
    return fetch(this.graphqlURL, {...this.fetchOptions, body: JSON.stringify(query)}).then(res => {
      return res.json();
    });
  }
}
