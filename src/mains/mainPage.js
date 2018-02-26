/**
 * Created by jaewonlee on 2017. 12. 18..
 */
import React, { Component } from 'react';
import {
    Col
} from 'react-bootstrap';
import {
    Route
} from 'react-router-dom';

//firebase
import * as firebase from 'firebase';

//components
import LeftNav from './../leftBar/leftNav'

////bodies
import LevelOfInjury from './bodies/levelOfInjury'
import MainBody from './bodies/mainBody'
import SelectPart from './bodies/selectPart'
import UserAccount from './bodies/userAccount'
import MyWorkoutList from './bodies/myWorkoutList'
import GenExercisePlan from './bodies/genExercisePlan'


class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height:window.innerHeight,
            width:window.innerWidth
        };
    }
    resize = () => {
        if(!window.location.href==("/app/select/*"||"/app/myworkoutlist||/app/genworkoutlist")){
            this.setState({width:window.innerWidth,height:window.innerHeight})
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    render() {
        if(!firebase.auth().currentUser){
            this.props.history.push('/login');
        }
        return (
            <div>
                <Col lg={3} md={3} sm={3} xsHidden style={{borderRight:'solid',borderWidth:5,borderColor:'#3780ab'}}>
                    <LeftNav {...this.props} style={{position:'fixed',width:'100%'}}/>
                </Col>
                <Col lg={9} md={9} sm={9} xs={12} style={{height:this.state.height}}>
                        <div style={{height:'100%'}}>
                            <Route exact path="/app/loi" component={()=><LevelOfInjury {...this.props}/>}/>
                            <Route exact path="/app/main" component={()=><MainBody {...this.props}/>}/>
                            <Route exact path="/app/myaccount" component={()=><UserAccount {...this.props}/>}/>
                            <Route exact path="/app/myworkoutlist" component={()=><MyWorkoutList {...this.props}/>}/>
                            <Route exact path="/app/genworkoutlist" component={()=><GenExercisePlan {...this.props}/>}/>
                            <Route path="/app/select/*" component={()=><SelectPart {...this.props}/>}/>

                        </div>
                </Col>
            </div>
        );
    }
}

export default MainPage;
