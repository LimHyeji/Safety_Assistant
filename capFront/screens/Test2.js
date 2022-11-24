import React, { useState, useEffect } from 'react';
import { View,Button,} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";
import Modal from 'react-native-modal'

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
  const [isModal, setModal] = useState(false);
return(
    <View>
      <Modal isVisible={isModal}>
        <View>
        <Postcode
          style={{ width: 320, height: 320 }}
          jsOptions={{ animation: true }}
          onSelected={data => {
            alert(JSON.stringify(data));
            setModal(false);
          }}
        />
        </View>
      </Modal>
      <Button title="주소찾기" onClick={() => setModal(true)}></Button>
    </View>
);
}
export default app;

/*
import React, { useState, useEffect } from 'react';
import { Text,} from 'react-native';

function app({mm,ss},{navigation}){
    const [minutes,setMinutes]=useState(parseInt(mm));
    const [seconds,setSeconds]=useState(parseInt(ss));

    useEffect(() => {
        const countdown = setInterval(() => {
          if (parseInt(seconds) > 0) {
            setSeconds(parseInt(seconds) - 1);
          }
          if (parseInt(seconds) === 0) {
            if (parseInt(minutes) === 0) {
                clearInterval(countdown);
            } else {
              setMinutes(parseInt(minutes) - 1);
              setSeconds(59);
            }
          }
        }, 1000);
        return () => clearInterval(countdown);
      }, [5, 0]);


    return(
        <Text>
            {minutes}:{seconds < 10 ? '0${seconds}':seconds}
        </Text>
    );
};

export default app;
//*/