/**
 * Created by jaewonlee on 2017. 12. 20..
 */
import React from 'react';

const leftIntro = post => (
    <div>
            <div className="background" style={{width:'100%',height:'100%',backgroundImage:'url('+require('./../images/mainSchoolImage.jpg')+')'}}>
            </div>
            <h2 style={{fontSize:45}}>Welcome to</h2>
            <h1><b>QuadPOWER</b></h1>
            <p>
                    <b>The Excersie App for People with Spinal Cord Injuries</b>
            </p>
            <br/>
            <br/>
            <p>Disclaimer: This Exercise app DOES NOT subsitute a healthcare professional's advice.</p>

            <p>The use of this app is at the discretion and responsibility of the user.</p>


            <img src={require('./../images/McGill_Wordmark.png')} alt="" style={{position:'absolute',bottom:30,left:30,height:'10%'}}/>

    </div>
);

export default leftIntro;