import React, { useEffect } from 'react';
import {  View, Text, ScrollView ,StyleSheet, Image, Dimensions, Button,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loading =async({navigation})=>{
  try{
  const value = await AsyncStorage.getItem('userData');
  const parsevalue=JSON.parse(value);

  if(value===null){
    setTimeout(() => {navigation.navigate('Loginpage')}, 3000);
  }
  else if(parsevalue.idx===true){
    setTimeout(() => {navigation.navigate('ParentMainpage')}, 3000);
  }
  else if(parsevalue.idx===false){
    setTimeout(() => {navigation.navigate('ChildMainpage')}, 3000);
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

function SplashScreen({navigation}){
  useEffect(() => {
    loading({navigation});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image source={require("../logo.png")}  style={styles.image}/>
        <Text style={styles.title}>노란 돌고래</Text>
      </View>
    </View>
    );
};

  export default SplashScreen;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#CAEF53"
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: "#CAEF53",
      marginTop: 20,
      marginBottom: 20,
    },
    image: {
      width: 175,
      height: 200,
      marginTop: 10,
    },
    circle:{
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
  })