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
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebase";

export default function SettingScreen({ navigation }) {

const { logOut, user } = useUserAuth();

const [menu,setMenu] = useState(null);
const [users,setUsers] = useState([]);
const [votes,setVotes] = useState([]);

useEffect(()=>{

const db = getDatabase(app);

/* USERS */
const usersRef = ref(db,"users");

onValue(usersRef,(snapshot)=>{

const data = snapshot.val();

if(data){
const list = Object.values(data);
setUsers(list);
}else{
setUsers([]);
}

});

const voteRef = ref(db,"votes");

onValue(voteRef,(snapshot)=>{

const data = snapshot.val();

if(data){

const list = Object.values(data);
setVotes(list);

}else{

setVotes([]);

}

});

},[]);


const handleLogout = async () => {
await logOut();
navigation.navigate("Login");
};

return (

<LinearGradient
colors={["#dfe7ff","#f1f4ff","#ffffff"]}
style={{flex:1}}
>

<ScrollView contentContainerStyle={styles.container}>

<View style={styles.bgCircle1}/>
<View style={styles.bgCircle2}/>
<View style={styles.bgSquare1}/>
<View style={styles.bgSquare2}/>

<LinearGradient
colors={["#1a3555","#234a78","#2f537c"]}
style={styles.header}
>

<Text style={styles.adminText}>ADMIN DASHBOARD</Text>

</LinearGradient>

<View style={styles.profileCard}>

<View style={styles.avatarCircle}>

<Image
source={require("../assets/profile.jpg")}
style={styles.avatar}
/>

</View>

<Text style={styles.email}>{user?.email}</Text>

</View>

<View style={styles.menuBox}>

<TouchableOpacity
style={styles.menuItem}
onPress={()=>setMenu("users")}
activeOpacity={0.7}
>

<View style={styles.iconCircle}>
<MaterialIcons name="person" size={22} color="#fff" />
</View>

<Text style={styles.menuText}>ข้อมูลผู้ใช้ทั้งหมด</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.menuItem}
onPress={()=>setMenu("votes")}
activeOpacity={0.7}
>

<View style={styles.iconCircle}>
<MaterialIcons name="how-to-vote" size={22} color="#fff" />
</View>

<Text style={styles.menuText}>แสดงผลโหวตทั้งหมด</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.menuItem}
onPress={()=>setMenu("contact")}
activeOpacity={0.7}
>

<View style={styles.iconCircle}>
<MaterialIcons name="help-outline" size={22} color="#fff" />
</View>

<Text style={styles.menuText}>ช่องทางการติดต่อ</Text>

</TouchableOpacity>

</View>

{menu === "users" && (

<View style={styles.dataBox}>

<Text style={styles.dataTitle}>สมาชิกทั้งหมด</Text>

<FlatList
data={users}
keyExtractor={(item,index)=>index.toString()}
renderItem={({item})=>(

<View style={styles.card}>

<Text style={styles.cardTitle}>👤 USER</Text>

<Text style={styles.cardText}>อีเมล: {item.email}</Text>

<Text style={styles.cardText}>รหัสนักศึกษา: {item.studentId}</Text>

</View>

)}
/>

</View>

)}

{menu === "votes" && (

<View style={styles.dataBox}>

<Text style={styles.dataTitle}>รายการโหวต</Text>

<FlatList
data={votes}
keyExtractor={(item,index)=>index.toString()}
renderItem={({item})=>(

<View style={styles.card}>

<Text style={styles.voteTitle}>{item.title}</Text>

<Text style={styles.voteYes}>👍 เห็นด้วย : {item.votesCount || 0}</Text>

<Text style={styles.voteNo}>👎 ไม่เห็นด้วย : {item["ไม่เห็นด้วย"] || 0}</Text>

</View>

)}
/>

</View>

)}

{menu === "contact" && (

<View style={styles.dataBox}>

<Text style={styles.dataTitle}>ติดต่อผู้พัฒนา</Text>

<Text style={styles.contact}>📧 Email : nurfatimah2549@gmail.com</Text>

</View>

)}

