/**
 * Created by jaewonlee on 2017. 12. 22..
 */
import React, { Component } from 'react';
import {
    DropdownButton,
    ButtonGroup,
    Button,

} from 'react-bootstrap';

//firebase
import * as firebase from 'firebase';
import * as firebaseFunction from './../../firebase/functions'

//injury option
import * as options from './../../options/option'

var currentUser


//styles

class LevelOfInjuries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            loading:true,
            width:window.innerWidth,
            height:window.innerHeight,
        };
        this._onSelect = this._onSelect.bind(this);
    }
    _onSelect(i){
        //set this value
        var done = false;

        done = firebaseFunction.initializeUser(options.loiOption[i]);
        //
        //this.props.history.push('/app/main');
        if(done){
            this.props.history.push('/app/main');
        }


        //this.setState({redirect:true})
    }
    componentWillMount() {
        this.setState({loading:true})

        if (!firebase.auth().currentUser) {
            this.props.history.push('/login');
        }
        currentUser= firebase.auth().currentUser;
         firebase.database().ref('/users/' + currentUser.uid+'/loi').once('value').then((snapshot) =>{
            if(snapshot.val()!==null){
                this.props.history.push('/app/main')
            }
         })
        this.setState({loading:false})
        //firebaseFunction.checkLoi(this.props)
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
        if(this.state.loading){
            return(
                <div c>
                    Loading
                </div>
            )
        }
        return (
            <div className="center" style={{flexDirection:'column',height:'100%'}}>
                <div className="center">
                    <b style={{paddingRight:10, fontSize:25}}>Level Of Injury</b>
                    <DropdownButton title="Choose your Level of Injury" id="bg-dropdown" style={{fontSize:20}}>
                        <div style={{height:'auto',maxHeight:'200px',overflow:'scroll', overflowX:'hidden',width:'100%'}}>
                            <ButtonGroup vertical block style={{width:'100%'}}>
                                {
                                    options.loiOption.map(
                                        (item, i) =>{
                                            return (
                                                <Button key ={i} onClick={()=>this._onSelect(i)}>{item}</Button>
                                            )
                                        }
                                    )
                                }
                            </ButtonGroup>
                        </div>
                    </DropdownButton>
                </div>

                <br/>
                <div>
                    * This question will only be asked once. This can be changed in the User Account later, if needed.
                </div>

            </div>
        );
    }
}

export default LevelOfInjuries;
