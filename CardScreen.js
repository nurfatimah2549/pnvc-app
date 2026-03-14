import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";

export default function CardScreen() {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log("ยังไม่ได้ล็อกอิน");
          setLoading(false);
          return;
        }

        const db = getDatabase(app);

        const snapshot = await get(ref(db, "users/" + user.uid));

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }

      } catch (error) {
        console.log("Error:", error);
      }

      setLoading(false);

    };

    fetchUser();

  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>ไม่พบข้อมูลผู้ใช้</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>ข้อมูลผู้ดูแลระบบ</Text>
      </View>

      <View style={styles.card}>

        <Image
          source={
            userData.photo
              ? { uri: userData.photo }
              : require("../assets/profile.jpg")
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData.name}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>รหัสนักศึกษา</Text>
          <Text style={styles.value}>{userData.studentId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>สาขาวิชา</Text>
          <Text style={styles.value}>{userData.major}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>อีเมล</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>เบอร์โทร</Text>
          <Text style={styles.value}>{userData.phone}</Text>
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    backgroundColor:"#F3F4F6",
    alignItems:"center",
    padding:20,
    justifyContent:"center"
  },

  header:{
    width:"100%",
    backgroundColor:"#234a78",
    padding:20,
    borderRadius:20,
    marginBottom:20,
    alignItems:"center"
  },

  headerTitle:{
    fontSize:22,
    color:"#fff",
    fontWeight:"bold"
  },

  card:{
    width:"100%",
    backgroundColor:"#fff",
    borderRadius:25,
    padding:25,
    alignItems:"center"
  },

  avatar:{
    width:120,
    height:120,
    borderRadius:60,
    marginBottom:15
  },

  name:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:20
  },

  infoBox:{
    width:"100%",
    backgroundColor:"#F0F7FF",
    padding:15,
    borderRadius:12,
    marginBottom:12
  },

  label:{
    fontSize:12,
    color:"#666"
  },

  value:{
    fontSize:16,
    fontWeight:"bold"
  }

});