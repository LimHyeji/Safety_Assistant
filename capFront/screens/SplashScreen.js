import React, { useEffect } from 'react';
import {  View, Text, ScrollView ,StyleSheet, Image, Dimensions, Button, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
/*
스타일시트 필요!
*/

const loading =async({navigation})=>{
  try{
  const value = await AsyncStorage.getItem('userData');
  const parsevalue=JSON.parse(value);

  if(value===null){
    navigation.navigate('Loginpage');
  }
  else if(parsevalue.idx===true){
    navigation.navigate('ParentMainpage');
  }
  else if(parsevalue.idx===false){
    navigation.navigate('ChildMainpage');
  }
}catch(error){
  console.error(error);
  return(
    <View style={styles.errorContainer}>
      <Text style={styles.errorLabel}>
        로딩 중에 문제가 발생했어요!
      </Text>
    </View>
  );
}


};
/*
function SplashScreen({navigation}){
  useEffect(() => {
    loading({navigation});
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={require("../logo.png")}  style={styles.image}/>
        <Text style={styles.title}></Text>
        </View>
      </ScrollView>
    );
};
*/ 
const SplashScreen = ({navigation}) => {
  
    return (
      <View>
          <View>
          <Button title="로그인" onPress={() => navigation.navigate('Loginpage')}></Button>
          </View>
          <View>
          <Button title="부모메인" onPress={() => navigation.navigate('ParentMainpage')}></Button>
          </View>
          <View>
          <Button title="자녀메인" onPress={() => navigation.navigate('ChildMainpage')}></Button>
          </View>
          <View>
          <Button title="(임시)회원정보수정" onPress={() => navigation.navigate('Modifypage')}></Button>
          </View>
          <View>
          <Button title="(임시)Test2" onPress={() => navigation.navigate('Test2page')}></Button>
          </View>
      </View>
    );
  };

  export default SplashScreen;


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