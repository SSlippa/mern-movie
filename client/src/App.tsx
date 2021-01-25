import { FC, useRef, useState } from "react";
import "./App.css";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import Menu from "./components/header/header";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import LoginService from "./components/login/login.service";
import { Toast } from "primereact/toast";

const App: FC = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [votedMovies, setVotedMovies] = useState<string[]>([])

  const history = useHistory();
  const toast = useRef<Toast>(null);

  const loginService = new LoginService();

  function setLoginState(state: boolean) {
    setLoggedIn(state);
  }

  function loginHandler({ event, username, password }) {
    event.preventDefault();
    loginService.userLogin(username, password).then(data => {
      if (!data.errors) {
        localStorage.setItem('token', data.data.login.token)
        setVotedMovies(data.data.login.votedMovies);
        setLoginState(true);
      }
      else {
        const errMessage = data.errors[0]?.message;
        toast.current.show({ severity: 'error', summary: 'Unsuccessful', detail: errMessage, life: 3000 });
      }
    })
  }

  function signupHandler({ event, username, password }) {
    event.preventDefault();
    loginService.userSignup(username, password).then(data => {
      if (!data.errors) {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User created', life: 3000 });
        history.push('/');
      }
      else {
        const errMessage = data.errors[0]?.message;
        toast.current.show({ severity: 'error', summary: 'Unsuccessful', detail: errMessage, life: 3000 });
      }
    })
  }

  function logoutHandler() {
    setLoginState(false);
  }

  let routes = (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <Login actionHandler={loginHandler} type='Login' />
        )}
      />
      <Route
        path="/signup"
        exact
        render={() => (
          <Login actionHandler={signupHandler} type='Signup' />
        )}
      />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <div className='App'>
      <Toast ref={toast} />
      <Menu isLoggedIn={isLoggedIn} logoutHandler={logoutHandler}/>
      <main className='main'>
        {isLoggedIn ? <Dashboard votedM={votedMovies}/> : routes}
      </main>
    </div>
  );
};

export default App;
