import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { GlobalStyles, Colors } from '@helpers';
import FastImage from 'react-native-fast-image';
import { ASSETS_DIR, CURRENCY, APP_URL_ENV } from '@env';
import moment from 'moment';
import { coinImage } from '../../common';

function BalanceHistory(props) {
  let item = props.history || {};
  const {
    type,
    quantity,
    sender,
    receiver,
    created_at,
    amount,
    balance,
    price,
    clan,
  } = item;
  const product = item.product || {};
  const product_description = product.product_description || {};

  const { message, newBalance, difference } = React.useMemo(() => {
    let msg;
    let balanceNew;
    let diff;
    const name = product_description?.name || 'Product Deleted';
    switch (type) {
      case 'everyday_cut':
        msg = `Account fee`;
        diff = -price;
        balanceNew = balance - price;
        break;
      case 'item_buy':
        msg = `Bought ${quantity} items(${name})`;
        diff = -price * quantity;
        balanceNew = balance - price * quantity;
        break;
      case 'item_sell':
        msg = `Sold ${quantity} items(${name})`;
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'item_sell_auto':
        msg = `Sold ${quantity} items(${name})`;
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'special_item_buy':
        diff = -price * quantity;
        balanceNew = balance - price * quantity;
        msg = `Bought ${quantity} special items(${name})`;
        break;
      case 'special_item_sell':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        msg = `Sold ${quantity} special items(${name})`;
        break;
      case 'special_item_sell_auto':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        msg = `Sold ${quantity} special items(${name})`;
        break;
      case 'send_coin':
        diff = -amount;
        balanceNew = balance - amount;
        msg = `Sent ${amount} coins to ${receiver?.firstname} ${receiver?.lastname}`;
        break;
      case 'receive_coin':
        diff = amount;
        balanceNew = amount + balance;
        msg = `Received ${amount} coins from ${sender?.firstname} ${sender?.lastname}`;
        break;

      case 'added coins to account':
        diff = amount;
        balanceNew = balance;
        msg = `${amount} coins was added to your account`;
        break;
      case 'deducted coins to account':
        diff = -amount;
        balanceNew = balance;
        msg = `${amount} coins was deducted to your account`;
        break;
      case 'trade':
        diff = amount;
        balanceNew = balance;
        msg = `Job Completed with ${quantity} ${name} you got ${amount} diamonds`;
        break;
      case 'buy_coin':
        diff = amount;
        balanceNew = balance + diff;
        msg = `Bought ${amount} coins`;
        break;
      case 'clan_buy':
        diff = -price;
        balanceNew = balance - price;
        msg = `Bought Clan ${clan?.title} with ${price} coins`;
        break;
      case 'clan_join':
        diff = -price;
        balanceNew = balance - price;
        msg = `Join ${clan?.title} with ${price} coins`;
        break;
      case 'clan_joining':
        diff = price;
        balanceNew = balance + price;
        msg = `${sender?.firstname} ${sender?.lastname} Join ${clan?.title} with ${price} coins`;
        break;
      case 'invest':
        balanceNew = balance - price;
        diff = -price;
        msg = `You invested for a contest with ${price} coins`;
        break;
      case 'investor_win':
        diff = price;
        balanceNew = balance + price;
        msg = `Congratulations! you won the contest and earned ${price} coins`;
        break;
      case 'star_win':
        diff = price;
        balanceNew = balance + price;
        msg = `Congratulations! you won the contest and earned ${price} coins`;
        break;
      default:
        msg = '';
    }

    return { message: msg, newBalance: balanceNew, difference: diff };
  }, [type, product_description, price, balance]);
  return (
    <>
      {message ? <OtrixDivider size={'md'} /> : false}
      {message ? (
        <View style={styles.cartContent} key={item.id}>
          {/* <View style={styles.imageView}>
          <FastImage
            style={styles.image}
            source={{
              uri: img,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View> */}
          <View style={styles.informationView}>
            <View>
              <Text style={styles.name}>{message}</Text>
            </View>
            <Text style={styles.orderDate}>
              At {moment(created_at).format('DD MMM YYYY hh:mm:ss a')}
            </Text>
          </View>
          {!props.hidden && (
            <View style={styles.priceBox}>
              <Text style={{ color: 'white' }}>
                {difference >= 0 ? '+' : ''} {difference}
              </Text>
              <View style={GlobalStyles.coinWrapper}>
                <Image source={coinImage} style={[GlobalStyles.coinImage]} />
                <Text style={{ color: 'white' }}>{newBalance}</Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        false
      )}
    </>
  );
}

export default BalanceHistory;

const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222222',
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: wp('90%'),
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginVertical: -10,
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
  informationView: {
    flex: 1,
    marginBottom: hp('1.4%'),
    marginLeft: 12,
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
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
  priceBox: {
    alignItems: 'flex-end',
  },
});
