/**
 * Created by jaewonlee on 2018. 1. 10..
 */

import * as firebase from 'firebase';

var strCat = [];
var aeroCat =[]
var flexCat =[]
var relaxCat =[]

var config = {
    apiKey: "AIzaSyAfeaoK55SUzFp_sUyPUcRm7L3ZdhMsMfA",
    authDomain: "quad-power.firebaseapp.com",
    databaseURL: "https://quad-power.firebaseio.com",
    projectId: "quad-power",
    storageBucket: "",
    messagingSenderId: "313495934960"
};

export const init = ()=>{
    firebase.initializeApp(config);
}
export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};

/*
 snapshot.forEach(function(item) {
 var itemVal = item.val();
 keys.push(itemVal);
 });
 for (i=0; i < keys.length; i++) {
 categories.push(keys[i].desc);
 }
 */

export const login =(email,password)=>{
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(()=> {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return firebase.auth().signInWithEmailAndPassword(email, password)
                .then(()=>{
                    alert("Welcome!")
                    //this.props.history.push('/app/loi')
                })
                .catch(function(error) {
                    // Handle Errors here.
                    alert(JSON.stringify(error))

                    if(error){
                        alert("Error Code : "+ error.code +" " +error.message);
                        return;
                    }
                });
        })
        .catch(function(error) {
            // Handle Errors here.

            alert("Error Code : "+ error.code +" " +error.message);
        });
}

export const logout=()=>{
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Successfully Logged out")
    }).catch( function(error) {
        // An error happened.
        alert("Failed To Logout")
    })
}

export const join =(email,password)=>{
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(()=>{
            alert("Successfully Created")
        })
        .catch(function(error) {
            // Handle Errors here.

            if(!error){
                alert("Error Code : "+ error.code +" " +error.message);
            }
        });
}

export const initializeUser = (option,context)=>{
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
        loi:option,
        auth:0,
        workoutList:{

        }

    }).then(()=>{
        context.props.history.push('/app/main');
        return true;
    }).catch((error)=>{
        alert(error)
        return false;
    })
}

export const checkAuthority=(context)=>{
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/auth').once('value').then((snapshot) =>{
        if(snapshot!==null){
            console.log(snapshot.val())
            if(snapshot.val()===1){
                context.setState({auth:true})
            }
        }
    })
}

export const updateUserInfo=(context,username,password,level)=>{
    console.log(password)
    if(username.length>0&&username!==undefined&&username!==null){
        firebase.auth().currentUser.updateProfile({
            displayName: username,
        }).then(()=> {
        }).catch(function(error) {
            console.log(error)
            alert("Failed to update username")
            return;
        });
    }
    console.log(password!==undefined&&password!==null)

    if(password!==undefined&&password!==null){
        firebase.auth().currentUser.updatePassword(password).then(()=> {

        }, function(error) {
            // An error happened.
            console.log(error)
            alert("Failed to update password")
            return;
        });
    }
    firebase.database().ref('/users/'+ firebase.auth().currentUser.uid).update({
        loi:level
    }).then(()=>{
    }).catch(()=>{
        alert("Failed to update level of injury")
        return;
    })
    alert("Update Successful")
    context.setState({edit:false})

}

export const getLoi =(context)=>{
    var value = null;
    if (!firebase.auth().currentUser) {
        context.props.history.push('/login');
    }
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
        if(snapshot.val()!==null){
            console.log(snapshot.val())
            value=snapshot.val()
        }
    }).then(()=>{
        context.setState({
            loading:false,
            username:firebase.auth().currentUser.displayName,
            email:firebase.auth().currentUser.email,
            loi:value,
            password:null,
        })
        return value
    }).catch(()=>{
        alert("failed to load")
    })
}

export const getCat =()=>{
    var categoreis;
    var loi=null
    var nodeRef=null

    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
        if(snapshot.val()!==null){
            console.log(snapshot.val())
            loi=snapshot.val()
        }
    }).then(()=>{
        firebase.database().ref('/category/'+loi).once('value').then((snapshot)=> {
            if (snapshot !== null) {
                var categories = snapshot.toJSON();
                console.log(categories)
                if (categories !== null) {
                    if (aeroCat.length < 1) {
                        for (var category in categories.Aerobics) {
                            aeroCat.push(category.toString())
                        }
                    }
                    if (strCat.length < 1) {
                        for (category in categories.Strength) {
                            strCat.push(category.toString())
                        }
                    }
                    if (flexCat.length < 1) {
                        for (category in categories.Flexibility) {
                            flexCat.push(category.toString())
                        }
                    }
                    if (relaxCat.length < 1) {
                        for (category in categories.Relaxation) {
                            relaxCat.push(category.toString())
                        }
                    }
                }
            }

        }).then(()=>{

        }).catch(()=>{
            alert("failed to load")

        })

    }).catch(()=>{
        alert("failed to load")
    })


    categoreis = [aeroCat,strCat,flexCat,relaxCat];
    return categoreis;
}

export const addCat=(context,category)=>{
    firebase.database().ref('category/' + category.loi +"/"+category.type+"/"+category.part).push({
        desc:category
    })
        .then(()=>{
            context.setState({addCategory:false});
            alert("Update Successful")
        })
        .catch((error)=>alert("Update Failed"))
}

export const addWorkoutList =(context,title)=>{
    firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/workoutList').push({
        title:title,
        list:[],
    }) .then(()=>{
        context.setState({addWorkoutList:false});
        alert("Update Successful")
    })
        .catch((error)=>alert("Update Failed"+error))
}

