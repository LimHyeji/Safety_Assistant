import React, {useState} from 'react';
import { View, Text, TextInput, Button, } from 'react-native';
import {RadioButton} from 'react-native-paper';

function AuthForm() {    
  const [type, setType] = useState('signup');
 //const [action, setAction] = useState('signup');
 // const [actionMode, setActionMode] = useState('새로 등록할게요~');
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
    username: {
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
      startTime: {
        value: '',
        type: 'textInput',  //드롭박스 구현?
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
  formHasErrors = () => {
    return hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>
          회원가입 정보를 다시 확인해주세요
        </Text>
      </View>
    ) : null;
  };
return (
    <View>
        <Text>회원가입</Text>
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
         <TextInput
            value={form.username.value}
            type={form.username.type}
            placeholder="이름"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('username',value)}
            />  
        <TextInput
            value={form.phoneNum.value}
            type={form.phoneNum.type}
            keyboardType={'phone-pad'}
            placeholder="전화번호"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('phoneNum',value)}
          />
        <RadioButton.Group onValueChange={newValue=>updateInput('idx', newValue)} value={form.idx.value}>
          <View style={{flexDirection:'row'}}>
            <RadioButton value={true}/>
            <Text>부모</Text>
            <RadioButton value={false}/>
            <Text>자녀</Text>
          </View>
        </RadioButton.Group>

        {
          form.idx.value === false ? (
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
          <Button title="회원가입" onPress={() =>  AuthFormAPI(form)}></Button>
        </View>
    </View>
    );
};

function AuthFormAPI(form){
  fetch('http://34.64.74.7:8081/user/signup', {
  method: 'POST',
  body: JSON.stringify({
    userId:form.userId.value,
    password:form.password.value,
    userId:form.userId.value,
    phoneNum:form.phoneNum.value,
    idx:form.idx.value,
    house:form.house.value,
    school:form.school.value,
    startTime:form.startTime.value
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    //setLoading(false);
    //if (responseJson.status === 'success') {
    /*  AsyncStorage.setItem('userId', responseJson.data.stu_id);
      console.log(responseJson.data.stu_id);
      navigation.replace('DrawerNavigationRoutes');
    } else {
      setErrortext('아이디와 비밀번호를 다시 확인해주세요');
      console.log('Please check your id or password');*/
    ///  console.log(responseJson);
  //  }
  })
  .catch((error) => {
    //setLoading(false);
    console.error(error);
  });
}

export default AuthForm;