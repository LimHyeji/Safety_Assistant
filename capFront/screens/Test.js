import React, { useState } from 'react';
import { View,} from 'react-native';
import DaumPostcode from 'react-daum-postcode';

const PostCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    width: "600px",
    height: "600px",
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
        <DaumPostcode style={PostCodeStyle} onComplete={HandlePostCode} />
    </View>
);
};
 
export default HandlePostCode;