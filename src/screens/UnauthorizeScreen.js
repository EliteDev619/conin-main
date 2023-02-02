import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-root-toast';

import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixLoader,
  OtrixDivider,
} from '@component';
import { doLogout, authData } from '@actions';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import getApi from '@apis/getApi';
import Fonts from '@helpers/Fonts';

function UnauthorizeScreen(props) {
  const [loading, setLoading] = useState(false);

  const onLogout = () => {
    setLoading(true);
    props.doLogout();
    getApi.getData('seller/logout', []).then(response => {
      setLoading(false);
      Toast.show('Successfully Logout', {
        duration: 2000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    });
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <View style={[{ justifyContent: 'center' }]}>
          <Text style={GlobalStyles.headingTxt}> Unauthorized</Text>
        </View>
      </OtrixHeader>

      {/* Content Start from here */}
      <OtrixContent>
        <Text style={styles.txt}>You don't have access!</Text>
        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={onLogout}>
          <Text style={GlobalStyles.buttonText}>Logout Now</Text>
        </Button>
        <OtrixDivider size={'md'} />

        {loading && <OtrixLoader />}
      </OtrixContent>
    </OtrixContainer>
  );
}

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      doLogout,
      authData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UnauthorizeScreen);

const styles = StyleSheet.create({
  txt: {
    fontSize: wp('6%'),
    marginVertical: hp('1.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: 'red',
    textAlign: 'center',
  },
});
