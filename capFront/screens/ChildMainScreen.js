import React, { useState, useEffect } from "react";
import { View, Text, Button, PermissionsAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, LogBox} from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, {Marker, Polyline, Circle, } from "react-native-maps";
import Boundary, {Events} from 'react-native-boundary';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { CommonActions } from '@react-navigation/native';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

//위치 접근 권한 받기
async function requestPermission() {
  try {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }catch(e) {
    console.log(e);
  }
}

async function requestBackPermission() {
  try{
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
  } catch(e) {
    console.log(e);
  }
}

async function requestSAWPermission() {
  try{
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW,
    );
  } catch(e) {
    console.log(e);
  }
}


function ChildMain({navigation}) {

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);
  const [route, setRoute] = useState([]); // 이동 경로
  const [dangerAreas, setDangerAreas] = useState([]); // 위험 지역
  const searchYear = [2021030, 2020055, 2019066];
  const [allCrossWalks, setAllCrossWalks] = useState([]); // 미추홀구 모든 횡단보도
  const [fenceCrossWalks, setFenceCrossWalks] = useState([]) // 미추홀구 70m이상 횡단보도
  const [fillAllData, setFillAllData] = useState([]);
  const [routetest,setRouteTest]=useState([{latitude:"37",longitude:"128"},{latitude:"38",longitude:"129"}]);

  const componentDidMount = async() => {
      // 위험지역
      for(let g in searchYear) {
        const response = await fetch('http://taas.koroad.or.kr/data/rest/frequentzone/pdestrians/jaywalking?authKey=uGpJdaxQtbuAGYqjJwwZlSaqI9J0gtYFiPlpCXHuYCQtrv%2FoR74lAmJ9FK9QQsKJ&searchYearCd=' + searchYear[g] + '&siDo=28&guGun=177&type=json');
        const danger = await response.json();
        setDangerAreas(dangerAreas => [...dangerAreas, danger.items.item]);
      }
      try {
        const value = await AsyncStorage.getItem('userData');
        const parseValue = JSON.parse(value);

        // 모든 횡단보도 가져오기 
        fetch('http://34.64.74.7:8081/user/login/cross', {
          method: 'POST',
          body: JSON.stringify({
            idx: false,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            if(responseJson==="expired"){
              try{
                await AsyncStorage.removeItem('userData');
                navigation.navigate('Loginpage');
              } catch(error){
                console.log(error);
              }
            }
            setAllCrossWalks(allCrossWalks => [...allCrossWalks, responseJson.crosses]);
          })
          .catch((error) => {
            console.error(error);
          });
          
          // 70m 이상의 횡단보도 가져오기
          fetch('http://34.64.74.7:8081/user/login/cross/cond', {
            method: 'POST',
            body: JSON.stringify({
              idx: false,
            }),
            headers : {
              'Content-Type' : 'application/json; charset=utf-8',
              Authorization: `Bearer${parseValue.token}`,
            }
          })
            .then(response => response.json())
            .then(async(responseJson) => {
              if(responseJson==="expired"){
                try{
                await AsyncStorage.removeItem('userData');
                navigation.navigate('Loginpage');
              }catch(error){
                console.log(error);
              }
              }
              setFenceCrossWalks(fenceCrossWalks => [...fenceCrossWalks, responseJson.crosses]);
            })
            .catch((error) => {
              console.error(error);
            });

          setFillAllData(true);
      } catch(error) {
        console.error(error);
        return(
          <View>
            <Text>
              로딩 중에 문제가 발생했어요!
            </Text>
          </View>
        );
      }
  }

  const trackPosition = () => {
    requestBackPermission().then(
      requestPermission().then(result => {
        console.log({result});
        if(result === "granted") {
          const _watchId = Geolocation.watchPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setLatitude(latitude);
              setLongitude(longitude);
              setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
              ChildMainAPI(latitude,longitude) //여기서 호출해야 위경도값 넘어감 왜지...?
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
        }
      })
    );
  }


  function removeFence() {
    // Remove the events
    Boundary.off(Events.ENTER)
    Boundary.off(Events.EXIT)

    // Remove the boundary from native API´s
    Boundary.removeAll()
      .then(() => console.log('Goodbye :('))
      .catch(e => console.log('Failed to delete Chipotle :)', e))
  }

  // Enter하면 호출될 함수
  const inFence = async(id) => {
    try{
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      console.log(id);

      if(id.toString() === "House") {
        console.log(`Enter my ${id}!!`);
        fetch("http://34.64.74.7:8081/user/login/alarm", {
          method: 'POST',
          body: JSON.stringify({
            userId: parseValue.userId,
            idx: parseValue.idx,
            alarm: "arrival",
            where: "House",
            lat: latitude,
            lng: longitude,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            console.log(responseJson);
            if(responseJson==="expired"){
              try{
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Loginpage');
            }catch(error){
              console.log(error);
            }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      else if(id.toString() === "School") {
        console.log(`Enter my ${id}!!`);
        fetch("http://34.64.74.7:8081/user/login/alarm", {
          method: 'POST',
          body: JSON.stringify({
            userId: parseValue.userId,
            idx: parseValue.idx,
            alarm: "arrival",
            where: "School",
            lat: latitude,
            lng: longitude,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            console.log(responseJson);
            if(responseJson==="expired"){
              try{
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Loginpage');
            }catch(error){
              console.log(error);
            }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // 횡단 보도일 경우,
      else if (Number(id) >= 0 && Number(id) < 51) {
        console.log(`Enter crossWalk ${id}!!`);
      }

      // 위험 지역
      else {
        console.log(`Enter dangerArea ${id}!!`);
        fetch("http://34.64.74.7:8081/user/login/alarm", {
          method: 'POST',
          body: JSON.stringify({
            userId: parseValue.userId,
            idx: parseValue.idx,
            alarm: "dangerArea",
            where: id.toString(),
            lat: latitude,
            lng: longitude,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            console.log(responseJson);
            if(responseJson==="expired"){
              try{
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Loginpage');
            }catch(error){
              console.log(error);
            }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch(error) {
      console.log(error);
    }
  }

  // Exit하면 호출될 함수
  const outFence = async(id) => {
    try{
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      console.log(id);

      if(id.toString() === "House") {
        console.log(`Exit my ${id}!!`);
        fetch("http://34.64.74.7:8081/user/login/alarm", {
          method: 'POST',
          body: JSON.stringify({
            userId: parseValue.userId,
            idx: parseValue.idx,
            alarm: "departure",
            where: "House",
            lat: latitude,
            lng: longitude,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            console.log(responseJson);
            if(responseJson==="expired"){
              try{
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Loginpage');
            }catch(error){
              console.log(error);
            }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      else if(id.toString() === "School") {
        console.log(`Exit my ${id}!!`);
        fetch("http://34.64.74.7:8081/user/login/alarm", {
          method: 'POST',
          body: JSON.stringify({
            userId: parseValue.userId,
            idx: parseValue.idx,
            alarm: "departure",
            where: "School",
            lat: latitude,
            lng: longitude,
          }),
          headers : {
            'Content-Type' : 'application/json; charset=utf-8',
            Authorization: `Bearer${parseValue.token}`,
          }
        })
          .then(response => response.json())
          .then(async(responseJson) => {
            console.log(responseJson);
            if(responseJson==="expired"){
              try{
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Loginpage');
            }catch(error){
              console.log(error);
            }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // 횡단 보도일 경우,
      else if (Number(id) >= 0 && Number(id) < 55) {
        console.log(`Exit crossWalk ${id}!!`);
      }

      // 위험 지역
      else {
        console.log(`Exit dangerArea ${id}!!`);
      }
    } catch(error) {
      console.log(error);
    }

  }

// 집/학교 지오펜스 설정
  const homeSchoolGeofence = async() => {
    try {
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      requestBackPermission().then(
        requestPermission().then(result => {
          console.log(result);

          Boundary.add({
            lat: parseFloat(parseValue.schoolLat),
            lng: parseFloat(parseValue.schoolLng),
            radius: 50, // in meters
            id: "School",
          })
            .then(() => console.log("School success!"))
            .catch(e => console.error("error :(", e));

          Boundary.add({
            lat: parseFloat(parseValue.houseLat),
            lng: parseFloat(parseValue.houseLng),
            radius: 50, // in meters
            id: "House",
          })
            .then(() => console.log("House success!"))
            .catch(e => console.error("error :(", e));

          Boundary.on(Events.ENTER, id => {
            inFence(id);
          });
          
          Boundary.on(Events.EXIT, id => {
            outFence(id);
          });
        })
      )
    } catch(error){
      console.error(error);
    }
  }
// 위험지역 지오펜스 설정
  const dangerAreaGeofence = () => {
    requestBackPermission().then(
      requestPermission().then(result => {
        console.log(result);

        for(danger in dangerAreas) {
          for(d in dangerAreas[danger]) {
            Boundary.add({
              lat: parseFloat(dangerAreas[danger][d].la_crd),
              lng: parseFloat(dangerAreas[danger][d].lo_crd),
              radius: 50, // in meters
              id: dangerAreas[danger][d].afos_fid.toString(),
            })
              .then(() => console.log("dangerAreas success!"))
              .catch(e => console.error("error :(", e));
          }
        }
      })
    )
  }
// 횡단보도 지오펜스 설정
  const crossWalkGeofence = () => {
    requestBackPermission().then(
      requestPermission().then(result => {
        console.log(result);

        for(cross in fenceCrossWalks) {
          for(c in fenceCrossWalks[cross]) {
            Boundary.add({
              lat: parseFloat(fenceCrossWalks[cross][c].latitude),
              lng: parseFloat(fenceCrossWalks[cross][c].longitude),
              radius: 50, // in meters
              id: c.toString(),
            })
              .then(() => console.log("crossWalk greater than 70m success!"))
              .catch(e => console.error("error :(", e));
          }
        }
      })
    )
  }
  // 테스트용 횡단보도 지오펜스 설정(인후 횡단보도 4개)
  const testCrossWalkGeofence = () => {
    requestBackPermission().then(
      requestPermission().then(result => {
        console.log(result);

        Boundary.add({
          lat: 37.45087401903797,
          lng: 126.6579022452648,
          radius: 50, // in meters
          id: "51",
        })
          .then(() => console.log("crossWalk for test success!"))
          .catch(e => console.error("error :(", e));

        Boundary.add({
          lat: 37.4512460468357,
          lng: 126.65647372842074,
          radius: 50, // in meters
          id: "52",
        })
          .then(() => console.log("crossWalk for test success!"))
          .catch(e => console.error("error :(", e));

        Boundary.add({
          lat: 37.45173864401376,
          lng: 126.65468581676325,
          radius: 50, // in meters
          id: "53",
        })
          .then(() => console.log("crossWalk for test success!"))
          .catch(e => console.error("error :(", e));

        Boundary.add({
          lat: 37.45216910632688,
          lng: 126.65322591821425,
          radius: 50, // in meters
          id: "54",
        })
          .then(() => console.log("crossWalk for test success!"))
          .catch(e => console.error("error :(", e));
      })
    )
  }
  const apiTest = async() => {
    try{
      const value = await AsyncStorage.getItem('userData');
      const parseValue = JSON.parse(value);

      fetch("http://34.64.74.7:8081/user/login/alarm", {
        method: 'POST',
        body: JSON.stringify({
          userId: parseValue.userId,
          idx: parseValue.idx,
          alarm: "arrival",
          where: "House",
          lat: parseValue.schoolLat,
          lng: parseValue.schoolLng,
        }),
        headers : {
          'Content-Type' : 'application/json; charset=utf-8',
          Authorization: `Bearer${parseValue.token}`,
        }
      })
        .then(response => response.json())
        .then((responseJson) => {
          console.log(responseJson);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch(error) {
      console.log(error);
    }
  }

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
          navigation.navigate("Loginpage");
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
    componentDidMount();
    trackPosition();

    apiTest();
    
    //testGeofence();
    //setInterval(()=>ChildMainAPI(latitude,longitude),5000); //여기서 호출하니 위경도 값 안넘어감
    //setInterval(()=>ChildMainAPI(routetest),5000);
  }, []);

  useEffect(() => {
    removeFence();

    homeSchoolGeofence();
    dangerAreaGeofence();
    testCrossWalkGeofence();
    //crossWalkGeofence();
  }, [fillAllData])
  
  if(!latitude && !longitude) {
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
            <TouchableOpacity style={styles.modifyButton} onPress={() => {drawer.openDrawer()}}>
              <Icon name="bars" size={25} color={"#000"}/>
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
            showsCompass={false}
            toolbarEnabled={false}
            //zoomEnabled={false} // 횡단보도 마커크기 고정 안되면 그냥 지도 확대 안되게 하는걸로...
          >
          <Marker
              coordinate={{latitude: latitude, longitude: longitude}}
          >
            <Icon name="map-marker-alt" size={30} color={"#CAEF53"}/>
          </Marker>

          <Polyline
              coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}
          />

          {// 모든 횡단보도 표시
            allCrossWalks.map(crossWalk => (
              crossWalk.map((cross, index) => (
                <Marker
                key={index}
                icon={require('../traffic_light_icon.png')}
                coordinate={{latitude: parseFloat(cross.latitude), longitude: parseFloat(cross.longitude)}}
                />
              ))
            ))
          }

          {dangerAreas.length === 0 ? (
                <ActivityIndicator
                  color="white"
                  style={{margin: 10}}
                  size="large"
                />
            ) : (
              dangerAreas.map(dangerArea => (
                dangerArea.map((dan, i) => (
                  <Circle
                    key={i}
                    center={{latitude: parseFloat(dan.la_crd), longitude: parseFloat(dan.lo_crd)}}
                    radius={50}
                    strokeColor="rgba(0,0,0,0)"
                    strokeWidth={3}
                    fillColor={dan.occrrnc_cnt >= 1 && dan.occrrnc_cnt <= 4 ? "rgba(255,255,0,0.1)" : (
                      dan.occrrnc_cnt > 4 && dan.occrrnc_cnt <= 7 ? "rgba(255,127,0,0.1)" : "rgba(255,0,0,0.1)"
                    )}
                  />
                ))
              ))
            )}

          </MapView>
        </DrawerLayout>
        {/*<View>
          <Button title="ON" onPress={() =>  {Boundary.on(Events.ENTER, ononon());}}></Button> 
        </View>
        <View>
          <Button title="OFF" onPress={() =>  {Boundary.on(Events.EXIT, ofof());}}></Button> 
        </View>
        <View>
          <Button title="자녀위치보내기" onPress={() =>  ChildMainAPI(latitude,longitude)}></Button>
          </View>*/}
      </View>
  );
}

async function ChildMainAPI(latitude,longitude){
  const value = await AsyncStorage.getItem('userData');
  const parseValue = JSON.parse(value);
  fetch('http://34.64.74.7:8081/user/login/child', {
  method: 'POST',
  body: JSON.stringify({
    "userId": "child",
    "idx": false,
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {
    'Content-Type' : 'application/json; charset=utf-8',
    Authorization: `Bearer${parseValue.token}`,
  }
})
  .then((response) => response.json())
  .then(async(responseJson) => {
    console.log(responseJson);
    if(responseJson==="expired"){
      try{
      await AsyncStorage.removeItem('userData');
      navigation.navigate('Loginpage');
    }catch(error){
      console.log(error);
    }
    }
  })
  .catch((error) => {
    console.error("no");
  });
}

/*
//테스트용1
function ChildMainAPI(latitude,longitude){
  fetch('http://34.64.74.7:8081/test/loc', {
  method: 'POST',
  body: JSON.stringify({
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(latitude);
    console.log(longitude);
    console.log(responseJson);
  })
  .catch((error) => {
    console.error("no");
  });
}
*/
/*/
//테스트용2
function ChildMainAPI(routetest){
  fetch('http://34.64.74.7:8081/test/loc2', {
  method: 'POST',
  body: JSON.stringify({
      list : routetest
  }),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(routetest);
    console.log(responseJson);
  })
  .catch((error) => {
    console.error("no");
  });
}
*/
export default ChildMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
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
  body: {
    width: "100%",
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#696969",
  },
  image: {
    width: 175,
    height: 200,
    marginTop: 80,
  },
  modifyButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 35,
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  }
});