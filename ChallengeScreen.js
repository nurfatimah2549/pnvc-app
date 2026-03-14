import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TouchableOpacity,
TextInput,
Alert
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { getDatabase, ref, onValue } from "firebase/database";

export default function ChallengeScreen() {

const [challenges,setChallenges] = useState([])
const [score,setScore] = useState(0)
const [currentGame,setCurrentGame] = useState(null)

const [tap,setTap] = useState(0)
const [guess,setGuess] = useState("")
const [targetNumber,setTargetNumber] = useState(Math.floor(Math.random()*10)+1)

//////////////////////
// LOAD CHALLENGES
//////////////////////

useEffect(()=>{

const db = getDatabase()
const challengeRef = ref(db,"challenges")

onValue(challengeRef,(snapshot)=>{

const data = snapshot.val()

if(data){

const list = Object.keys(data).map(key=>({
id:key,
...data[key]
}))

setChallenges(list)

}

})

},[])

//////////////////////
// REWARD PLAYER
//////////////////////

const reward = ()=>{

setScore(prev => prev + 30)

Alert.alert("สำเร็จ","คุณได้รับ 30 เหรียญ!")

setCurrentGame(null)
setTap(0)
setGuess("")

}

//////////////////////
// GAME UI
//////////////////////

if(currentGame){

if(currentGame.game === "tap"){

return(

<LinearGradient colors={["#eef4ff","#f9fbff"]} style={styles.container}>

<View style={styles.gameCard}>

<Text style={styles.gameHeader}>กดปุ่มให้ครบ 10 ครั้ง</Text>

<Text style={styles.score}>{tap}/10</Text>

<TouchableOpacity
onPress={()=>{

const newTap = tap + 1
setTap(newTap)

if(newTap >= 10){
reward()
}

}}
>

<LinearGradient
colors={["#2f537c","#5b8ed8"]}
style={styles.gameButton}
>

<Text style={styles.buttonText}>TAP</Text>

</LinearGradient>

</TouchableOpacity>

</View>

</LinearGradient>

)

}

if(currentGame.game === "guess"){

return(

<LinearGradient colors={["#eef4ff","#f9fbff"]} style={styles.container}>

<View style={styles.gameCard}>

<Text style={styles.gameHeader}>
ทายเลข 1 - 10
</Text>

<TextInput
style={styles.input}
value={guess}
onChangeText={setGuess}
keyboardType="numeric"
/>

<TouchableOpacity
onPress={()=>{

if(parseInt(guess) === targetNumber){
reward()
}else{
Alert.alert("ผิด","ลองใหม่")
}

}}
>

<LinearGradient
colors={["#2f537c","#5b8ed8"]}
style={styles.gameButton}
>

<Text style={styles.buttonText}>ทาย</Text>

</LinearGradient>

</TouchableOpacity>

</View>

</LinearGradient>

)

}

return(

<LinearGradient colors={["#eef4ff","#f9fbff"]} style={styles.container}>

<View style={styles.gameCard}>

<Text style={styles.gameHeader}>
เกมจำสี
</Text>

<Text style={{marginBottom:20}}>
กดปุ่มเพื่อรับรางวัล
</Text>

<TouchableOpacity onPress={reward}>

<LinearGradient
colors={["#2f537c","#5b8ed8"]}
style={styles.gameButton}
>

<Text style={styles.buttonText}>
สำเร็จ
</Text>

</LinearGradient>

</TouchableOpacity>

</View>

</LinearGradient>

)

}

//////////////////////
// CHALLENGE LIST
//////////////////////

const renderItem = ({item})=>{

return(

<View style={styles.cardShadow}>

<LinearGradient
colors={["#ffffff","#f7faff"]}
style={styles.card}
>

<Text style={styles.title}>
{item.title}
</Text>

<Text style={styles.description}>
{item.description}
</Text>

<Text style={styles.points}>
🎁 โบนัส 30 เหรียญ
</Text>

<TouchableOpacity
onPress={()=>setCurrentGame(item)}
>

<LinearGradient
colors={["#2f537c","#5b8ed8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
เล่นเกม
</Text>

</LinearGradient>

</TouchableOpacity>

</LinearGradient>

</View>

)

}

return(

<LinearGradient
colors={["#eef4ff","#ffffff"]}
style={{flex:1}}
>

{/* HEADER ห้ามแก้ */}

<View style={styles.topHeader}>

<Text style={styles.challengeTitle}>
🏆 Challenge Games
</Text>

<Text style={styles.coinText}>
เหรียญของคุณ : {score}
</Text>

</View>

<View style={{padding:20,flex:1}}>

<FlatList
data={challenges}
renderItem={renderItem}
keyExtractor={(item)=>item.id}
showsVerticalScrollIndicator={false}
/>

</View>

</LinearGradient>

)

}

const styles = StyleSheet.create({

topHeader:{
backgroundColor:"#2f537c",
paddingTop:45,
paddingBottom:25,
borderBottomLeftRadius:35,
borderBottomRightRadius:35,
alignItems:"center"
},

challengeTitle:{
color:"#fff",
fontSize:24,
fontWeight:"bold"
},

coinText:{
color:"#e0e8f3",
fontSize:16,
marginTop:5
},

container:{
flex:1,
padding:20,
justifyContent:"center"
},

gameCard:{
backgroundColor:"#fff",
padding:40,
borderRadius:26,
alignItems:"center",
shadowColor:"#2f537c",
shadowOpacity:0.2,
shadowRadius:20,
elevation:10
},

gameHeader:{
fontSize:26,
fontWeight:"bold",
textAlign:"center",
marginBottom:20
},

score:{
fontSize:26,
fontWeight:"bold",
color:"#2f537c",
marginBottom:20
},

cardShadow:{
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:15,
elevation:6,
marginBottom:20
},

card:{
padding:28,
borderRadius:24
},

title:{
fontSize:22,
fontWeight:"bold"
},

description:{
color:"#666",
marginVertical:12,
lineHeight:21
},

points:{
color:"#ff9800",
fontWeight:"bold",
marginBottom:16
},

button:{
paddingVertical:14,
borderRadius:14,
alignItems:"center"
},

gameButton:{
paddingVertical:22,
paddingHorizontal:60,
borderRadius:18,
alignItems:"center"
},

buttonText:{
color:"white",
fontWeight:"bold",
fontSize:17
},

input:{
borderWidth:1,
borderColor:"#e0e0e0",
padding:13,
marginBottom:15,
borderRadius:12,
textAlign:"center",
width:"100%"
}

});