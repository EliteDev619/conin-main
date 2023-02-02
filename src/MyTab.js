import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Image, Text, View } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useFocusEffect,
} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import getApi from '@apis/getApi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SupplierPage,
  SellerStore,
  ProfileScreen,
  DigitalStudioShowScreen,
} from './screens/index';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors, GlobalStyles } from '@helpers';
import Fonts from './helpers/Fonts';
import { _roundDimensions } from './helpers/util';
import { echo } from './redux/Api/echo';
import { setNewProducts } from './redux/Action/general';
const BottomTab = createMaterialBottomTabNavigator();
function MyTabs(props) {
  const [receivedCounts, setReceivedCounts] = useState(0);
  const [newProduct, setNewProduct] = useState(null);
  const { newProducts, setNewProducts } = props;
  const fetchData = () => {
    return (
      props.userData &&
      props.userData.id &&
      getApi
        .getData(
          `seller/chat/getReceivedMessagesCounts?receiver=${props.userData.id}`,
        )
        .then(res => {
          if (res.message == 'Too Many Attempts.') {
            return;
          }
          setReceivedCounts(res);
        })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', data => {
      if (data.sender == 'price update') {
        setNewProduct(data.receiver);
        return;
      }
      if (data.sender == 'price update all') {
        console.log('price update all');
        newProducts.map(product => {
          data.receiver.records.map(record => {
            if (product.id === record.id) {
              console.log(product, record);
              product.price = record.price;
              product.product_price.pop();
              product.product_price.unshift({
                price: record.price,
              });
              console.log(product);
            }
          });
          return product;
        });
        setNewProducts([...newProducts]);
      }
      fetchData();
    });
    return () => echo.channel('chat-channel').stopListening('.message.new');
  });
  let { cartCount, userData = {} } = props;
  const mode = userData?.mode;

  return (
    <BottomTab.Navigator
      initialRouteName="DigitalStudioShowScreen"
      activeColor="red"
      inactiveColor="white"
      shifting={false}
      barStyle={styles.tabbarStyle}>
      {mode !== 'customer' && (
        <BottomTab.Screen
          name="HomeScreen"
          children={props => (
            <SupplierPage
              product={newProduct}
              setNewProduct={setNewProduct}
              {...props}
            />
          )}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,

            tabBarIcon: ({ focused, tintColor }) => <View />,
            tabBarLabel: 'Item Shop',
          }}
        />
      )}
      <BottomTab.Screen
        name="SellerStore"
        children={props => <SellerStore product={newProduct} {...props} />}
        options={{
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forScaleFromCenterAndroid,

          tabBarIcon: ({ focused, tintColor }) => (
            <View style={{ height: 0 }} />
          ),

          tabBarLabel: 'Marketplace',
        }}
      />

      {/* <BottomTab.Screen
        name="DigitalStudioShowScreen"
        children={props => (
          <DigitalStudioShowScreen {...props} renderToCurrent={true} />
        )}
        options={{
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forScaleFromCenterAndroid,

          tabBarIcon: ({ focused, tintColor }) => (
            <View style={{ height: 0 }} />
          ),

          tabBarLabel: 'For you',
        }}
      /> */}

      <BottomTab.Screen
        name="ProfileScreen"
        children={props => (
          <ProfileScreen receivedCounts={receivedCounts} {...props} />
        )}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarLabel: 'Account',

          tabBarIcon: ({ focused, tintColor }) => (
            <View style={{ height: 0 }} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
function mapStateToProps(state) {
  return {
    cartCount: state.cart.cartCount ? state.cart.cartCount : null,
    authStatus: state.auth.USER_AUTH,
    userData: state.auth.USER_DATA,
    newProducts: state.cart.newProducts,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setNewProducts,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(MyTabs);

const styles = StyleSheet.create({
  bottomTabIcon: {
    height: wp('%'),
    width: wp('6%'),
  },
  tabbarStyle: {
    backgroundColor: 'black',
    paddingBottom: 12,
  },
  cartIconView: {
    backgroundColor: Colors.light_white,
    height: _roundDimensions()._height * 0.068,
    width: _roundDimensions()._height * 0.068,
    borderRadius: _roundDimensions()._borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp('2%'),
    position: 'relative',
    zIndex: 9999999999,
  },
  count: {
    backgroundColor: Colors.white,
  },
  countText: {
    color: Colors.link_color,
    fontFamily: Fonts.Font_Bold,
  },
});
