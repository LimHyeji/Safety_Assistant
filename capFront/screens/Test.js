import React, { useState } from 'react';
import { View,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
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
//*

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
//*/