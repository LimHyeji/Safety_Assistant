import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CheckPassword({navigation}) {   
  
    const [form, setForm] = useState({
        password: {
          value: '',
          type: 'textInput',
          rules: {},
          valid: false,
        }
      });
    
    const updateInput = (name, value) => {
      let formCopy = form;
      formCopy[name].value = value;
      setForm(form => {
        return {...formCopy};
      });
    };
    

return (
        <View style={styles.container}>
        <Image source={require("../logo.png")}  style={styles.image}/>
        <Text style={styles.title}>현재 비밀번호를 입력해주세요.</Text>
          <View style={styles.InputContainer}>
          <TextInput
              style={styles.body}
              value={form.password.value}
              type={form.password.type}
              secureTextEntry={true}
              autoCapitalize={'none'}
              placeholder="비밀번호"
              placeholderTextColor={'#ddd'}
              onChangeText={value=>updateInput('password',value)}
            />
          </View>
{
/*
            <TouchableOpacity style={styles.button} onPress={() =>  CheckPasswordAPI(form, {navigation})}>
              <Text>확인</Text>
            </TouchableOpacity>
            */
}
        <TouchableOpacity style={styles.button}>
              <Text>확인</Text>
            </TouchableOpacity>
        </View>
    );
};
/*
function CheckPasswordAPI(form, {navigation}){
  fetch('http://34.64.74.7:8081...', {
    method: 'POST',
    body: JSON.stringify({
      password:form.password.value
    }  ),
    headers : {'Content-Type' : 'application/json; charset=utf-8'}
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.msg === "Ok"){    //임시 반환 메시지
        //idx에 따라 따른 페이지 이동
      }
      else{
        Alert.alert("비밀번호 확인","비밀번호가 틀렸습니다. 다시 입력해주세요.",[
          {
            text:"확인"
          }
        ])
      }
    })
    .catch((error) => {
      console.error(error);
      return(
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>
            비밀번호를 다시 입력해주세요.
          </Text>
        </View>
      );
    });
}
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: "40%",
    marginTop: 30,
    marginBottom: 30,
    height: 50,
    backgroundColor: "#CAEF53",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  InputContainer: {
    width: "80%",
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: "#CAEF53",
    borderRadius: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  body: {
    width: "100%",
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#696969",
  },
  image: {
    width: 175,
    height: 200,
    marginTop: 80,
  },
});

export default CheckPassword;