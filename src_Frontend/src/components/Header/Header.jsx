import React from 'react';
import s from './Header.module.scss';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  return (
    <header className="row no-gutters header">
      <div className={s.header__wrapper}>
        <div className="row no-gutters col-6">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5 col-9" >
            <div className={s.logo}>
              <a href="/main"><img src="./images/logo_new.png" alt="logo" /></a>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-8 col-sm-7 col-3">
            <div className={s.sloganBlock}>
              <div className={s.sloganBlock__item}>
                <p style={{ cursor: "default" }}>Process your text and get a <span style={{ fontWeight: '500', color: '#E57900' }}>sense in few seconds</span></p>
                <span className={s.sloganBlock__icon}><i className="fas fa-question-circle"></i></span>
              </div>
            </div>
            {/* <div className={s.menu}>
            <ul>
              <li>
                <NavLink className={`${s.item}`} activeClassName={s.active} to="/dialogs">My data</NavLink>
              </li>
              <li>
                <NavLink className={s.item} activeClassName={s.active} to="/settings">Settings</NavLink>
              </li>
            </ul>
          </div> */}
          </div>
        </div>
        <div className={`row no-gutters col`}>
          <div className={s.authBlock}>
            <NavLink to="/login" activeClassName={s.active}>
              <button style={{ color: "white"}} className="btn btn-sm blue-gradient">Login</button>
            </NavLink>
            <NavLink to="/signup" activeClassName={s.active}>
              <button style={{ color: "black"}} className="btn btn-sm sunny-morning-gradient">Sign Up</button>
            </NavLink>
          </div>

        </div>
      </div>


    </header>
  )
}

export default Header;