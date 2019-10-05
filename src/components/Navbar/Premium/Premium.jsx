import React from 'react';
import s from './Premium.module.css';

const Premium = (props) => {
  return (
    <a href="#s" className={s.block}>
      <p className={s.invite}>Get<br></br> Premium</p>
      <img src="images/plus-flat3.png" alt="invite"></img>
    </a>
  )
}

export default Premium