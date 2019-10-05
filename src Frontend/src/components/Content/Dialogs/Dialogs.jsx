import React from 'react';
import s from './Dialogs.module.css';
import { Route, Redirect} from 'react-router-dom';
import DialogItem from './DialogItem/DialogsItem';
import Messages_1_to_2 from './Messages/MessageGroups/Messages_1_to_2';
import Messages_1_to_3 from './Messages/MessageGroups/Messages_1_to_3';
import Messages_1_to_4 from './Messages/MessageGroups/Messages_1_to_4';
import Messages_1_to_5 from './Messages/MessageGroups/Messages_1_to_5';
import Messages_1_to_6 from './Messages/MessageGroups/Messages_1_to_6';
import Messages_1_to_7 from './Messages/MessageGroups/Messages_1_to_7';


const Dialogs = (props) => {
	let dialogsElements = props.dialogsData.map(dialog => <DialogItem name={dialog.name} id={dialog.id} />);
	
	return (
		<div className={s.dialogsGrid}>
			<div className={s.dialogs}>
				<div className={s.dialogItems}>
					{dialogsElements}
				</div>
			</div>
			<div className={s.messages}>
				<Route path="/dialogs/2" render={() => <Messages_1_to_2 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Route path="/dialogs/3" render={() => <Messages_1_to_3 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Route path="/dialogs/4" render={() => <Messages_1_to_4 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Route path="/dialogs/5" render={() => <Messages_1_to_5 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Route path="/dialogs/6" render={() => <Messages_1_to_6 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Route path="/dialogs/7" render={() => <Messages_1_to_7 messagesData={props.messagesData} addMessage={props.addMessage} />} />
				<Redirect from="/dialogs" exact to="/dialogs/2" /> 
			</div>
		</div>
	)
}

export default Dialogs