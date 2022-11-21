import React, { useState, useEffect } from "react";
import { View, Text, Button, PermissionsAndroid, ActivityIndicator, } from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, {Marker, Polyline, Circle} from "react-native-maps";
import Boundary, {Events} from 'react-native-boundary';

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
  const guGun = [680, 740, 305, 500, 620, 215, 530, 545, 350, 320, 230, 590, 440, 410, 650, 200, 290, 710, 470, 560, 170, 380, 110, 140, 260];
  const [crossWalks,setCrossWalks] = useState([]); //횡단보도
  const [routetest,setRouteTest]=useState([{latitude:"37",longitude:"128"},{latitude:"38",longitude:"129"}]);

  const componentDidMount = async() => {
      for(let g in guGun) {
        const response = await fetch('http://taas.koroad.or.kr/data/rest/frequentzone/pedstrians?authKey=Wamet5QoAtdrevWTUcRvZV8ey5UsqtkcjGwmpVfYsay5RJnrDMFwFE4yUE4WldPf&searchYearCd=2022032&siDo=11&guGun=' + guGun[g] + '&type=json');
        const danger = await response.json();
        setDangerAreas(dangerAreas => [...dangerAreas, danger.items.item]);
      }

      const crossWalk = await fetch('http://34.64.74.7:8081/user/login/cross?idx=false')
      const crossWalkData = await crossWalk.json();
      setCrossWalks(crossWalks => [...crossWalks, crossWalkData.crosses]);  // 변수에 값 안들어감
      console.log(crossWalks);
  }

  const trackPosition = () => {
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
        const _watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
            //setInterval(()=>ChildMainAPI(latitude,longitude),5000); //여기서 호출해야 위경도값 넘어감 왜지...?
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
  }


  function removeFence() {
    // Remove the events
    Boundary.off(Events.ENTER)
    Boundary.off(Events.EXIT)

    // Remove the boundary from native API´s
    Boundary.removeAll()
      .then(() => console.log('Goodbye all Chipotle :('))
      .catch(e => console.log('Failed to delete Chipotle :)', e))
  }

  function ononon(id) {
    console.log(`Get out of my ${id}!!`);
  }

  function testGeofence() {
    requestBackPermission().then(
      requestPermission().then(result => {
        console.log({result});
        if(result === "granted") {
          
          Boundary.add({
            lat: 37.600020465178645,
            lng: 126.66487554774204,
            radius: 50, // in meters
            id: "School",
          })
            .then(() => console.log("success!"))
            .catch(e => console.error("error :(", e));

          Boundary.on(Events.ENTER, id => {
            // Prints 'Get out of my Chipotle!!'
            ononon(id);
          });
            
          Boundary.on(Events.EXIT, id => {
            // Prints 'Ya! You better get out of my Chipotle!!'
            console.log(`Ya! You better get out of my ${id}!!`)
          });
        }
      })
    )
  }

  useEffect(() => {
    componentDidMount();
    trackPosition();

    removeFence();
    testGeofence();
    //setInterval(()=>ChildMainAPI(latitude,longitude),5000); //여기서 호출하니 위경도 값 안넘어감
    //setInterval(()=>ChildMainAPI(routetest),5000);
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
        />

        <Polyline
            coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}
        />

        {//횡단보도 띄워야함
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