import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';

import {
  OtrixContainer,
  SellerItem,
  OtrixLoader,
  OtirxBackButton,
  OtrixContent,
  OtrixAlert,
  OtrixDivider,
  OtrixHeader,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '@helpers/Fonts';

import { logfunction } from '@helpers/FunctionHelper';
import { Input } from 'native-base';
import getApi from '@apis/getApi';

const { width } = Dimensions.get('window');

function SellerStore(props) {
  const [state, setState] = React.useState({
    data: [],
    searchKeyword: '',
  });
  const [loader, setLoader] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [showMessage, setShowMessage] = React.useState(false);
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [amount, setAmount] = useState(0);
  const [selectedSeller, setSelectedSeller] = useState(0);
  const [sending, setSending] = React.useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchData(1);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, [state]);

  const onPressSend = item => {
    if (sending) {
      return;
    }
    let sendData = new FormData();
    sendData.append('receiver', selectedSeller);
    sendData.append('amount', amount);
    setSending(true);

    getApi
      .postData('seller/sendCoins', sendData)
      .then(response => {
        logfunction('RESPONSE ORDER  ', response);
        if (response.status == 1) {
          setType('success');
          setMessage(response.message);
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
          fetchData(1, searchKeyword);
        } else {
          setType('error');
          setMessage(JSON.stringify(response.message));
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        }
        setSending(false);
      })
      .catch(e => {
        setSending(false);
      });
  };

  const fetchData = (page, text = '') => {
    if (text.length > 0) {
      setTimeout(() => {
        getApi
          .getData(`seller/getSellers?page=${page}&q=${text}`, [])
          .then(response => {
            if (response.status === 1) {
              logfunction('RESPONSEEE ', response.data);
              setLoader(false);
              setLoading(false);
              setTotalPages(response.data.last_page);
              setState(prevState => ({
                ...prevState,
                data:
                  page === 1
                    ? response.data.data
                    : [...prevState.data, ...response.data.data],
              }));
            }
          });
      }, 600);
    }
  };

  const paginate = () => {
    if (loader) {
      return;
    }
    if (totalPages > 1 && currentPage <= totalPages) {
      setLoader(true);
      setCurrentPage(prevState => prevState + 1);
      fetchData(currentPage + 1, searchKeyword);
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
    <SellerItem
      navigation={props.navigation}
      seller={item}
      selectedSeller={selectedSeller}
      setSelectedSeller={setSelectedSeller}
    />
  );

  const { searchKeyword, data } = state;

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={[GlobalStyles.headerLeft, { flex: 0, marginLeft: 12 }]}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headingTxt}>Send Coins</Text>
        </View>
      </OtrixHeader>

      <View style={[styles.headerView]}>
        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <View style={styles.verticalLine} />
          <Input
            w={'100%'}
            autoFocus={false}
            variant="outline"
            placeholder="Search Sellers."
            style={[styles.textInputSearchStyle, { flex: 1 }]}
            returnKeyType="search"
            value={searchKeyword}
            onEndEditing={e => {
              setLoading(true);
              setCurrentPage(1);
              fetchData(1, e.nativeEvent.text);
            }}
            onChangeText={value => {
              setState(prevState => ({ ...prevState, searchKeyword: value }));
            }}
          />
        </View>
      </View>

      {loading ? (
        <OtrixLoader />
      ) : (
        <View style={{ flex: 1 }}>
          {data.length > 0 && (
            <FlatList
              style={{ padding: wp('1%') }}
              data={data}
              horizontal={false}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              ListFooterComponent={renderFooter}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>
      )}
      <View style={styles.sendContainer}>
        <Input
          w={width - 120}
          autoFocus={false}
          variant="outline"
          placeholder="Specify the amount."
          style={[styles.textInputSearchStyle, { flex: 1 }]}
          value={amount}
          keyboardType="numeric"
          onChangeText={value => {
            setAmount(value);
          }}
        />
        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={onPressSend}>
          <Text style={GlobalStyles.buttonText}>
            {sending ? 'Sending' : 'Send Coins'}
          </Text>
        </Button>
      </View>
      {showMessage && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps, {})(SellerStore);

const styles = StyleSheet.create({
  headerView: {
    marginVertical: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchView: {
    height: hp('9%'),
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.white,
    height: hp('6%'),
    paddingHorizontal: 8,
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
    backgroundColor: Colors.white,
    fontSize: wp('3.5%'),
    borderRadius: 5,
    color: Colors.secondry_text_color,
    borderWidth: 0,
    marginHorizontal: wp('5%'),
  },
  emptyTxt: {
    fontSize: wp('6%'),
    marginVertical: hp('1.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
  title: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6.5%'),
    color: Colors.themeColor,
  },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
