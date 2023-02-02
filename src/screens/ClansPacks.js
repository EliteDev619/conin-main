import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { OtrixContainer, OtrixContent } from '@component';
import { _roundDimensions } from '@helpers/util';
import { _getWishlist, _addToWishlist } from '@helpers/FunctionHelper';
import { coinImage } from '../common';
import { GlobalStyles } from '@helpers';
import { numberWithComma } from '../helpers/FunctionHelper';
import { Button } from 'native-base';
import {
  OtirxBackButton,
  OtrixAlert,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import getApi from '@apis/getApi';
import { Title } from 'react-native-paper';

function ClansPacks(props) {
  const [selectedId, setSelectedId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setUserConfirm] = useState(false);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState(false);

  const fetchData = () => {
    getApi
      .getData('seller/clans')
      .then(res => {
        setLoading(false);
        if (res.status === 1) {
          setData(res.clans);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const onPressBuy = async () => {
    setUserConfirm(false);
    if (!selectedId) {
      setAlert({
        type: 'error',
        message: 'Please Select the item',
      });
      return;
    }
    if (buying) return;
    setBuying(true);
    let sendData = new FormData();
    sendData.append('id', selectedId.id);
    await getApi.postData('seller/buyClan', sendData).then(res => {
      if (res.status === 1) {
        setMessage({
          type: 'success',
          message: res.message,
        });
        setLoading(true);
        fetchData();
      } else {
        setMessage({
          type: 'error',
          message: res.message,
        });
      }
    });
    setBuying(false);
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('MyClansScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Clan Packs</Text>
        </View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Clans PACKS FOR KINGS AND EMPERORS
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{}}
            data={data}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(contact, index) => String(index)}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={[
                    styles.packBox,
                    item.id === selectedId?.id && { backgroundColor: 'white' },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedId(item);
                      setAlert(null);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#3AFA95',
                          paddingHorizontal: 17,
                          borderRadius: 4,
                        }}>
                        <Title
                          style={{
                            fontWeight: '700',
                            fontSize: 10,
                            lineHeight: 13.72,
                          }}>
                          -{item.discount}
                        </Title>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.packBoxHeader,
                        item.id === selectedId?.id && {
                          backgroundColor: '#0066FF',
                        },
                      ]}>
                      <Text style={[styles.packBoxTitle]}>{item.title}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{
                          uri: item?.product?.image
                            ? 'http://coinnow.life/public/uploads/product/' +
                              item?.product.image
                            : 'http://coinnow.life/public/uploads/assets/img/default.png',
                          priority: FastImage.priority.high,
                        }}
                        style={[{ width: 60, height: 60 }]}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 5,
                      }}>
                      <Image
                        source={coinImage}
                        style={[{ width: 32, height: 32 }]}
                      />
                      <Text
                        style={[
                          styles.price,
                          item.id === selectedId?.id && { color: 'black' },
                        ]}>
                        {numberWithComma(item.price)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <Button
            style={{
              height: 77,
              width: '100%',
              borderRadius: 13,
            }}
            backgroundColor="#0066FF"
            title="BUY NOW">
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 24,
                lineHeight: 31.25,
                color: 'white',
                textTransform: 'uppercase',
              }}
              onPress={() => setUserConfirm(true)}>
              {buying ? 'Processing' : 'Buy Now'}
            </Text>
          </Button>
          <Text
            style={{
              color: 'white',
              fontWeight: '400',
              fontSize: 10,
              lineHeight: 26,
              letterSpacing: 1,
              marginVertical: 18,
              padding: 5,
              textAlign: 'left',
            }}>
            *This is a one time transaction. Become clan owner for life-time.
            People will pay to join your clan & your clan members gets discount
            on your clan item.
          </Text>
        </OtrixContent>
      )}
      {alert != null && (
        <OtrixAlert type={alert.type} message={alert.message} />
      )}
      <ConfirmDialog
        title="Buy"
        message="Are you sure to buy?"
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
          onPress: onPressBuy,
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
      {message && <OtrixAlert type={message.type} message={message.message} />}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(ClansPacks);
const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    width: '100%',
    height: 77,
    backgroundColor: 'white',
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20.83,
  },
  packBox: {
    height: 186,
    backgroundColor: 'white',
    borderRadius: 13,
    flex: 0.5,
    marginBottom: 20,
    width: '45%',
    marginHorizontal: 5,
  },
  packBoxHeader: {
    backgroundColor: '#AFB3BC',
    marginTop: 10,
    padding: 9,
  },
  packBoxTitle: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20.83,
    textAlign: 'center',
    color: 'black',
  },
  coin: {
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 41.66,
    color: '#AFB3BC',
  },
  price: {
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 31.25,
    color: '#AFB3BC',
  },
});
