import { useState } from "react";
import './login.css'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface ILoginProps {
    actionHandler: Function,
    type: 'Login' | 'Signup'
}

function Login({actionHandler, type}: ILoginProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function clickHandler(event) {
        actionHandler({event, username: email, password })
        setEmail('');
        setPassword('');
    }

    return (
        <div className="login">
            <form>
                <h5>Email</h5>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <h5>Password</h5>
                <InputText
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button
                  className='button-submit'
                  label={type}
                  onClick={(event) => clickHandler(event)}
                />
            </form>
        </div>
    )
}

export default Login;
