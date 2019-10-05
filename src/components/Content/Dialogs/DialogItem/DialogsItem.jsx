import React from 'react';
import s from './../Dialogs.module.css';
import { NavLink } from 'react-router-dom';

const DialogItem = (props) => {
	let path = "/dialogs/" + props.id;
	let imageSrc = "images/avatar" + props.id + ".jpg";
	return (
		<NavLink className={s.item} to={path} activeClassName={s.active}>
			<div className={s.ava}><img src={imageSrc} alt="avatar" /></div>
			<p>{props.name}</p>
		</NavLink>
	)
}


export default DialogItem