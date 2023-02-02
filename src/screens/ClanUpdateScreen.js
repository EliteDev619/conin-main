import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { OtrixContainer, OtrixContent } from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { SliderBox } from 'react-native-image-slider-box';
import getApi from '@apis/getApi';
import {
  LiveUpdate,
  OtirxBackButton,
  OtrixAlert,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import {
  Flex,
  Button,
  Spacer,
  FormControl,
  Input,
  InfoOutlineIcon,
} from 'native-base';
import { numberWithComma } from '../helpers/FunctionHelper';
import { coinImage } from '../common';
import ClanItem from '../component/ClanComponent/ClanItem';

function ClanUpdateScreen(props) {
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    name: null,
    price: null,
    submited: false,
  });

  const { name, price, submited } = formData;

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(false);

  useEffect(() => {
    setData({
      ...formData,
      name: props.route.params?.item?.title,
      price: props.route.params?.item?.fee.toString(),
    });
  }, [props.route.params?.item]);

  const isNumeric = value => {
    return /^-?\d+$/.test(value);
  };

  const validate = () => {
    setData({ ...formData, submited: true });
    if (name && price && price > 0 && isNumeric(price)) return true;
    if (!isNumeric(price) && price) {
      setErrors(prevErros => ({
        ...prevErros,
        price: 'Price should be number',
      }));
    }
    if (price < 0 && price) {
      setErrors(prevErros => ({
        ...prevErros,
        price: 'Price should be positive',
      }));
    }
    if (name == null) {
      setErrors(prevErros => ({
        ...prevErros,
        name: 'Clan name is required',
      }));
    }
    if (price == null) {
      setErrors(prevErros => ({
        ...prevErros,
        price: 'Price is required',
      }));
    }
    return false;
  };

  const handleSubmit = () => {
    if (validate()) {
      delete errors.name;
      delete errors.price;
      setLoading(true);
      let formData = new FormData();
      formData.append('title', name);
      formData.append('price', price);
      getApi
        .postData(`seller/clans/${props.route.params.item.id}`, formData)
        .then(res => {
          setLoading(false);
          if (res.status == 1) {
            setMessage({
              type: 'success',
              message: res.message,
            });
          } else {
            setMessage({
              type: 'error',
              message: 'Failed',
            });
          }
        });
    }
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
          <Text style={GlobalStyles.headingTxt}>Clan Setting</Text>
        </View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <View style={styles.clanContainer}>
            <ClanItem data={props.route.params.item} />
          </View>
          <FormControl isRequired isInvalid={submited && 'name' in errors}>
            <Input
              placeholder="CLAN NAME"
              style={styles.input}
              variant="unstyled"
              value={name}
              onChangeText={value => {
                setData({
                  ...formData,
                  name: value,
                });
                delete errors.name;
              }}
            />
            {errors.name && (
              <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={submited && 'price' in errors}>
            <Input
              placeholder="JOIN PRICE"
              style={styles.input}
              variant="unstyled"
              keyboardType="numeric"
              value={price}
              onChangeText={value => {
                setData({
                  ...formData,
                  price: value,
                });
                delete errors.price;
              }}
            />
            {errors.price && (
              <FormControl.ErrorMessage
                leftIcon={<InfoOutlineIcon size="xs" />}>
                {errors.price}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          <Button style={styles.setButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Set</Text>
          </Button>
        </OtrixContent>
      )}
      {message && <OtrixAlert type={message.type} message={message.message} />}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(ClanUpdateScreen);
const styles = StyleSheet.create({
  input: {
    color: '#AFB3BC',
    fontSize: 16,
    lineHeight: 20.83,
    backgroundColor: 'white',
    textAlign: 'center',
    height: 77,
    borderRadius: 13,
    borderWidth: 0,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  clanContainer: {
    marginVertical: 10,
  },
  setButton: {
    height: 77,
    backgroundColor: '#0066FF',
    borderRadius: 13,
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 31.25,
  },
});
