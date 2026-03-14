import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function MemberList({ navigation }){

const members = [
  {id:"1", name:"Somchai", email:"somchai@email.com"},
  {id:"2", name:"Suda", email:"suda@email.com"},
  {id:"3", name:"Anan", email:"anan@email.com"},
];

return(
<View style={styles.container}>

<TouchableOpacity onPress={()=>navigation.goBack()}>
<Text style={styles.back}>⬅ Back</Text>
</TouchableOpacity>

<Text style={styles.title}>Member List</Text>

<FlatList
data={members}
keyExtractor={(item)=>item.id}
renderItem={({item})=>(
<View style={styles.card}>
<Text style={styles.name}>{item.name}</Text>
<Text style={styles.email}>{item.email}</Text>
</View>
)}
/>

</View>
);
}

const styles = StyleSheet.create({
container:{
flex:1,
padding:20,
backgroundColor:"#f5f5f5"
},

back:{
fontSize:18,
color:"#0766f7",
marginBottom:10
},

title:{
fontSize:24,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:8,
marginBottom:10,
elevation:3
},

name:{
fontSize:18,
fontWeight:"bold"
},

email:{
color:"#555",
marginTop:3
}
});