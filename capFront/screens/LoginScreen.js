import React, {useState} from "react";
import { View, Text, TextInput, Button, } from "react-native";
import {AsyncStorage} from '@react-native-async-storage/async-storage';

function Login({navigation}){

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
          <View>
          <Button title="회원가입" onPress={() => navigation.navigate('Registerpage')}></Button>
          </View>         
    </View>
    );
  };

  function LoginAPI(form){
    fetch('http://34.64.74.7:8081/user/login', { //host명 필요
    method: 'POST',
    body: JSON.stringify({
      userId: form.userId.value,
      password:form.password.value
    } ),
    headers : {'Content-Type' : 'application/json; charset=utf-8'}
  })
    .then((response) =>   
    response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  };
  
    export default Login;