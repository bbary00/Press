import React from 'react';
import s from './Navbar.module.css';
import Invite from './Premium/Premium';
import DataPreview from './DataPreview/DataPreview';
import {NavLink} from 'react-router-dom';

const Navbar = (props) => {
  return (
    <nav className={s.nav}>
      <div className={s.menu}>
        <ul>
          <li>
            <NavLink className={s.item} activeClassName={s.active} to="/main">Check text</NavLink>
          </li>
          <li>
            <NavLink className={`${s.item}`} activeClassName={s.active} to="/dialogs">My data</NavLink>
          </li>
          {/* <li>
            <NavLink className={s.item} activeClassName={s.active} to="/news">Settings</NavLink>
          </li>
          <li>
            <NavLink className={s.item} activeClassName={s.active} to="/music">Music</NavLink>
          </li> */}
          <li>
            <NavLink className={s.item} activeClassName={s.active} to="/settings">Settings</NavLink>
          </li>
        </ul>
      </div>
      <DataPreview friendsPreview={props.friendsPreview}/>
      <Invite />
     
    </nav>
  )
}

export default Navbar