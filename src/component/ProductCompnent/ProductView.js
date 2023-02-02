import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { coinImage } from '@common';
import {
  numberWithComma,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { Grayscale } from 'react-native-color-matrix-image-filters';

function ProductView(props) {
  const data = props.data || {};
  const prices = data.product_price || [];
  const productChange = React.useMemo(() => {
    const prevPrice = prices.length > 1 ? prices[1].price : 0;
    return data.price - prevPrice;
  }, [props, prices]);
  let off = null;
  let special = 0;
  if (data.special != null) {
    let startDate = moment(data.special.start_date, 'DD/MM/YYYY');
    let endDate = moment(data.special.end_date, 'DD/MM/YYYY');
    if (
      startDate <= moment(new Date(), 'DD/MM/YYYY') &&
      endDate >= moment(new Date(), 'DD/MM/YYYY')
    ) {
      special = data.special.price;
      off = calculateOffPercentage(data.price, data.special.price) + '% off';
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.productBox,
        props.fromSimilar && { marginHorizontal: wp('1.5%') },
      ]}
      onPress={() => props.navToDetail(data)}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={[
            styles.imageView,
            Number(data.min_price) + Number(data.change_amount) >
              Number(data.price) && {
              borderColor: '#6D00C2',
              borderWidth: 3,
            },
          ]}>
          {data.quantity > 0 || data.sellers_count > 0 ? (
            <FastImage
              style={[styles.image]}
              source={{
                uri: data.image
                  ? 'http://coinnow.life/public/uploads/product/' + data.image
                  : 'http://coinnow.life/public/uploads/assets/img/default.png',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Grayscale>
              <FastImage
                style={[styles.image]}
                source={{
                  uri: data.image
                    ? 'http://coinnow.life/public/uploads/product/' + data.image
                    : 'http://coinnow.life/public/uploads/assets/img/default.png',
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Grayscale>
          )}
        </View>
        <View style={styles.description}>
          <Text style={styles.title} numberOfLines={2}>
            {data?.product_description?.name}
          </Text>
          {special > 0 ? (
            data.quantity > 0 || data.sellers_count > 0 ? (
              <View style={styles.SpcialView}>
                <View style={GlobalStyles.coinWrapper}>
                  <Image source={coinImage} style={GlobalStyles.coinImage} />
                  <Text style={styles.price}>{numberWithComma(special)} </Text>
                </View>

                <Text style={styles.price}>
                  <Image source={coinImage} style={GlobalStyles.coinImage} />
                  {numberWithComma(data.price)}
                </Text>
              </View>
            ) : (
              <View style={styles.SpcialView}>
                <View style={GlobalStyles.coinWrapper}>
                  <Text style={styles.notAvailable}>Not Available</Text>
                </View>
              </View>
            )
          ) : data.quantity > 0 || data.sellers_count > 0 ? (
            <View style={GlobalStyles.coinWrapper}>
              <Image source={coinImage} style={GlobalStyles.coinImage} />
              <Text style={[styles.price]}>{numberWithComma(data.price)}</Text>
            </View>
          ) : (
            <View style={GlobalStyles.coinWrapper}>
              <Text style={[styles.notAvailable]}>Not Available</Text>
            </View>
          )}
          <Text style={styles.manufacturer}>
            {data.product_manufacturer ? data.product_manufacturer.name : ''}
          </Text>
        </View>
      </View>
      {(data.quantity > 0 || data.sellers_count > 0) && (
        <View style={styles.infromationView}>
          <View style={styles.priceView}>
            <Text
              style={[
                styles.priceChange,
                productChange < 0
                  ? { color: Colors.red }
                  : { color: '#05FF00' },
              ]}>
              {productChange >= 0 ? '+' : '-'}
              {Math.abs(productChange)}
            </Text>

            {off != null && <Text style={styles.offerTxt}>{off} </Text>}
          </View>
        </View>
      )}
      {data.quantity == 0 && (
        <View style={GlobalStyles.outstockview}>
          <Text style={GlobalStyles.outofstockTxt}>Out of stock</Text>
        </View>
      )}
      {data.quantity > 0 && data.new == true && (
        <View style={GlobalStyles.newtextView}>
          <Text style={GlobalStyles.newTxt}>New</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default ProductView;

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 13,
    width: '100%',
    maxWidth: wp('100%'),
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 78,
  },
  imageView: {
    backgroundColor: '#0A0A0A',
    height: 78,
    width: 78,
    borderRadius: 13,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    aspectRatio: 0.9,
    width: '94%',
  },
  disabledImage: {
    resizeMode: 'cover',
    alignSelf: 'center',
    aspectRatio: 0.9,
    width: '100%',
  },
  infromationView: {
    paddingHorizontal: 10,
  },
  starView: {
    alignItems: 'flex-start',
    marginVertical: hp('0.6%'),
  },
  myStarStyle: {
    color: '#ffd12d',
    backgroundColor: '#0A0A0A',
    marginHorizontal: 1,
    textShadowRadius: 1,
  },
  myEmptyStarStyle: {
    color: 'gray',
  },
  productName: {
    color: Colors.white,
    fontFamily: Fonts.Font_Semibold,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
  },
  priceView: {
    marginTop: hp('0.6%'),
    flexDirection: 'row',
    width: 91,
    height: 42,
    backgroundColor: '#0A0A0A',
    borderRadius: 13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  price: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'left',
  },
  notAvailable: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'left',
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.6%'),
    textDecorationLine: 'line-through',
    bottom: hp('0.2%'),
    margin: 10,
  },
  offerTxt: {
    flex: 0.3,
    textAlign: 'center',
    color: Colors.link_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('2.2%'),
    textTransform: 'uppercase',
    borderRadius: 5,
  },
  SpcialView: {
    flex: 0.7,
    flexDirection: 'row',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20.83,
    color: Colors.white,
  },
  manufacturer: {
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 13.02,
    textAlign: 'left',
    color: 'black',
  },
  description: {
    marginLeft: 15,
    marginTop: 5,
  },
  priceChange: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20.83,
    fontWeight: '700',
  },
});
