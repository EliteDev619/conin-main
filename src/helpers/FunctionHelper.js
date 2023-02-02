import { Linking } from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment-timezone';

export function chatSupport() {
  const link = 'whatsapp://send?text=Hello Weird App&phone=9898';
  Linking.canOpenURL(link).then(supported => {
    if (!supported) {
      Toast.show('Whatsapp not installed', {
        duration: 2000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      // alert('Please Install Whatsapp To Send Direct Message');
    } else {
      Linking.openURL(link);
    }
  });
}

const logprint = false;

export function logfunction(tag, message) {
  if (logprint) {
  }
}

export async function _getWishlist() {
  let getWishlistData = await AsyncStorage.getItem('GET_LOCAL_WISHLIST');
  getWishlistData = JSON.parse(getWishlistData);
  return getWishlistData;
}

export async function _addToWishlist(id) {
  let getWishlistData = await AsyncStorage.getItem('GET_LOCAL_WISHLIST');
  getWishlistData = JSON.parse(getWishlistData);
  let storeToarr;

  if (getWishlistData != null && getWishlistData.length > 0) {
    if (!getWishlistData.includes(id)) {
      getWishlistData.push(id);
    } else {
      const index = getWishlistData.indexOf(id);
      if (index > -1) {
        getWishlistData.splice(index, 1);
      }
    }
    storeToarr = getWishlistData;
  } else {
    storeToarr = [id];
  }
  await AsyncStorage.setItem('GET_LOCAL_WISHLIST', JSON.stringify(storeToarr));
  return storeToarr;
}

export async function _getLocalCart() {
  let data = await AsyncStorage.getItem('CART_DATA');
  data = JSON.parse(data);
  return data;
}

export function numberWithComma(num) {
  var decimalPart;

  var array = Math.floor(num).toString().split('');
  var index = -3;
  while (array.length + index > 0) {
    array.splice(index, 0, ',');
    index -= 4;
  }

  // if (2 > 0) {
  //   num = parseFloat(num);
  //   // decimalPart = num.toFixed(2).split('.')[1];
  //   return array.join('');
  // }
  return array.join('');
}

export function calculateOffPercentage(original, special) {
  let off = 0;
  let diff = original - special;
  off = numberWithComma((diff / original) * 100);
  return off;
}

export function dateToFromNowDaily(myDate) {
  // get from-now for this date
  var fromNow = moment(myDate).fromNow();

  // ensure the date is displayed with today and yesterday
  return moment(myDate).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday] hh:mm:ss',
    sameDay: '[Today] hh:mm:ss',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    // when the date is further away, use from-now functionality
    sameElse: function () {
      return '[' + fromNow + ']';
    },
  });
}
