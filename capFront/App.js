import React,{useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import{createSwitchNavigator, createAppContainer} from 'react-navigation'
import{createStackNavigator} from 'react-navigation-stack'
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import addressScreen from './screens/addressScreen';
import ParentMainScreen from './screens/ParentMainScreen';
import ParentSetUpScreen from './screens/ParentSetUpScreen';
import ChildMainScreen from './screens/ChildMainScreen';
import ChildSetUpScreen from './screens/ChildSetUpScreen';
import ModifyScreen from './screens/ModifyScreen';  //위치 수정 필요
import Test2 from './screens/Test2'; //임시

const ParentAppStack = createStackNavigator(
  {
    ParentMainpage:ParentMainScreen,
    ParentSetUppage:ParentSetUpScreen,
  },
  {
    initialRouteName:'ParentMainpage',
    headerMode: 'none',
  }
  );

  const ChildAppStack = createStackNavigator(
    {
      ChildMainpage:ChildMainScreen,
      ChildSetUppage:ChildSetUpScreen,
    },
    {
      initialRouteName:'ChildMainpage',
      headerMode: 'none',
    }
    );

const AuthStack = createStackNavigator(
  {
    Loginpage:LoginScreen,
    Registerpage:RegisterScreen,
    addresspage:addressScreen,
  },
  {
    initialRouteName:'Loginpage',
    headerMode: 'none',
  }
  );

  const switchScreen=createSwitchNavigator(
  {
    Splashpage:SplashScreen,
    Modifypage:ModifyScreen,
    Test2page:Test2, //임시
    ParentApp:ParentAppStack,
    ChildApp:ChildAppStack,
    Auth:AuthStack,
  },
  {
    initialRouteName:'Splashpage',
    headerMode: 'none',
  }
  );

const AppContainer=createAppContainer(switchScreen);

function App({navigation}){
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('알림 테스트', JSON.stringify(remoteMessage));
  });
  useEffect(() => {
    return unsubscribe;
  }, []);
    return (
      <AppContainer/>
    );
};

export default  App;
