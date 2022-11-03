//import {useNavigation} from '@react-navigation/native';
import React, {useState} from "react";
import { StyleSheet, Text, View, TextInput, Button, Platform, } from "react-native";
//StyleSheet 추가 필요

function Login(){

const [type, setType] = useState('Login');
//const [action, setAction] = useState('Login');
//const [actionMode, setActionMode] = useState('문구 적기');
const [hasErrors, setHasErrors] = useState(false);
const [form, setForm] = useState({
  userId: {
    value: '',
    type: 'textInput',
    rules: {},
    valid: true,
    },
  password: {
    value: '',
    type: 'textInput',
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
};

  formHasErrors = () => {
    return hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>
          로그인 정보를 다시 확인해주세요.
        </Text>
      </View>
    ) : null;
  };

return (
    <View>
        <Text>로그인</Text>
        <TextInput
            value={form.userId.value}
            type={form.userId.type} // 미입력하면 못 넘어가게
            autoCapitalize={'none'}
            placeholder="아이디"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('userId',value)}
            />
        <TextInput
            value={form.password.value}
            type={form.password.type}
            secureTextEntry={true}
            autoCapitalize={'none'}
            placeholder="비밀번호"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('password',value)}
            />
          <View>
          <Button title="로그인" onPress={() =>  LoginAPI(form)}></Button>
          </View>
    </View>
    );
  };

  function LoginAPI(form){
    fetch('http://url', { //host명 필요
    method: 'POST',
    body: JSON.stringify({
      userId: form.userId.value,
      password:form.password.value
    } ),
    headers : {'Content-Type' : 'application/json; charset=utf-8'}
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      //jwt 토큰 저장해야함!

      
           // setLoading(false);
      /*
      if (responseJson.status === 'success') {
        AsyncStorage.setItem('userId', responseJson.data.stu_id);
        console.log(responseJson.data.stu_id);
        navigation.replace('DrawerNavigationRoutes');
      } else {
        setErrortext('아이디와 비밀번호를 다시 확인해주세요');
        console.log('Please check your id or password');
      }*/
    })
    .catch((error) => {
      console.error(error);
    });
  };
  
    export default Login;