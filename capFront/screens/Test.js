import React, { useState } from 'react';
import { View,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import { Button } from 'react-native-paper';

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
    onSelected={data => alert(JSON.stringify(data))}
  />
  </View>
);
}
export default app;
//*/