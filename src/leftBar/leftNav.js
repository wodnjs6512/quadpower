/**
 * Created by jaewonlee on 2017. 12. 18..
 */
import React, { Component } from 'react';

import {
    Button,
    ButtonGroup,
    Panel,
    Col,
    DropdownButton
} from 'react-bootstrap';
import * as options from './../options/option'
import * as styles from './../styles'

//firebase
import * as firebase from 'firebase';
import * as firebaseFunctions from './../firebase/functions'
//Vimeo Player
import ReactPlayer from 'react-player'

var height;
var width;

//user data
var currentUser;
var catList =[];
var catAll=[];


class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addVid:false,
            addCategory:false,
            typeDropdown:false,
            partDropdown:false,
            loiDropdown:false,
            auth:false,
            videoDesc:{
                loi:null,
                type:null,
                part:null,
                title:null,
                url:null,
                coach:null,
                material:null,
                desc:null,
                param:null
            },
            category:{
                loi:null,
                type:null,
                part:null,
            },

            width:window.innerWidth,
            height:window.innerHeight,

        };
        this.uploadVid = this.uploadVid.bind(this);
        this.uploadCategory = this.uploadCategory.bind(this);
    }

    componentWillMount(){
        if(!firebase.auth().currentUser){
            this.props.history.push('/login');
            return
        }
        currentUser= firebase.auth().currentUser;

        firebaseFunctions.checkAuthority(this)

        catAll = firebaseFunctions.getCat();
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

    uploadVid(){
        console.log(this.state.videoDesc)
        var desc = this.state.videoDesc;
        if(!desc.title||!desc.loi||!desc.type||!desc.url||!desc.coach){
            return alert("There is a missing part")
        }
        firebaseFunctions.addVid(this,desc)
    }

    addVid(){
        switch(this.state.videoDesc.type){
            case "Aerobics":
                if(catList!==catAll[0]){
                    catList = catAll[0];
                    this.forceUpdate();
                }
                break;
            case "Strength":
                if(catList!==catAll[1]){
                    catList = catAll[1];
                    this.forceUpdate();
                }
                break;
            case "Flexibility":
                if(catList!==catAll[2]){
                    catList = catAll[2];
                    this.forceUpdate();
                }
                break;
            case "Relaxation":
                if(catList!==catAll[3]){
                    catList = catAll[3];
                    this.forceUpdate();
                }
                break;
            default:
                break;
        }
        return(
            <Panel style={{display:"flex",flexDirection:"column",position:"absolute",top:10,left:10,width:this.state.width-20,height:this.state.height-20,backgroundColor:"white",zIndex:10,borderWidth:5,justifiyContent:'center',overflowY:"scroll"}}>
                <img src={require('./../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                     onClick={()=>this.setState({addVid:false})} alt=""/>
                <div className="center" style={{flexDirection:'column',width:'100%',height:100,fontSize:30,borderBottom:'solid'}}>
                    <b>Add New Video</b>
                </div>
                <div>
                    <br/>
                    <div>
                        <Col className="center" lg={12} md={12} sm={12} xs={12} style={{height:50}}>
                            <b>Level of Injury : &nbsp;</b>
                            <DropdownButton title={this.state.videoDesc.loi?this.state.videoDesc.loi:"Choose the Level of Injury"} id="type" style={{fontSize:15}}
                                            open={this.state.loiDropdown} onToggle={()=>this.setState({loiDropdown:!this.state.loiDropdown})}>
                                <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                                    <ButtonGroup vertical block style={{width:'100%'}}>
                                        {
                                            options.loiOption.map(
                                                (item, i) =>{
                                                    return (
                                                        <Button onClick={()=>{this.setState({videoDesc:{...this.state.videoDesc,loi:item},loiDropdown:false})}}
                                                        >{item}</Button>
                                                    )
                                                }
                                            )
                                        }
                                    </ButtonGroup>
                                </div>
                            </DropdownButton>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>TYPE : &nbsp;</b>
                            <DropdownButton title={this.state.videoDesc.type?this.state.videoDesc.type:"Choose the type"} id="type" style={{fontSize:15}}
                                            open={this.state.typeDropdown} onToggle={()=>this.setState({typeDropdown:!this.state.typeDropdown})}>
                                <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                                    <ButtonGroup vertical block style={{width:'100%'}}>
                                        {
                                            options.typeOption.map(
                                                (item, i) =>{
                                                    return (
                                                        <Button onClick={()=>{this.setState({videoDesc:{...this.state.videoDesc,type:item},typeDropdown:false})}}
                                                        >{item}</Button>
                                                    )
                                                }
                                            )
                                        }
                                    </ButtonGroup>
                                </div>
                            </DropdownButton>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            {
                                catList.length>0?
                                    <div>
                                        <b>PART : &nbsp;</b>
                                        <DropdownButton title={this.state.videoDesc.part?this.state.videoDesc.part:"Choose the Part"} style={{fontSize:15}}
                                                        open={this.state.partDropdown} onToggle={()=>this.setState({partDropdown:!this.state.partDropdown})}>
                                            <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                                                <ButtonGroup vertical block style={{width:'100%'}}>
                                                    {
                                                        catList.map(
                                                            (item, i) =>{
                                                                return (
                                                                    <Button onClick={()=>this.setState({videoDesc:{...this.state.videoDesc,part:item},partDropdown:false})}
                                                                    >{item}</Button>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </ButtonGroup>
                                            </div>
                                        </DropdownButton>
                                    </div>
                                    :
                                    null
                            }

                        </Col>
                    </div>
                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>TITLE</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <input style={styles.inputStyle} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,title:e.target.value}})}/>
                        </Col>
                    </div>

                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>URL</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <input style={styles.inputStyle} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,url:e.target.value}})}/>
                        </Col>
                        {
                            this.state.videoDesc.url?
                                <Col className="center" lg={12} md={12} sm={12} xs={12}>
                                    <ReactPlayer url={this.state.videoDesc.url} playing={false} width="25%" height={window.innerHeight/4} controls/>
                                </Col>
                                :
                                null
                        }

                    </div>

                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>COACH</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <input style={styles.inputStyle} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,coach:e.target.value}})}/>
                        </Col>
                    </div>

                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>MATERIAL</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <input style={styles.inputStyle} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,material:e.target.value}})}/>
                        </Col>
                    </div>

                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>DESCRIPTION</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <textarea style={{width:'80%',resize:"none"}} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,desc:e.target.value}})}/>
                        </Col>
                    </div>

                    <div>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <b>PARAMETERS</b>
                        </Col>
                        <Col className="center" lg={6} md={6} sm={6} xs={12} style={{height:50}}>
                            <input style={styles.inputStyle} onChange={(e)=> this.setState({videoDesc:{...this.state.videoDesc,param:e.target.value}})}/>
                        </Col>
                    </div>
                    <hr style={styles.horizontalLine}/>
                    <div className="center">
                        <Button onClick={()=>this.uploadVid()}>Submit</Button>
                    </div>
                </div>
            </Panel>
        )
    }

    uploadCategory(){
        var category = this.state.category;
        if(!category.loi||!category.type||!category.part){
            return alert("There is a missing part")
        }
        firebaseFunctions.addCat(this,category)
    }

    addCategory(){
        return(
            <Panel style={{display:"flex",flexDirection:"column",position:"absolute",top:10,left:10,width:this.state.width-20,height:this.state.height-20,backgroundColor:"white",zIndex:10,borderWidth:5,justifiyContent:'center',overflowY:"scroll"}}>
                <img src={require('./../images/delete.svg')} style={{position:'absolute',top:10,right:10,width:20,height:20,zIndex:11}}
                     onClick={()=>this.setState({addCategory:false})} alt=""/>
                <div className="center" style={{flexDirection:'column',width:'100%',height:100,fontSize:30,borderBottom:'solid'}}>
                    <b>Add New Category</b>
                </div>
                <Col className="center" lg={12} md={12} sm={12} xs={12} style={{height:50}}>
                    <b>Level of Injury : &nbsp;</b>
                    <DropdownButton title={this.state.category.loi?this.state.category.loi:"Choose the Level of Injury"} id="type" style={{fontSize:15}}
                                    open={this.state.loiDropdown} onToggle={()=>this.setState({loiDropdown:!this.state.loiDropdown})}>
                        <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                            <ButtonGroup vertical block style={{width:'100%'}}>
                                {
                                    options.loiOption.map(
                                        (item, i) =>{
                                            return (
                                                <Button onClick={()=>{this.setState({category:{...this.state.category,loi:item},loiDropdown:false})}}
                                                >{item}</Button>
                                            )
                                        }
                                    )
                                }
                            </ButtonGroup>
                        </div>
                    </DropdownButton>
                </Col>
                <Col className="center" lg={12} md={12} sm={12} xs={12} style={{height:50}}>
                    <b>TYPE : &nbsp;</b>
                    <DropdownButton title={this.state.category.type?this.state.category.type:"Choose the type"} id="type" style={{fontSize:15}}
                                    open={this.state.typeDropdown} onToggle={()=>this.setState({typeDropdown:!this.state.typeDropdown})}>
                        <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                            <ButtonGroup vertical block style={{width:'100%'}}>
                                {
                                    options.typeOption.map(
                                        (item, i) =>{
                                            return (
                                                <Button onClick={()=>{this.setState({category:{...this.state.category,type:item},typeDropdown:false})}}
                                                >{item}</Button>
                                            )
                                        }
                                    )
                                }
                            </ButtonGroup>
                        </div>
                    </DropdownButton>
                </Col>
                <Col className="center" lg={12} md={12} sm={12} xs={12} style={{height:50}}>
                    <b>PART : &nbsp;</b>
                    <div className="center" style={{height:'auto',maxHeight:'200px'}}>
                        <input style={{width:"100%"}} onChange={(e)=> this.setState({category:{...this.state.category,part:e.target.value}})}/>
                    </div>
                </Col>
                <hr style={styles.horizontalLine}/>
                <div className="center">
                    <Button onClick={()=>this.uploadCategory()}>Submit</Button>
                </div>
            </Panel>
            )
    }

    render() {
        if(height !== window.innerHeight||width!==window.innerWidth){
            height = window.innerHeight;
            width = window.innerWidth;
            this.forceUpdate();
        }
        if(!currentUser){
            this.props.history.push('/');
            return <div/>
        }
        else{
            return (
                <div className="center" style={{flexDirection:'column',height:this.state.height,justifiyContent:'flex-start'}}>
                    <img src={require('./../images/app-logo.jpg')} style={{width:'100%',opacity:0.5}} alt=""/>
                    <b style={{fontSize:30}}>Welcome!</b>
                    <b style={{fontSize:25}}>{currentUser.displayName?currentUser.displayName:currentUser.email}</b>
                    <hr style={{padding:0,margin:0,marginTop:5,marginBottom:5,height:5,borderColor:'black'}}/>
                    <ButtonGroup vertical style={{width:'100%'}}>
                        <Button bsStyle="primary" onClick={()=>this.props.history.push('/app/main')}>Home</Button>
                        <Button bsStyle="primary" onClick={()=>this.props.history.push('/app/myaccount')}>User Account</Button>
                        <Button bsStyle="primary" onClick={()=>this.props.history.push('/app/myworkoutlist')}>My Workout List</Button>
                        <br/>
                        {
                            this.state.auth?
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <Button bsStyle="primary" onClick={()=>this.setState({addVid:true})}>Add Workout Video</Button>
                                    <Button bsStyle="primary" onClick={()=>this.setState({addCategory:true})}>Add Category</Button>
                                    <br/>
                                </div>
                                :
                                null
                        }

                        <Button bsStyle="primary" onClick={()=>firebaseFunctions.logout()}>Log Out</Button>
                        <br/>
                        <p>Github : <a href="https://github.com/wodnjs6512/quadpower">https://github.com/wodnjs6512/quadpower</a></p>
                    </ButtonGroup>
                    {this.state.addVid?this.addVid():null}
                    {this.state.addCategory?this.addCategory():null}
                </div>
            );
        }

    }
}


export default LeftNav;
