import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, Button } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import UnityAds from 'react-native-unity-ads-moon';

function Container(props) {
  const [ads, setAds] = useState(null);
  // React.useEffect(
  //   React.useCallback(() => {
  //     console.log('Container');
  //     let adsTimer = null;
  //     let isMounted = true;
  //     async function load() {
  //       setAds(false);
  //       console.log('loading started');
  //       try {
  //         const response = await UnityAds.loadAd(
  //           '4966795',
  //           'Interstitial_Android',
  //           true,
  //         );
  //         if (!isMounted) return;
  //         console.log('loading finished successfully', response);
  //         setAds(true);
  //       } catch (e) {
  //         console.log('loading finished with error', e);
  //         setAds(false);
  //       }
  //       if (!adsTimer) {
  //         adsTimer = setInterval(() => {
  //           console.error('timer every 60');
  //           setAds(true);
  //         }, 60000);
  //       }
  //     }
  //     load();
  //     return () => {
  //       console.log('clearEffect');
  //       isMounted = false;
  //       clearInterval(adsTimer);
  //     };
  //   }, []),
  //   [],
  // );

  // const showAd = async () => {
  //   setAds(false);
  //   UnityAds.isLoad().then(isLoad => {
  //     console.log(isLoad);
  //     if (isLoad) {
  //       UnityAds.showAd()
  //         .then(result => {
  //           console.log(result);
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //   });
  // };
  return (
    <>
      {/* {ads && showAd()} */}
      <StatusBar backgroundColor={Colors.light_white} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_white }}>
        <View style={[GlobalStyles.mainView, props.customStyles]}>
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
}

export default OtrixContainer = React.memo(Container);
