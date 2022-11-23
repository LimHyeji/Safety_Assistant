import React from 'react';
import { View,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeLatLng=async(lat,lng,address,{navigation})=>{
  await AsyncStorage.setItem(
    'gpsData',
    JSON.stringify({
      lat:lat,
      lng:lng,
      address:address
    })
  )
  navigation.navigate("Registerpage");
};

function toLatLng(address,{navigation}){
  Geocode.setApiKey("AIzaSyD3wawfdvi_QBp0XYbXPC47nXWUUEVX4wY");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");

  Geocode.fromAddress(address).then(
    (response) => {
      console.log(address);
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);
    
      storeLatLng(lat,lng,address,{navigation});

    },
    (error) => {
      console.error(error);
    }
  );
}

function app({navigation}){
  return(
    <View>
      <Postcode
      style={{ width: '100%', height: '100%' }}
      jsOptions={{ animation: true }}
      onSelected={data => toLatLng(data.addressEnglish,{navigation})}
    />
    </View>
  );
}
export default app;
//*/