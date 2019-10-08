import React from 'react';
import 'bootstrap';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Content/Main/Main';
import Settings from './components/Content/Settings/Settings';
import Footer from './components/Footer/Footer';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
 

const App = (props) => {
	return (
		<BrowserRouter>
			<div>
				<div className="headWrapper">
					<Header />
				</div>
				<div className="contentWrapper">
					<div className="adSenseContainer">ADSENSE 1</div>
					<div className="contentContainer">
						<Route path="/main"
							render={() => <Main
								mainPage={props.state.mainPage}
								addSentencesFromSummarizedText={props.addSentencesFromSummarizedText}
								changeTextToProcess={props.changeTextToProcess}
								changeNumberOfSentencesToProcess={props.changeNumberOfSentencesToProcess}
								changePercentOfSentencesToProcess={props.changePercentOfSentencesToProcess}
								moveRangeToClosestStep={props.moveRangeToClosestStep}
								splitAndCalculateSentences={props.splitAndCalculateSentences}
							/>} 
						/>
						{/* <Route 
							path="/dialogs"
							render={() => <Dialogs
								dialogsData={props.state.dialogsPage.dialogsData}
								messagesData={props.state.dialogsPage.messagesData}
								addMessage={props.addMessage}
							/>} 
						/> */}
						<Route path="/settings" render={() => <Settings />} />
						<Redirect from="/" exact to="/main" />
					</div>
					<div className="adSenseContainer">ADSENSE 2</div>
				</div>
				<div className="footerWrapper">
					<Footer />
				</div>
			</div>
		</BrowserRouter>

	);
};

export default App;
