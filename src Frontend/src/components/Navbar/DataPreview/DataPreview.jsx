import React from 'react';
import s from './DataPreview.module.css';
import { NavLink } from 'react-router-dom';

const DataPreview = (props) => {

  let friendsData = props.friendsPreview.map((el) => {
    return (
      <NavLink className={s.item} to={`/users/${el.id}`} activeClassName={s.active}>
        <div className={s.ava}><img src={`images/avatar${el.id}.jpg`} alt="avatar" /></div>
      </NavLink>
    )
  })

  return (
    <div>
      <div className={s.block}>
        <p className={s.previewBlock}>Last texts</p>
        <div className={s.friends}>
          {/* {friendsData} */}
        </div>
      </div>
    </div>


  )
}

export default DataPreview