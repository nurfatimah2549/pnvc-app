import React, { useState } from 'react';
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
Platform,
StatusBar,
ActivityIndicator,
Alert
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";

function Register() {

const [firstName,setFirstName] = useState('');
const [lastName,setLastName] = useState('');
const [birthDate,setBirthDate] = useState('');

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showPass, setShowPass] = useState(false);

const { signUp } = useUserAuth();
const navigation = useNavigation();

const topOffset =
Platform.OS === 'android'
? (StatusBar.currentHeight || 24) + 8
: 10;

const handleRegister = async () => {

setError('');

if (!email || !password) {
setError('กรุณากรอกอีเมลและรหัสผ่าน');
return;
}

if (password.length < 6) {
setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
return;
}

try {

setLoading(true);

const userCredential = await signUp(email, password);
const user = userCredential.user;

const db = getDatabase(app);

await set(ref(db, "users/" + user.uid), {

email: email,
role: "user",
profileImage: "",

firstName:firstName,
lastName:lastName,
birthDate:birthDate

});

Alert.alert('สมัครสมาชิกสำเร็จ');

navigation.navigate('Login');

} catch (err) {

const msg = err && err.message
? err.message
: 'เกิดข้อผิดพลาดในการสมัครสมาชิก';

setError(msg);

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

<View style={styles.logoWrap}>
<Text style={styles.logo}>สมัครสมาชิก</Text>
<Text style={styles.subtitle}>สร้างบัญชีผู้ใช้ใหม่</Text>
</View>

<View style={styles.card}>

{error ? <Text style={styles.error}>{error}</Text> : null}

<View style={styles.inputBox}>
<MaterialIcons name="person" size={22} color="#234a78"/>
<TextInput
style={styles.input}
placeholder="ชื่อ"
value={firstName}
onChangeText={setFirstName}
/>
</View>

<View style={styles.inputBox}>
<MaterialIcons name="person-outline" size={22} color="#234a78"/>
<TextInput
style={styles.input}
placeholder="นามสกุล"
value={lastName}
onChangeText={setLastName}
/>
</View>

<View style={styles.inputBox}>
<MaterialIcons name="calendar-today" size={22} color="#234a78"/>
<TextInput
style={styles.input}
placeholder="วันเดือนปีเกิด (เช่น 01/01/2000)"
value={birthDate}
onChangeText={setBirthDate}
/>
</View>

<View style={styles.inputBox}>
<MaterialIcons name="email" size={22} color="#234a78"/>
<TextInput
style={styles.input}
placeholder="อีเมล"
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
onPress={handleRegister}
disabled={loading}
style={styles.buttonInner}
>

{loading
? <ActivityIndicator color="#fff"/>
: <Text style={styles.loginText}>
สมัครสมาชิก
</Text>
}

</TouchableOpacity>

</LinearGradient>

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

logoWrap:{
marginBottom:30,
alignItems:'center'
},

logo:{
fontSize:26,
fontWeight:'bold',
color:'#fff'
},

subtitle:{
color:'#d6e3f5',
marginTop:6
},

card:{
width:'88%',
backgroundColor:'#fff',
padding:25,
borderRadius:25,

shadowColor:'#000',
shadowOffset:{width:0,height:15},
shadowOpacity:0.25,
shadowRadius:20,
elevation:15
},

inputBox:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#f6f9ff',
borderRadius:14,
paddingHorizontal:12,
marginBottom:14
},

input:{
flex:1,
padding:14,
fontSize:15
},

loginButton:{
borderRadius:16,
marginTop:10
},

buttonInner:{
padding:16,
alignItems:'center'
},

loginText:{
color:'#fff',
fontSize:16,
fontWeight:'bold'
},

error:{
color:'red',
textAlign:'center',
marginBottom:10
},

header:{
position:'absolute',
left:10
},

backButton:{
padding:10
},

backText:{
color:'#fff',
fontSize:16
}

});

export default Register;