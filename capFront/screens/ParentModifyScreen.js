import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
비밀번호 미입력 시 api 안넘기는 것으로 예외처리
*/

function ModifyAuthForm({navigation}) {
  const [parseValue, setParseValue] = useState({});
  const getForm = async() => {
    try {
      const value = await AsyncStorage.getItem('userData');
      setParseValue(JSON.parse(value));
    } catch(error) {
      console.error(error);
      return(
        <View>
          <Text>
            로딩 중에 문제가 발생했어요!
          </Text>
        </View>
      );
    }
  }

  const [form, setForm] = useState({
    userId: { //표시해야하고 접근불가
      value: '',
      type: 'textInput',
      rules: {},
      valid: true,  
    },
    password: { //표시 안함
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    confirmPassword: {  //표시 안함
      value: '',
      type: 'textInput', //비밀번호확인 구현필요
      rules: {},
      valid: false,
    },
    userName: { //표시해야하고 접근불가
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
      },
      phoneNum: { //표시해야하고 접근불가
        value: '',
        type: 'textInput',
        rules: {},
        valid: true,
      }
  });

const updateInput = (name, value) => {
    let formCopy = form;
    formCopy[name].value = value;
    setForm(form => {
      return {...formCopy};
    });
};

useEffect(() => {
  getForm();
}, [])

return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={require("../logo.png")}  style={styles.image}/>
        <Text style={styles.title}>회원정보수정</Text>
          <View style={styles.InputContainer}>
            <View style={styles.bodyContainer}><Text style={styles.body}>아이디</Text></View>
            <View style={styles.infoContainer}><Text style={styles.info}>{parseValue.userId}</Text></View>
          </View>
          <View style={styles.InputContainer}>
            <View style={styles.bodyContainer}><Text style={styles.body}>비밀번호</Text></View>
            <View style={styles.infoContainer}>
              <TextInput
                style={styles.info}
                value={form.password.value}
                type={form.password.type}
                secureTextEntry={true}
                autoCapitalize={'none'}
                placeholder="비밀번호"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('password',value)}
              />
            </View>
          </View>
          <View style={styles.InputContainer}>
            <View style={styles.bodyContainer}><Text style={styles.body}>비밀번호 확인</Text></View>
            <View style={styles.infoContainer}>
              <TextInput
                style={styles.info}
                value={form.confirmPassword.value}
                type={form.confirmPassword.type}
                secureTextEntry={true}
                autoCapitalize={'none'}
                placeholder="비밀번호 확인"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('confirmPassword',value)}
              />
            </View>
          </View>
          {
              form.confirmPassword.value === form.password.value ? (
                <Text style={styles.notEq}></Text>
              ):(
                <Text style={styles.notEq}>비밀번호가 일치하지 않습니다.</Text>
              )
            }
          <View style={styles.InputContainer}>
            <View style={styles.bodyContainer}><Text style={styles.body}>이름</Text></View>
            <View style={styles.infoContainer}><Text style={styles.info}>{parseValue.userName}</Text></View>
          </View>  
          <View style={styles.InputContainer}>
            <View style={styles.bodyContainer}><Text style={styles.body}>전화번호</Text></View>
            <View style={styles.infoContainer}><Text style={styles.info}>{parseValue.phoneNum}</Text></View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() =>  ModifyAuthFormAPI(form, parseValue, {navigation})}>
            <Text>회원정보수정</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
    );
};

function ModifyAuthFormAPI(form, parseValue, {navigation}){
  if(form.password.value === '') {
    Alert.alert("수정 실패", "수정할 비밀번호를 입력하세요." , [
      {
        text: "확인",
      }
    ])
  }
  else {
    fetch('http://34.64.74.7:8081/user/login/update', {
    method: 'POST',
    body: JSON.stringify({
      userId: parseValue.userId,  
      userName: parseValue.userName,  
      password: form.password.value,
      phoneNum: parseValue.phoneNum,  
      parentPhoneNum:null,
      idx:true,
      houselat:null,
      houselng:null,
      schoollat:null,
      schoollng:null,
      duration:null
    }  ),
    headers : {
      'Content-Type' : 'application/json; charset=utf-8',
      Authorization: `Bearer${parseValue.token}`,
    }
  })
    .then(async(responseJson) => {
      console.log(responseJson);
      if(responseJson==="expired"){
        try{
        await AsyncStorage.removeItem('userData');
        navigation.navigate('Loginpage');
      }catch(error){
        console.log(error);
      }
      }
      navigation.goBack(null); // 일단 비밀번호를 수정하면 메인으로 돌아가게 해둠
      //비밀번호 수정하면 로그인 풀리게 하는 것도 괜찮을듯?
    })
    .catch((error) => {
      console.error(error);
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white"
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    marginTop: 20,
    marginBottom: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: 20,
    color: "#696969",
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
    borderColor: "#CAEF53",
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  bodyContainer: {
    width: "30%",
  },  
  infoContainer: {
    width: "70%",
  }, 
  body: {
    fontSize: 14,
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "black",
    textAlignVertical: 'center',
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: "#CAEF53"
  },
  info: {
    fontSize: 14,
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "black",
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  image: {
    width: 175,
    height: 200,
    marginTop: 80,
  },
  notEq: {
    width: "70%",
    height: 42,
    textAlignVertical: 'center',
    textAlign: "center",
    color: "red",
  }, 
});


export default ModifyAuthForm;