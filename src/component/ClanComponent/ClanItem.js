import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { GlobalStyles } from '@helpers';
import { Spacer } from 'native-base';
import { numberWithComma } from '../../helpers/FunctionHelper';
import { coinImage } from '../../common';

function ClanItem(props) {
  return (
    <View style={styles.clanItem}>
      <View>
        <Text style={styles.title}>{props.data?.title}</Text>
        <Text style={styles.content}>
          Clan Item: {props.data?.product?.product_description?.name}
        </Text>
        <View style={styles.coinBox}>
          <View
            style={{
              backgroundColor: '#3AFA95',
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 10,
                lineHeight: 13.02,
                color: 'black',
              }}>
              {numberWithComma(props.data.members.length)} Members
            </Text>
          </View>
        </View>
      </View>
      <Spacer />
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
            {numberWithComma(
              props.data.history_sum_price ? props.data.history_sum_price : 0,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(ClanItem);
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
    backgroundColor: 'white',
    borderRadius: 13,
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
