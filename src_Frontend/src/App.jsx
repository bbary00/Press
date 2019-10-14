import React from 'react';
import 'bootstrap';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Content/Main/Main';
import Footer from './components/Footer/Footer';
import { Route, Redirect } from 'react-router-dom';


const App = (props) => {
	// debugger;
	return (
		
			<div>
				<div className="headWrapper">
					<Header />
				</div>
				<div className="contentWrapper">
					{/* <div className="adSenseContainer">ADSENSE 1</div> */}
					<div className="contentContainer">
						<Route path="/main"
							render={() => <Main
								mainPage={props.state.mainPage}
								dispatch={props.dispatch} />} />
						
						{/* <Route path="/settings" render={() => <Settings />} /> */}
						<Redirect from="/" exact to="/main" />
					</div>
					{/* <div className="adSenseContainer">ADSENSE 2</div> */}
				</div>
				<div className="footerWrapper">
					<Footer />
				</div>
			</div>
		

	);
};

export default App;
