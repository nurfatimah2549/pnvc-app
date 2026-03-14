import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

export default function AdminLogin({ navigation }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const auth = getAuth(app);

  const handleLogin = async ()=>{

    try{

      const userCredential = await signInWithEmailAndPassword(auth,email,password);

      const user = userCredential.user;

      // ตรวจว่าเป็น admin หรือไม่
      if(user.email === "nurfatimah2549@gmail.com"){

        Alert.alert("Admin Login Success");
        navigation.navigate("Main");

      }else{

        Alert.alert("คุณไม่ใช่ Admin");

      }

    }catch(error){

      Alert.alert("Login Error",error.message);

    }

  };

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Admin Login</Text>

      <TextInput
      placeholder="Email"
      style={styles.input}
      value={email}
      onChangeText={setEmail}
      />

      <TextInput
      placeholder="Password"
      secureTextEntry
      style={styles.input}
      value={password}
      onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:20
},

title:{
fontSize:26,
fontWeight:"bold",
textAlign:"center",
marginBottom:30
},

input:{
borderWidth:1,
borderColor:"#ccc",
padding:12,
borderRadius:8,
marginBottom:15
},

button:{
backgroundColor:"#0766f7",
padding:15,
borderRadius:8,
alignItems:"center"
},

text:{
color:"#fff",
fontWeight:"bold"
}

});