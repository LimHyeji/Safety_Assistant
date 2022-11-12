import React, {useState} from "react";
import { View, Text, TextInput, Button, ScrollView ,TouchableOpacity, StyleSheet, Image, Dimensions} from "react-native";
import {AsyncStorage} from '@react-native-async-storage/async-storage';

function Login({navigation}){

const [data,setData]=useState(null);
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
  <ScrollView>
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
          onChangeText={value=>updateInput('userId',value)}
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
          onChangeText={value=>updateInput('password',value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() =>  LoginAPI(form)}>
        <Text>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Registerpage')}>
          <Text>회원가입</Text>
      </TouchableOpacity>    
    </View>
  </ScrollView>
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
      
      setData(responseJson);
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          userId:data.userId,
          userName:data.userName,
          token:data.token,
          idx:data.idx,
          //idx==true라면 날아오는가, idx==false일 때엔 null인가
          childId:data.childrenInfo.userId
        })
      )

      if(data.idx==true){
        navigation.navigate('PareantMainpage');
      }
      else{
        navigation.navigate('ChildMainpage');
      }
      
    })
    .catch((error) => {
      console.error(error);
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