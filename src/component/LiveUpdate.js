import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

const LiveUpdate = () => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: 5,
      marginTop: 5
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require("../assets/images/live-dot.png")}/>
        <Text style={{
          fontWeight: '400',
          fontSize: 10,
          lineHeight: 13.02,
          color: 'white'
        }}>
          Updating Live
        </Text>
      </View>
    </View>
  )
}

export default LiveUpdate;
