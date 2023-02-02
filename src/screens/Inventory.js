import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import {
  OtrixContainer,
  InventorySearchProducts,
  OtrixLoader,
  OtirxBackButton,
  OtrixContent,
} from '@component';
import { coinImage, logImg } from '@common';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '@helpers/Fonts';
import {
  _getWishlist,
  _addToWishlist,
  logfunction,
} from '@helpers/FunctionHelper';
import MostSearchArr from '@component/items/MostSearchArr';
import { Input } from 'native-base';
import getApi from '@apis/getApi';
import { numberWithComma } from '../helpers/FunctionHelper';
import { OtrixHeader } from '../component';
import InventoryDigitalProducts from '../component/InventoryDigitalProducts';

function Inventory(props) {
  const [state, setState] = React.useState({
    data: [],
    searchKeyword: '',
    showMost: true,
    showSuggestions: false,
  });

  const [total, setTotal] = React.useState({
    quantity: 0,
    price: 0,
  });

  const [investedDigitals, setInvestedDigitals] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (data) {
      let quantity = 0,
        price = 0;
      for (let i = 0; i < data.length; i++) {
        quantity += parseInt(data[i].pivot.quantity);
        price += parseInt(data[i].pivot.quantity) * parseInt(data[i].price);
      }
      setTotal({
        quantity,
        price,
      });
    }
  }, [state, data]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData('');
      getInvestedDigitals();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, [state]);

  const getInvestedDigitals = () => {
    setLoading(true);
    return getApi
      .getData('seller/investedImages')
      .then(res => {
        setLoading(false);
        setInvestedDigitals(res);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  const getData = text => {
    if (text.length > -1) {
      return setTimeout(() => {
        if (state.data?.length < 1) {
          setLoading(true);
        }

        return getApi
          .getData('seller/searchProducts?q=' + text, [])
          .then(response => {
            if (response.status == 1) {
              logfunction('RESPONSEEE ', response.data);
              setState({
                showSuggestions: true,
                showMost: false,
                searchKeyword: text,
                data: response.data,
              });
              setLoading(false);
            }
          });
      }, 600);
    } else {
      setState({
        ...state,
        showSuggestions: false,
        showMost: true,
      });
    }

    setState({
      ...state,
      searchKeyword: text,
    });
  };

  const { searchKeyword, data, showMost, showSuggestions } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Inventory</Text>
        </View>
      </OtrixHeader>

      {/* <View style={[styles.headerView]}>
        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <View style={styles.verticalLine} />
          <Input
            w={'100%'}
            autoFocus={false}
            variant=""
            placeholder="Search Products"
            style={[styles.textInputSearchStyle, { flex: 1 }]}
            returnKeyType="search"
            value={searchKeyword}
            onEndEditing={e => {
              getData(e.nativeEvent.text);
            }}
            onChangeText={value => {
              setState({ ...state, searchKeyword: value });
            }}
          />
        </View>
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 20,
        }}>
        <View style={styles.totalBox}>
          <Text style={styles.totalTilte}>Total Inventory Items</Text>
          <Text style={styles.totalValue}>{total.quantity}</Text>
        </View>
        <View style={styles.totalBox1}>
          <Text style={styles.totalTilte}>Inventory Worth</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image source={coinImage} style={GlobalStyles.coinImage} />
            <Text style={styles.totalValue}>
              {numberWithComma(total.price)}
            </Text>
          </View>
        </View>
      </View>
      <OtrixContent>
        {showSuggestions && data.length > 0 && (
          <InventorySearchProducts
            navigation={props.navigation}
            products={data}
            getData={getData}
          />
        )}
        {investedDigitals && investedDigitals.length > 0 && (
          <InventoryDigitalProducts products={investedDigitals} />
        )}
      </OtrixContent>

      {loading && <OtrixLoader />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

export default connect(mapStateToProps)(Inventory);

const styles = StyleSheet.create({
  headerView: {
    marginVertical: hp('2%'),
    marginHorizontal: wp('3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#292B2E',
  },
  searchView: {
    height: hp('9%'),
    backgroundColor: '#292B2E',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#292B2E',
    height: hp('6%'),
  },
  searchIcon: {
    flex: 0.08,
    color: Colors.secondry_text_color,
    alignSelf: 'center',
    textAlign: 'center',
  },
  verticalLine: {
    height: hp('2.5%'),
    backgroundColor: Colors.link_color,
  },
  textInputSearchStyle: {
    fontFamily: Fonts.Font_Reguler,
    backgroundColor: '#36393E',
    fontSize: wp('3.5%'),
    color: Colors.white,
    marginHorizontal: wp('1.5%'),
    borderRadius: wp('2%'),
  },
  noRecord: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('25%'),
  },
  emptyTxt: {
    fontSize: wp('6%'),
    marginVertical: hp('1.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
  mostSearchView: {
    backgroundColor: Colors.white,
    padding: hp('1.5%'),
    marginHorizontal: wp('4%'),
    borderRadius: wp('3%'),
  },
  title: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
  tagStyle: {
    justifyContent: 'center',
    padding: hp('1.5%'),
    backgroundColor: Colors.light_white,
    borderRadius: wp('5%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('0.4%'),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
  headerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#292B2E',
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6.5%'),
    color: Colors.white,
  },
  totalBox: {
    backgroundColor: '#222222',
    borderRadius: 13,
    height: 53,
    width: '45%',
    marginVertical: 10,
    marginLeft: 20,

    padding: 10,
  },
  totalBox1: {
    backgroundColor: '#222222',
    borderRadius: 13,
    height: 53,
    width: '45%',
    marginVertical: 10,

    padding: 10,
  },
  totalBox2: {
    backgroundColor: '#222222',
    borderRadius: 13,
    height: 53,
    marginVertical: 10,
    marginRight: 20,
    padding: 10,
  },
  totalTilte: {
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
    display: 'flex',
    lineHeight: 15.62,
  },
  totalValue: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20.83,
  },
});
