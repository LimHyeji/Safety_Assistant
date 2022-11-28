import React, { useState, useEffect } from 'react';
import { Text,Linking,Button} from 'react-native';
import GoogleFit, { Scopes, BucketUnit } from 'react-native-google-fit'
/*
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
*/0

/*
function app(){
  return(
  <Button title="전화걸기" onPress={()=>{Linking.openURL(`tel:전화번호`)}} />
  );
}
*/



function app() {
  const optionsHB = {
    startDate: new Date(2021, 1, 1).toISOString(), // required
    endDate: new Date().toISOString(), // required
    bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1, // optional - default 1.
  };

  async function fetchData() {
    const bloodpressure = await GoogleFit.getBloodPressureSamples(optionsHB);
  console.log(bloodpressure);
  }
  useEffect(() => {
    const options = {
      scopes: 
        [
            Scopes.FITNESS_ACTIVITY_READ,
            Scopes.FITNESS_ACTIVITY_WRITE,
            Scopes.FITNESS_BLOOD_PRESSURE_READ,
            Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
            Scopes.FITNESS_BLOOD_GLUCOSE_READ,
            Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
        ],
    };

    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isAuthorized) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
      if(!GoogleFit.isAuthorized) {
        GoogleFit.authorize(options)
              .then(authResult => {
                if (authResult.success) {
                  console.log('Success')
                  fetchData()
                } else {
                  console.log('Denied')
                  //dispatch("AUTH_DENIED", authResult.message);
                }
              })
              .catch((error) => {
                console.log(error);
                //dispatch("AUTH_ERROR");
              })
      }
      else {
        console.log("already!");
        fetchData()
      }
    })
  }, []);
}
export default app;