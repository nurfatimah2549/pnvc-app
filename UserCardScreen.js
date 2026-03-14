import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";

export default function UserCardScreen(){

const [profileImage,setProfileImage] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const loadUser = async()=>{

const auth = getAuth();
const user = auth.currentUser;

const db = getDatabase(app);
const snapshot = await get(ref(db,"users/"+user.uid));

if(snapshot.exists()){

const data = snapshot.val();
setProfileImage(data.photo);

}

setLoading(false);

};

loadUser();

},[]);

if(loading){

return(
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<ActivityIndicator size="large"/>
</View>
)

}

return(

<ScrollView contentContainerStyle={styles.container}>

<Image
source={{uri:profileImage}}
style={styles.avatar}
/>

<Text style={styles.name}>ผู้ใช้งานระบบ</Text>

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{
flexGrow:1,
justifyContent:"center",
alignItems:"center"
},

avatar:{
width:120,
height:120,
borderRadius:60
},

name:{
fontSize:20,
marginTop:20
}

})