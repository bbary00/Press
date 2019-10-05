import React from 'react';
import s from './Header.module.css';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  return (
    <header className="header">
      <div className="row no-gutters">
        <div className="col-2">
          <div className={s.logo_container}>
            <div className={s.logo}>
              <a href="/main"><img src="./images/logo_new.png" alt="logo" /></a>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className={s.menu}>
            <ul>
              <li>
                <NavLink className={s.item} activeClassName={s.active} to="/main">Check text</NavLink>
              </li>
              <li>
                <NavLink className={`${s.item}`} activeClassName={s.active} to="/dialogs">My data</NavLink>
              </li>
              <li>
                <NavLink className={s.item} activeClassName={s.active} to="/settings">Settings</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-4">

        </div>
      </div>


    </header>
  )
}

export default Header;