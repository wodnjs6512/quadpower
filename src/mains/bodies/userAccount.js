/**
 * Created by jaewonlee on 2018. 1. 3..
 */
import React, { Component } from 'react';
import {
    Col,
    Row,
    Button,
    DropdownButton,
    ButtonGroup
} from 'react-bootstrap';
//firebase
import * as firebase from 'firebase';
import * as firebaseFunctions from './../../firebase/functions'

//style
import * as styles from './../../styles'

//injury option
import * as options from './../../options/option'
class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loi:"C1",
            username:null,
            email : null,
            password:"",
            edit : false,
            loading:false,
            width:window.innerWidth,
            height:window.innerHeight,
        };
    }
    /*
     user.updatePassword(newPassword).then(function() {
     // Update successful.
     }, function(error) {
     // An error happened.
     });
     */
    componentWillMount(){
        // if not logged in, go back to main
        this.setState({loading:true})
        if(!firebase.auth().currentUser){
            this.props.history.push('/');
            return
        }
        var loi = firebaseFunctions.getLoi(this);
    }
    resize = () => {
        this.setState({height:window.innerHeight,width:window.innerWidth})
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    _onSelect(i){
        //set this value
        this.setState({loi:i})
    }

    render(){
        if(this.state.loading){
            return(
                <div className="center">
                    Loading
                </div>
            )
        }
        return(
            <div className="center" style={{flexDirection:'column'}}>
                <div className="center" style={{flexDirection:'column',background:"#3780ab",width:'100%',height:100,color:'white',fontSize:30}}>
                    <b style={{border:'solid',borderWidth:5,padding:5}}>User Account</b>
                </div>
                <div style={{width:'100%',fontSize:30,margin:5}}>
                    <Row>
                        <Col lg={3} md={3} sm={6} xs={12} >
                            <div style={{backgroundColor:'black',color:'white',margin:5,paddingLeft:10}}>
                                Name :
                            </div>
                        </Col>
                        <Col lg={9} md={9} sm={6} xs={12} >
                            <div style={{margin:5,paddingLeft:10}}>
                                {
                                    this.state.edit?
                                        <input style={styles.loginInputStyle} placeholder={firebase.auth().currentUser.username}
                                               onChange={(e)=>this.setState({username:e.target.value})}
                                        />
                                        :
                                        firebase.auth().currentUser?firebase.auth().currentUser.displayName:"No Name has been set for this account yet"
                                }

                            </div>
                        </Col>
                    </Row>

                    <br/>
                    <Row>
                        <Col lg={3} md={3} sm={6} xs={12} >
                            <div style={{backgroundColor:'black',color:'white',margin:5,paddingLeft:10}}>
                                E-mail :
                            </div>
                        </Col>
                        <Col lg={9} md={9} sm={6} xs={12} >
                            <div style={{margin:5,paddingLeft:10}}>
                                {
                                    firebase.auth().currentUser?firebase.auth().currentUser.email:"No Name has been set for this account yet"
                                }
                            </div>
                        </Col>
                    </Row>

                    <br/>

                    <Row>
                        <Col lg={3} md={3} sm={6} xs={12} >
                            <div style={{backgroundColor:'black',color:'white',margin:5,paddingLeft:10}}>
                                Password :
                            </div>
                        </Col>
                        <Col lg={9} md={9} sm={6} xs={12}>
                            <div style={{margin:5,paddingLeft:10}}>
                                {
                                    this.state.edit?
                                        <input style={styles.loginInputStyle} placeholder="***********"
                                               onChange={(e)=>this.setState({password:e.target.value})}
                                        />
                                        :
                                        "***********"
                                }
                            </div>

                        </Col>
                    </Row>

                    <br/>
                    <Row>
                        <Col lg={3} md={3} sm={6} xs={12} >
                            <div style={{backgroundColor:'black',color:'white',margin:5,paddingLeft:10}}>
                                Level of Injury :
                            </div>
                        </Col>
                        <Col lg={9} md={9} sm={6} xs={12} >
                            <div style={{margin:5,paddingLeft:10}}>
                                {
                                    this.state.edit?
                                        <DropdownButton title={this.state.loi} id="bg-dropdown" style={{fontSize:20}}>
                                            <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                                                <ButtonGroup vertical block style={{width:'100%'}}>
                                                    {
                                                        options.loiOption.map(
                                                            (item, i) =>{
                                                                return (
                                                                    <Button key ={i} onClick={()=>this._onSelect(item)}>{item}</Button>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </ButtonGroup>
                                            </div>
                                        </DropdownButton>
                                        :
                                        ""+this.state.loi
                                }
                            </div>
                        </Col>
                    </Row>


                </div>
                <div>
                    {
                        !this.state.edit?
                            <Button bsStyle="primary" style={styles.buttonStyle} onClick={()=>this.setState({edit:true})}>
                                Edit
                            </Button>
                        :
                            <Button bsStyle="primary" style={styles.buttonStyle} onClick={()=>firebaseFunctions.updateUserInfo(this,this.state.username,this.state.password,this.state.loi)}>
                                Submit
                            </Button>
                    }

                </div>
            </div>
        );
    }
}
export default UserAccount;