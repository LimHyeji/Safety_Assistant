import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image} from 'react-native';
import {RadioButton} from 'react-native-paper';


function AuthForm({navigation}) {    

  const [hasErrors, setHasErrors] = useState(false);
  const [form, setForm] = useState({
    userId: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: true,  
      //중복된 아이디에 대한 예외처리
      //(api 추가버튼 구현할것인가 vs 회원가입 버튼에서 처리할 것인가)
    },
    password: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    confirmPassword: {
      value: '',
      type: 'textInput', //비밀번호확인 구현필요
      rules: {},
      valid: false,
    },
    userName: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
      },
      phoneNum: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: true,
      //중복된 번호에 대한 예외처리
      //(api 추가버튼 구현할것인가 vs 회원가입 버튼에서 처리할 것인가)
      },
      idx: {
        value: '',
        type: 'boolean',
        rules: {},
        valid: false,
      },
      house: {
        value: '',
        type: 'textInput',  //우편번호 가공 구현 필요
        rules: {},
        valid: false,
      },
      school: {
        value: '',
        type: 'textInput',  //우편번호 가공 구현 필요
        rules: {},
        valid: false,
      },
      duration: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
      },
      parentPhoneNum: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
        //존재하는 번호인지 확인필요
        //api 추가하는 버튼 구현할 것인가 vs 회원가입 버튼에서 처리할 것인가
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

/*
confirmPassword = () => {
    return type != 'signup' ? ( //??
      <Input
        value={form.confirmPassword.value}
        type={form.confirmPassword.type}
        secureTextEntry={true}
        placeholder="비밀번호 재입력"
        placeholderTextColor={'#ddd'}
        onChangeText={value => updateInput('confirmPassword', value)}
      />
    ) : null;
  };

  const formHasErrors = () => {
    return hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>
          회원가입 정보를 다시 확인해주세요
        </Text>
      </View>
    ) : null;
  };
  */

return (
    <ScrollView>
        <View style={styles.container}>
          <Image source={require("../logo.png")}  style={styles.image}/>
          <Text style={styles.title}>회원가입</Text>
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
          <View style={styles.RadioButtonContainer}>
            <RadioButton.Group onValueChange={newValue=>updateInput('idx', newValue)} value={form.idx.value}>
              <View style={styles.RadioButtonBody} >
                <RadioButton value={true}/>
                <Text>부모</Text>
                <RadioButton value={false}/>
                <Text>자녀</Text>
              </View>
            </RadioButton.Group>
          </View>

          {
            form.idx.value === false ? (
              <View style={styles.childContainer}>
                <View style={styles.InputContainer}>
                  <TextInput
                    style={styles.body}
                    value={form.house.value}    //우편 번호 선택으로 수정 필요
                    type={form.house.type}
                    placeholder="집 위치"
                    placeholderTextColor={'#ddd'}
                    onChangeText={value=>updateInput('house',value)}
                  />
                </View>
                <View style={styles.InputContainer}>
                  <TextInput
                    style={styles.body}
                    value={form.school.value}   //우편 번호 선택으로 수정 필요
                    type={form.school.type}
                    placeholder="학교 위치"
                    placeholderTextColor={'#ddd'}
                    onChangeText={value=>updateInput('school',value)}
                  />
                </View>
                <View style={styles.InputContainer}>
                  <TextInput
                    style={styles.body}
                    value={form.duration.value}
                    type={form.duration.type}
                    placeholder="등교 시간"
                    placeholderTextColor={'#ddd'}
                    onChangeText={value=>updateInput('duration',value)}
                  />
                </View>
                <View style={styles.InputContainer}>
                  <TextInput
                    style={styles.body}
                    value={form.parentPhoneNum.value}
                    type={form.parentPhoneNum.type}
                    placeholder="부모님 전화번호"
                    placeholderTextColor={'#ddd'}
                    onChangeText={value=>updateInput('parentPhoneNum',value)}
                  />
                </View>
              </View>
            ) : (
              <></>
            )
          }

            <TouchableOpacity style={styles.button} onPress={() =>  AuthFormAPI(form)}>
              <Text>회원가입</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    );
};

function AuthFormAPI(form){
  fetch('http://34.64.74.7:8081/user/signup', {
  method: 'POST',
  body: JSON.stringify({
    userId:form.userId.value,
    userName:form.userName.value,
    password:form.password.value,
    phoneNum:form.phoneNum.value,
    parentPhoneNum:form.parentPhoneNum.value,
    idx:form.idx.value,
    house:form.house.value,
    school:form.school.value,
    duration:form.duration.value
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
  childContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    width: Dimensions.get('window').width,
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
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  image: {
    width: 175,
    height: 200,
    marginTop: 80,
  }
});


export default AuthForm;