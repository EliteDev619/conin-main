import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { GlobalStyles, Colors } from '@helpers';
import { coinImage } from '@common';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ASSETS_DIR, CURRENCY } from '@env';
import FastImage from 'react-native-fast-image';
import {
  numberWithComma,
  logfunction,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import moment from 'moment';
import { Button } from 'native-base';
import { ConfirmDialog } from 'react-native-simple-dialogs';

function SellerStoreSearchProducts(props) {
  const [buying, setBuying] = useState(false);
  const [showConfirm, setUserConfirm] = useState(false);

  let item = props.product || {};

  let special = 0;
  let off = '';
  const seller = item?.seller || {};
  // let startDate = moment(item.product.special?.special?.start_date, 'DD/MM/YYYY');
  // let endDate = moment(item.special?.special?.end_date, 'DD/MM/YYYY');
  // if (
  //   startDate <= moment(new Date(), 'DD/MM/YYYY') &&
  //   endDate >= moment(new Date(), 'DD/MM/YYYY')
  // ) {
  //   special = item.special?.price;
  //   off =
  //     calculateOffPercentage(item.special?.price, item.special?.special.price) + '% off';
  // }
  const { firstname, lastname, power } = seller;

  console.log(item.product.image_profit);

  const onPressBuy = async () => {
    setUserConfirm(false);
    if (buying) return;
    setBuying(true);
    if (props.onPressBuy) {
      await props.onPressBuy(item);
    }
    setBuying(false);
  };

  return (
    <Pressable
      style={styles.cartContent}
      key={item.id}
      // onPress={() =>
      //   props.navigation.navigate('ProductDetailScreen', { id: item.id })
      // }
      onLongPress={() => {
        props.onLongPress && props.onLongPress(item);
      }}>
      <View
        style={[
          styles.cartBox,
          item.sale == '0' && {
            backgroundColor: '#363636',
          },
          item?.product?.image_profit != null && {
            backgroundColor: 'black',
          },
        ]}>
        <View style={styles.imageView}>
          <FastImage
            style={styles.image}
            source={{
              uri: item?.product?.image
                ? 'http://coinnow.life/public/uploads/product/' +
                  item?.product.image
                : 'http://coinnow.life/public/uploads/assets/img/default.png',
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.infromationView}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity>
              <Text style={styles.name}>
                {item?.product?.product_description?.name}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.white,
                fontWeight: '700',
                marginLeft: 12,
              }}>
              X{item.quantity}
            </Text>
          </View>

          {special > 0 ? (
            <View style={styles.SpcialView}>
              <View style={GlobalStyles.coinWrapper}>
                <Image source={coinImage} style={GlobalStyles.coinImage} />
                <Text style={styles.price}>
                  {numberWithComma(special * item.quantity)}{' '}
                </Text>
              </View>

              <Text style={styles.originalPrice}>
                {numberWithComma(item?.product?.price * item.quantity)}
              </Text>
            </View>
          ) : (
            <View style={GlobalStyles.coinWrapper}>
              <Image source={coinImage} style={GlobalStyles.coinImage} />
              <Text style={[styles.price]}>
                {numberWithComma(item?.product?.price * item.quantity)}
              </Text>
            </View>
          )}

          {/* {!!off && <Text style={styles.offerTxt}>{off} </Text>}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text>merchant power</Text>
            <Text style={{ color: 'red' }}>{` (${power})`}</Text>
          </View> */}
        </View>
        <View style={{ paddingRight: 12, alignItems: 'flex-end' }}>
          {item.sale == '1' ? (
            !props.isMine && (
              <Button
                isLoading={buying}
                size="md"
                variant="solid"
                bg={Colors.themeColor}
                style={[
                  { borderRadius: 10, backgroundColor: 'white' },
                  item?.product?.image_profit != null && {
                    backgroundColor: '#0047FF',
                  },
                ]}
                onPress={() => setUserConfirm(true)}>
                <Text style={{ color: 'black' }}>
                  {buying ? 'Processing' : 'Buy Now'}
                </Text>
              </Button>
            )
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
      <ConfirmDialog
        title="Buy"
        message="Are you sure to buy?"
        onTouchOutside={() => setUserConfirm(false)}
        visible={showConfirm}
        negativeButton={{
          title: 'NO',
          onPress: () => setUserConfirm(false),
          // disabled: true,
          titleStyle: {
            color: 'red',
            colorDisabled: 'aqua',
          },
          style: {
            backgroundColor: 'transparent',
            backgroundColorDisabled: 'transparent',
          },
        }}
        positiveButton={{
          title: 'YES',
          onPress: onPressBuy,
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
    </Pressable>
  );
}

export default SellerStoreSearchProducts;
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    marginTop: wp('3%'),
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('12%'),
    width: wp('100%'),
    flex: 1,
    backgroundColor: '#000B42',
    borderRadius: 6,
  },
  imageView: {
    backgroundColor: Colors.light_white,
    //height: hp('11%'),
    height: '100%',
    borderRadius: wp('1.5%'),
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    height: '100%',
    aspectRatio: 1,
    width: wp('21.5%'),
    borderRadius: wp('1.5%'),
  },
  infromationView: {
    flex: 1,
    marginLeft: wp('5%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: wp('3.8%'),
    fontFamily: Fonts.Font_Bold,
  },
  // price: {
  //     textAlign: 'center',
  //     color: Colors.link_color,
  //     lineHeight: hp('4%'),
  //     fontSize: wp('5%'),
  //     fontFamily: Fonts.Font_Bold,
  // },
  plusminus: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  plusminusTxt: {
    fontSize: wp('3%'),
    color: Colors.secondry_text_color,
    textAlign: 'center',
  },
  quantityTxt: {
    fontSize: wp('4%'),
    color: Colors.text_color,
    marginHorizontal: wp('1%'),
    fontFamily: Fonts.Font_Bold,
    top: hp('0.2%'),
    textAlign: 'center',
  },
  deleteIcon: {
    flex: 0.1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: wp('2%'),
  },
  delete: {
    fontSize: wp('3.6%'),
    color: Colors.secondry_text_color,
  },
  priceView: {
    flex: 1,
    marginTop: hp('0.6%'),
    flexDirection: 'row',
  },
  price: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
    color: Colors.white,
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.5%'),
    textDecorationLine: 'line-through',
  },
  offerTxt: {
    textAlign: 'center',
    color: Colors.link_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('2.2%'),
    textTransform: 'uppercase',
    borderRadius: 5,
  },
  SpcialView: {
    flexDirection: 'row',
  },
});
