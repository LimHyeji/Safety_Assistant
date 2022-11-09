import React from 'react';
import{createSwitchNavigator, createAppContainer} from 'react-navigation'
import{createStackNavigator} from 'react-navigation-stack'
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ParentMainScreen from './screens/ParentMainScreen';
import ParentSetUpScreen from './screens/ParentSetUpScreen';
import ChildMainScreen from './screens/ChildMainScreen';
import ChildSetUpScreen from './screens/ChildSetUpScreen';
import ModifyScreen from './screens/ModifyScreen';  //위치 수정 필요
import Test from './screens/Test';  //임시

const ParentAppStack = createStackNavigator(
  {
    ParentMainpage:ParentMainScreen,
    ParentSetUppage:ParentSetUpScreen,
  },
  {
    initialRouteName:'ParentMainpage',
  }
  );

  const ChildAppStack = createStackNavigator(
    {
      ChildMainpage:ChildMainScreen,
      ChildSetUppage:ChildSetUpScreen,
    },
    {
      initialRouteName:'ChildMainpage',
    }
    );

const AuthStack = createStackNavigator(
  {
    Loginpage:LoginScreen,
    Registerpage:RegisterScreen,
  },
  {
    initialRouteName:'Loginpage',
  }
  );

  const switchScreen=createSwitchNavigator(
  {
    Splashpage:SplashScreen,
    Modifypage:ModifyScreen,
    Testpage:Test,
    ParentApp:ParentAppStack,
    ChildApp:ChildAppStack,
    Auth:AuthStack,
  },
  {
    initialRouteName:'Splashpage',
  }
  );

  export default createAppContainer(switchScreen);