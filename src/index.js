import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

// bodies
import LoginPage from './starting/loginPage'
import MainPage from './mains/mainPage'
import * as firebaseFunction from './firebase/functions'


const Redirection=()=>(
    <Redirect to={"/login"}/>
    );

firebaseFunction.init();


ReactDOM.render(
    <div>
        <Router>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <Route path="/app/*" component={MainPage}/>
                <Route exact path="/*" component={Redirection}/>
            </Switch>
        </Router>
    </div>

   , document.getElementById('root'));
registerServiceWorker();
