/**
 * Created by jaewonlee on 2018. 1. 11..
 */
import React, { Component } from 'react';
import {
    Col,
    Button,
    ButtonGroup,
    Tabs,
    Tab,
    Panel
} from 'react-bootstrap';

//Vimeo Player
import ReactPlayer from 'react-player'

//firebase
import * as firebase from 'firebase';
import * as firebaseFunctions from './../../firebase/functions';

//style
import * as styles from './../../styles'

var currentUser;
var keyList=[];
var itemList=[];

class MyWorkoutList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            current:1,
            data:null,
            title:null,
            addWorkoutList:false,
            detailItem:null,
            workoutListAdder: false,
            deleteWorkoutList:false,
            showPanel:false,
            width:window.innerWidth,
            height:window.innerHeight,
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.init = this.init.bind(this)
    }

    componentWillMount(){
        // if not logged in, go back to main
        this.init();
    }
    init(){
        this.setState({loading:true})

        if(!firebase.auth().currentUser){
            this.props.history.push('/login');
            return
        }
        currentUser = firebase.auth().currentUser

        var workoutList = firebaseFunctions.getWorkoutList(this);
        keyList = workoutList[0];
        itemList = workoutList[1];
    }

    handleSelect(key) {
        this.setState({ current :key});
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
                    <b style={{border:'solid',borderWidth:5,padding:5}}>My Workout List</b>
                </div>
                <div style={{width:'100%'}}>
                    <Col lg={6} md={6} sm={6} xs={6} style={{display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>

                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6} style={{display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                        <Button bsStyle="primary" onClick={()=>this.setState({deleteWorkoutList:true})}>Delete Workout List</Button>
                        <Button bsStyle="primary" onClick={()=>this.setState({addWorkoutList:true})}>Create New Workout List</Button>
                    </Col>
                </div>


                <Tabs
                    defaultActiveKey={0}
                    activeKey={this.state.current} animation={true}
                    style={{width:'100%',overflowY:'scroll',height:this.state.height-140,fontSize:20}}
                    id="controlled-tab-example"
                    onSelect={this.handleSelect}
                    mountOnEnter
                    unmountOnExit
                >

                    {
                        keyList.map((item,i)=>{
                            return(
                                <Tab eventKey={i} title={itemList[i].title} key={i}>
                                    <div>
                                        {
                                            itemList[i].list===undefined?
                                                <div className="center" style={{fontSize:30}}>
                                                    "No Items"
                                                </div>
                                                :
                                                itemList[i].list.map((item,j)=>{
                                                    return(
                                                        <div className="center" style={{justifyContent:'flex-start',borderBottom:'solid'}} key={"s"+j}>
                                                            <br/>
                                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                                <div className="center" style={{flexDirection:"column",width:'100%',padding:10,objectFit:'contains'}}>
                                                                    <ReactPlayer url={item.url} autoPlay={false} playing={false} width='200' height="100%" controls style={{objectFit:'contains'}}/>
                                                                    <Button style={{background:"#222222",color:"white"}} onClick={()=>{this.setState({workoutListAdder: true,detailItem:item})}}>
                                                                        Add To Other Workout
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
                                                                    <Button bsStyle='primary'  style={{justifySelf:"center"}} onClick={()=>this.setState({showPanel: true,detailItem:item})}>
                                                                        Details
                                                                    </Button>
                                                                    <Button bsStyle='primary'  style={{justifySelf:"center"}} onClick={()=>{
                                                                        itemList[i].list.splice(j,1);
                                                                        console.log(itemList)
                                                                        firebaseFunctions.removeFromWorkoutList(this,keyList[i],itemList[i].list)
                                                                    }}>
                                                                        Remove From List
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    )
                                                })
                                        }

                                    </div>
                                </Tab>
                            )
                        })

                    }
                </Tabs>

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
                            {itemList.map((item,i)=>{
                                return(
                                    <Col lg={4} md={4} sm={6} xs={6} className="center" key={i}>
                                        <Button bsStyle="primary" onClick={()=>{
                                            var list = item.list;
                                            if(list===null||list===undefined) list = [];
                                            list.push(this.state.detailItem);
                                            firebaseFunctions.addToWorkoutList(keyList[i],item.title,list);
                                            this.init();
                                            this.setState({workoutListAdder:false,showPanel:false})

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
                    null
                }

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
                {
                    this.state.deleteWorkoutList?
                        <Panel style={styles.userPanelStyle}>
                            <div className="center" style={styles.userPanelTitleStyle}>
                                <b>Select Workout List to Delete</b>
                            </div>
                            <img src={require('./../../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                                 onClick={()=>this.setState({workoutListAdder:false})} alt=""/>
                            <br/>
                            <div>
                                {itemList.map((item,i)=>{
                                    return(
                                        <Col lg={4} md={4} sm={6} xs={6} key={i}>
                                            <Button bsStyle="primary" onClick={()=>{
                                                var list = item.list;
                                                if(list===null||list===undefined) list = [];
                                                list.push(this.state.detailItem);
                                                firebaseFunctions.deleteWorkoutList(keyList[i]);
                                                this.setState({workoutListAdder:false,showPanel:false,deleteWorkoutList:false})
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
                        null
                }
            </div>
        );
    }
}
export default MyWorkoutList;