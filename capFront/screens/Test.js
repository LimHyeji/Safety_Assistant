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