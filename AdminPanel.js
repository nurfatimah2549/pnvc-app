import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

export default function AdminPanel({ navigation }){

const [voteName,setVoteName] = useState("");
const [showInput,setShowInput] = useState(false);

const addVote = ()=>{
if(voteName===""){
alert("Please enter vote name");
return;
}

alert("Vote Item Added : " + voteName);
setVoteName("");
setShowInput(false);
};

return(
<View style={styles.container}>

<Text style={styles.title}>Admin Dashboard</Text>

<TouchableOpacity style={styles.card} onPress={()=>setShowInput(true)}>
<Text style={styles.cardText}>➕ Add Vote Item</Text>
</TouchableOpacity>

{showInput && (
<View style={styles.inputBox}>

<TextInput
placeholder="Enter vote item name"
style={styles.input}
value={voteName}
onChangeText={setVoteName}
/>

<TouchableOpacity style={styles.addButton} onPress={addVote}>
<Text style={styles.addText}>Add Vote</Text>
</TouchableOpacity>

</View>
)}

<TouchableOpacity style={styles.card} onPress={()=>navigation.navigate("VoteResults")}>
<Text style={styles.cardText}>📊 View Vote Results</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card} onPress={()=>navigation.navigate("MemberList")}>
<Text style={styles.cardText}>👥 Manage Users</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.card} onPress={()=>navigation.navigate("VoteHistory")}>
<Text style={styles.cardText}>🗳 Vote History</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.logout} onPress={()=>alert("Logout")}>
<Text style={styles.logoutText}>🚪 Logout</Text>
</TouchableOpacity>

</View>
);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f5f5f5",
alignItems:"center",
paddingTop:80
},

title:{
fontSize:28,
fontWeight:"bold",
marginBottom:40
},

card:{
width:"80%",
backgroundColor:"#0766f7",
padding:20,
borderRadius:10,
marginBottom:15,
alignItems:"center"
},

cardText:{
color:"#fff",
fontSize:18,
fontWeight:"bold"
},

inputBox:{
width:"80%",
backgroundColor:"#fff",
padding:15,
borderRadius:10,
marginBottom:15
},

input:{
borderWidth:1,
borderColor:"#ccc",
padding:10,
borderRadius:5,
marginBottom:10
},

addButton:{
backgroundColor:"#28a745",
padding:12,
borderRadius:5,
alignItems:"center"
},

addText:{
color:"#fff",
fontWeight:"bold"
},

logout:{
marginTop:30
},

logoutText:{
fontSize:16,
color:"red"
}

});