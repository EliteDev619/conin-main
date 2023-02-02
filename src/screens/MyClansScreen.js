import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { OtrixContainer, OtrixContent } from '@component';

import { GlobalStyles } from '@helpers';
import getApi from '@apis/getApi';
import { OtirxBackButton, OtrixHeader, OtrixLoader } from '../component';
import { Flex, Spacer } from 'native-base';
import { numberWithComma } from '../helpers/FunctionHelper';
import { coinImage } from '../common';
import ClanItem from '../component/ClanComponent/ClanItem';

function MyClansScreen(props) {
  const [total, setTotal] = useState({
    price: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [clans, setClans] = useState([]);

  const fetchData = () => {
    setLoading(true);
    getApi
      .getData('seller/myClans')
      .then(res => {
        if (res.status === 1) {
          setTotal({
            ...res.total,
          });
          setClans([...res.clans]);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> My Clans</Text>
        </View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <Flex direction="row">
            <View style={styles.header}>
              <Text style={styles.title}>
                {props?.customerData?.firstname +
                  ' ' +
                  props?.customerData?.lastname}
              </Text>
              <Text style={styles.content}>clans you own: {total.count}</Text>
              <View style={styles.coinBox}>
                <View
                  style={{
                    backgroundColor: '#3AFA95',
                    borderRadius: 4,
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={coinImage}
                    style={[GlobalStyles.coinImage, { width: 24, height: 24 }]}
                  />
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 14,
                      lineHeight: 18.23,
                      color: 'white',
                    }}>
                    {numberWithComma(total.price)}
                  </Text>
                </View>
              </View>
            </View>
            <Spacer />
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ClansPacks')}
              style={styles.buyClan}>
              <Text
                style={[
                  styles.title,
                  {
                    color: 'white',
                  },
                ]}>
                Buy Clans
              </Text>
            </TouchableOpacity>
          </Flex>
          <View style={styles.clanContainer}>
            {clans.map(item => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('ClanUpdateScreen', {
                      item: item,
                    })
                  }>
                  <ClanItem data={item} />
                </TouchableOpacity>
              );
            })}
          </View>
        </OtrixContent>
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
export default connect(mapStateToProps, {})(MyClansScreen);
const styles = StyleSheet.create({
  header: {
    width: '65%',
    backgroundColor: 'white',
    borderRadius: 13,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  buyClan: {
    height: '100%',
    width: '34%',
    backgroundColor: '#0066FF',
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  content: {
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 12,
    color: '#AFB3BC',
    textTransform: 'capitalize',
  },
  coinBox: {
    flexDirection: 'row',
    marginTop: 5,
    maxHeight: 33,
  },
  clanItem: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 13,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clanContainer: {
    marginVertical: 25,
  },
});
