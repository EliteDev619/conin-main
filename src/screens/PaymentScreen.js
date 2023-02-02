import React, { useState } from 'react';
import {
  CardField,
  CardForm,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import { connect } from 'react-redux';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'native-base';
import { OtrixContainer, OtrixContent, OtrixAlert } from '@component';
import getApi from '@apis/getApi';
import { OtirxBackButton, OtrixHeader, OtrixLoader } from '../component';
import { coinImage, numberWithComma, stripeBadge } from '../common';
import { GlobalStyles } from '../helpers';

function PaymentScreen(props) {
  // ...
  const { confirmPayment, loading } = useConfirmPayment();
  const [alert, setAlert] = useState(null);
  const fetchPaymentIntentClientSecret = async () => {
    let sendData = new FormData();
    sendData.append('id', props.route.params.id);
    const response = await getApi.postData('seller/payByStripe', sendData);
    const { clientSecret } = response;
    return clientSecret;
  };

  const handlePayPress = async () => {
    // Gather the customer's billing information (e.g., email)
    const billingDetails = {
      name: props.customerData.email,
    };

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();
    // Confirm the payment with the card details
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });

    if (error) {
      setAlert({
        type: 'error',
        message: 'YOUR CARD WAS DECLINED',
      });
    } else if (paymentIntent) {
      setAlert({
        type: 'success',
        message: 'THANK YOU FOR PURCHASE',
      });
      let sendData = new FormData();
      sendData.append('id', props.route.params.id);
      getApi.postData('seller/buyCoin', sendData).then(res => {});
    }
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('CoinPack')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Payment</Text>
        </View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <View style={[styles.packBox]}>
            <View style={[styles.packBoxHeader]}>
              <Text style={[styles.packBoxTitle]}>
                {props.route.params.title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <Image
                source={coinImage}
                style={[GlobalStyles.coinImage, { width: 45, height: 45 }]}
              />
              <Text style={[styles.coin]}>
                {numberWithComma(props.route.params.coin)}
              </Text>
            </View>
            <View>
              <Text style={[styles.price]}>
                ${numberWithComma(props.route.params.price)}
              </Text>
            </View>
          </View>
          {alert ? (
            <View
              style={{
                borderRadius: 13,
                height: 204,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginTop: 20,
              }}>
              <Text
                style={[
                  alert.type == 'success' && { color: '#0066FF' },
                  alert.type == 'error' && { color: '#b10000' },
                  {
                    fontSize: 24,
                    fontWeight: '700',
                    lineHeight: 31.25,
                  },
                ]}>
                {alert.message}
              </Text>
            </View>
          ) : (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                  borderRadius: 13,
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 30,
                }}
                onCardChange={cardDetails => {}}
                onFocus={focusedField => {}}
              />
              <Button
                onPress={handlePayPress}
                disabled={loading}
                style={styles.payButton}>
                <Text style={styles.buttonText}>BUY NOW</Text>
              </Button>
            </View>
          )}
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              lineHeight: 26,
              fontWeight: '400',
              textAlign: 'center',
              marginVertical: 20,
            }}>
            *This is a one time transaction. Your card information is never
            saved.{' '}
          </Text>
          {/* <View>
            <Image source={stripeBadge} style={{ width: '100%' }} />
          </View> */}
        </OtrixContent>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(PaymentScreen);

const styles = StyleSheet.create({
  packBox: {
    height: 186,
    backgroundColor: 'white',
    borderRadius: 13,
    flex: 0.5,
    marginTop: 10,
    width: '100%',
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
  payButton: {
    backgroundColor: '#0066FF',
    borderRadius: 13,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 31.25,
  },
});
