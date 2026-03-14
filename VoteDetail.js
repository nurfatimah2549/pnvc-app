import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, runTransaction, get, push, set } from 'firebase/database';
import { useUserAuth } from "../context/UserAuthContext";
import app from '../firebase';

export default function VoteDetail({ navigation, route }) {

  const { user } = useUserAuth();

  const [choice, setChoice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalTimeoutRef = useRef(null);

  const [item, setItem] = useState(null);
  const [modalCount, setModalCount] = useState(null);
  const [modalProject, setModalProject] = useState('');
  const [modalPoints, setModalPoints] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  useEffect(() => {

    const id = route?.params?.id;

    if (!id) {
      setLoading(false);
      return;
    }

    const db = getDatabase(app);
    const itemRef = ref(db, `votes/${id}`);

    const unsub = onValue(itemRef, (snap) => {
      const data = snap.val();
      setItem(data || null);
      setLoading(false);
    });

    return () => unsub();

  }, [route?.params?.id]);


  const handleCloseModal = () => {

    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }

    setModalVisible(false);
    navigation.navigate("Vote");

  };

  const handleVote = async () => {

    if (!choice) return;

    const id = route?.params?.id;

    const db = getDatabase(app);

    let newCount = null;

    try {

      const countRef = ref(db, `votes/${id}/votesCount`);

      const result = await runTransaction(countRef, (current) => {
        return (current || 0) + 1;
      });

      if (result?.snapshot) {
        newCount = result.snapshot.val();
      }

      /* บันทึกประวัติการโหวต */

      const historyRef = ref(db, "voteHistory");

      const newHistory = push(historyRef);

      await set(newHistory, {

        voteId: id,
        title: item?.title,
        userEmail: user?.email,
        choice: choice === "join" ? "เห็นด้วย" : "ไม่เห็นด้วย",
        date: new Date().toISOString()

      });

    } catch (err) {

      console.log(err);

    }

    setModalCount(newCount);

    setModalProject(item?.title || '');

    const points = Math.floor(Math.random() * 5) + 1;

    setModalPoints(points);

    setModalVisible(true);

    modalTimeoutRef.current = setTimeout(() => {

      setModalVisible(false);
      navigation.navigate("Vote");

    }, 1400);

  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <Image
          source={{ uri: item?.image || 'https://via.placeholder.com/350x140' }}
          style={styles.banner}
        />

        <Text style={styles.title}>
          {item?.title}
        </Text>

        <Text style={styles.description}>
          {item?.description}
        </Text>

        <Text style={styles.sectionHeader}>เข้าร่วมการโหวต</Text>

        <View style={styles.optionsRow}>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setChoice('join')}
          >
            <View style={[styles.radioOuter, choice === 'join' && styles.radioChecked]}>
              {choice === 'join' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>เห็นด้วย</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setChoice('not')}
          >
            <View style={[styles.radioOuter, choice === 'not' && styles.radioChecked]}>
              {choice === 'not' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>ไม่เห็นด้วย</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.voteButton, !choice && styles.voteButtonDisabled]}
          onPress={handleVote}
        >
          <Text style={styles.voteButtonText}>Vote</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              ขอบคุณที่โหวต
            </Text>

            <Text>
              คุณได้รับ {modalPoints} คะแนน
            </Text>

            <Text>
              {modalProject}
            </Text>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

container:{flex:1,backgroundColor:"#f2f3f5"},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
padding:15,
backgroundColor:"#fff"
},

headerTitle:{
fontSize:18,
fontWeight:"bold"
},

content:{
padding:15
},

banner:{
width:"100%",
height:160,
borderRadius:10
},

title:{
fontSize:18,
fontWeight:"bold",
marginTop:10
},

description:{
marginTop:8
},

sectionHeader:{
marginTop:20,
fontWeight:"bold"
},

optionsRow:{
flexDirection:"row",
marginTop:10
},

option:{
flexDirection:"row",
alignItems:"center",
marginRight:20
},

radioOuter:{
width:18,
height:18,
borderRadius:9,
borderWidth:2,
borderColor:"#aaa",
alignItems:"center",
justifyContent:"center"
},

radioInner:{
width:10,
height:10,
borderRadius:5,
backgroundColor:"#0b4fe6"
},

radioChecked:{
borderColor:"#0b4fe6"
},

optionText:{
marginLeft:6
},

footer:{
position:"absolute",
bottom:20,
left:20,
right:20
},

voteButton:{
backgroundColor:"#0b4fe6",
padding:14,
borderRadius:8,
alignItems:"center"
},

voteButtonDisabled:{
backgroundColor:"#9db8ff"
},

voteButtonText:{
color:"#fff",
fontWeight:"bold"
},

modalOverlay:{
flex:1,
backgroundColor:"rgba(0,0,0,0.4)",
justifyContent:"center",
alignItems:"center"
},

modalCard:{
backgroundColor:"#fff",
padding:20,
borderRadius:10,
alignItems:"center"
}

});