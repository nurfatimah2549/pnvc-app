import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function VoteHistory({ navigation }) {

const history = [
  {id:"1", user:"Somchai", vote:"Team A"},
  {id:"2", user:"Suda", vote:"Team B"},
  {id:"3", user:"Anan", vote:"Team A"},
];

return(
<View style={styles.container}>

<TouchableOpacity onPress={()=>navigation.goBack()}>
<Text style={styles.back}>⬅ Back</Text>
</TouchableOpacity>

<Text style={styles.title}>Vote History</Text>

<FlatList
data={history}
keyExtractor={(item)=>item.id}
renderItem={({item})=>(
<View style={styles.card}>
<Text style={styles.name}>{item.user}</Text>
<Text style={styles.vote}>Voted : {item.vote}</Text>
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

vote:{
marginTop:5,
color:"#444"
}

});