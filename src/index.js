import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import sagas from '@sagas';
import reducers from '@reducer';
import createSagaMiddleware from 'redux-saga';
import UnityAds from 'react-native-unity-ads-moon';

import { createLogger } from 'redux-logger';
import { NativeBaseProvider } from 'native-base';
import AppNavigator from './AppNavigator';
import { STRIPE_PUBLISHING_KEY } from '@env';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

let store = createStore(
  reducers,
  compose(applyMiddleware(loggerMiddleware, sagaMiddleware)),
);

sagaMiddleware.run(sagas);

export { store };

const App = () => {
  const [ads, setAds] = useState(null);

  React.useEffect(() => {
    let adsTimer = null;
    let isMounted = true;
    async function load() {
      setAds(false);
      try {
        const response = await UnityAds.loadAd(
          '4966795',
          'Rewarded_Android',
          false,
        );
        setAds(true);
        if (!adsTimer) {
          adsTimer = setInterval(() => {
            setAds(true);
          }, 240000);
        }
      } catch (e) {
        setAds(false);
      }
    }
    load();
    return () => {
      clearInterval(adsTimer);
    };
  }, []);

  const showAd = async () => {
    setAds(false);
    UnityAds.isLoad().then(isLoad => {
      if (isLoad) {
        UnityAds.showAd()
          .then(result => {})
          .catch(error => {});
      }
    });
  };
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHING_KEY}
      urlScheme="your-url-scheme"
      // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.coinnow"
      // required for Apple Pay
    >
      {ads && showAd()}
      <Provider store={store}>
        <NativeBaseProvider>
          <AppNavigator />
        </NativeBaseProvider>
      </Provider>
    </StripeProvider>
  );
};

export default App;
