export interface RegisterResponse extends UserInfo {}

export interface LoginResponse {
  token: string;
  votedMovies: string[];
}

export interface UserInfo {
  id: string;
  username: string;
}

export interface MovieInfo {
  id: string;
  name: string;
  duration: number;
  actors: string[];
  release: string;
  rating: number;
}

export interface Context {
  userInfo: UserInfo;
}
