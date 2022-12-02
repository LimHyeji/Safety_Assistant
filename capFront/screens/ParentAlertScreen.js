import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Platform, Alert, PermissionsAndroid, ActivityIndicator, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ScrollView } from "react-native-gesture-handler";

/*
알림정보는 받아서 async에 저장해놓고 사용
알림사항?
1. 타임아웃 -> timeout api, (학교/집 분리 시에,,, 학교인지 집인지도 api 보내줘야 함), 학교/집 내지는 현재 위치 출력해줘도 좋을 듯, 받은 시간
    - 'child username'이(가) 아직 학교에 도착하지 않았습니다.
    - 'child username'이(가) 아직 집에 도착하지 않았습니다.

2. 집/학교 벗어남 알림 -> 지오펜스 api, (학교인지 집인지도 api 보내줘야 함), 현재 위치 보내서 출력해줘도 좋을 듯, 받은 시간
    - 'child username'이(가) 외출했습니다.
    - 'child username'이(가) 학교를 떠났습니다. //..?

3. 위험지역 접근 알림 -> 위험지역 지오펜스 api, 현재 위치 보내서 출력해줘도 좋을 듯, 받은 시간
    - 'child username'이(가) 사고다발지역(?)에 접근했습니다. 주의를 요합니다.

4. ...

위치정보는 그때그때 lat,lng 받아서 역지오코딩

날짜정보는 그때그때 Date()객체로 받아서 async에 저장해놓고 사용

*/

const delAlert=()=>{
    //현재 알림 전체 삭제
    /*
    가능하다면 옆으로 밀었을 때 그 알림만 삭제되도록 구현해보고 싶어
    */
};

function ParentAlert({navigation}){
    let date = new Date();
    let now = date.toLocaleString();

    const [alarmList, setAlarmList] = useState([]);

    const loadAlarmList = async () => {
      try {
        const value = await AsyncStorage.getItem('alarm');
        setAlarmList(JSON.parse(value));
        console.log(alarmList);
        console.log(JSON.parse(value));
        
      } catch (error) {
        console.log(error);
      }
    }
    
    useEffect(() => {
      loadAlarmList();
    }, []);

return(
    <View style={styles.body}>

        <Text style={styles.title}>알림</Text>
        <TouchableOpacity style={styles.alarmButton}>
          <Icon name="bell" size={25} color={"#000"}/>
        </TouchableOpacity>
        <View style={styles.container}>    
        {//스크롤 가능하게 구현(async 배열)
        <ScrollView>
          <View>
            <Image style={styles.image}  source={require("../profile.jpg")}/>
            <Text style={styles.textTitle}>{alarmList.alarm}</Text>
            <Text style={styles.text1}>{alarmList.alarmAddress}</Text>
            <Text style={styles.text2}>{alarmList.date}</Text>
          </View>
        </ScrollView>
        }
        </View>
        <View>
        <TouchableOpacity style={styles.del} onPress={() =>  delAlert()}>
            <Text style={styles.del}>알림 전체 삭제</Text>
          </TouchableOpacity>   
        </View>
   </View>

);
};

export default ParentAlert;

const styles = StyleSheet.create({
    body: {
        backgroundColor:'white',
         width: "100%",
          height: "100%",
    },
    container: {
        width: '99%',
        height: 100,
        //flexDirection: 'row',
        backgroundColor: 'white',
        //alignItems: 'center',
        marginTop: 5,
        marginLeft: 2,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 10,
        borderWidth: 1,
      },
      title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "black",
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
      },
      textTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        position: "absolute",
        top: 10,
        right: 2,
        //marginTop: 10,
      },
      del:{
        color: 'darkgrey',
        alignItems: 'center',
        justifyContent: 'center',
      },
      text1: {
        color: 'black',
        justifyContent:'flex-end',
        alignSelf:'flex-end',
        position: "absolute",
        top: 50,
        right: 2,
        color: 'darkgrey',
      },
      text2: {
        color: 'black',
        justifyContent:'flex-end',
        alignSelf:'flex-end',
        position: "absolute",
        top: 50,
        right: 2,
        position: "absolute",
        top: 70,
        right: 2,
        flex:1,
      },
    image: {
      width: 80,
      height: 80,
      borderRadius: 50,
      flex:1,
      position: "absolute",
      top: 10,
      left: 2,
    },
    alarmButton: {
        alignItems: "center",
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 35,
        position: "absolute",
        top: 20,
        right: 10,
      },
  })