export const getWorkoutList=(context)=>{
    var keyList=[]
    var itemList = [];
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/workoutList').on('value',(snapshot) =>{

        snapshot.forEach(function(item) {
            if(!keyList.includes(item.key)){
                var value = item.val();
                itemList.push(value);
                keyList.push(item.key);
            }
        });

        context.setState({loading:false,current:0})
    })

    return [keyList,itemList];
}

export const addToWorkoutList = (key,listTitle,itemlist)=>{
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+"/workoutList/"+key).update({
        list:itemlist
    }).then(()=>{
        console.log(itemlist);
        alert("added to "+listTitle);
        return true;
    }).catch((error)=>alert(error+" Failed to add"))
}

export const deleteWorkoutList = (key)=>{
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+"/workoutList/"+key).remove().then(()=>{
        alert("deleted");
    }).catch((error)=>alert(error+" Failed to delete"))
}

export const removeFromWorkoutList = (context,key,itemlist)=>{
    context.setState({loading:true})
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+"/workoutList/"+key).update({
        list:itemlist
    }).then(()=>{
        console.log(itemlist);
        alert("removed");
        context.setState({loading:false})
        return true;
    }).catch((error)=>alert(error+" Failed to Remove"))
}

export const addVid =(context,desc)=>{
    console.log(desc);
    var ref;
    if(desc.part===null){
        firebase.database().ref('vid/' + desc.loi +"/"+desc.type+"/"+"notspec").push({
            desc:desc
        })
            .then(()=>{
                context.setState({addVid:false,
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
                    }
                });
                alert("Upload Successful")
            })
            .catch((error)=>alert("Upload Failed "+error))
    }
    else{
        firebase.database().ref('vid/' + desc.loi +"/"+desc.type+"/"+desc.part).push({
            desc:desc
        })
            .then(()=>{
                context.setState({addVid:false,
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
                    }
                });
                alert("Upload Successful")
            })
            .catch((error)=>alert("Upload Failed "+error))
    }
}

export const getVid = (context,options,title)=>{
    var vidList=[]
    if(options.length<1){
        firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
            var loi=snapshot.toJSON();
                firebase.database().ref('vid/' + loi +"/"+title+"/notspec").once('value').then((snapshot) =>{
                    if(snapshot!==null){
                        //concat vids
                        snapshot.forEach(function(childSnapshot) {
                            var item = childSnapshot.val();
                            item.key = childSnapshot.key;
                            vidList.push(item.desc)
                        });
                        console.log(vidList)
                        context.forceUpdate();
                    }
                })
        })
    }
    else
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
        var loi=snapshot.toJSON();
        for(var i =0; i<options.length;i++){
            var part = options[i]
            console.log('vid/' + loi +"/"+title+"/"+part)
            firebase.database().ref('vid/' + loi +"/"+title+"/"+part).once('value').then((snapshot) =>{
                if(snapshot!==null){
                    //concat vids
                    snapshot.forEach(function(childSnapshot) {
                        var item = childSnapshot.val();
                        item.key = childSnapshot.key;
                        vidList.push(item.desc)
                    });
                    console.log(vidList)
                    context.forceUpdate();
                }
            })
        }
    })
    return vidList;
}

export const genWorkoutList =(context)=>{
    var finalList=[];
    var vidList=[];
    var subset=[];
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/loi').once('value').then((snapshot) =>{
        var loi=snapshot.toJSON();
        firebase.database().ref('vid/' + loi ).once('value').then((snapshot) =>{
            if(snapshot!==null){
                //concat vids
                snapshot.forEach(function(childSnapshot) {
                    childSnapshot.forEach(function(type) {
                        subset=[];
                        type.forEach(function(option){
                            option.forEach(function(item){
                                subset.push(item.val());
                            })
                        })
                        if(childSnapshot.key=="Aerobics"){
                            vidList[0]=subset;
                        }
                        else if(childSnapshot.key=="Strength"){
                            vidList[1]=subset;
                        }
                        else if(childSnapshot.key=="Flexibility"){
                            vidList[2]=subset;
                        }
                        else if(childSnapshot.key=="Relaxation"){
                            vidList[3]=subset;
                        }
                    })
                });
                console.log(vidList);
                for(var i=0;i<4;i++){

                    if(i==1){
                        var temp1 = Math.floor(Math.random()*vidList[i].length);
                        finalList.push(vidList[i][temp1])
                        var temp2 = Math.floor(Math.random()*vidList[i].length);
                        while(Math.abs(temp1-temp2)<1){
                            temp2 = Math.floor(Math.random()*vidList[i].length);
                        }
                        finalList.push(vidList[i][temp2])
                    }
                    else {
                        finalList.push(vidList[i][Math.floor(Math.random()*vidList[i].length)])
                    }

                }

                var keyList=[]
                var itemList = [];
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/workoutList').once('value').then((snapshot) =>{
                    snapshot.forEach(function(item) {
                        var value = item.val();
                        itemList.push(value);
                        keyList.push(item.key);
                    });
                    console.log(keyList)
                    context.setState({loading:false,data:finalList,keyList:keyList,itemList:itemList})
                    return [keyList,itemList];
                })
                    .catch(function(error) {
                        // Handle Errors here.
                        alert("Error Code : "+ error.code +" " +error.message);
                    });


            }
        })
    })
}