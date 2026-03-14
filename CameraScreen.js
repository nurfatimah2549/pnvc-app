import React, { useRef, useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Image,
Alert
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialIcons } from "@expo/vector-icons";

export default function CameraScreen() {

  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState("back");

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync();
  }, []);

  // ถ่ายรูป
  const takePhoto = async () => {

    if (cameraRef.current) {

      const picture = await cameraRef.current.takePictureAsync();

      setPhoto(picture.uri);

    }

  };

  // บันทึกรูป
  const savePhoto = async () => {

    await MediaLibrary.saveToLibraryAsync(photo);

    Alert.alert("สำเร็จ", "บันทึกรูปลงแกลเลอรี่แล้ว");

  };

  // ถ่ายใหม่
  const retakePhoto = () => {
    setPhoto(null);
  };

  // ลบรูป
  const deletePhoto = () => {
    setPhoto(null);
    Alert.alert("ลบรูปแล้ว");
  };

  // หมุนรูป
  const rotatePhoto = async () => {

    const result = await ImageManipulator.manipulateAsync(
      photo,
      [{ rotate: 90 }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    setPhoto(result.uri);

  };

  // ครอปรูป
  const cropPhoto = async () => {

    const result = await ImageManipulator.manipulateAsync(
      photo,
      [{
        crop: {
          originX: 0,
          originY: 0,
          width: 300,
          height: 300
        }
      }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    setPhoto(result.uri);

  };

  const switchCamera = () => {

    setFacing(current =>
      current === "back" ? "front" : "back"
    );

  };

  if (!permission) return <View/>;

  if (!permission.granted) {

    return (
      <View style={styles.center}>
        <Text>ต้องอนุญาตกล้องก่อน</Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={{color:"#fff"}}>อนุญาต</Text>
        </TouchableOpacity>

      </View>
    );
  }

  // หน้าดูรูป + แก้ไข
  if (photo) {

    return (

      <View style={styles.previewContainer}>

        <Image source={{ uri: photo }} style={styles.previewImage}/>

        <View style={styles.editBar}>

          <TouchableOpacity onPress={cropPhoto}>
            <MaterialIcons name="crop" size={32} color="#fff"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={rotatePhoto}>
            <MaterialIcons name="rotate-right" size={32} color="#fff"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={deletePhoto}>
            <MaterialIcons name="delete" size={32} color="red"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={retakePhoto}>
            <MaterialIcons name="camera-alt" size={32} color="#fff"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={savePhoto}>
            <MaterialIcons name="save" size={32} color="#4CAF50"/>
          </TouchableOpacity>

        </View>

      </View>

    );

  }

  return (

    <View style={styles.container}>

      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
      />

      {/* ปุ่มสลับกล้อง */}
      <TouchableOpacity
        style={styles.switch}
        onPress={switchCamera}
      >
        <MaterialIcons name="flip-camera-ios" size={32} color="#fff"/>
      </TouchableOpacity>

      {/* ปุ่มถ่าย */}
      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.captureOuter}
          onPress={takePhoto}
        >
          <View style={styles.captureInner}/>
        </TouchableOpacity>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#000"
  },

  camera:{
    flex:1
  },

  bottomBar:{
    position:"absolute",
    bottom:40,
    width:"100%",
    alignItems:"center"
  },

  captureOuter:{
    width:80,
    height:80,
    borderRadius:40,
    borderWidth:5,
    borderColor:"#fff",
    justifyContent:"center",
    alignItems:"center"
  },

  captureInner:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:"#fff"
  },

  switch:{
    position:"absolute",
    top:60,
    right:20
  },

  previewContainer:{
    flex:1,
    backgroundColor:"#000",
    justifyContent:"center",
    alignItems:"center"
  },

  previewImage:{
    width:"100%",
    height:"75%",
    resizeMode:"contain"
  },

  editBar:{
    flexDirection:"row",
    justifyContent:"space-around",
    width:"100%",
    padding:20,
    backgroundColor:"#111"
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  permissionButton:{
    marginTop:15,
    backgroundColor:"#2b6cb0",
    padding:10,
    borderRadius:8
  }

});