<TouchableOpacity
style={styles.logoutBtn}
onPress={handleLogout}
activeOpacity={0.8}
>

<MaterialIcons name="logout" size={22} color="#fff" />

<Text style={styles.logoutText}>ออกจากระบบ</Text>

</TouchableOpacity>

</ScrollView>

</LinearGradient>

);
}

const styles = StyleSheet.create({

container:{
flexGrow:1,
alignItems:"center",
paddingBottom:50
},

header:{
width:"100%",
paddingTop:65,
paddingBottom:40,
borderBottomLeftRadius:45,
borderBottomRightRadius:45,
alignItems:"center",
marginBottom:25,
elevation:6
},

adminText:{
fontSize:26,
fontWeight:"bold",
color:"#fff",
letterSpacing:1.5
},

profileCard:{
width:"90%",
backgroundColor:"#ffffff",
alignItems:"center",
padding:28,
borderRadius:22,
marginBottom:20,
shadowColor:"#000",
shadowOpacity:0.18,
shadowRadius:15,
shadowOffset:{width:0,height:8},
elevation:6
},

avatarCircle:{
backgroundColor:"#f3f6fb",
borderRadius:100,
padding:8
},

avatar:{
width:95,
height:95,
borderRadius:50
},

email:{
marginTop:12,
fontSize:16,
color:"#2f537c",
fontWeight:"600"
},

menuBox:{
width:"90%",
backgroundColor:"#fff",
borderRadius:20,
shadowColor:"#000",
shadowOpacity:0.12,
shadowRadius:10,
shadowOffset:{width:0,height:5},
elevation:4
},

menuItem:{
flexDirection:"row",
alignItems:"center",
padding:20,
borderBottomWidth:0.6,
borderColor:"#eee"
},

iconCircle:{
backgroundColor:"#2f537c",
padding:10,
borderRadius:12
},

menuText:{
marginLeft:16,
fontSize:16,
fontWeight:"600",
color:"#333"
},

dataBox:{
width:"90%",
backgroundColor:"#fff",
marginTop:22,
padding:20,
borderRadius:20,
shadowColor:"#000",
shadowOpacity:0.12,
shadowRadius:10,
shadowOffset:{width:0,height:5},
elevation:4
},

dataTitle:{
fontSize:19,
fontWeight:"bold",
marginBottom:12,
color:"#2f537c"
},

card:{
backgroundColor:"#f4f7fb",
padding:16,
borderRadius:14,
marginBottom:12
},

cardTitle:{
fontWeight:"bold",
marginBottom:6,
color:"#2f537c"
},

cardText:{
color:"#444"
},

voteTitle:{
fontWeight:"bold",
fontSize:16,
marginBottom:6,
color:"#2f537c"
},

voteYes:{
color:"#1e8e3e",
marginBottom:3
},

voteNo:{
color:"#c5221f"
},

contact:{
fontSize:15,
color:"#444"
},

logoutBtn:{
flexDirection:"row",
backgroundColor:"#2f537c",
padding:18,
borderRadius:16,
marginTop:28,
width:"90%",
justifyContent:"center",
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.2,
shadowRadius:10,
shadowOffset:{width:0,height:5},
elevation:6
},

logoutText:{
color:"#fff",
fontSize:16,
fontWeight:"bold",
marginLeft:10
},

bgCircle1:{
position:"absolute",
width:320,
height:320,
backgroundColor:"#a9bbff",
borderRadius:200,
top:-120,
left:-100,
opacity:0.35
},

bgCircle2:{
position:"absolute",
width:260,
height:260,
backgroundColor:"#c7c3ff",
borderRadius:200,
bottom:80,
right:-120,
opacity:0.35
},

bgSquare1:{
position:"absolute",
width:140,
height:140,
backgroundColor:"#e6ebff",
top:200,
left:-40,
transform:[{rotate:"25deg"}],
borderRadius:20,
opacity:0.6
},

bgSquare2:{
position:"absolute",
width:120,
height:120,
backgroundColor:"#dde4ff",
bottom:200,
right:-30,
transform:[{rotate:"25deg"}],
borderRadius:20,
opacity:0.6
}

});