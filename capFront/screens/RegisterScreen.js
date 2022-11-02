import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet, Text, View, TextInput, Button, Platform,} from 'react-native';
import {RadioButton} from 'react-native-paper';
//import Input from '../../utils/forms/input';

function AuthFormAPI(){

  fetch('http://localhost:3001/user/login', { //host명 필요
  method: 'POST',
  body: JSON.stringify(form),
  headers: {
    //Header Defination
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((responseJson) => {
    //Hide Loader
    setLoading(false);
    console.log(responseJson);
    // If server response message same as Data Matched
    if (responseJson.status === 'success') {
      AsyncStorage.setItem('userid', responseJson.data.stu_id);
      console.log(responseJson.data.stu_id);
      navigation.replace('DrawerNavigationRoutes');
    } else {
      setErrortext('아이디와 비밀번호를 다시 확인해주세요');
      console.log('Please check your id or password');
    }
  })
  .catch((error) => {
    //Hide Loader
    setLoading(false);
    console.error(error);
  });
}

function AuthForm() {    
  const [type, setType] = useState('Login');
  const [action, setAction] = useState('Login');
  const [actionMode, setActionMode] = useState('새로 등록할게요~');
  const [hasErrors, setHasErrors] = useState(false);
  const [form, setForm] = useState({
    userid: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: true,  //중복된 아이디에 대한 예외처리
    },
    password: {
      value: '',
      type: 'textInput', // **로 입력되도록 조치 필요
      rules: {},
      valid: false,
    },
    confirmPassword: {
      value: '',
      type: 'textInput', //비밀번호확인과 회원가입버튼 필요
      rules: {},
      valid: false,
    },
    username: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: false,
      },
/*
      gender: {
        value: '',
        type: 'textInput',  //성별 라디오버튼
       rules: {},
        valid: false,
      },
 */
      phoneNum: {
        value: '',
        type: 'textInput',  //번호 타입
        rules: {},
        valid: true,  //중복된 번호에 대한 예외처리
      },
/*
      birth: {
        value: '',
        type: 'textInput',  //생년월일 타입
        rules: {},
        valid: true,
      },
 */
      isParent: {
        value: '',
        type: 'boolean',  //input 아님
        rules: {},
        valid: false,
      },
      house: {
        value: '',
        type: 'textInput',  //우편번호 가공 필요
        rules: {},
        valid: false,
      },
      school: {
        value: '',
        type: 'textInput',  //우편번호 가공 필요
        rules: {},
        valid: false,
      },
      startTime: {  //변수에 대한 고민 필요
        value: '',
        type: 'textInput',  //시간 타입
        rules: {},
        valid: false,
      },
      parentPhoneNum: {
        value: '',
        type: 'textInput',  //번호 타입
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
    //console.warn(form);
};
confirmPassword = () => {
    return type != 'Login' ? (
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
  formHasErrors = () => {
    return hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>
          로그인 정보를 다시 확인해주세요
        </Text>
      </View>
    ) : null;
  };
return (
    <View>
        <Text>회원가입</Text>
        <TextInput
            value={form.userid.value}
            type={form.userid.type} // 미입력하면 못 넘어가게
            autoCapitalize={'none'}
            placeholder="아이디"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('userid',value)}
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
        <TextInput
            value={form.username.value}
            type={form.username.type}
            placeholder="이름"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('username',value)}
            />
        {/*<Input
            value={form.gender.value}       //라디오버튼
            type={form.gender.type}
            placeholder="성별"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('gender',value)}
/>*/}
     
        <TextInput
            value={form.phoneNum.value}
            type={form.phoneNum.type}
            keyboardType={'phone-pad'}
            placeholder="전화번호"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('phoneNum',value)}
          />
        {/* <Input
            value={form.birth.value}    //생년월일 틀
            type={form.birth.type}
            keyboardType={'email-address'}  //
            placeholder="생년월일"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('birth',value)}
/>*/}
        <RadioButton.Group onValueChange={newValue=>updateInput('isParent', newValue)} value={form.isParent.value}>
          <View style={{flexDirection:'row'}}>
            <RadioButton value={true}/>
            <Text>부모</Text>
            <RadioButton value={false}/>
            <Text>자녀</Text>
          </View>
        </RadioButton.Group>

        {
          form.isParent.value === false ? (
            <View>
              <TextInput
                value={form.house.value}    //우편 번호 선택
                type={form.house.type}
                placeholder="집 위치"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('house',value)}
              />
              <TextInput
                value={form.school.value}   //우편 번호 선택
                type={form.school.type}
                placeholder="학교 위치"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('school',value)}
              />

              <TextInput
                value={form.startTime.value}
                type={form.startTime.type}
                placeholder="등교 시간"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('startTime',value)}
              />
              <TextInput
                value={form.parentPhoneNum.value}
                type={form.parentPhoneNum.type}
                placeholder="부모님 전화번호"
                placeholderTextColor={'#ddd'}
                onChangeText={value=>updateInput('parentPhoneNum',value)}
              />
            </View>
          ) : (
            <></>
          )
        }
        <View>
          <Button title="회원가입" onPress={a = () =>  AuthFormAPI}></Button>
          {
            /*
            <할일>
            api 보내기
            + 집/학교 데이터 처리
            */
          }
        </View>
    </View>
    );
};

export default AuthForm;