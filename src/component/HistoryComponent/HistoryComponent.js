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

function OrdersComponent(props) {
  // console.log(props)
  let item = props.history || {};
  const { type, quantity, created_at, amount, receiver, sender, price, clan } =
    item;
  const product = item.product || {};
  const product_description = product.product_description || {};
  const img = React.useMemo(() => {
    return !!item.product?.image && !!item.product?.product_description?.name
      ? ASSETS_DIR + 'product/' + item.product?.image
      : APP_URL_ENV + 'assets/img/default.png';
  }, [item.product]);

  const message = React.useMemo(() => {
    let msg;
    let balance;
    const name = product_description?.name || 'Product Deleted';
    switch (type) {
      case 'item_buy':
        msg = `Bought ${quantity} items(${name})`;
        balance = '- ' + quantity * price;
        break;
      case 'item_sell':
        msg = `Sold ${quantity} items(${name})`;
        balance = '+ ' + quantity * price;
        break;
      case 'item_sell_auto':
        msg = `Sold ${quantity} items(${name})`;
        balance = '+ ' + quantity * price;
        break;
      case 'special_item_buy':
        msg = `Bought ${quantity} special items(${name})`;
        balance = '- ' + quantity * price;
        break;
      case 'special_item_sell':
        msg = `Sold ${quantity} special items(${name})`;
        balance = '+ ' + quantity * price;
        break;
      case 'special_item_sell_auto':
        msg = `Sold ${quantity} special items(${name})`;
        balance = '+ ' + quantity * price;
        break;
      case 'fight_item_buy':
        msg = `Won ${quantity} items(${name}) in fight`;
        balance = '+ ' + quantity * price;
        break;
      case 'fight_item_sell':
        msg = `Lost ${quantity} items(${name}) in fight`;
        balance = '- ' + quantity * price;
        break;
      case 'send_coin':
        msg = `Sent ${amount} coins to ${receiver?.firstname} ${receiver?.lastname}`;
        balance = '- ' + amount;
        break;
      case 'receive_coin':
        msg = `Received ${amount} coins from ${sender?.firstname} ${sender?.lastname}`;
        balance = '+ ' + amount;
        break;
      case 'trade':
        msg = `Job Completed with ${quantity} ${name} you got ${amount} diamonds`;
        balance = '';
        break;
      case 'item_sell_list':
        msg = `You Listed ${quantity} ${name} To Sell`;
        balance = '';
        break;
      case 'added coins to account':
        msg = `${amount} coins was added to your account`;
        balance = '+ ' + amount;
        break;
      case 'deducted coins to account':
        msg = `${amount} coins was deducted to your account`;
        balance = '- ' + amount;
        break;
      case 'buy_coin':
        balance = '+ ' + amount;
        msg = `Bought ${amount} coins`;
        break;
      case 'clan_buy':
        balance = -price;
        msg = `Bought Clan ${clan?.title} with ${price} coins`;
        break;
      case 'clan_join':
        balance = -price;
        msg = `Join ${clan?.title} with ${price} coins`;
        break;
      case 'clan_joining':
        balance = price;
        msg = `${clan?.owner?.firstname} ${clan?.owner?.lastname} Join ${clan?.title} with ${price} coins`;
        break;
      case 'invest':
        balance = '- ' + price;
        msg = `You invested for a contest with ${price} coins`;
        break;
      case 'investor_win':
        balance = '+ ' + price;
        msg = `Congratulations! you won the contest`;
        break;
      case 'star_win':
        balance = '+ ' + price;
        msg = `Congratulations! you won the contest`;
        break;
      case 'investor_lost':
        msg = 'sorry you lost the contest.. better luck next time';
        break;
      case 'star_lost':
        msg = 'sorry you lost the contest.. better luck next time';
        break;
      default:
        msg = '';
        balance = '';
    }
    return [msg, balance];
  }, [type, product_description]);
  return (
    <>
      <OtrixDivider size={'md'} />

      <View style={styles.cartContent} key={item.id}>
        <View style={styles.cartBox}>
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
          <View style={styles.infromationView}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.name}>{message[0]}</Text>
              <Text style={styles.name}>{message[1]}</Text>
            </View>
            <Text style={styles.orderDate}>
              At {moment(created_at).format('DD MMM YYYY hh:mm:ss a')}
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
