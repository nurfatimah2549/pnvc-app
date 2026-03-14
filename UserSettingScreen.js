import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
FlatList,
ScrollView,
Image
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserAuth } from "../context/UserAuthContext";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../firebase";

export default function SettingScreen({ navigation }) {

const { logOut, user } = useUserAuth();

const [menu,setMenu] = useState(null);
const [myVotes,setMyVotes] = useState([]);
const [photo,setPhoto] = useState(null);

useEffect(()=>{

const db = getDatabase(app);

const historyRef = ref(db,"voteHistory");

onValue(historyRef,(snapshot)=>{

const data = snapshot.val();

if(data){

const list = Object.values(data);

const userVotes = list.filter(
v => v.userEmail === user?.email
);

setMyVotes(userVotes);

}

});

},[]);


useEffect(()=>{

const loadPhoto = async()=>{

const auth = getAuth();
const currentUser = auth.currentUser;

if(!currentUser) return;

const db = getDatabase(app);

const snapshot = await get(ref(db,"users/"+currentUser.uid));

if(snapshot.exists()){

const data = snapshot.val();

setPhoto(data.photo);

}

};

loadPhoto();

},[]);


const handleLogout = async () => {
await logOut();
navigation.navigate("Login");
};

return (

<LinearGradient
colors={["#f8fbff","#e9f2ff","#dce8ff"]}
style={{flex:1}}
>

<ScrollView contentContainerStyle={styles.container}>

{/* HEADER */}

<View style={styles.header}>
<Text style={styles.title}>โปรไฟล์ของฉัน</Text>
</View>

{/* PROFILE */}

<View style={styles.profileCard}>

{photo ? (
<Image
source={{ uri: photo }}
style={styles.avatar}
/>
) : (
<MaterialIcons name="account-circle" size={95} color="#2f537c" />
)}

<Text style={styles.email}>
{user?.email}
</Text>

<Text style={styles.subText}>
ผู้ใช้งานระบบโหวต
</Text>

</View>


{/* MENU */}

<View style={styles.menuBox}>

<TouchableOpacity
style={styles.menuItem}
onPress={()=>setMenu("myvote")}
>

<MaterialIcons name="how-to-vote" size={22} color="#2f537c" />

<Text style={styles.menuText}>
ประวัติการโหวตของฉัน
</Text>

</TouchableOpacity>

</View>


{/* VOTE HISTORY */}

{menu === "myvote" && (

<View style={styles.dataBox}>

<Text style={styles.dataTitle}>
ประวัติการโหวต
</Text>

{myVotes.length === 0 ? (

<Text style={{textAlign:"center",color:"#777"}}>
ยังไม่มีประวัติการโหวต
</Text>

) : (

<FlatList
data={myVotes}
keyExtractor={(item,index)=>index.toString()}
renderItem={({item})=>(

<View style={styles.card}>

<Text style={styles.voteTitle}>
{item.title}
</Text>

<Text style={styles.voteChoice}>
ผลโหวต : {item.choice}
</Text>

</View>

)}
/>

)}

</View>

)}


{/* LOGOUT */}

<TouchableOpacity
style={styles.logoutBtn}
onPress={handleLogout}
>

<MaterialIcons name="logout" size={22} color="#fff" />

<Text style={styles.logoutText}>
ออกจากระบบ
</Text>

</TouchableOpacity>

</ScrollView>

</LinearGradient>

);
}

const styles = StyleSheet.create({

container:{
flexGrow:1,
alignItems:"center",
paddingBottom:40
},

header:{
width:"100%",
backgroundColor:"#2f537c",
paddingTop:65,
paddingBottom:35,
borderBottomLeftRadius:40,
borderBottomRightRadius:40,
alignItems:"center",
marginBottom:25
},

title:{
fontSize:28,
fontWeight:"bold",
color:"#fff",
letterSpacing:1
},

profileCard:{
width:"90%",
backgroundColor:"#ffffff",
alignItems:"center",
padding:30,
borderRadius:22,
marginBottom:20,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:15,
elevation:5
},

avatar:{
width:95,
height:95,
borderRadius:50
},

email:{
marginTop:12,
fontSize:17,
fontWeight:"bold",
color:"#2f537c"
},

subText:{
fontSize:13,
color:"#777"
},

menuBox:{
width:"90%",
backgroundColor:"#ffffff",
borderRadius:22,
shadowColor:"#000",
shadowOpacity:0.07,
shadowRadius:10,
elevation:3
},

menuItem:{
flexDirection:"row",
alignItems:"center",
padding:20
},

menuText:{
marginLeft:15,
fontSize:16,
fontWeight:"500"
},

dataBox:{
width:"90%",
backgroundColor:"#ffffff",
marginTop:20,
padding:22,
borderRadius:22,
shadowColor:"#000",
shadowOpacity:0.07,
shadowRadius:10,
elevation:3
},

dataTitle:{
fontSize:18,
fontWeight:"bold",
marginBottom:15,
color:"#2f537c"
},

card:{
backgroundColor:"#f4f7fd",
padding:15,
borderRadius:14,
marginBottom:10
},

voteTitle:{
fontSize:16,
fontWeight:"bold"
},

voteChoice:{
fontSize:14,
color:"#555"
},

logoutBtn:{
flexDirection:"row",
backgroundColor:"#2f537c",
padding:16,
borderRadius:16,
marginTop:30,
width:"90%",
justifyContent:"center",
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.2,
shadowRadius:10,
elevation:5
},

logoutText:{
color:"#fff",
fontSize:16,
fontWeight:"bold",
marginLeft:10
}

});