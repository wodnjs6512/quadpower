/**
 * Created by jaewonlee on 2017. 12. 22..
 */
import React, { Component } from 'react';

import {
    Button,
    Col,
    Panel
} from 'react-bootstrap';

//firebase
import * as firebase from 'firebase'
import * as firebaseFunctions from './../../firebase/functions'

//Vimeo Player
import ReactPlayer from 'react-player'

//style
import * as styles from './../../styles'

var title = null;
var catList = null;
var catAll=[];
var vidList = [];
var keyList = [];
var workoutList=null;

class SelectPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode : 0,
            loading:false,
            showPanel:false,
            categories:null,
            list:null,
            options:[],
            title:null,
            detailItem:null,
            workoutListAdder: false,
            addWorkoutList : false,
            width:window.innerWidth,
            height:window.innerHeight,
        };
    }

    componentWillMount(){
        //change title by category
        switch(window.location.pathname){

            case "/app/select/aero":
                title = "Aerobics"
                break;
            case "/app/select/str":
                title = "Strength"
                break;
            case "/app/select/flex":
                title = "Flexibility"
                break;
            case "/app/select/relax":
                title = "Relaxation"
                break;
            default:
                break;
        }

        /*
        firebase operation
         */
        // if not logged in, go back to main
        if(!firebase.auth().currentUser){
            this.props.history.push('/');
            return
        }
        //get current user data
        catAll = firebaseFunctions.getCat();
        keyList = firebaseFunctions.getWorkoutList(this)[0];
        workoutList = firebaseFunctions.getWorkoutList(this)[1];

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

    getVid(){
        var loi = null;
        vidList = firebaseFunctions.getVid(this,this.state.options,title);
        this.setState({loading:false})
    }
    selelctViewSwitcher(){
        // switch title, and corresponding list
        switch(window.location.pathname){
            /*
            Need to change list by category
             */
            case "/app/select/aero":
                catList = catAll[0];
                break;
            case "/app/select/str":
                catList = catAll[1];
                break;
            case "/app/select/flex":
                catList = catAll[2];
                break;
            case "/app/select/relax":
                catList = catAll[3];
                break;
            default:
                break;
        }

        if(catList===null){
            this.props.history.push("/app/main");
            return
        }
        if(catList.length<1){
            this.setState({mode:1,loading:true});
            this.getVid();
        }

        return(
            <div className="center" style={{flexDirection:'column'}}>
                <div style={{width:'100%'}}>
                    {
                        catList.map(
                            (item, i) =>{
                                return (
                                    <Col lg={4} md={4} sm={6} xs={6} className="center" key={i}>
                                        <input type="checkbox" value={i} style={{width:30,height:30}} onChange={()=>{
                                            var list = this.state.options;
                                            if(list.includes(item)){
                                                var i = list.indexOf(item);
                                                list.splice(i,1);
                                                this.setState({options:list})
                                            }
                                            else{
                                                list.push(item);
                                                this.setState({options:list})
                                            }
                                        }}/>
                                        <div className="center" style={{margin:10,width:'100%',height:100,backgroundColor:'#3780ab',color:'white',fontSize:25,borderRadius:10}}>{item}</div>
                                    </Col>
                                )
                            }
                        )
                    }
                </div>
                <hr style={{border:'solid',width:'100%'}}/>

                <div style={{display:'flex', flexDirection:'row'}}>
                    <Button bsStyle="primary"
                            style={{alignSelf:"flex-end",margin:10,width:'50%',height:50,backgroundColor:'#3780ab',
                                color:'white',fontSize:25,borderRadius:10}}
                            onClick={()=>{
                                this.setState({mode:1,loading:true});
                                this.getVid();
                            }}
                    >Next</Button>
                    <Button bsStyle="primary"
                            style={{alignSelf:"flex-end",margin:10,width:'50%',height:50,backgroundColor:'#3780ab',
                                color:'white',fontSize:25,borderRadius:10}}
                            onClick={()=>{this.props.history.push("/app/main");
                            }}
                    >Previous</Button>
                </div>
            </div>
        )
    }
    resultView(){
        // list view, map resulting data
        return(
            <div style={{overflowY:'scroll',height:this.state.height-100}}>
                {
                    this.state.loading?
                        <div className="center" style={{fontSize:50,height:this.state.height-100}}>Loading</div>
                        :
                        vidList.map((item,i)=>{
                            return(
                                <div className="center" style={{justifyContent:'flex-start',borderBottom:'solid'}} key={i}>
                                    <br/>
                                    <Col lg={6} md={6} sm={6} xs={6}>
                                        <div className="center" style={{flexDirection:"column",width:'100%',padding:10}}>
                                            <ReactPlayer url={item.url} autoPlay={false} playing={false} width='200' height="100%" controls style={{objectFit:'contains'}}/>
                                            <Button style={{background:"#222222",color:"white"}} onClick={()=>{this.setState({workoutListAdder: true,detailItem:item})}}>
                                                Add To My Workout
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={6} >
                                        <div style={{justifyContent:"flex-start",height:"100%",width:'100%',padding:10}}>
                                            <h4> Title: {item.title}</h4>
                                            <h5> Coach: {item.coach}</h5>
                                            <h5> Description: {item.desc}</h5>
                                        </div>
                                        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'50%'}}>
                                            <Button style={{justifySelf:"center"}} onClick={()=>this.setState({showPanel: true,detailItem:item})}>
                                                Details
                                            </Button>
                                        </div>
                                    </Col>
                                </div>
                            )
                        })
                }
            </div>
        )
    }
    screenSwitcher(){
        if(this.state.mode===0) {
            return (this.selelctViewSwitcher())
        }
        else if(this.state.mode===1){
            return (this.resultView())
        }
    }
    render() {
        return (
            <div>
                <div className="center" style={{border:'solid',borderWidth:5,borderRadius:10,borderColor:"#444444",width:'100%',height:100,color:'black',fontSize:30}}>
                    <b>{title}</b>
                </div>
                {this.screenSwitcher()}
                {this.state.showPanel?
                    <Panel style={styles.userPanelStyle}>
                        <div className="center" style={styles.userPanelTitleStyle}>
                            <b>{this.state.detailItem.title}</b>
                        </div>
                        <br/>
                        <div style={{height:'100%',justifyContent:'center'}}>
                            <img src={require('./../../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                                 onClick={()=>this.setState({showPanel:false})} alt=""/>
                            <Col className="center" lg={9} md={9} sm={12} xs={12} style={{backgroundColor:'black'}}>
                                <ReactPlayer url={this.state.detailItem.url} autoPlay={false} playing={false} controls style={{width:'100%',height:'100%'}}/>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={12}>
                                <div className="center" style={{width:'100%',justifyContent:'center'}}>
                                    <Button style={{background:"#222222",color:"white"}} onClick={()=>{this.setState({workoutListAdder: true})}}>
                                        Add To My Workout List
                                    </Button>
                                </div>

                                <div>
                                    <h4><b>Description of Exercise</b></h4>
                                    {this.state.detailItem.desc}
                                    <br/>
                                </div>
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={9}>
                                <br/>
                                <div style={{justifyContent:"flex-start",height:"100%",width:'100%',padding:10,border:'solid'}}>
                                    <h4> <b>Coach:&nbsp;</b> {this.state.detailItem.coach}</h4>
                                    <hr style={styles.horizontalLine}/>
                                    <h4> <b>Description:&nbsp;</b>{this.state.detailItem.desc}</h4>
                                </div>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={3}>
                                <div>
                                    <h4><b>Parameters:</b></h4>
                                    {this.state.detailItem.param}
                                    <br/>
                                    <hr style={styles.horizontalLine}/>
                                    <h4><b>Progression:</b></h4>
                                </div>
                            </Col>
                        </div>
                    </Panel>
                :
                null}
                {this.state.workoutListAdder?
                    <Panel style={styles.userPanelStyle}>
                        <div className="center" style={styles.userPanelTitleStyle}>
                            <b>Select Workout List</b>
                        </div>
                        <img src={require('./../../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                             onClick={()=>this.setState({workoutListAdder:false})} alt=""/>
                        <div style={{width:'100%'}}>
                            <Col lg={6} md={6} sm={6} xs={6}>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} style={{display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                                <Button bsStyle="primary" onClick={()=>this.setState({addWorkoutList:true})}>Create New Workout List</Button>
                            </Col>
                        </div>
                        <br/>
                        <div>
                            {workoutList.map((item,i)=>{
                                return(
                                    <Col lg={4} md={4} sm={6} xs={6}  key={i}>
                                        <Button bsStyle="primary" onClick={()=>{
                                            var list = item.list;
                                            if(list===null||list===undefined) list = [];
                                            console.log(list)
                                            list.push(this.state.detailItem);
                                            console.log(list)

                                            firebaseFunctions.addToWorkoutList(keyList[i],item.title,list);
                                            this.setState({workoutListAdder:false,showPanel:false})}} style={{width:"100%",height:100,fontSize:30}}>
                                            {item.title}
                                        </Button>
                                    </Col>
                                )
                            })}
                        </div>

                    </Panel>
                    :
                    null}
                {
                    this.state.addWorkoutList?
                        <Panel style={styles.userPanelStyle}>
                            <img src={require('./../../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                                 onClick={()=>this.setState({addWorkoutList:false})} alt=""/>
                            <div className="center" style={{flexDirection:'column',width:'100%',height:100,fontSize:30,borderBottom:'solid'}}>
                                <b>Add New WorkoutList</b>
                            </div>

                            <div  style={{fontSize:20}}>
                                <Col lg={6} md={6} sm={6} xs={6} className="center">
                                    Title :
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                    <input style={styles.inputStyle} onChange={(e)=> this.setState({title:e.target.value})} placeholder={this.state.title}/>
                                </Col>
                            </div>
                            <br/>
                            <hr style={styles.horizontalLine}/>
                            <br/>
                            <div className="center">
                                <Button onClick={()=>firebaseFunctions.addWorkoutList(this,this.state.title)}>Submit</Button>
                            </div>
                        </Panel>
                        :
                        null
                }
            </div>
        );
    }
}

export default SelectPart;
