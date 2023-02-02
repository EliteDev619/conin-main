import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function Search(props) {
  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('SearchScreen')}>
      <View style={styles.searchContainer}>
        <Text style={styles.textInputSearchStyle}>Search Items</Text>
      </View>
    </TouchableOpacity>
  );
}

export default SearchBar = React.memo(Search);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#36393E',
    height: hp('8%'),
    marginTop : '10%'
  },
  textInputSearchStyle : {
    alignContent : 'center',
    color : Colors.white,
  },
  searchIcon: {
    flex: 0.1,
    color: Colors.secondry_text_color,
    fontSize: wp('3.5%'),
    alignSelf: 'center',
    textAlign: 'center',
  },
});
