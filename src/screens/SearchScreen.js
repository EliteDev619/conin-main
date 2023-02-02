import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import {
  OtrixContainer,
  SellerStoreSearchProducts,
  OtrixLoader,
  OtirxBackButton,
  OtrixContent,
} from '@component';
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
import ProductView from '../component/ProductCompnent/ProductView';

function SearchScreen(props) {
  const [state, setState] = React.useState({
    data: [],
    searchKeyword: '',
    loading: false,
    showMost: true,
    showSuggestions: false,
  });

  const getData = text => {
    if (text.length > 2) {
      setTimeout(() => {
        setState({ loading: true });
        getApi.getData('searchProducts?q=' + text, []).then(response => {
          if (response.status == 1) {
            logfunction('RESPONSEEE ', response.data);
            setState({
              showSuggestions: true,
              showMost: false,
              loading: false,
              searchKeyword: text,
              data: response.data,
            });
          }
        });
      }, 600);
    } else {
      setState({
        showSuggestions: false,
        showMost: true,
      });
    }

    setState({
      searchKeyword: text,
    });
  };

  useEffect(() => {}, []);

  const navigateToDetailPage = data => {
    props.navigation.navigate('ProductDetailScreen', { data: data });
  };

  const navigateToLoginPage = data => {
    props.navigation.navigate('LoginScreen', {});
  };

  const addToWishlist = id => {
    props.addToWishlist(id);
  };

  const renderCard = item => {
    item.new = true;
    return (
      <View style={styles.productBox} key={item.id.toString()}>
        <ProductView
          data={item}
          key={item.id}
          navToDetail={navigateToDetailPage}
          navToLogin={navigateToLoginPage}
          userAuth={props.userAuth}
          addToWishlist={addToWishlist}
          //wishlistArray={wishlistArr}
        />
      </View>
    );
  };

  const { searchKeyword, data, loading, showMost, showSuggestions } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      <View style={[styles.headerView]}>
        <TouchableOpacity
          style={[
            GlobalStyles.headerLeft,
            { flex: 0.1, marginLeft: wp('0.5%'), marginRight: wp('1%') },
          ]}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <View style={styles.verticalLine} />
          <Input
            w={'100%'}
            autoFocus={true}
            variant="outline"
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
      </View>

      {/* {showMost && (
        <View style={styles.mostSearchView}>
          <Text style={styles.title}>Most Searches</Text>
          <View style={styles.tagRow}>
            {MostSearchArr.map(item => (
              <TouchableOpacity
                style={styles.tagStyle}
                key={item}
                onPress={() => {
                  getData(item);
                }}>
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )} */}

      {showSuggestions && data.length > 0 && (
        <OtrixContent>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.map((item, index) => {
              return renderCard(item);
            })}
          </View>
        </OtrixContent>
      )}

      {loading && <OtrixLoader />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

export default connect(mapStateToProps)(SearchScreen);

const styles = StyleSheet.create({
  headerView: {
    marginVertical: hp('2%'),
    marginHorizontal: wp('3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchView: {
    height: hp('9%'),
    backgroundColor: Colors.backgroundColor_dark,
  },
  searchContainer: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.backgroundColor_dark,
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
    backgroundColor: Colors.backgroundColor_dark,
    fontSize: wp('3.5%'),
    borderRadius: 5,
    color: Colors.secondry_text_color,
    borderWidth: 0,
    marginHorizontal: wp('5%'),
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
    backgroundColor: Colors.backgroundColor_dark,
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
    backgroundColor: Colors.light_backgroundColor_dark,
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
  productBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor_dark,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    width: '46%',
    height: 'auto',
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginHorizontal: wp('1.5%'),
    paddingBottom: hp('1%'),
  },
});
