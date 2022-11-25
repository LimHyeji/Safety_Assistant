import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert, Modal } from 'react-native';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";

function AuthForm({navigation}) {   
  
  const [isHomeModalVisible, setIsHomeModalVisible] = useState(false);
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false);
  const [homeAddress, setHomeAddress] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  
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
    },
    idx: {
      value: '',
      type: 'boolean',
      rules: {},
      valid: false,
    },
    houselat: { 
      value: '',
      type: 'text', 
      rules: {},
      valid: false,
    },
    houselng: {
      value: '',
      type: 'text',  
      rules: {},
      valid: false,
    },
    schoollat: {
      value: '',
      type: 'text',  
      rules: {},
      valid: false,
    },
    schoollng: {
      value: '',
      type: 'text',  
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
    }
  });

updateInput = (name, value) => {
  let formCopy = form;
  formCopy[name].value = value;
  setForm(form => {
    return {...formCopy};
  });
};

const storeLatLng = (lat, lng, address, flag)=>{
  if(flag === 1) {
    updateInput('houselat', lat);
    updateInput('houselng', lng);
    console.log(form.houselat.value, form.houselng.value);
    setHomeAddress(address);
  }
  else if (flag === 2) {
    updateInput('schoollat', lat);
    updateInput('schoollng', lng);
    console.log(form.schoollat.value, form.schoollng.value);
    setSchoolAddress(address);
  }
};

function toLatLng(addressEng, addressKor, flag){
  Geocode.setApiKey("AIzaSyD3wawfdvi_QBp0XYbXPC47nXWUUEVX4wY");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");
  Geocode.fromAddress(addressEng).then(
    (response) => {
      console.log(addressKor);
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);

      storeLatLng(lat,lng, addressKor, flag);
    },
    (error) => {
      console.error(error);
    }
  );
}

function idDoubleCheck(userId){
  fetch('http://34.64.74.7:8081/user-nicknames/'+userId.value+'/exists', {
    method: 'GET',
  }).then((response) => response.json())
  .then((responseJson) => {
    if(responseJson === true) {
      Alert.alert("중복 확인", "사용 불가한 아이디입니다.", [
        {
          text: "확인",
        }
      ])
    }
    else {
      Alert.alert("중복 확인", "사용 가능한 아이디입니다.", [
        {
          text: "확인",
        }
      ])
    }
  })
};

confirmPassword = () => {
      //비밀번호 재확인 로직 작성
  };

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
              <TouchableOpacity style={styles.checkButton} onPress={() => idDoubleCheck(form.userId)}>
                <Text>중복 확인</Text>
              </TouchableOpacity>
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
              placeholder="전화번호('-' 없이 입력)"
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
                  <Text style={styles.context}> {homeAddress} </Text>
                  <Modal visible={isHomeModalVisible}>
                    <Postcode
                      style={{width: "100%", height: "100%"}}
                      jsOptions={{ animation: true }}
                      onSelected={data => {
                        toLatLng(data.addressEnglish, data.address, 1);
                        setIsHomeModalVisible(!isHomeModalVisible);
                      }}
                    />
                  </Modal>
                  <TouchableOpacity style={styles.checkButton} onPress={() => setIsHomeModalVisible(true)}>
                    <Text>주소 찾기</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.InputContainer}>
                <Text style={styles.context}> {schoolAddress} </Text>
                  <Modal visible={isSchoolModalVisible}>
                    <Postcode
                      style={{width: "100%", height: "100%"}}
                      jsOptions={{ animation: true }}
                      onSelected={data => {
                        toLatLng(data.addressEnglish, data.address, 2);
                        setIsSchoolModalVisible(!isSchoolModalVisible);
                      }}
                    />
                  </Modal>
                  <TouchableOpacity style={styles.checkButton} onPress={() => setIsSchoolModalVisible(true)}>
                    <Text>주소 찾기</Text>
                  </TouchableOpacity>
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

            <TouchableOpacity style={styles.button} onPress={() =>  AuthFormAPI(form, {navigation})}>
              <Text>회원가입</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    );
};

function AuthFormAPI(form, {navigation}){
  fetch('http://34.64.74.7:8081/user/signup', {
    method: 'POST',
    body: JSON.stringify({
      userId:form.userId.value,
      userName:form.userName.value,
      password:form.password.value,
      phoneNum:form.phoneNum.value,
      parentPhoneNum:form.parentPhoneNum.value,
      idx:form.idx.value,
      houseat:form.houselat.value,
      houselng:form.houselng.value,
      schoollat:form.schoollat.value,
      schoollng:form.schoollng.value,
      duration:form.duration.value
    }  ),
    headers : {'Content-Type' : 'application/json; charset=utf-8'}
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.msg === "It is Check to communicate"){
        navigation.navigate('Loginpage')
      }
    })
    .catch((error) => {
      console.error(error);
      return(
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>
            회원가입 정보를 다시 확인해주세요.
          </Text>
        </View>
      );
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
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
  checkButton: {
    width: "25%",
    height: 30,
    marginTop: 6,
    marginRight: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: "black",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
  RadioButtonContainer: {
    width: "80%",
    marginTop: 30,
    alignItems: "center",
  },
  body: {
    width: "70%",
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#696969",
  },
  context: {
    width: "70%",
    height: 42,
    justifyContent: 'flex-start',
    textAlignVertical: 'center',
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