import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { _roundDimensions } from '@helpers/util';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixLoader,
} from '@component';
const { width } = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';
import BalanceHistoryItem from '../component/HistoryComponent/BalanceHistoryItem';
import { coinImage } from '@common';

function BalanceHistory(props) {
  const [state, setState] = React.useState({
    historyList: [],
    currentPage: 1,
    totalPages: 1,
    loading: true,
    loader: false,
  });
  const { historyList, totalPages, currentPage, loading, loader } = state;

  const fetchData = page => {
    getApi.getData('seller/balanceHistory?page=' + page, []).then(response => {
      if (response.status == 1) {
        setState(prevstate => ({
          ...prevstate,
          historyList:
            page == 1
              ? response.data.data
              : [...prevstate.historyList, ...response.data.data],
          totalPages: response.data.last_page,
          loading: false,
          loader: false,
        }));
      }
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchData(1);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, []);

  const paginate = () => {
    if (totalPages > 1 && currentPage <= totalPages) {
      setState({
        ...state,
        loader: true,
        currentPage: currentPage + 1,
      });
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    return (
      //Footer View
      <View>
        {loader && <OtrixLoader />}
        <OtrixDivider size={'sm'} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <BalanceHistoryItem navigation={props.navigation} history={item} />
  );

  const currentBalance = data => {
    const { type, price, balance, quantity, amount } = data;
    let balanceNew = 0;
    let diff;
    switch (type) {
      case 'everyday_cut':
        diff = -price;
        balanceNew = balance - price;
        break;
      case 'item_buy':
        diff = -price * quantity;
        balanceNew = balance - price * quantity;
        break;
      case 'item_sell':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'item_sell_auto':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'special_item_buy':
        diff = -price * quantity;
        balanceNew = balance - price * quantity;
        break;
      case 'special_item_sell':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'special_item_sell_auto':
        diff = price * quantity;
        balanceNew = balance + price * quantity;
        break;
      case 'send_coin':
        diff = -amount;
        balanceNew = balance - amount;
        break;
      case 'receive_coin':
        diff = amount;
        balanceNew = balance + amount;
        break;
      case 'buy_coin':
        diff = amount;
        balanceNew = balance + amount;
        break;
      case 'deducted coins to account':
        balanceNew = balance;
        break;
      case 'added coins to account':
        balanceNew = balance;
        break;
      case 'trade':
        diff = amount;
        balanceNew = balance;
        break;
      case 'clan_buy':
        diff = -price;
        balanceNew = balance - price;
        break;
      case 'clan_join':
        diff = -price;
        balanceNew = balance - price;
        break;
      case 'clan_joining':
        diff = price;
        balanceNew = balance + price;
        break;
      case 'invest':
        diff = -price;
        balanceNew = balance - price;
        break;
      case 'investor_win':
        diff = price;
        balanceNew = balance + price;
        break;
      case 'star_win':
        diff = price;
        balanceNew = balance + price;
        break;
      default:
        balanceNew = balance;
    }
    return balanceNew;
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Balance History</Text>
        </View>
      </OtrixHeader>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{ alignItems: 'center', marginTop: wp('4%') }}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>Current Balance</Text>
            <View style={GlobalStyles.coinWrapper}>
              <Image
                source={coinImage}
                style={[GlobalStyles.coinImage, { marginLeft: 6 }]}
              />
              <Text style={styles.itemText}>
                {historyList.length == 0 ? '' : currentBalance(historyList[0])}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CoinPack');
          }}
          style={{ alignItems: 'center', marginTop: wp('4%') }}>
          <View
            style={[
              styles.itemContainer,
              {
                height: 105,
              },
            ]}>
            <Text style={styles.itemLabel}>BUY NOW</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Orders Content start from here */}
      <OtrixDivider size={'sm'} />
      {loading ? (
        <OtrixLoader />
      ) : (
        <View
          style={styles.addressBox}
          showsHorizontalScrollIndicator={false}
          vertical={false}>
          {historyList.length > 0 ? (
            <FlatList
              style={{ padding: wp('1%') }}
              data={historyList}
              horizontal={false}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              ListFooterComponent={renderFooter}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          ) : null}
        </View>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps)(BalanceHistory);

const styles = StyleSheet.create({
  deliveryTitle: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('5%'),
  },
  addressBox: {
    marginHorizontal: wp('4%'),
    flex: 1,
    height: 'auto',
    borderRadius: wp('2%'),
  },
  deliveryBox: {
    marginHorizontal: wp('1.5%'),
    width: wp('88%'),
    marginVertical: hp('0.5%'),
    height: hp('30.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
  },
  addressTxt: {
    fontSize: wp('3.6%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.text_color,
    textAlign: 'left',
  },
  deliveryAddressTxt: {
    textAlign: 'right',
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
  },
  edit: {
    textAlign: 'right',
  },
  editView: { justifyContent: 'flex-start' },
  addressContent: {
    flexDirection: 'row',
  },
  itemContainer: {
    width: (width - 60) / 2,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#222222',
    marginHorizontal: 0,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  itemContainer1: {
    width: (width - 48) / 2,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#000000',
    marginHorizontal: 0,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  itemsWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: wp('6%'),
  },
  itemLabel: {
    color: Colors.white,
    fontFamily: Fonts.Font_Bold,
    fontSize: 20,
    marginBottom: 8,
  },
  itemText: {
    color: Colors.white,
    fontFamily: Fonts.Font_Bold,
    fontSize: 16,
  },
});
