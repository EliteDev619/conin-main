import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { Colors } from '@helpers';
import FastImage from 'react-native-fast-image';
import { APP_URL_ENV, ASSETS_DIR } from '@env';
import moment from 'moment';

function OrdersComponent(props) {
  let item = props.history || {};
  const { type, quantity = 0, price = 0 } = item;
  const product = item.product || {};
  const product_description = product.product_description || {};
  const amount = price * quantity;

  const img = React.useMemo(() => {
    return !!item.product?.image && !!item.product?.product_description?.name
      ? ASSETS_DIR + 'product/' + item.product?.image
      : APP_URL_ENV + 'assets/img/default.png';
  }, [item.product]);

  const message = React.useMemo(() => {
    let msg;
    const name = product_description?.name || 'Product Deleted';
    switch (type) {
      case 'item_buy':
        msg = `You spent ${amount} coins to buy ${quantity} items(${name})`;
        break;
      case 'item_sell':
        msg = `You earned ${amount} coins by selling ${quantity} items(${name})`;
        break;
      case 'item_sell_auto':
        msg = `You earned ${amount} coins by selling ${quantity} items(${name})`;
        break;
      case 'special_item_buy':
        msg = `You spent ${amount} coins to buy ${quantity} special items(${name})`;
        break;
      case 'special_item_sell':
        msg = `You earned ${amount} coins by selling ${quantity} special items(${name})`;
        break;
      case 'special_item_sell_auto':
        msg = `You earned ${amount} coins by selling ${quantity} special items(${name})`;
        break;
      default:
        msg = '';
    }

    return msg;
  }, [type, product_description]);
  return (
    <>
      <OtrixDivider size={'md'} />

      <View style={styles.cartContent} key={item.id}>
        <View style={styles.cartBox}>
          {/* <View style={styles.imageView}> */}
          {/* <FastImage
              style={styles.image}
              source={{
                uri: img,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            /> */}
          {/* </View> */}
          <View style={styles.infromationView}>
            <View>
              <Text style={styles.name}>{message}</Text>
            </View>
            <Text style={styles.orderDate}>
              At {moment(item.created_at).format('DD MMM YYYY hh:mm:ss a')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default OrdersComponent;
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1F497B',
    borderRadius: wp('2%'),
  },
  cartBox: {
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    flex: 1,
    padding: 8,
  },
  imageView: {
    backgroundColor: Colors.light_white,
    borderRadius: wp('1.5%'),
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: undefined,
    aspectRatio: 1,
    width: wp('15.5%'),
  },
  infromationView: {
    flex: 1,
    marginBottom: hp('1.4%'),
    marginLeft: 12,
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.Font_Bold,
  },
  orderDate: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: wp('3%'),
    fontFamily: Fonts.Font_Regular,
  },
});
