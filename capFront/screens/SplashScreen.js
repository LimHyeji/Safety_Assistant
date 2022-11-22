import React, {useState, useEffect} from 'react';
import { View, Text, Button,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loading =async({navigation})=>{
  try{
  const value = await AsyncStorage.getItem('userData');
  const parsevalue=JSON.parse(value);
  console.log(parsevalue.idx);
  if(value===null){
    navigation.navigate('Loginpage');
  }
  else if(parsevalue.idx===true){
    navigation.navigate('ParentMainpage');
  }
  else if(parsevalue.idx===false){
    navigation.navigate('ChildMainpage');
  }
}catch(error){
  console.log(error);
}
}

const SplashScreen = ({navigation}) => {

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
          <Button title="(임시)Test2" onPress={() => navigation.navigate('Test2page')}></Button>
          </View>
      </View>
    );
  };
  
  export default SplashScreen;