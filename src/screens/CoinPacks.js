import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
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

function CoinPacks(props) {
  const [selectedId, setSelectedId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getApi
      .getData('getCoinPrices')
      .then(res => {
        setLoading(false);
        setData(res);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleBuy = () => {
    if (!selectedId) {
      setAlert({
        type: 'error',
        message: 'Please Select the item',
      });
      return;
    }
    props.navigation.navigate('PaymentScreen', {
      ...selectedId,
    });
  };
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('BalanceHistory')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Coin Packs</Text>
        </View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              COIN PACKS FOR KINGS AND EMPERORS
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
                        marginTop: 15,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={coinImage}
                        style={[
                          GlobalStyles.coinImage,
                          { width: 45, height: 45 },
                        ]}
                      />
                      <Text
                        style={[
                          styles.coin,
                          item.id === selectedId?.id && { color: 'black' },
                        ]}>
                        {numberWithComma(item.coin)}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.price,
                          item.id === selectedId?.id && { color: 'black' },
                        ]}>
                        ${numberWithComma(item.price)}
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
              }}
              onPress={handleBuy}>
              SELECT
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
            Please read our “terms of service” “privacy policy” & “community
            guidelines” before purchasing.{' '}
          </Text>
        </OtrixContent>
      )}
      {alert != null && (
        <OtrixAlert type={alert.type} message={alert.message} />
      )}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(CoinPacks);
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
    marginTop: 28,
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
    fontSize: 32,
    lineHeight: 41.66,
    textAlign: 'center',
    color: 'black',
  },
});
