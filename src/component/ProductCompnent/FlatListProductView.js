import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Fonts from '@helpers/Fonts';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ASSETS_DIR, CURRENCY } from '@env';
import {
  numberWithComma,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import { coinImage } from '@common';
import { LineChart } from 'react-native-chart-kit';
import { fontWeight } from 'styled-system';
import { Grayscale } from 'react-native-color-matrix-image-filters';

function FlatListProductView(props) {
  const data = props.data || {};
  const prices = data.product_price || [];
  const productChange = React.useMemo(() => {
    const prevPrice = prices.length > 1 ? prices[1].price : 0;
    return data.price - prevPrice;
  }, [props, prices]);

  let off = null;
  let special = 0;
  let price = data.price != undefined ? data.price : data.product_details.price;
  let points = data.points;

  if (data.special != null) {
    let startDate = moment(data.special.start_date, 'DD/MM/YYYY');
    let endDate = moment(data.special.end_date, 'DD/MM/YYYY');
    if (
      startDate <= moment(new Date(), 'DD/MM/YYYY') &&
      endDate >= moment(new Date(), 'DD/MM/YYYY')
    ) {
      special = data.special.price;
      off = calculateOffPercentage(price, data.special.price) + '% off';
    }
  }

  const wishlistArr = props.wishlistArray ? props.wishlistArray : null;
  console.log(data);

  return (
    <TouchableOpacity
      style={styles.productBox}
      onPress={() => props.navToDetail(data)}>
      <View
        style={[
          styles.imageView,
          {
            backgroundColor: props.imageViewBg
              ? props.imageViewBg
              : Colors.backgroundColor_dark,
          },
        ]}>
        {data.quantity > 0 || data.sellers_count > 0 ? (
          <FastImage
            style={styles.image}
            source={{
              uri: data.image
                ? ASSETS_DIR + 'product/' + data.image
                : ASSETS_DIR + '/assets/img/default.png',
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Grayscale>
            <FastImage
              style={styles.image}
              source={{
                uri: data.image
                  ? ASSETS_DIR + 'product/' + data.image
                  : ASSETS_DIR + '/assets/img/default.png',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Grayscale>
        )}
      </View>
      <View style={styles.infromationView}>
        <Text style={styles.productName} numberOfLines={2}>
          {data?.product_description?.name}
        </Text>
        <Text style={styles.manufacturer}>
          {data.product_manufacturer ? data.product_manufacturer.name : ''}
        </Text>
        <View style={styles.priceView}>
          <View style={{ flexShrink: 1 }}>
            {points > 0 ? (
              data.quantity > 0 || data.sellers_count > 0 ? (
                <View style={styles.SpcialView}>
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
                <Text style={[styles.price]}>
                  <Image source={coinImage} style={GlobalStyles.coinImage} />
                  {numberWithComma(data.price)}
                </Text>
              </View>
            ) : (
              <View style={GlobalStyles.coinWrapper}>
                <Text style={[styles.notAvailable]}>Not Available</Text>
              </View>
            )}
          </View>

          {/* <View>
            <LineChart
              data={{
                labels:
                  prices?.length > 0 ? prices?.map((p, index) => index) : ['0'],
                datasets: [
                  {
                    data:
                      prices?.length > 0
                        ? prices
                            ?.sort((a, b) => (a.date > b.date ? 1 : -1))
                            .map((p, index) => p.price || 0)
                        : [0],
                  },
                ],
              }}
              fromZero={true}
              width={80} // from react-native
              height={60}
              yAxisLabel=""
              yAxisSuffix=""
              hideLegend={true}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              withHorizontalLines={false}
              withVerticalLines={false}
              chartConfig={{
                backgroundColor: "black",
                backgroundGradientFrom: "black",
                backgroundGradientTo: "black",
                color: () => `rgba(70, 156, 99, ${1})`,
                labelColor: () => 'green',
                strokeWidth: 2,
                propsForDots: {
                  r: '0',
                  strokeWidth: '2',
                  stroke: 'red',
                },
                propsForVerticalLabels: {
                  fontSize: 11,
                  weight: '700',
                },
              }}
              bezier
              style={GlobalStyles.chart}
            />
          </View> */}
        </View>
      </View>
      {!data.image_profit &&
        (data.quantity > 0 || data.sellers_count > 0) &&
        !points && (
          <View style={styles.quantity}>
            <Text
              style={[
                styles.priceChange,
                productChange < 0 && { color: Colors.red },
              ]}>
              {productChange >= 0 ? '+' : '-'}
              {Math.abs(productChange)}
            </Text>
            {off != null && <Text style={styles.offerTxt}>{off} </Text>}
          </View>
        )}

      {data.quantity == 0 && (
        <View style={GlobalStyles.outstockview}>
          <Text style={GlobalStyles.outofstockTxt}>Out of stock</Text>
        </View>
      )}

      {/* {wishlistArr &&
      wishlistArr.length > 0 &&
      wishlistArr.includes(data.id) ? (
        <TouchableOpacity
          style={GlobalStyles.FavCircle}
          onPress={() => props.addToWishlist(data.id)}>
          <Icon
            name="heart"
            style={GlobalStyles.unFavIcon}
            color={Colors.white}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            GlobalStyles.unFavCircle,
            { backgroundColor: Colors.backgroundColor_dark },
          ]}
          onPress={() => props.addToWishlist(data.id)}>
          <Icon
            name="heart-o"
            style={GlobalStyles.unFavIcon}
            color={Colors.secondry_text_color}
          />
        </TouchableOpacity>
      )}*/}
    </TouchableOpacity>
  );
}

export default FlatListProductView;

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    paddingBottom: hp('1%'),
    width: wp('45%'),
    maxWidth: wp('45%'),
    marginHorizontal: wp('1%'),
    flex: 0.5,
    backgroundColor: '#36393E',
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: 'column',
  },
  imageView: {
    backgroundColor: Colors.black,
    width: '100%',
    borderTopStartRadius: wp('2%'),
    borderTopEndRadius: wp('2%'),
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    aspectRatio: 1.25,
    width: '100%',
  },
  infromationView: {
    width: wp('40%'),
    paddingTop: 12,
  },
  starView: {
    alignItems: 'flex-start',
    marginVertical: hp('0.6%'),
  },
  myStarStyle: {
    color: '#ffd12d',
    backgroundColor: 'transparent',
    marginHorizontal: 1,
    textShadowRadius: 1,
  },
  myEmptyStarStyle: {
    color: 'gray',
  },
  productName: {
    color: Colors.white,
    fontFamily: Fonts.Font_Semibold,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 20.83,
  },
  priceView: {
    marginTop: hp('0.6%'),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  price: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'center',
    marginBottom: 6,
  },
  notAvailable: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'center',
    marginBottom: 6,
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.6%'),
    textDecorationLine: 'line-through',
    bottom: hp('0.2%'),
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
  quantity: {
    width: 91,
    height: 42,
    backgroundColor: '#222222',
    borderRadius: 13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceChange: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20.83,
    fontWeight: '700',
  },
  manufacturer: {
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 13.02,
    textAlign: 'center',
    color: 'black',
  },
});
