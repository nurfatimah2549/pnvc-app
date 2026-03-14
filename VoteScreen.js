import React, { useEffect, useState } from 'react';
import { isAdmin } from "../utils/role";
import { useUserAuth } from "../context/UserAuthContext";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
  get
} from 'firebase/database';

import { getAuth } from 'firebase/auth';
import app from '../firebase';

export default function VoteScreen({ navigation }) {
  const { user } = useUserAuth();
  const [admin, setAdmin] = useState(false);

useEffect(() => {

  async function checkAdmin() {

    const result = await isAdmin(user);

    setAdmin(result);

  }

  if (user) {
    checkAdmin();
  }

}, [user]);

  const [votes, setVotes] = useState([]);
  const [userVote, setUserVote] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const [editingItem, setEditingItem] = useState(null);

  const db = getDatabase(app);
  const auth = getAuth(app);

  const votesRef = ref(db, 'votes');

  useEffect(() => {

    const unsub = onValue(votesRef, (snapshot) => {

      const data = snapshot.val() || {};

      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));

      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setVotes(list);

    });

    const user = auth.currentUser;

    if (user) {

      const uid = user.uid;

      const userVoteRef = ref(db, `votesUsers/${uid}`);

      get(userVoteRef).then((snapshot) => {

        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserVote(data.voteId);
        }

      });

    }

    return () => unsub();

  }, []);

  const openAdd = () => {

    setEditingItem(null);
    setTitleInput('');
    setDateInput('');
    setDescriptionInput('');

    setModalVisible(true);

  };

  const openEdit = (item) => {

    setEditingItem(item);

    setTitleInput(item.title || '');
    setDateInput(item.date || '');
    setDescriptionInput(item.description || '');

    setModalVisible(true);

  };

  const handleSave = async () => {

    if (!titleInput.trim())
      return Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อรายการ');

    try {

      const payload = {
        title: titleInput,
        date: dateInput,
        description: descriptionInput || '',
        votesCount: 0,
        createdAt: Date.now()
      };

      if (editingItem) {

        delete payload.createdAt;

        await update(ref(db, `votes/${editingItem.id}`), payload);

      } else {

        await push(votesRef, payload);

      }

      setModalVisible(false);
      setTitleInput('');
      setDateInput('');
      setDescriptionInput('');
      setEditingItem(null);

    } catch (err) {

      Alert.alert('Error', err.message);

    }

  };

  const handleVote = async (voteId) => {

    try {

      const user = auth.currentUser;

      if (!user) {
        Alert.alert("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      const uid = user.uid;

      const userVoteRef = ref(db, `votesUsers/${uid}`);

      const snapshot = await get(userVoteRef);

      if (snapshot.exists()) {
        Alert.alert("คุณโหวตไปแล้ว");
        return;
      }

      const voteRef = ref(db, `votes/${voteId}`);

      const voteSnapshot = await get(voteRef);

      if (!voteSnapshot.exists()) return;

      const data = voteSnapshot.val();

      const currentVotes = data.votesCount || 0;

      await update(voteRef, {
        votesCount: currentVotes + 1
      });

      await update(ref(db, `votesUsers/${uid}`), {
        voteId: voteId,
        votedAt: Date.now()
      });

      setUserVote(voteId);

      Alert.alert("โหวตสำเร็จ");

    } catch (err) {

      Alert.alert("Error", err.message);

    }

  };

  const handleDelete = (id) => {

    Alert.alert(
      'ลบรายการ',
      'ต้องการลบรายการนี้หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {

              await remove(ref(db, `votes/${id}`));

              Alert.alert('ลบแล้ว', 'รายการถูกลบเรียบร้อย');

            } catch (err) {

              Alert.alert('Error', err.message);

            }
          },
        },
      ]
    );

  };

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <TouchableOpacity
        onPress={() => navigation.navigate('VoteDetail', { id: item.id })}>

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.date}>{item.date}</Text>

        <Text style={styles.voteCount}>
          Votes : {item.votesCount || 0}
        </Text>

        <Text style={{
          color: userVote === item.id ? "red" : "green",
          fontWeight: "bold",
          marginTop: 4
        }}>
          สถานะ : {userVote === item.id ? "โหวตแล้ว" : "รอการโหวต"}
        </Text>

      </TouchableOpacity>

  <View style={styles.buttonRow}>

  <TouchableOpacity
    style={styles.voteButton}
    onPress={() => handleVote(item.id)}>
    <Text style={styles.voteText}>Vote</Text>
  </TouchableOpacity>

  {admin && (
    <>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openEdit(item)}>
        <MaterialIcons name="edit" size={20} color="#0b4fe6" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => handleDelete(item.id)}>
        <MaterialIcons name="delete" size={20} color="#e23b3b" />
      </TouchableOpacity>
    </>
  )}

</View>

    </View>

  );

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Vote</Text>

        {admin && (
  <TouchableOpacity
    style={styles.addButton}
    onPress={openAdd}>
    <MaterialIcons name="add" size={22} color="#fff" />
  </TouchableOpacity>
)}
      </View>

      <FlatList
        data={votes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              {editingItem ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}
            </Text>

            <TextInput
              placeholder="ชื่อรายการ"
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
            />

            <TextInput
              placeholder="วันที่"
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
            />

            <TextInput
              placeholder="รายละเอียด"
              style={styles.input}
              value={descriptionInput}
              onChangeText={setDescriptionInput}
            />

            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}>
                <Text style={{ color: '#fff' }}>บันทึก</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f2f3f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },

  headerLeft: { width: 44 },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0b4fe6',
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222'
  },

  date: {
    fontSize: 13,
    color: '#777',
    marginTop: 6
  },

  voteCount: {
    marginTop: 6,
    color: '#0b4fe6',
    fontWeight: '600'
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },

  voteButton: {
    backgroundColor: '#0b4fe6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6
  },

  voteText: {
    color: '#fff'
  },

  iconButton: {
    marginLeft: 12
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    padding: 10,
    marginTop: 8
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 12
  },

  cancelBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },

  saveBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#0b4fe6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }

});