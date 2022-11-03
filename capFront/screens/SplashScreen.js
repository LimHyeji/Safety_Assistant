import React, {useState, useEffect} from 'react';
import {AsyncStorage} from '@react-native-community/async-storage';
import { ActivityIndicator,View,StyleSheet,Image } from 'react-native';

//코드보완 필요, expired 여부 체크
const SplashScreen = ({navigation}) => {
    const [animating, setAnimating] = useState(true);
  
    useEffect(() => {
      setTimeout(() => {
        setAnimating(false);
        AsyncStorage.getItem('user_id').then((value) =>
          navigation.replace(value === null ? 'Auth' : 'App'),
        );
      }, 3000);
    }, []);
  
    return (
      <View>
       <Text>
        등하교 도우미 앱(제목)
       </Text>
      </View>
    );
  };
  
  export default SplashScreen;