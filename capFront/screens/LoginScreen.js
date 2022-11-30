import React, {useState} from "react";
import { View, Text, TextInput, ScrollView ,TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
테스트용 아이디/비번
부모
parent parent 0000
child child 1111
*/

function Login({navigation}){

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

const updateInput = (name, value) => {
  let formCopy = form;
  formCopy[name].value = value;
  setForm(form => {
    return {...formCopy};
  });
};

return (
  <ScrollView keyboardShouldPersistTaps='always'>
    <View style={styles.container}>
      <Image source={require("../logo.png")}  style={styles.image}/>
      <Text style={styles.title}>로그인</Text>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          value={form.userId.value}
          type={form.userId.type} // 미입력하면 못 넘어가게
          autoCapitalize={'none'}
          placeholder="아이디"
          placeholderTextColor={'#ddd'}
          onChangeText={(value) => updateInput('userId', value)}
        />
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          value={form.password.value}
          type={form.password.type}
          secureTextEntry={true}
          autoCapitalize={'none'}
          placeholder="비밀번호"
          placeholderTextColor={'#ddd'}
          onChangeText={(value) => updateInput('password',value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() =>  LoginAPI(form, {navigation})}>
        <Text>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Registerpage')}>
        <Text>회원가입</Text>
      </TouchableOpacity>    
    </View>
  </ScrollView>
  );
};

  function LoginAPI(form, {navigation}){
    
    fetch('http://34.64.74.7:8081/user/lgin', { 
    method: 'POST',
    body: JSON.stringify({
      userId: form.userId.value,
      password:form.password.value
    } ),
    headers : {'Content-Type' : 'application/json; charset=utf-8'}
  })
    .then((response) =>   response.json())
    .then(async(responseJson)=> {
      if(responseJson.message === "bad request") {
        Alert.alert("로그인 실패", "로그인 정보를 다시 확인해주세요.", [
          {
            text: "확인"
          }
        ])
      }
      else {
        console.log(responseJson);
        if(responseJson.idx===true){  //부모일 경우의 저장 내용
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify({
            idx:responseJson.idx,
            userId:responseJson.userId,
            userName:responseJson.userName,
            phoneNum: responseJson.phoneNum,
            token:responseJson.token,

            childId:responseJson.childrenInfo.userId,
            childHouseLat:responseJson.childrenInfo.houselat, //집 학교 표시 시 사용
            childHouseLng:responseJson.childrenInfo.houselng,
            childSchoolLat:responseJson.childrenInfo.schoollat,
            childSchoolLng:responseJson.childrenInfo.schoollng
          })
        )
        navigation.navigate('ParentMainpage');
        }
        else if(responseJson.idx === false) { //자녀일 경우의 저장 내용
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify({
              idx:responseJson.idx,
              userId:responseJson.userId,
              userName:responseJson.userName,
              phoneNum: responseJson.phoneNum,
              parentPhoneNum: responseJson.parentPhoneNum,
              token:responseJson.token,

              houseLat: responseJson.myLocation.houselat,
              houseLng: responseJson.myLocation.houselng,
              schoolLat: responseJson.myLocation.schoollat,
              schoolLng: responseJson.myLocation.schoollng,
              duration: responseJson.myLocation.duration,
            })
          )
          navigation.navigate('ChildMainpage');
        }
      }
    })
    .catch((error) => {
      console.error(error);
      Alert.alert("로그인 정보를 다시 확인해주세요!");
    });
  };
  
    export default Login;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        height: Dimensions.get('window').height,
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
      InputContainer: {
        width: "80%",
        marginTop: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#CAEF53",
        borderRadius: 10,
      },
      body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: "#696969",
      },
      button: {
        width: "40%",
        marginTop: 30,
        height: 50,
        backgroundColor: "#CAEF53",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      },
      image: {
        width: 175,
        height: 200,
        marginTop: 80,
      },
      signup: {
        width: "30%",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
      },
    })