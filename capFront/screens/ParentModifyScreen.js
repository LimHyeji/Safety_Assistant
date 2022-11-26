import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

/*
비밀번호 미입력 시 api 안넘기는 것으로 예외처리
*/

function ModifyAuthForm({navigation}) {    

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
          <Text style={styles.title}>회원정보수정</Text>
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
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              value={form.confirmPassword.value}
              type={form.confirmPassword.type}
              secureTextEntry={true}
              autoCapitalize={'none'}
              placeholder="비밀번호 확인"
              placeholderTextColor={'#ddd'}
              onChangeText={value=>updateInput('confirmPassword',value)}
            />
          </View>
          {
              form.confirmPassword.value === form.password.value ? (
                <Text style={styles.notEq}></Text>
              ):(
                <Text style={styles.notEq}>비밀번호가 일치하지 않습니다.</Text>
              )
            }
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              value={form.userName.value}
              type={form.userName.type}
              autoCapitalize={'none'}
              placeholder="이름"
              placeholderTextColor={'#ddd'}
              onChangeText={value=>updateInput('userName',value)}
            />  
          </View>  
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              value={form.phoneNum.value}
              type={form.phoneNum.type}
              keyboardType={'phone-pad'}
              placeholder="전화번호"
              placeholderTextColor={'#ddd'}
              onChangeText={value=>updateInput('phoneNum',value)}
            />
          </View>

          <View>  
            <TouchableOpacity style={styles.button} onPress={() =>  ModifyAuthFormAPI(form)}>
              <Text>회원정보수정</Text>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>
    );
};

function ModifyAuthFormAPI(form){
  fetch('http://34.64.74.7:8081//user/login/update', {
  method: 'POST',
  body: JSON.stringify({
    userId:"parent",  //async에서 받은 값
    userName:"parent",  //async에서 받은 값
    password:form.password.value,
    phoneNum:"1111",  //async에서 받은 값
    idx:true,
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
  })
  .catch((error) => {
    console.error(error);
  });
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
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: 20,
    color: "#696969",
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#CAEF53",
    justifyContent: "center",
    alignItems: "center"
  },
  loginContainer: {
    width: "70%",
    backgroundColor: "#ff5a66",
    borderRadius: 25,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: "white",
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: "80%",
    marginTop: 30,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
  },
  RadioButtonContainer: {
    width: "80%",
    marginTop: 30,
    alignItems: "center",
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#696969",
  },
  RadioButtonBody: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
});


export default ModifyAuthForm;