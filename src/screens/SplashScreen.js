import React, { useEffect } from 'react';
import { View, Animated, Easing, LogBox, Image } from 'react-native';
import { requestInit } from '@actions';
import { splashlogo } from '@common';
import { OtrixContainer } from '@component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';

const animatedValue = new Animated.Value(0);

function SplashScreen(props) {
  const navigateToMain = () => {
    let navTo = setTimeout(
      () =>
        props.loadApplication &&
        props.navigation.reset({
          index: 0,
          routes: [{ name: props.navScreen }],
        }),
      300,
    );

    return () => {
      clearTimeout(navTo);
    };
  };

  useEffect(() => {
    // LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

    // Animated.timing(animatedValue, {
    //   toValue: 1,
    //   duration: 1000,
    //   easing: Easing.ease,
    //   useNativeDriver: true, // Add this line
    // }).start();
    let loadApp;
    async function fetchData() {
      // You can await here
      loadApp = setTimeout(() => props.requestInit(), 4000);
    }

    fetchData();
    return () => {
      clearTimeout(loadApp);
    };
  }, [navigateToMain()]);

  return (
    <OtrixContainer>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
          flex: 1,
        }}>
        <Image
          source={splashlogo}
          style={{
            height: hp('100%'),
            width: wp('100%'),
          }}
        />
      </View>
    </OtrixContainer>
  );
}

const mapStateToProps = state => ({
  loadApplication: state.mainScreenInit.loadApplication,
  navScreen: state.mainScreenInit.navScreen,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      requestInit,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
