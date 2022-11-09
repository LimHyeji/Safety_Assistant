import React from 'react';
import{createSwitchNavigator, createAppContainer} from 'react-navigation'
import{createStackNavigator} from 'react-navigation-stack'
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import SetUpScreen from './screens/SetUpScreen';
import ModifyScreen from './screens/ModifyScreen';
import Test from './screens/Test';

const AppStack = createStackNavigator(
  {
    Mainpage:MainScreen,
    SetUppage:SetUpScreen,
  },
  {
    initialRouteName:'Mainpage',
  }
  );
const AuthStack = createStackNavigator(
  {
    Loginpage:LoginScreen,
    Registerpage:RegisterScreen,
    Modifypage:ModifyScreen,
    Testpage:Test,
  },
  {
    initialRouteName:'Loginpage',
  }
  );

  const switchScreen=createSwitchNavigator(
  {
    Splashpage:SplashScreen,
    App:AppStack,
    Auth:AuthStack,
  },
  {
    initialRouteName:'Splashpage',
  }
  );

  export default createAppContainer(switchScreen);