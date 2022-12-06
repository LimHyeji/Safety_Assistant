import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Platform, Alert, PermissionsAndroid, ActivityIndicator, TouchableOpacity} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from "react-native-geolocation-service";
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import RNRestart from 'react-native-restart';

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

  const [latitude, setLatitude] = useState(null); //부모의 위치데이터
  const [longitude, setLongitude] = useState(null);

  const [childLat, setChildLat] = useState(null); //자녀의 위치데이터
  const [childLng, setChildLng] = useState(null);
  const [route, setRoute] = useState([]); // 자녀의 이동 경로
  const [show, setShow] = useState(false);

  const [alarmList, setAlarmList] = useState([]);
  const [flag, setFlag] = useState(false);

  const trackPosition = () => {  //부모의 위치추적
    requestPermission();
    try{
      const _watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 3000,
          fastestInterval: 2000,
        },
      );
      return () => {
        if(_watchId) {
          Geolocation.clearWatch(_watchId);
        }
      }
    }catch(error){
      console.log(error);
    }
  }

  const showChildLocation = async() => {  //자녀의 위치추적
    try{
      const value = await AsyncStorage.getItem('userData'); //테스트를 위한 주석처리
      const parseValue = JSON.parse(value); //테스트를 위한 주석처리
      fetch('http://34.64.74.7:8081/user/login/parent', {
        method: "POST",
        body: JSON.stringify({
          //userId: parseValue.childrenInfo[0].userId, //테스트를 위한 주석처리
          "userId": "child",  //테스트를 위한 임시값
          "idx": true,
        }),
        headers : {
          'Content-Type' : 'application/json; charset=utf-8',
          Authorization: `Bearer${parseValue.token}`,
        }
      })
      .then((response) => response.json())
      .then(async(responseJson) => {
        //console.log(responseJson);
        if(responseJson==="expired"){
          try{
          await AsyncStorage.removeItem('userData');
          navigation.navigate('Loginpage');
        }catch(error){
          console.log(error);
        }
        }

        if(responseJson.latitude!==null){
        setChildLat(parseFloat(responseJson.latitude));
        setChildLng(parseFloat(responseJson.longitude));
        setRoute(route => [...route, {latitude:parseFloat(responseJson.latitude), longitude: parseFloat(responseJson.longitude)}]);
        setShow(true);
      }
      })
      .catch((error) => {
        console.error(error);
      });
    }catch(error){
      console.log(error);
    }
  }

  const parentAlert=async()=>{
    const value = await AsyncStorage.getItem('userData'); //테스트를 위한 주석처리
    const parseValue = JSON.parse(value); //테스트를 위한 주석처리
    try{
      fetch('http://34.64.74.7:8081/user/login/alarmRec',{
        method:"POST",
        body: JSON.stringify({
         //userId: parseValue.childrenInfo[0].userId, //테스트를 위한 주석처리
          "userId":"child",
          "idx":true,
        }),
        headers : {
          'Content-Type' : 'application/json; charset=utf-8',
          Authorization: `Bearer${parseValue.token}`,
        }
      })
      .then((response) => response.json())
      .then(async(responseJson) => {
        //console.log(responseJson);
        if(responseJson.message === "expired"){
          try{
            await AsyncStorage.removeItem('userData');
            RNRestart.Restart();
          }catch(error){
            console.log(error);
          }
        }
        if(responseJson.lat !== null && responseJson.lng !== null) {
          console.log(responseJson);
          
              // 역지오코딩
    Geocode.setApiKey("AIzaSyD3wawfdvi_QBp0XYbXPC47nXWUUEVX4wY");
    Geocode.setLanguage("ko");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    Geocode.fromLatLng(responseJson.lat, responseJson.lng).then(
      async(response) => {
        const address=response.results[0].formatted_address;
        const addresstemp=address.substr(5, address.length);
        const value = await AsyncStorage.getItem('alarm');
        setAlarmList(JSON.parse(value));
        let date = new Date();
        let now = date.toLocaleString();
        setAlarmList(alarmList => [...alarmList, {alarm: responseJson.alarm, where: responseJson.where, alarmAddress: addresstemp, now}]);
        //await AsyncStorage.setItem('alarm', JSON.stringify(alarmList)) //null 처리

        setFlag(true);
      },
      (error) => {
        console.error(error);
      }
    )
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }catch(error){
      console.log(error);
    }
  }

  async function saveAlarm(alarmList) {
    await AsyncStorage.setItem('alarm', JSON.stringify(alarmList));
    console.log(alarmList);
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

  async function logoutAPI() {
    try {
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      fetch('http://34.64.74.7:8081/user/login/logout', {
        method: 'POST',
        headers : {
          Authorization: `Bearer${parseValue.token}`,
        } 
      })
      .then(response => response.json())
      .then(async(responseJson) => {
        if(responseJson.msg === "expired") {
          await AsyncStorage.removeItem('userData');
          RNRestart.Restart();
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    trackPosition();
    setInterval(()=>showChildLocation(),5000); //과연 넘어올것인가
    setInterval(()=>parentAlert(),5000); //과연 넘어올것인가
  }, []);

  useEffect(() => {
    if(flag === true) {
      saveAlarm(alarmList);
    }
  }, [flag])
  
  if(!latitude && !longitude) { //부모 위치정보 없을 때 로딩
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator
          color="black"
          style={{
            flex: 1,
            justifyContent: "center",
          }}
          size="large"
        />
      </View>
    );
  }

  handleDrawerSlide = (status) => {
    // outputs a value between 0 and 1
    console.log(status);
  };

  renderDrawer = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.InnerContainer} onPress={() => {navigation.navigate('CheckPasswordpage')}}>
          <Text style={styles.modifyTitle}>회원 정보 수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutContainer} onPress={() => logoutAPI()}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let drawer = null;
  return (
      <View style={{ flex: 1 }}>
        <DrawerLayout
          ref={(refDrawer) => {
            drawer = refDrawer 
          }}
          drawerWidth={300}
          drawerPosition={DrawerLayout.positions.Left}
          drawerType="front"
          drawerBackgroundColor="#ddd"
          renderNavigationView={this.renderDrawer}
          onDrawerClose={() => (drawer.closeDrawer())}
        >
          <View>
            <TouchableOpacity style={styles.alarmButton} onPress={() =>  navigation.navigate('ParentAlertpage')}>
              <Icon name="bell" size={25} color={"#000"}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.modifyButton} onPress={() => {drawer.openDrawer()}}>
              <Icon name="bars" size={25} color={"#000"}/>
            </TouchableOpacity>
          </View>
          {show === false ? (  //부모 위치 띄우기
          <MapView
            style={{ flex: 1, width:'100%', height:'100%' }}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsCompass={false}
            toolbarEnabled={false}
          >

            <Marker
            coordinate={{latitude: latitude, longitude: longitude}}
            >
              <Icon name="map-marker-alt" size={30} color={"#CAEF53"}/>
            </Marker>
            
          </MapView>
          ) : (<></>)}

          {show === true ? (  //자녀 위치 띄우기
          <MapView
          style={{ flex: 1, width:'100%', height:'100%' }}
          initialRegion={{
            latitude: childLat, 
            longitude: childLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          >
            <Marker
            coordinate={{latitude: childLat, longitude: childLng}}
            >
              <Icon name="map-marker-alt" size={30} color={"#CAEF53"}/>
            </Marker>

            <Polyline
              coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}
            />
            
          </MapView>
          ) : (<></>)}


          <View>
            <TouchableOpacity style={styles.reloadButton} onPress={() => showChildLocation()}>
              <Icon name="redo-alt" size={30} color={"#000"}/>
            </TouchableOpacity>
          </View>
        </DrawerLayout>
      </View>
  );
}

export default ParentMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
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
  modifyButton: {
    alignItems: "center",
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 35,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  
  modifyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  InnerContainer: {
    width: "100%",
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: "black",
  },
  logoutContainer: {
    justifyContent: 'center',
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  logoutText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  }, 
})