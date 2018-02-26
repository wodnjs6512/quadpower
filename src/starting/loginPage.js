/**
 * Created by jaewonlee on 2017. 12. 18..
 */
import React, { Component } from 'react';
import {
    Col,
    Button,
} from 'react-bootstrap';

import * as styles from './../styles'

//firebase
import * as firebase from 'firebase';
import * as firebaseFunctions from './../firebase/functions'

//components
import Left from './leftIntro'

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login:{
                email:"",
                password:"",
            },
            register:{
                email:"",
                password:"",
            },
            width:window.innerWidth,
            height:window.innerHeight,
        };

    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user)=> {
            if (user) {

                if(!firebase.auth().currentUser.displayName){
                    firebase.auth().currentUser.updateProfile({
                        displayName: user.email
                    }).then(function() {
                        // Update successful.
                    }).catch(function(error) {
                        // An error happened.
                    });
                }
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
                    if(snapshot.val()!==null){
                        this.props.history.push('/app/main')
                    }
                })
                this.props.history.push('/app/loi');
            } else {
                // User is signed out.
                // ...
                this.props.history.push('/login');
            }
        });
    }

    resize = () => {
        this.setState({width:window.innerWidth,height:window.innerHeight})
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    render() {

        return(
            <div>
                <Col lg={8} md={8} sm={12} xs={12} style={{display:'flex',height:this.state.height,alignItems:'center',textAlign:'center',justifyContent:'center', verticalAlign:'center',backgroundColor:'transparent'}}>
                    <Left style={{display:'flex',height:this.state.height,alignItems:'center',textAlign:'center',justifyContent:'center', verticalAlign:'center',backgroundColor:'transparent'}}/>
                </Col>
                <Col lg={4} md={4} sm={12} xs={12} style={{display:'flex',height:this.state.height,alignItems:'center',textAlign:'center',justifyContent:'center', verticalAlign:'center',backgroundColor:'transparent'}}>
                    <div style={{width:this.state.width*0.8}}>
                        <div style={{display:'flex',flexDirection:'column',margin:20,padding:10,height:window.innerHeight/2.5,border:'solid',borderColor:'darkblue',borderWidth:3,borderRadius:20,alignItems:'center',verticalAlign:'center',textAlign:'center',justifyContent:'center'}}>
                            <b style={{fontSize:25}}>Sign In</b>
                            <br/>
                            <div>
                                <b>EMAIL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>
                                <input style={{border:'none',borderBottom:'solid',borderBottomWidth:1}} placeholder=" USERNAME HERE"
                                       onChange={(e)=> this.setState({login:{...this.state.login,email:e.target.value}})}/>
                            </div>
                            <br/>
                            <div>
                                <b>PASSWORD :</b>
                                <input type={"password"}style={{border:'none',borderBottom:'solid',borderBottomWidth:1}} placeholder=" PASSWORD HERE"
                                       onChange={(e)=> this.setState({login:{...this.state.login,password:e.target.value}})}/>
                            </div>
                            <br/>
                            <Button bsStyle="primary" style={{paddingLeft:50,paddingRight:50}} onClick={()=>firebaseFunctions.login(this.state.login.email,this.state.login.password)}>Submit</Button>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',margin:20,padding:10,height:window.innerHeight/2.5,border:'solid',borderColor:'darkblue',borderWidth:3,borderRadius:20,alignItems:'center',verticalAlign:'center',textAlign:'center',justifyContent:'center'}}>
                            <b style={{fontSize:25}}>Register</b>
                            <br/>
                            <div>
                                <b>EMAIL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>
                                <input style={{border:'none',borderBottom:'solid',borderBottomWidth:1}} placeholder=" Email"
                                       onChange={(e)=> this.setState({register:{...this.state.register,email:e.target.value}})}/>
                            </div>
                            <br/>
                            <div>
                                <b>PASSWORD :</b>
                                <input style={{border:'none',borderBottom:'solid',borderBottomWidth:1}} placeholder=" 6 or longer" type={"password"}
                                       onChange={(e)=> this.setState({register:{...this.state.register,password:e.target.value}})}/>
                            </div>
                            <br/>
                            <Button bsStyle="primary" style={{paddingLeft:50,paddingRight:50}} onClick={()=>firebaseFunctions.join(this.state.register.email,this.state.register.password)}>Submit</Button>
                        </div>
                    </div>
                </Col>
            </div>
        );
    }
}

export default LoginPage;
