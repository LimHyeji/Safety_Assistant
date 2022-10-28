import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet, Text, View, TextInput, Button, Platform,} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
//import Input from '../../utils/forms/input';

const CheckIsParent=[{
    id: '1',
    label: '부모',
    value: true
},
{
    id: '2',
    label: '자녀',
    value: false
}]

const AuthForm = () => {    
  const [type, setType] = useState('Login');
  const [action, setAction] = useState('Login');
  const [actionMode, setActionMode] = useState('새로 등록할게요~');
  const [hasErrors, setHasErrors] = useState(false);
  const [form, setForm] = useState({
    userid: {
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
      type: 'textInput',
      rules: {},
      valid: false,
    },
    username: {
        value: '',
        type: 'textInput',
        rules: {},
        valid: true,
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
        valid: true,
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
        type: 'textInput',  //input 아님
        rules: {},
        valid: false,
      },
      house: {
        value: '',
        type: 'textInput',  //다음 우편번호 가공 필요
        rules: {},
        valid: false,
      },
      school: {
        value: '',
        type: 'textInput',  //다음 우편번호 가공 필요
        rules: {},
        valid: true,
      },
      startTime: {
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
    console.warn(form);
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
          앗! 로그인 정보를 다시 확인해주세요~
        </Text>
      </View>
    ) : null;
  };
return (
    <View>
        <Input
            value={form.userid.value}
            type={form.userid.type}
            autoCapitalize={'none'}
            placeholder="아이디"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('userid',value)}
            />
        <Input
            value={form.password.value}
            type={form.password.type}
            placeholder="비밀번호"
            placeholderTextColor={'#ddd'}
            />
        <Input
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
     
        <Input
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
        <RadioGroup
            radioButtons={radioButtons}
            
            onPress={value=>updateInput('isParent',value)}

value={form.isParent.value}   //라디오버튼 내지 boolean -> 숨김기능 구현
            type={form.isParent.type}
            placeholder="부모, 자녀"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('isParent',value)}
            />
       {/*
        <Input
            value={form.house.value}    //우편 번호 선택
            type={form.house.type}
            placeholder="집 위치"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('house',value)}
            />
        <Input
            value={form.school.value}   //우편 번호 선택
            type={form.school.type}
            placeholder="학교 위치"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('school',value)}
            />

            <Input
            value={form.startTime.value}
            type={form.startTime.type}
            placeholder="등교 시간"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('startTime',value)}
            />
*/}
        <Input
            value={form.parentPhoneNum.value}
            type={form.parentPhoneNum.type}
            placeholder="부모님 전화번호"
            placeholderTextColor={'#ddd'}
            onChangeText={value=>updateInput('parentPhoneNum',value)}
            />
    </View>
    );
};




const styles = StyleSheet.create({});