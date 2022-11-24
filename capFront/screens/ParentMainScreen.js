import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Platform, Alert, PermissionsAndroid, ActivityIndicator, TouchableOpacity} from "react-native";
import MapView, {Marker, Polyline, Circle} from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

//위치 접근 권한 받기
async function requestPermission() {
  try {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }catch(error) {
    console.log(error);
  }
}


function ParentMain({navigation}) {

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);
  const [route, setRoute] = useState([]); // 이동 경로
  const [show, setShow] = useState(false);
  const [dangerAreas, setDangerAreas] = useState([]); // 위험 지역
  
  const trackPosition = async() => {
    requestPermission();
    try{
      //const value = await AsyncStorage.getItem('userData');
      //const parsevalue = JSON.parse(value);
      fetch('http://34.64.74.7:8081/user/login/parent', {
        method: "POST",
        body: JSON.stringify({
          //userId: parsevalue.childrenInfo[0].userId,
          "userId": "child",
          "idx": true,
        }),
        headers : {'Content-Type' : 'application/json; charset=utf-8'}
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLatitude(parseFloat(responseJson.latitude));
        setLongitude(parseFloat(responseJson.longitude));
        setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
      })
      .catch((error) => {
        console.error(error);
      });
    }catch(error){
      console.log(error);
    }
  }

  const showChildLocation = async() => {
    try{
      //const value = await AsyncStorage.getItem('userData');
      //const parsevalue = JSON.parse(value);
      fetch('http://34.64.74.7:8081/user/login/parent', {
        method: "POST",
        body: JSON.stringify({
          //userId: parsevalue.childrenInfo[0].userId,
          "userId": "child",
          "idx": true,
        }),
        headers : {'Content-Type' : 'application/json; charset=utf-8'}
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLatitude(parseFloat(responseJson.latitude));
        setLongitude(parseFloat(responseJson.longitude));
        setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
        setShow(true);
      })
      .catch((error) => {
        console.error(error);
      });
    }catch(error){
      console.log(error);
    }
  }

  /*
  const showInfo = () => {
    Alert.alert(
      '경로 정보',
      '여기에 정보가 보이게?', 
      [
        {text: '확인', onPress: () => {setShow(false)}},
        {text: '취소', onPress: () => {}},
      ]
    )
  }
  */

  useEffect(() => {
    componentDidMount();
    trackPosition();
  }, []);
  
  if(!latitude && !longitude) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>Loading...</Text>
      </View>
    );
  }

  return (
      <View style={{ flex: 1 }}>
        <View>
          <TouchableOpacity style={styles.alarmButton} onPress={() => {console.log("touch")}}>
            <Icon name="bell" size={25} color={"#000"}/>
          </TouchableOpacity>
        </View>
        <MapView
          style={{ flex: 1, width:'100%', height:'100%' }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
        
        {show === true ? (
          <Marker
          coordinate={{latitude: latitude, longitude: longitude}}
          >
            <Icon name="map-marker-alt" size={30} color={"#CAEF53"}/>
          </Marker>
        ) : (<></>)}
  
        </MapView>
        <View>
          <TouchableOpacity style={styles.reloadButton} onPress={() => showChildLocation()}>
            <Icon name="redo-alt" size={30} color={"#000"}/>
          </TouchableOpacity>
        </View>
        <View>
          <Button title="설정" onPress={() =>  navigation.navigate('ParentSetUppage')}></Button> 
        </View>
      </View>
  );
}

export default ParentMain;

const styles = StyleSheet.create({
  reloadButton: {
    backgroundColor: "#CAEF53",
    alignItems: "center",
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    position: "absolute",
    bottom: 10,
    right: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      }
    })
  },
  alarmButton: {
    alignItems: "center",
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 35,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
})