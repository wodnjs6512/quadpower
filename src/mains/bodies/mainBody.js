/**
 * Created by jaewonlee on 2017. 12. 22..
 */
import React, { Component } from 'react';
import {
    Col,
    Button,
    ButtonGroup
} from 'react-bootstrap';
import * as styles from './../../styles'
import * as firebase from 'firebase'
import * as firebaseFunction from './../../firebase/functions'

class MainBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height:window.innerHeight,
            width:window.innerWidth
        };
        this.buttonAdapter= this.buttonAdapter.bind(this);
    }

    buttonAdapter(i){
        switch(i){
            case 1 :
                this.props.history.push("/app/select/aero");
                break;
            case 2 :
                this.props.history.push("/app/select/str");
                break;
            case 3 :
                this.props.history.push("/app/select/flex");
                break;
            case 4 :
                this.props.history.push("/app/select/relax");
                break;
            case 5 :
                this.props.history.push("/app/genworkoutlist");
                break;
            default:
                break;
        }
    }
    resize = () => {
        this.setState({height:window.innerHeight,width:window.innerWidth})
    }
    componentWillMount(){
        if (!firebase.apps.length) {
            firebase.init();
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    render() {
        return (
            <div className="center" style={{flexDirection:'column',height:this.state.height}}>
                <div className="center" style={{flexDirection:'column',background:"#3780ab",width:'100%',height:100,color:'white',fontSize:30}}>
                    <b style={{border:'solid',borderWidth:5,padding:5}}>Build New Workout</b>
                </div>
                <div style={{width:'100%',height:this.state.height-100}}>
                    <Col lg={6} md={6} sm={6} xs={12} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',border:'solid',borderColor:"#3780ab",height:this.state.height-100,borderBottom:'none'}}>
                        <b style={styles.sectionTitle}>What would you like to work on?</b>
                        <br/>
                        <ButtonGroup vertical>
                            <Button bsStyle="primary" onClick={()=>this.buttonAdapter(1)} style={styles.buttonStyle}>Aerobics</Button>
                            <br/>
                            <Button bsStyle="primary" onClick={()=>this.buttonAdapter(2)} style={styles.buttonStyle}>Strength</Button>
                            <br/>
                            <Button bsStyle="primary" onClick={()=>this.buttonAdapter(3)} style={styles.buttonStyle}>Flexibility</Button>
                            <br/>
                            <Button bsStyle="primary" onClick={()=>this.buttonAdapter(4)} style={styles.buttonStyle}>Relaxation</Button>
                        </ButtonGroup>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',border:'solid',borderColor:"#3780ab",height:this.state.height-100,borderBottom:'none'}}>
                        <b style={styles.sectionTitle}>OR</b>
                        <br/>
                        <Button bsStyle="primary" onClick={()=>this.buttonAdapter(5)} style={styles.buttonStyle}>Generate Exercise Plan</Button>
                        <br/>
                        * This Generates Random Exercise, will not be saved as list.
                        <br/>
                        1 Aerobics, 2 Strength, 1 Flexibility and 1 Relaxation Exercise routine will be generated
                    </Col>
                </div>
            </div>
        );
    }
}

export default MainBody;
