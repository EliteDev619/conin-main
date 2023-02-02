import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ASSETS_DIR, CURRENCY } from '@env';
import { GlobalStyles, Colors } from '@helpers';
import { coinImage } from '@common';
import FastImage from 'react-native-fast-image';
import {
  numberWithComma,
  logfunction,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import moment from 'moment';
import getApi from '@apis/getApi';
import { Button } from 'native-base';

const ProductItem = props => {
  const item = props.item || {};
  // const [timing, setTiming] = useState(0);
  const [message, setMessage] = useState({
    message: '',
    type: 'success',
  });
  const [loading, setLoading] = useState(false);
  // let counter = useRef(null);
  // useEffect(() => {
  //   if (counter.current) {
  //     clearInterval(counter.current);
  //   }
  //   const now = new Date();
  //   const updatedDate = new Date(props.item?.pivot.updated_at);
  //   const seconds = (now.getTime() - updatedDate.getTime()) / 1000;
  //   if (seconds / 3600 >= 2 || props.item.pivot.sale == 1) {
  //     setTiming(0);
  //     clearInterval(counter.current);
  //   } else {
  //     setTiming(Math.floor(3600 * 2 - seconds));
  //     counter.current = setInterval(() => {
  //       setTiming(prevState => prevState - 1);
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(counter.current);
  //   };
  // }, [props.item]);

  const onPressSale = id => {
    setLoading(true);
    let sendData = new FormData();
    sendData.append('sale', 1);
    sendData.append('quantity', props.item.quantity);
    sendData.append('product_id', props.item.product_description.product_id);
    sendData.append('price', props.item.price);
    getApi.postData(`seller/listProductSale/${id}`, sendData).then(response => {
      logfunction('response ', response);
      // alert(JSON.stringify(response))
      props.getData('').then(() => {
        setLoading(false);
      });
    });
  };

  // useEffect(() => {
  //   if (timing < 0) {
  //     clearInterval(counter.current);
  //   }
  // }, [timing]);

  // const formatted = new Date(timing * 1000).toISOString().slice(11, 19);
  console.log(item);
  return (
    <View
      style={styles.cartContent}
      key={item.id}
      onPress={() => onPressSale(item.id)}>
      <View style={styles.cartBox}>
        <View style={styles.imageView}>
          <FastImage
            style={styles.image}
            source={{
              uri: item.image
                ? ASSETS_DIR + 'product/' + item.image
                : ASSETS_DIR + '/assets/img/default.png',
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.infromationView}>
          <TouchableOpacity>
            <Text style={styles.name}>
              {item?.product_description?.name} (x{item?.pivot.quantity})
            </Text>
          </TouchableOpacity>

          {item.special > 0 ? (
            <View style={styles.SpcialView}>
              <View style={GlobalStyles.coinWrapper}>
                <Image source={coinImage} style={GlobalStyles.coinImage} />
                <Text style={styles.price}>{numberWithComma(special)} </Text>
              </View>

              <Text style={styles.originalPrice}>
                {numberWithComma(item.price)}
              </Text>
            </View>
          ) : (
            <View style={GlobalStyles.coinWrapper}>
              <Image source={coinImage} style={GlobalStyles.coinImage} />
              <Text style={[styles.price]}>{numberWithComma(item.price)}</Text>
            </View>
          )}
          <Text style={[styles.originalPrice]}>
            Buy Price: {numberWithComma(item?.pivot?.origin_price)}
          </Text>
          {item.off != null && <Text style={styles.offerTxt}>{item.off} </Text>}
          {/* {timing ? (
            <Text style={{ color: 'white', fontWeight: '700' }}>
              {formatted}
            </Text>
          ) : (
            <Text style={{ color: 'black', fontWeight: '700' }}>
              On Marketplace
            </Text>
          )} */}
        </View>
        <View style={{ paddingRight: 12 }}>
          {item?.pivot?.sale == '0' ? (
            <Button
              isLoading={loading}
              style={styles.listNow}
              onPress={() => onPressSale(item.pivot.id)}>
              <Text style={styles.price}>List Now</Text>
            </Button>
          ) : (
            <View style={[styles.listNow, { backgroundColor: 'none' }]}>
              <Text style={[styles.price, { color: 'black' }]}>Listed</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

function InventorySearchProducts(props) {
  let data = props.products;
  for (let s = 0; s < data.length; s++) {
    if (data[s].special != null) {
      let startDate = moment(data[s].special.start_date, 'DD/MM/YYYY');
      let endDate = moment(data[s].special.end_date, 'DD/MM/YYYY');
      if (
        startDate <= moment(new Date(), 'DD/MM/YYYY') &&
        endDate >= moment(new Date(), 'DD/MM/YYYY')
      ) {
        data[s].special = data[s].special.price;
        data[s].off =
          calculateOffPercentage(data[s].price, data[s].special.price) +
          '% off';
      }
    }
  }

  return (
    <>
      {data.length > 0 &&
        data.map((item, index) => (
          <ProductItem
            item={item}
            navigation={props.navigation}
            key={`${item.id}${index}`}
            getData={props.getData}
          />
        ))}
    </>
  );
}

export default React.memo(InventorySearchProducts);
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#36393E',
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageView: {
    backgroundColor: Colors.light_white,
    height: '100%',
    borderRadius: wp('1.5%'),
  },
  image: {
    resizeMode: 'cover',
    height: '100%',
    aspectRatio: 1,
  },
  infromationView: {
    flex: 1,
    marginBottom: hp('1.4%'),
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
    alignContent: 'space-between',
  },
  name: {
    textAlign: 'left',
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
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
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'left',
  },
  originalPrice: {
    color: 'white',
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.5%'),
    lineHeight: hp('3.2%'),
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
  listNow: {
    width: 91,
    height: 42,
    backgroundColor: '#222222',
    borderRadius: 13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
