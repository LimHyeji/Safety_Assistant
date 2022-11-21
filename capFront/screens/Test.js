import React, { useState, useEffect } from 'react';
import { View,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";

function toLatLng(address){
  Geocode.setApiKey("AIzaSyD3wawfdvi_QBp0XYbXPC47nXWUUEVX4wY");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");
  Geocode.fromAddress(address).then(
    (response) => {
      console.log(address);
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);
    },
    (error) => {
      console.error(error);
    }
  );
}
function app({navigation}){
  /*
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
*/
return(
  <View>
    <Postcode
    style={{ width: 320, height: 320 }}
    jsOptions={{ animation: true }}
    onSelected={data => toLatLng(data.addressEnglish)}
  />
  </View>
);
}
export default app;
//*/