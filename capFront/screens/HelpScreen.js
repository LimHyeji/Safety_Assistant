import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

function Help({navigation}){
    const [fitFlag, setFitFlag] = useState(false);
    const [posFlag, setPosFlag] = useState(false);
    const [finePosFlag, setFinePosFlag] = useState(false);
    const [colFlag, setColFlag] = useState(false);
    return(
        <ScrollView>
            <View style={styles.container}>
                <Image source={require("../logo.png")}  style={styles.image}/>
                <Text style={styles.title}>도움말</Text>
                <View style={styles.InputContainer}>
                    <TouchableOpacity onPress={() => setFitFlag(!fitFlag)}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={styles.category}>구글 피트니스 권한</Text>
                            {
                                fitFlag === true ? (
                                    <Icon name="caret-up" size={20} color={"#000"}/>
                                ) : ( <Icon name="caret-down" size={20} color={"#000"}/> )
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        fitFlag === true ? (
                            <View>
                                <Text style={styles.context}>노란 돌고래는 구글 피트니스를 통해 심박수를 받아와 위급 상황을 인식하고 보호자에게 긴급 전화를 거는 기능을 제공합니다.</Text>
                                <Text style={styles.context}>따라서 구글 피트니스에 필요 권한을 요청하고 허용해주셔야 해당 기능을 제대로 사용하실 수 있습니다.</Text>
                                <Text style={styles.context}>(단, 스마트 워치가 있을 경우만)</Text>
                                <Text style={styles.context}>심박수 데이터 이외의 다른 데이터들은 사용하지 않습니다.</Text>
                            </View>
                        ) : (<></>)
                    }
                </View>

                <View style={styles.InputContainer}>
                    <TouchableOpacity onPress={() => setPosFlag(!posFlag)}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={styles.category}>위치 접근 권한</Text>
                            {
                                posFlag === true ? (
                                    <Icon name="caret-up" size={20} color={"#000"}/>
                                ) : ( <Icon name="caret-down" size={20} color={"#000"}/> )
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        posFlag === true ? (
                            <View>
                                <Text style={styles.context}>노란 돌고래는 GPS를 통한 위치 정보를 수집하여 많은 기능을 제공합니다.</Text>
                                <Text style={styles.context}>따라서 위치 접근 권한을 허용해주셔야 합니다.</Text>
                                <Text style={styles.context}>백그라운드에서도 위치 정보를 수집하기 위해서 반드시 위치 접근 권한을 "항상 허용"으로 설정해주시기 바랍니다.</Text>
                            </View>
                        ) : (<></>)
                    }
                </View>

                <View style={styles.InputContainer}>
                    <TouchableOpacity onPress={() => setFinePosFlag(!finePosFlag)}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={styles.category}>정확한 위치 정보를 얻는 방법</Text>
                            {
                                finePosFlag === true ? (
                                    <Icon name="caret-up" size={20} color={"#000"}/>
                                ) : ( <Icon name="caret-down" size={20} color={"#000"}/> )
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        finePosFlag === true ? (
                            <View>
                                <Text style={styles.context}>GPS의 정확도를 향상시키기 위해 위치 설정에서 Google 위치 정확도를 켜주시고 항상 모바일 네트워크 / 와이파이 / 블루투스를 켠 상태로 어플을 이용해주세요.</Text>
                                <Text style={styles.context}>그러면 보다 정확하게 위치 정보를 받아올 수 있습니다.</Text>
                            </View>
                        ) : (<></>)
                    }
                </View>

                <View style={styles.InputContainer}>
                    <TouchableOpacity onPress={() => setColFlag(!colFlag)}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={styles.category}>위치 수집 간격</Text>
                            {
                                colFlag === true ? (
                                    <Icon name="caret-up" size={20} color={"#000"}/>
                                ) : ( <Icon name="caret-down" size={20} color={"#000"}/> )
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        colFlag === true ? (
                            <View>
                                <Text style={styles.context}>위치 수집 간격이란 자녀의 위치를 수집해오는 간격을 말합니다.</Text>
                                <Text style={styles.context}>시간이 짧을수록 더 자주 자녀의 현위치 정보를 가져옵니다.</Text>
                                <Text style={styles.context}>수집 간격이 너무 넓으면 자녀의 이동 경로의 정확도가 떨어지니 참고해주세요.</Text>
                            </View>
                        ) : (<></>)
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default Help;

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
      marginTop: 10,
      backgroundColor: "#EEFBC4",
      padding: 15,
      borderRadius: 10,
    },
    body: {
      height: 42,
      paddingLeft: 20,
      paddingRight: 20,
      color: "#696969",
    },
    image: {
      width: 175,
      height: 200,
      marginTop: 80,
    },
    category: {
        fontSize: 18,
        color: "black",
        marginBottom: 10,
    },
    context: {
        fontSize: 14,
        color: "black",
        marginBottom: 5,
        marginLeft: 5,
    }
})