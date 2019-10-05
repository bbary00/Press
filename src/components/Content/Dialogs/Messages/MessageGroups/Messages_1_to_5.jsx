import React from 'react';
import s from './../Messages.module.css';
import MyMessageTemplate from '../MyMessageTemplate';
import FriendsMessageTemplate from '../FriendsMessageTemplate';

const Messages_1_to_5 = (props) => {

	let dialogNumber = 4;

	let messagesElements = props.messagesData[dialogNumber - 1].map(el => {
		if (el.sender === 0) {
			return <MyMessageTemplate message={el.message} userId={el.userId} />
		} else if (el.sender === 1) {
			return <FriendsMessageTemplate message={el.message} userId={el.userId} />
		}
	})

	let newMessage = React.createRef();
	let sendMessage = () => {
		let dialogId = dialogNumber; // First dialog. Hardcoding.
		let sender = 0;
		let userId = 1; // For now our default user is #1. Because we don`t have login opportunity.
		let messageId = props.messagesData[0][props.messagesData[0].length - 1].id + 1;
		let text = newMessage.current.value;
		props.addMessage(dialogId, sender, userId, messageId, text);
		newMessage.current.value = '';
	}

	return (
		<div className={s.dialogGrid}>
			<div className={s.messagesItems}>
				{messagesElements}
			</div>
			<div className={s.inputBlock}>
				<textarea ref={newMessage}></textarea>
				<button type="button" className={`btn btn-outline-primary`} onClick={sendMessage}>Send</button>
			</div>
		</div>
	)
}

export default Messages_1_to_5