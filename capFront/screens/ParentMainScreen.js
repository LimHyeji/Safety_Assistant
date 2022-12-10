import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Platform, Alert, PermissionsAndroid, ActivityIndicator, TouchableOpacity, Image, Modal, FlatList, ScrollView} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from "react-native-geolocation-service";
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import RNRestart from 'react-native-restart';
import {RadioButton} from 'react-native-paper';

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
  const [name, setName] = useState('');

  const [childLat, setChildLat] = useState(null); //자녀의 위치데이터
  const [childLng, setChildLng] = useState(null);
  const [route, setRoute] = useState([]); // 자녀의 이동 경로
  const [show, setShow] = useState(false);

  const [alarmList, setAlarmList] = useState([]);
  const [flag, setFlag] = useState(false);
  
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileNum, setProfileNum] = useState(0);
  const profileList = [
    {
      idx: 0,
      src: require('../profile/default.jpg')
    },
    {
      idx: 1,
      src: require('../profile/profile1.png')
    },
    {
      idx: 2,
      src: require('../profile/profile2.png')
    },
    {
      idx: 3,
      src: require('../profile/profile3.png')
    },
    {
      idx: 4,
      src: require('../profile/profile4.png')
    },
    {
      idx: 5,
      src: require('../profile/profile5.png')
    },
    {
      idx: 6,
      src: require('../profile/profile6.png')
    },
    {
      idx: 7,
      src: require('../profile/profile7.png')
    }
    ,{
      idx: 8,
      src: require('../profile/profile8.png')
    }
  ];
  //위치 수집 간격 설정
  const [isCollectModalVisible, setIsCollectModalVisible] = useState(false);
  const [collectInterval, setCollectInterval] = useState(5000);
  const [colFlag, setColFlag] = useState(false);

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
      const value = await AsyncStorage.getItem('userData'); 
      const parseValue = JSON.parse(value);
      fetch('http://34.64.74.7:8081/user/login/parent', {
        method: "POST",
        body: JSON.stringify({
          "userId": parseValue.childId, 
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
        if(responseJson.message==="expired"){
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
    const value = await AsyncStorage.getItem('userData'); 
    const parseValue = JSON.parse(value); 
    try{
      fetch('http://34.64.74.7:8081/user/login/alarmRec',{
        method:"POST",
        body: JSON.stringify({
          "userId": parseValue.childName,
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
        if(responseJson.message=== "expired"){
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

  async function loadData() {
    try {
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      const value2 = await AsyncStorage.getItem('profile');
      const parseValue2 = JSON.parse(value2);

      const value3 = await AsyncStorage.getItem('collect');
      const parseValue3 = JSON.parse(value3);
      setName(parseValue.userName);
      setProfileNum(parseValue2.profileNum);
      setCollectInterval(parseValue3.collectInterval);
      setColFlag(true);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    trackPosition();
    loadData();
    setInterval(()=>parentAlert(),5000); //과연 넘어올것인가
  }, []);

  useEffect(() => {
    if(colFlag === true) {
      setInterval(()=>showChildLocation(), collectInterval);
    }
  }, [colFlag]);

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

  const changeProfile = async(index) => {
    setProfileNum(index);
    await AsyncStorage.setItem(
      'profile',
      JSON.stringify({
        profileNum: index,
      })
    );
    setIsProfileModalVisible(!isProfileModalVisible);
  }

  const changeCollectInterval = async(interval) => {
    setCollectInterval(interval*1000);
    await AsyncStorage.setItem(
      'collect',
      JSON.stringify({
        collectInterval: interval*1000,
      })
    );
    setIsCollectModalVisible(!isCollectModalVisible);
    RNRestart.Restart();
  }

  renderDrawer = () => {
    return (
      <View style={styles.container}>
        <Modal //프로필 수정
          visible={isProfileModalVisible}
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FlatList
                keyExtractor={item => item.idx}
                data={profileList}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => changeProfile(item.idx)}>
                    <Image style={styles.changeImage} source={item.src}/>
                  </TouchableOpacity>
                )}
                numColumns={3}
              />
            </View>
          </View>
        </Modal>

        <Modal //위치 수집 간격 설정
          visible={isCollectModalVisible}
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.collectView}>
              <RadioButton.Group
                onValueChange={(newValue) => changeCollectInterval(newValue)}
                value={collectInterval / 1000}
              >
                <RadioButton.Item label="5초" value={5} style={styles.RadioButtonBody}/>
                <RadioButton.Item label="10초" value={10} style={styles.RadioButtonBody}/>                
                <RadioButton.Item label="20초" value={20} style={styles.RadioButtonBody}/>                
                <RadioButton.Item label="30초" value={30} style={styles.RadioButtonBody}/>                
                <RadioButton.Item label="2분" value={120} style={styles.RadioButtonBody}/>               
                <RadioButton.Item label="10분" value={600} style={styles.RadioButtonBody}/>                
              </RadioButton.Group>
            </View>
          </View>
        </Modal>
        <View style={styles.profile}>
          <TouchableOpacity activeOpacity={1} onPress={() => setIsProfileModalVisible(true)}>
            <Image style={styles.image}  source={profileList[profileNum].src}/>
          </TouchableOpacity>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.idx}>부모</Text>
          </View>
        </View>
        <View style={styles.InnerContainer}><Text style={styles.title}>회원 정보 수정</Text></View>
        <TouchableOpacity style={styles.InnerContainer} onPress={() => {navigation.navigate('CheckPasswordpage')}}>
          <Text style={styles.modifyTitle}>회원 정보 수정</Text>
        </TouchableOpacity>
        <View style={styles.InnerContainer}><Text style={styles.title}>설정</Text></View>
        <TouchableOpacity style={styles.InnerContainer} onPress={() => setIsCollectModalVisible(true)}>
          <Text style={styles.modifyTitle}>위치 수집 간격 설정</Text>
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
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "black",
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  modifyTitle: {
    fontSize: 20,
    color: "black",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  InnerContainer: {
    width: "100%",
    borderBottomWidth: 1,
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
  profile: {
    width: "100%",
    height: "13%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#CAEF53",
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginLeft: 20,
  },
  userName: {
    fontSize: 24,
    color: "black",
    marginRight: 20,
  },
  idx: {
    fontSize: 14,
    color: "#66666",
    marginRight: 20,
  },
  modalView: {
    margin: 20,
    width: "80%",
    height: "45%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
  },
  collectView: {
    margin: 20,
    width: "50%",
    height: "45%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  changeImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 10,
    borderWidth: 0.2,
    borderColor: "lightgray",
  },
  RadioButtonBody: {
    justifyContent: "space-between",
    width: "80%",
    marginLeft: 25
  },
})