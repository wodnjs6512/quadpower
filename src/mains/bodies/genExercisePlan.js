/**
 * Created by jaewonlee on 2018. 1. 29..
 */
import React, { Component } from 'react';
import {
    Button,
    Col,
    Panel
} from 'react-bootstrap';

//Vimeo Player
import ReactPlayer from 'react-player'

//firebase
import * as firebase from 'firebase';
import * as firebaseFunctions from './../../firebase/functions'

//style
import * as styles from './../../styles'


var data=[];
var keyList=[];
var itemList=[];


class genExercisePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            data:null,
            keyList:null,
            itemList:null,
            loading: true,
            showPanel:false,
            workoutListAdder:false,
            addWorkoutList:false,
        };
    }

    resize = () => {
        this.setState({width:window.innerWidth,height:window.innerHeight})
    }

    componentWillMount(){
        this.setState({loading:true})
        if(!firebase.auth().currentUser){
            this.props.history.push('/login');
            return
        }
        firebaseFunctions.genWorkoutList(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    render(){
        if(this.state.loading){
            return(
                <div>
                    loading
                </div>
            )
        }
        return(
            <div>
                <div className="center" style={{flexDirection:'column'}}>
                    <div className="center" style={{flexDirection:'column',background:"#3780ab",width:'100%',height:100,color:'white',fontSize:30}}>
                        <b style={{border:'solid',borderWidth:5,padding:5}}>Generated Workout List</b>
                    </div>
                    <div style={{overflowY:'scroll',height:this.state.height-100,width:'100%'}}>
                        {
                            this.state.data.map((item,i)=>{
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

                </div>
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
                                        Add To Other Workout
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
                        <br/>
                        <div>
                            {this.state.itemList.map((item,i)=>{
                                return(
                                    <Col lg={4} md={4} sm={6} xs={6} className="center" key={i}>
                                        <Button bsStyle="primary" onClick={()=>{
                                            var list = item.list;
                                            if(list===null||list===undefined) list = [];
                                            list.push(this.state.detailItem);
                                            firebaseFunctions.addToWorkoutList(this.state.keyList[i],item.title,list);
                                            this.setState({workoutListAdder:false,showPanel:false})
                                            this.forceUpdate();
                                        }}
                                                style={{width:"100%",height:100,fontSize:30}}>
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
        )
    }
}
export default genExercisePlan;