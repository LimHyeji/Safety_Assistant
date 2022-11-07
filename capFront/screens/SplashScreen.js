import React, {useState, useEffect} from 'react';
import { View, Text, Button,} from 'react-native';
import {AsyncStorage} from '@react-native-async-storage/async-storage';

const storeData=async userData=>{
  try{
      await AsyncStorage.setItem('userData',JSON.stringify(userData));    //userData는 로그인 시에 받은 값
  }catch(e){
    console.log(error);
  }
}

const getData=async () => {
  try{
    const loadedData=await AsyncStorage.getItem('userData');
    //setUserData(JSON.parse(loadedData)||"{}");  //자료없을경우 빈객체반환..? setUserData 구현안됨
  }catch(e){
    console.log(error);
  }
}
/*
setItem("key",data)
getItem("key")
*/


//코드보완 필요, expired 여부 체크
const SplashScreen = ({navigation}) => {
  /*
  const [isReady, setisReady] = useState(false);
  
    useEffect(() => {
      setTimeout(() => {
        setAnimating(false);
        AsyncStorage.getItem('user_id').then((value) =>
          navigation.replace(value === null ? 'Auth' : 'App'),
        );
      }, 3000);
    }, []);
    */
    return (
      <View>
       <Text>
        등하교 도우미 앱(제목)
       </Text>
       <View>
          <Button title="로그인" onPress={() => navigation.navigate('Loginpage')}></Button>
          <Button title="메인" onPress={() => navigation.navigate('Mainpage')}></Button>
          </View>
      </View>
    );
  };
  
  export default SplashScreen;