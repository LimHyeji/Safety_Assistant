import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Postcode from '@actbase/react-daum-postcode';
import Geocode from "react-geocode";


/*
자녀일 경우 미입력 시 못넘어가게 예외처리 필요
*/

function ModifyAuthForm({navigation}) {    
  const [isHomeModalVisible, setIsHomeModalVisible] = useState(false);
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false);
  const [homeAddress, setHomeAddress] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');

  // async에서 회원 정보 가져오기
  const [parseValue, setParseValue] = useState({});
  const [gogo, setGogo] = useState(false);
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
    setGogo(true);
  }

  const findAddr = () => {
    // 집 역지오코딩
    Geocode.setApiKey("AIzaSyD3wawfdvi_QBp0XYbXPC47nXWUUEVX4wY");
    Geocode.setLanguage("ko");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    Geocode.fromLatLng(parseValue.houseLat, parseValue.houseLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setHomeAddress(address.substr(5, address.length));
      },
      (error) => {
        console.error(error);
      }
    )
    // 학교 역지오코딩
    Geocode.fromLatLng(parseValue.schoolLat, parseValue.schoolLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setSchoolAddress(address.substr(5, address.length));
      },
      (error) => {
        console.error(error);
      }
    )
  }

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

  useEffect(() => {
    getForm();
  }, [])
  
  useEffect(() => {
    if(gogo === true) {
      findAddr();
    }
  }, [gogo]);

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
      },
      idx: {//idx에 따라 스크린 분리
        value: '',
        type: 'boolean',
        rules: {},
        valid: false,
      },
      houselat: {   //modal 띄워야함
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
      duration: {//표시해야하고 수정가능
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
      },
      parentPhoneNum: {//표시해야하고 접근불가
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
    <ScrollView>
      <View style={styles.container}>
        <Image source={require("../logo.png")}  style={styles.image}/>
        <Text style={styles.title}>회원정보수정</Text>
        <View style={styles.InputContainer}>
          <View style={styles.bodyContainer}><Text style={styles.body}>아이디</Text></View>
          <View style={styles.infoContainer}><Text style={styles.dontChangeInfo}>{parseValue.userId}</Text></View>
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
          <View style={styles.infoContainer}><Text style={styles.dontChangeInfo}>{parseValue.userName}</Text></View>
        </View>  
        <View style={styles.InputContainer}>
          <View style={styles.bodyContainer}><Text style={styles.body}>전화번호</Text></View>
          <View style={styles.infoContainer}><Text style={styles.dontChangeInfo}>{parseValue.phoneNum}</Text></View>
        </View>
        <View style={styles.InputContainer}>
          <View style={styles.bodyContainer}><Text style={styles.body}>집</Text></View>
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
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => setIsHomeModalVisible(true)}>
              <Text style={styles.info}>{homeAddress}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.InputContainer}>
          <View style={styles.bodyContainer}><Text style={styles.body}>학교</Text></View>
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
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => setIsSchoolModalVisible(true)}>
              <Text style={styles.info}>{schoolAddress}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.InputContainer}>
          <View style={styles.bodyContainer}><Text style={styles.body}>등교 시간</Text></View>
          <View style={styles.infoContainer}>
            <TextInput
              style={styles.info}
              value={form.duration.value}
              type={form.duration.type}
              placeholder="등교 시간"
              placeholderTextColor={'#ddd'}
              onChangeText={value=>updateInput('duration',value)}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() =>  ModifyAuthFormAPI(form, parseValue, {navigation})}>
          <Text>회원정보수정</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    );

    function ModifyAuthFormAPI(form, parseValue, {navigation}){
      if(form.houselat.value === '') {
        updateInput('houselat', parseValue.houseLat);
      }
      if(form.houselng.value === '') {
        updateInput('houselng', parseValue.houseLng);
      }
      if(form.schoollat.value === '') {
        updateInput('schoollat', parseValue.schoolLat);
      }
      if(form.schoollng.value === '') {
        updateInput('schoollng', parseValue.schoolLng);
      }
      if(form.duration.value === '') {
        updateInput('duration', parseValue.duration);
      }

      if(form.password.value === '') {
        Alert.alert("수정 실패", "수정할 비밀번호를 입력해주세요.", [
          {
            text: "확인"
          }
        ])
      }
      else {
        fetch('http://34.64.74.7:8081/user/login/update', {
        method: 'POST',
        body: JSON.stringify({
          userId: parseValue.userId, //async
          userName: parseValue.userName, //async
          password: form.password.value, 
          phoneNum: parseValue.phoneNum, //async
          parentPhoneNum: parseValue.parentPhoneNum,//async
          idx:false,
          houselat: form.houselat.value,
          houselng: form.houselng.value,
          schoollat: form.schoollat.value,
          schoollng: form.schoollng.value,
          duration: form.duration.value
        }  ),
        headers : {'Content-Type' : 'application/json; charset=utf-8'}
      })
        .then((responseJson) => {
          console.log(responseJson);
          navigation.goBack(null);
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
};

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
  dontChangeInfo: {
    fontSize: 14,
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: "grey",
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  image: {
    width: 175,
    height: 200,
    marginTop: 80,
  },
  checkButton: {
    width: "40%",
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
  notEq: {
    width: "70%",
    height: 42,
    textAlignVertical: 'center',
    textAlign: "center",
    color: "red",
  }, 
});


export default ModifyAuthForm;