import React, { useState } from 'react';
import { View,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Geolocation from "react-native-geolocation-service";
import MapView, {Marker, Polyline, Circle} from "react-native-maps";
import Boundary, {Events} from 'react-native-boundary';

/*
const PostCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    width: "60%",
    height: "60%",
    padding: "7px",
  };

function HandlePostCode(data) {
    let fullAddress = data.address;
    let extraAddress = ''; 
    
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    console.log(data)
    console.log(fullAddress)
    console.log(data.zonecode)

return(
    <View>
        <Postcode style={{flex:1, width:'100%', zIndex:999}} onComplete={HandlePostCode} />
    </View>
);
};
 
export default HandlePostCode;
*/
/*

function app({navigation}){
const getAddressData = data => {
 let defaultAddress = ''; // 기본주소
 if (data.buildingName === 'N') {
   defaultAddress = data.apartment;
 } else {
   defaultAddress = data.buildingName;
 }

 navigation.goBack();
 route.params.onSelect({
   zone_code: data.zonecode,
   default_address: data.address + ' ' + defaultAddress,
 });
};
return(
  <View>
  <Postcode
  style={{ flex: 1, width: '100%', zIndex: 999 }}
  jsOptions={{ animation: true }}
  onSelected={data => getAddressData(data)}
  />
  </View>
);
}
export default app;
*/
//*
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


function ChildMain({navigation}) {

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);

  const trackPosition = () => {
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
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
      }
    });
  }

  useEffect(() => {
    trackPosition();
    Boundary.add({
      latitude: 34.017714,
      longitude: -118.499033,
      radius: 50, // in meters
      id: "test",
    })
    .then(() => console.log("success!"))
    .catch(e => console.error("error :(", e));
    Boundary.
    Boundary.on(Events.ENTER, id => {
      // Prints 'Get out of my Chipotle!!'
      console.log(`Get out of my ${id}!!`);
    });
    
    Boundary.on(Events.EXIT, id => {
      // Prints 'Ya! You better get out of my Chipotle!!'
      console.log(`Ya! You better get out of my ${id}!!`)
    })
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

        </MapView>
        </View>
  );
}

export default ChildMain;
//*/
/*
const App = () => {
  
  sendMessageToWatch = () => {
    try {
      Watch.sendMessage({text: 'hi'}, (err, resp) => {
        if (!err) {
          console.log('response received', resp);
        } else {
          console.warn('error sending message to watch', err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const testBtn = async (text) => {
    sendMessageToWatch();
  };

  return (
    <View>
      <Text>Test</Text>
      <TouchableOpacity onPress={getTestBtn}>
        <Button title={'테스트버튼'} onPress={testBtn} />
      </TouchableOpacity>
    </View>
  );
};*/