import React from 'react';
import{createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import SetUpScreen from './screens/SetUpScreen';

const AppStack = createStackNavigator({Main:MainScreen});
const AuthStack = createStackNavigator({Login:LoginScreen});

export default createAppContainer(createSwitchNavigator(
  {
    Splash:SplashScreen,
    App:AppStack,
    Auth:AuthStack, //setup이랑 register 잊지말기
  },
  {
    initialRouteName:'Splash',
  }
))