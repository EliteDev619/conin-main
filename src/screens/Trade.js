import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, TextArea, Image } from 'native-base';
import {
  OtrixContainer,
  InventorySearchProducts,
  OtrixLoader,
  OtirxBackButton,
  OtrixContent,
} from '@component';
import { ASSETS_DIR, CURRENCY } from '@env';
import { coinImage } from '@common';
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
import { ACCESS_TOKEN, API_URL } from '@common/config';
import FastImage from 'react-native-fast-image';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { diamond } from '../common';

function Trade(props) {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState('');

  const [loading, setLoading] = useState(false);
  const [showConfirm, setUserConfirm] = useState(false);

  const [info, setInfo] = useState();
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, []);

  const getData = () => {
    setTimeout(async () => {
      if (data.length < 1) {
        setLoading(true);
      }
      getApi.getData('seller/getTrades', []).then(response => {
        if (response.status == 1) {
          setData(response.data);
          setLoading(false);
        } else if (response.status == 0) {
          setLoading(false);
        }
      });
    }, 600);
  };

  const trade = () => {
    const { origin_id, quantity_trade, coin_quantity, id } = info;
    setUserConfirm(false);
    let sendData = new FormData();
    sendData.append('product_id', origin_id);
    sendData.append('quantity_trade', quantity_trade);
    sendData.append('coin_quantity', coin_quantity);
    sendData.append('id', id);
    getApi.postData('seller/trade', sendData).then(response => {
      // alert(JSON.stringify(response))
      if (response.status == 1 || response.status == 4) {
        alert('Trade success!');
        if (response.status == 4) {
          getData();
          //setData(data.filter(d => d.id !== id));
        }
      } else if (response.status == 0) {
        alert('Something went wrong!');
      } else if (response.status == 2) {
        alert("You don't have enough inventory");
      } else if (response.status == 3) {
        alert("You don't have this product in your inventory");
      }
    });
  };

  const tradeSelectHandle = data => {
    setUserConfirm(true);
    setInfo(data);
  };
  return (
    <>
      <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
        <OtrixContent>
          <View
            style={{
              flex: 2,
              flexBasis: 30,
              flexDirection: 'row',
              alignContent: 'space-between',
              marginLeft: 10,
              marginTop: 20,
            }}>
            <View
              style={{ flexBasis: 180, flexShrink: 1, color: Colors.white }}>
              <Text style={styles.headingTxt}>Rewards</Text>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.headingTxt}>Required</Text>
            </View>
          </View>
          <ScrollView>
            {data.length > 0 &&
              data.map((d, index) => (
                <View
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignContent: 'space-between',
                      height: 70,
                      paddingBottom: 1,
                      marginTop: 10,
                    },
                  ]}
                  key={index}>
                  <TouchableOpacity
                    style={{
                      flexBasis: 280,
                      flexShrink: 1,
                      backgroundColor: '#1F497B',
                      borderRadius: 5,
                    }}
                    onPress={() => tradeSelectHandle(d)}>
                    <View
                      style={[
                        {
                          flexBasis: 350,
                          flexShrink: 1,
                          flexDirection: 'row',
                          alignContent: 'space-between',
                          padding: 10,
                        },
                      ]}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexBasis: 100,
                          flexShrink: 1,
                        }}>
                        <Image
                          source={diamond}
                          style={[GlobalStyles.coinImage]}
                        />
                      </View>
                      <View style={{ flexBasis: 400, flexShrink: 1 }}>
                        <View
                          style={{ flexBasis: 45, justifyContent: 'center' }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: 'white',
                            }}>
                            {d.min_reward} - {d.max_reward}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexBasis: 100,
                          flexShrink: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: 14,
                          }}>
                          x{d.quantity_trade}
                        </Text>
                      </View>

                      <FastImage
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 5,
                          borderWidth: 0,
                          borderColor: Colors.white,
                        }}
                        source={{
                          uri:
                            'http://coinnow.life/public/uploads/product/' +
                            d.product_image,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginHorizontal: 20,
                      flexBasis: 60,
                      paddingVertical: 2,
                      flexShrink: 1,
                    }}>
                    <FastImage
                      style={{
                        width: 60,
                        height: 65,
                        borderRadius: 10,
                        borderColor: '#1F497B',
                        borderWidth: 0,
                      }}
                      source={{
                        uri:
                          'http://coinnow.life/public/uploads/trade/' + d.image,
                      }}
                    />
                    {/* <Text>{JSON.stringify(d)}</Text> */}
                  </View>
                </View>
              ))}
          </ScrollView>
        </OtrixContent>

        {loading && <OtrixLoader />}
      </OtrixContainer>
      <ConfirmDialog
        title="Trade"
        message="Are you sure about trade?"
        onTouchOutside={() => setUserConfirm(false)}
        visible={showConfirm}
        negativeButton={{
          title: 'NO',
          onPress: () => setUserConfirm(false),
          // disabled: true,
          titleStyle: {
            color: 'red',
            colorDisabled: 'aqua',
          },
          style: {
            backgroundColor: 'transparent',
            backgroundColorDisabled: 'transparent',
          },
        }}
        positiveButton={{
          title: 'YES',
          onPress: trade,
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
    </>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

const styles = StyleSheet.create({
  headerView: {
    marginVertical: hp('2%'),
    marginHorizontal: wp('3%'),
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
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4.5%'),
    color: Colors.white,
  },
  headingTxt1: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6.5%'),
    color: Colors.white,
  },
});

export default connect()(Trade);
