import React from 'react'
import { Text, View, StyleSheet, Dimensions} from "react-native";

function Help({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>도움말</Text>
        </View>
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
      marginTop: 30,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: "#CAEF53",
    },
    body: {
      height: 42,
      paddingLeft: 20,
      paddingRight: 20,
      color: "#696969",
    },
})