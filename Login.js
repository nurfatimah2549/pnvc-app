import React, { useState } from 'react';
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
Platform,
StatusBar,
ActivityIndicator
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";

export default function Login() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showPass, setShowPass] = useState(false);

const { login } = useUserAuth();
const navigation = useNavigation();

const topOffset =
Platform.OS === 'android'
? (StatusBar.currentHeight || 24) + 8
: 10;

const handleLogin = async () => {

setError('');

if (!email || !password) {
setError('กรุณากรอกอีเมลและรหัสผ่าน');
return;
}

try {

setLoading(true);

const userCredential = await login(email, password);
const user = userCredential.user;

const db = getDatabase(app);

const snapshot = await get(ref(db, "users/" + user.uid));

if (snapshot.exists()) {

const data = snapshot.val();

if (data.role === "admin") {

navigation.replace("AdminHome");

} else {

navigation.replace("Main");

}

} else {

setError("ไม่พบข้อมูลผู้ใช้");

}

} catch (err) {

setError("เข้าสู่ระบบไม่สำเร็จ");

} finally {

setLoading(false);

}

};

return (

<LinearGradient
colors={['#0d1f35','#17395c','#234a78','#2d5f99']}
style={styles.container}
>

<View style={[styles.header,{top:topOffset}]}>
<TouchableOpacity
onPress={()=>navigation.navigate('Main')}
style={styles.backButton}
>
<Text style={styles.backText}>‹ ย้อนกลับ</Text>
</TouchableOpacity>
</View>

<View style={styles.bgCircle1}/>
<View style={styles.bgCircle2}/>
<View style={styles.bgCircle3}/>
<View style={styles.bgCircle4}/>

<View style={styles.logoWrap}>
<Text style={styles.logo}>ระบบลงคะแนนอิเล็กทรอนิกส์</Text>
<Text style={styles.subtitle}>กรุณาล็อกอินเข้าสู่ระบบ</Text>
</View>

<View style={styles.card}>

{error ? 
<View style={styles.errorBox}>
<Text style={styles.error}>{error}</Text>
</View>
: null}

<View style={styles.inputBox}>
<MaterialIcons name="email" size={22} color="#234a78"/>
<TextInput
style={styles.input}
placeholder="อีเมล"
placeholderTextColor="#888"
value={email}
onChangeText={setEmail}
keyboardType="email-address"
autoCapitalize="none"
/>
</View>

<View style={styles.inputBox}>
<MaterialIcons name="lock" size={22} color="#234a78"/>

<TextInput
style={styles.input}
placeholder="รหัสผ่าน"
placeholderTextColor="#888"
value={password}
onChangeText={setPassword}
secureTextEntry={!showPass}
/>

<TouchableOpacity
onPress={()=>setShowPass(!showPass)}
>
<MaterialIcons
name={showPass ? "visibility" : "visibility-off"}
size={22}
color="#888"
/>
</TouchableOpacity>

</View>

<LinearGradient
colors={['#3b7ddd','#234a78']}
style={styles.loginButton}
>

<TouchableOpacity
onPress={handleLogin}
disabled={loading}
style={styles.buttonInner}
activeOpacity={0.8}
>

{loading
? <ActivityIndicator color="#fff"/>
: <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
}

</TouchableOpacity>

</LinearGradient>

<TouchableOpacity
onPress={()=>navigation.navigate('Register')}
style={styles.registerLink}
>
<Text style={styles.linkText}>
ยังไม่มีบัญชี? สมัครสมาชิก
</Text>
</TouchableOpacity>

</View>

</LinearGradient>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:'center',
alignItems:'center'
},

bgCircle1:{
position:'absolute',
width:300,
height:300,
borderRadius:150,
backgroundColor:'#4c8cff',
top:-120,
right:-80,
opacity:0.35
},

bgCircle2:{
position:'absolute',
width:220,
height:220,
borderRadius:110,
backgroundColor:'#6ea3ff',
bottom:-40,
left:-80,
opacity:0.3
},

bgCircle3:{
position:'absolute',
width:140,
height:140,
borderRadius:70,
backgroundColor:'#ffffff',
top:160,
left:-40,
opacity:0.08
},

bgCircle4:{
position:'absolute',
width:120,
height:120,
borderRadius:60,
backgroundColor:'#ffffff',
bottom:200,
right:-30,
opacity:0.05
},

logoWrap:{
marginBottom:35,
alignItems:'center'
},

logo:{
fontSize:24,
fontWeight:'bold',
color:'#ffffff',
letterSpacing:1.3,
textShadowColor:'rgba(0,0,0,0.4)',
textShadowOffset:{width:0,height:3},
textShadowRadius:8
},

subtitle:{
color:'#e2ecf7',
marginTop:6,
fontSize:14
},

card:{
width:'88%',
backgroundColor:'rgba(255,255,255,0.97)',
padding:30,
borderRadius:32,

shadowColor:'#000',
shadowOffset:{width:0,height:25},
shadowOpacity:0.35,
shadowRadius:30,
elevation:25
},

inputBox:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#f8faff',
borderRadius:18,
paddingHorizontal:14,
marginBottom:16,

borderWidth:1,
borderColor:'#e5edf7'
},

input:{
flex:1,
padding:14,
fontSize:16
},

loginButton:{
borderRadius:18,
marginTop:14,

shadowColor:'#234a78',
shadowOffset:{width:0,height:10},
shadowOpacity:0.7,
shadowRadius:12,
elevation:15
},

buttonInner:{
padding:16,
alignItems:'center'
},

loginText:{
color:'#fff',
fontSize:17,
fontWeight:'bold',
letterSpacing:1
},

errorBox:{
backgroundColor:'#ffecec',
padding:12,
borderRadius:10,
marginBottom:14,
borderWidth:1,
borderColor:'#ffb3b3'
},

error:{
color:'#cc0000',
textAlign:'center'
},

registerLink:{
marginTop:22,
alignItems:'center'
},

linkText:{
color:'#234a78',
fontWeight:'700'
},

header:{
position:'absolute',
left:12
},

backButton:{
padding:10
},

backText:{
color:'#fff',
fontSize:16
}

});