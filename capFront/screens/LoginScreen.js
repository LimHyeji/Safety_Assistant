import React, { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { View, Text, TextInput, Button,  PermissionsAndroid, ActivityIndicator } from "react-native";
import MapView, {Marker, Polyline, AnimatedRegion} from "react-native-maps";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


function LoginAPI(){
  fetch('http://localhost:3001/user/register', { //host명 필요
  method: 'POST',
  body: JSON.stringify({
    userid:userid,
    password:password        
  }),
  headers: {
    //Header Defination
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((responseJson) => {
    //Hide Loader
    setLoading(false);
    console.log(responseJson);
    // If server response message same as Data Matched
    if (responseJson.status === 'success') {
      AsyncStorage.setItem('userid', responseJson.data.stu_id);
      console.log(responseJson.data.stu_id);
      navigation.replace('DrawerNavigationRoutes');
    } else {
      setErrortext('아이디와 비밀번호를 다시 확인해주세요');
      console.log('Please check your id or password');
    }
  })
  .catch((error) => {
    //Hide Loader
    console.error(error);
  });
};

function Login(){

const [type, setType] = useState('Login');
const [action, setAction] = useState('Login');
const [actionMode, setActionMode] = useState('새로 등록할게요~');
const [hasErrors, setHasErrors] = useState(false);
const [form, setForm] = useState({
  userid: {
    value: '',
    type: 'textInput',
    rules: {},
    valid: true,  //중복된 아이디에 대한 예외처리
  },
  password: {
    value: '',
    type: 'textInput', // **로 입력되도록 조치 필요
    rules: {},
    valid: false,
  }
});

updateInput = (name, value) => {
  setHasErrors(false);
  let formCopy = form;
  formCopy[name].value = value;
  setForm(form => {
    return {...formCopy};
  });
  //console.warn(form);
};

  formHasErrors = () => {
    return hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>
          로그인 정보를 다시 확인해주세요
        </Text>
      </View>
    ) : null;
  };

return (
    <View>
        <Text>로그인</Text>
        <TextInput
            value={form.userid.value}
            type={form.userid.type} // 미입력하면 못 넘어가게
            autoCapitalize={'none'}
            placeholder="아이디"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('userid',value)}
            />
        <TextInput
            value={form.password.value}
            type={form.password.type}
            autoCapitalize={'none'}
            placeholder="비밀번호"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('password',value)}
            />
          <View>
          <Button title="로그인" onPress={a = () =>  LoginAPI}></Button>
          {
            /*
            <할일>
            api 보내기
            + 집/학교 데이터 처리
            */
          }
          </View>
    </View>
    );
  };

    export default Login;