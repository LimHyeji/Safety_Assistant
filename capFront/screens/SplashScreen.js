import React, {useState, useEffect} from 'react';
import { View, Text, Button,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SplashScreen = async({navigation}) => {

    const value = await AsyncStorage.getItem('userData');

    if(value==null){
      navigation.navigate('Loginpage');
    }
    else if(value.idx===true){
      navigation.navigate('ParentMainpage');
    }
    else if(value.idx===false){
      navigation.navigate('ChildMainpage');
    }
    else{
      console.log('error');
    }  
  
    return (
      <View>
          <View>
          <Button title="로그인" onPress={() => navigation.navigate('Loginpage')}></Button>
          </View>
          <View>
          <Button title="부모메인" onPress={() => navigation.navigate('ParentMainpage')}></Button>
          </View>
          <View>
          <Button title="자녀메인" onPress={() => navigation.navigate('ChildMainpage')}></Button>
          </View>
          <View>
          <Button title="(임시)회원정보수정" onPress={() => navigation.navigate('Modifypage')}></Button>
          </View>
          <View>
          <Button title="(임시)Test" onPress={() => navigation.navigate('Testpage')}></Button>
          </View>
      </View>
    );
  };
  
  export default SplashScreen;