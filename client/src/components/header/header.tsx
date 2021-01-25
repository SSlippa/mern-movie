import './header.css'

import { Menubar } from "primereact/menubar";
import { NavLink } from 'react-router-dom';

interface IMenuProps {
  isLoggedIn: boolean;
  logoutHandler: Function;
}

const Menu = ({isLoggedIn, logoutHandler} : IMenuProps) => {
  let end =
    <div className='nav-buttons'>
      <NavLink className='p-menuitem-link' to='/' exact>
        Login
      </NavLink>
      <NavLink className='p-menuitem-link' to='/signup' exact>
        Signup
      </NavLink>
    </div>

  if (isLoggedIn) {
    end = <NavLink className='p-menuitem-link' to='/' exact onClick={logoutHandler}>
      Logout
    </NavLink>
  }

  return (
    <div>
      <div className="card">
        <Menubar end={end} />
      </div>
    </div>
  );
};

export default Menu;
