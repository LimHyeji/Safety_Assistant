import React, { useState, useEffect } from "react";
import { View, Text, Button, PermissionsAndroid, ActivityIndicator, } from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, {Marker, Polyline, Circle, } from "react-native-maps";
import Boundary, {Events} from 'react-native-boundary';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      // 모든 횡단보도 가져오기
      const allCrossWalk = await fetch('http://34.64.74.7:8081/user/login/cross?idx=false');
      const crossWalkData = await allCrossWalk.json();
      setAllCrossWalks(allCrossWalks => [...allCrossWalks, crossWalkData.crosses]);  // 변수에 값 안들어감
      
      // 70m 이상의 횡단보도 가져오기
      const fenceCrossWalk = await fetch('http://34.64.74.7:8081/user/login/cross/cond?idx=false');
      const fenceCrossWalkData = await fenceCrossWalk.json();
      setFenceCrossWalks(fenceCrossWalks => [...fenceCrossWalks, fenceCrossWalkData.crosses]);

      setFillAllData(true);
  }

  const trackPosition = () => {
    requestBackPermission().then(result => {
      requestPermission().then(result => {
        console.log({result});
        if(result === "granted") {
          const _watchId = Geolocation.watchPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setLatitude(latitude);
              setLongitude(longitude);
              setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
              //ChildMainAPI(latitude,longitude) //여기서 호출해야 위경도값 넘어감 왜지...?
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
      });
    })
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
          lat: latitude,
          lng: longitude,
        }),
        headers : {'Content-Type' : 'application/json; charset=utf-8'}
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
            alarm: 2,
            where: "House",
            lat: latitude,
            lng: longitude,
          }),
          headers : {'Content-Type' : 'application/json; charset=utf-8'}
        })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson, "OK");
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
            alarm: 2,
            where: "School",
            lat: latitude,
            lng: longitude,
          }),
          headers : {'Content-Type' : 'application/json; charset=utf-8'}
        })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson, "OK");
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
            alarm: 4,
            where: id.toString(),
            lat: latitude,
            lng: longitude,
          }),
          headers : {'Content-Type' : 'application/json; charset=utf-8'}
        })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson, "OK");
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
            alarm: 1,
            where: "House",
            lat: latitude,
            lng: longitude,
          }),
          headers : {'Content-Type' : 'application/json; charset=utf-8'}
        })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson, "OK");
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
            alarm: 1,
            where: "School",
            lat: latitude,
            lng: longitude,
          }),
          headers : {'Content-Type' : 'application/json; charset=utf-8'}
        })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson, "OK");
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // 횡단 보도일 경우,
      else if (Number(id) >= 0 && Number(id) < 51) {
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
    //homeSchoolGeofence();
    //dangerAreaGeofence();
    //crossWalkGeofence();
  }, [fillAllData])
  
  if(!latitude && !longitude) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>Loading...</Text>
      </View>
    );
  }

  return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, width:'100%', height:'100%' }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
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
        <View>
          <Button title="설정" onPress={() =>  navigation.navigate('ChildSetUppage')}></Button> 
        </View>
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

function ChildMainAPI(latitude,longitude){
  fetch('http://34.64.74.7:8081/user/login/child', {
  method: 'POST',
  body: JSON.stringify({
    "userId": "child",
    "idx": false,
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
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