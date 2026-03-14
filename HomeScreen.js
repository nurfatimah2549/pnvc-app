import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebase";

const { width } = Dimensions.get("window");

const SERVICES = [
  { name: "โหวต", icon: "how-to-vote", screen: "Vote" },
  { name: "สมัครเรียน", icon: "app-registration" },
  { name: "กิจกรรม", icon: "groups" },
  { name: "ข่าว", icon: "article" },
  { name: "บุคลากร", icon: "people" },
  { name: "นักศึกษา", icon: "badge" },
  { name: "ตารางเรียน", icon: "calendar-today" },
  { name: "ติดต่อ", icon: "support-agent" }
];

export default function HomeScreen({ navigation }) {
const [voteCount, setVoteCount] = useState(0);
useEffect(() => {
  const db = getDatabase(app);
  const votesRef = ref(db, "votes");

  const unsubscribe = onValue(votesRef, (snapshot) => {
    const data = snapshot.val() || {};

    const total = Object.keys(data).reduce((sum, key) => {
      const item = data[key];
      return sum + (item?.votesCount ? Number(item.votesCount) : 0);
    }, 0);

    setVoteCount(total);
  });

  return () => unsubscribe();
}, []);
  
  const renderServiceItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.serviceItem}
      onPress={() => item.screen && navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>
        <MaterialIcons name={item.icon} size={26} color="#234a78" />
      </View>
      <Text style={styles.serviceText} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#234a78" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/th/3/3c/Vocational_education_logo.png" }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>วิทยาลัยอาชีวศึกษาปัตตานี</Text>
          <Text style={styles.headerSubTitle}>Pattani Vocational College</Text>
        </View>

        {/* NEWS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>อัปเดตล่าสุด</Text>
        </View>
        
        <View style={styles.newsRow}>
          <View style={[styles.newsCard, styles.shadow]}>
            <Image
              source={{ uri: "https://scontent.fbkk10-1.fna.fbcdn.net/v/t39.30808-6/646388946_1499239171997463_8228278984930667648_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHuNxqKoszDyBTcXqMe6rRkK-Rlq4XQelkr5GWrhdB6WfFggiIEJxn-oNi13s1AMzFeTrr17ND3_s2r4mBRLh0z&_nc_ohc=D9qU2e3Zg0IQ7kNvwGbM8bj&_nc_oc=AdmpnNJWhHrvdMIAEdROgCeItNbylTa8jVSkNmcf61urj3NiUWhIyTZnGC4B6j0X8hg&_nc_zt=23&_nc_ht=scontent.fbkk10-1.fna&_nc_gid=UOoHZpo-_MykmvKcnZ2qhw&_nc_ss=8&oh=00_AfwN-n9gYEcePeaNjSO42A6c9vS-QzPUZwrZlYfeQIuQSg&oe=69AF38D0" }}
              style={styles.newsImage}
            />
            <View style={styles.newsOverlay}>
              <Text style={styles.newsTag}>ประชาสัมพันธ์</Text>
            </View>
          </View>

          <View style={[styles.newsCard, styles.shadow]}>
            <Image
              source={{ uri: "https://scontent.fhdy1-1.fna.fbcdn.net/v/t39.30808-6/646204914_1497765908811456_5149061382631126918_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeExjiRk8quQXgPhGwmg_4POs5yrogXpB_uznKuiBekH-5LY3f8gLNFadnRx42ilQNPiHNaoU6VDg0sEzfpbCESW&_nc_ohc=Eyfnzr24-EMQ7kNvwEN-2up&_nc_oc=AdkYdjYRFM0CdHMl6BpVJXm2IS-lwz8rD1la8zR4sYJA1yNzRiGe3g_gVP828YtpC2U&_nc_zt=23&_nc_ht=scontent.fhdy1-1.fna&_nc_gid=gWBK0A8vsfahnbjnsoLmkg&_nc_ss=8&oh=00_Afw5VPHW_BjWxYgHtYsSA0REuwL8sOkWA9XLgqouP0z87Q&oe=69AF12EB" }}
              style={styles.newsImage}
            />
            <View style={styles.newsOverlay}>
              <Text style={styles.newsTag}>กิจกรรม</Text>
            </View>
          </View>
        </View>

        {/* SERVICES SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>เมนูบริการ</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>ดูทั้งหมด</Text></TouchableOpacity>
        </View>

        <View style={[styles.servicesGrid, styles.shadow]}>
          {SERVICES.map(renderServiceItem)}
        </View>
        {/* VOTE SUMMARY */}
        <View style={[styles.voteBox, styles.shadow]}>
            <Text style={styles.voteTitle}>จำนวนโหวตทั้งหมด</Text>
            <Text style={styles.voteNumber}>{voteCount}</Text>
      <TouchableOpacity
      style={styles.voteButton} onPress={() => navigation.navigate("Vote")}
  >     <Text style={styles.voteButtonText}>ดูรายการโหวต</Text>
      </TouchableOpacity>
</View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6", 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  scrollContent: {
    paddingBottom: 20
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    backgroundColor: "#234a78",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20
  },
  headerTitle: {
  color: "#fff",
  fontSize: 26,
  fontWeight: "bold",
  letterSpacing: 0.5,
  textAlign: "center",
  lineHeight: 32
},
  headerSubTitle: {
  color: "rgba(255,255,255,0.9)",
  fontSize: 16,
  marginTop: 4,
  textAlign: "center"
},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937"
  },
  seeAllText: {
    color: "#234a78",
    fontSize: 13,
    fontWeight: '600'
  },
  newsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 25
  },
  newsCard: {
    width: width * 0.44,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden", 
    position: 'relative'
  },
  newsImage: {
    width: "100%",
    height: 250,
  },
  newsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  newsTag: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: 'center'
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 20,
  },
  serviceItem: {
    width: "25%", 
    alignItems: "center",
    marginVertical: 15,
  },
  iconBox: {
    backgroundColor: "#F0F7FF",
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  serviceText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500"
  },
  voteBox:{
  backgroundColor:"#fff",
  marginHorizontal:16,
  padding:20,
  borderRadius:18,
  alignItems:"center",
  marginTop:20
},

voteTitle:{
  fontSize:16,
  color:"#6B7280"
},

voteNumber:{
  fontSize:32,
  fontWeight:"bold",
  color:"#234a78",
  marginVertical:6
},

voteButton:{
  backgroundColor:"#234a78",
  paddingHorizontal:20,
  paddingVertical:10,
  borderRadius:10,
  marginTop:8
},

voteButtonText:{
  color:"#fff",
  fontWeight:"600"
},
});
