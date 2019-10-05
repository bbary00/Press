import React from 'react';
import s from './Footer.module.css';

const Footer = (props) => {
  return (
    <header className="footer">
        <div className={s.logo}>
          <a href="/profile"><img src="./images/logo_new.png" alt="logo" /></a>
        </div>
    </header>
  )
}

export default Footer;