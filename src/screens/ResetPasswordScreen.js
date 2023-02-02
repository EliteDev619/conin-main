import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtirxBackButton,
  OtrixDivider,
  OtrixAlert,
  OtrixLoader,
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from 'native-base';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  GlobalStyles,
  Colors,
  isValidpassword,
  isValidConfirmPassword,
} from '@helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../helpers/Fonts';
import { logfunction } from '@helpers/FunctionHelper';
import getApi from '@apis/getApi';

function ResetPasswordScreen(props) {
  const [formData, setData] = React.useState({
    new_password: '',
    confirm_password: '',
    submited: false,
    loading: false,
    message: null,
    type: 'error',
  });
  const [state, setDatapassword] = React.useState({
    secureEntry: true,
    secureEntry2: true,
    secureEntry3: true,
  });
  const [errors, setErrors] = React.useState({});
  const [showMessage, setShowLoading] = React.useState(false);

  const { secureEntry, secureEntry2, secureEntry3 } = state;
  const { new_password, confirm_password, submited, loading, type, message } =
    formData;

  const validate = () => {
    setData({ ...formData, submited: true });

    if (!isValidpassword(new_password).success) {
      logfunction('FIeld ', isValidpassword(new_password).message);
      setErrors({
        ...errors,
        new_password: isValidpassword(new_password).message,
      });
      return false;
    } else if (
      !isValidConfirmPassword(new_password, confirm_password).success
    ) {
      logfunction('FIeld ', isValidConfirmPassword(new_password).message);
      setErrors({
        ...errors,
        confirm_password: isValidConfirmPassword(new_password, confirm_password)
          .message,
      });
      return false;
    }
    return true;
  };

  const submit = () => {
    if (validate()) {
      setData({
        ...formData,
        loading: true,
      });

      let sendData = new FormData();
      sendData.append('password', new_password);
      sendData.append('email', props.route.params.seller);
      try {
        getApi.postData('seller/resetPasswordV1', sendData).then(response => {
          logfunction('RESPONSE ', response);
          if (response.status == 1) {
            setData({
              ...formData,
              loading: false,
              message: response.message,
              type: 'success',
              new_password: null,
              confirm_password: null,
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 1500);
          } else {
            setData({
              ...formData,
              type: 'error',
              message: response.message,
              loading: false,
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 3000);
          }
        });
      } catch (error) {
        logfunction('Error', error);
        setData({
          ...state,
          loading: false,
        });
      }
    }
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Reset Password</Text>
        </View>
      </OtrixHeader>
      <OtrixDivider size={'md'} />
      {/* Content Start from here */}

      <OtrixContent>
        <FormControl
          isRequired
          isInvalid={submited && 'new_password' in errors}>
          <Input
            variant="outline"
            placeholder="New Password"
            style={{
              color: 'white',
              textAlign: 'center',
              backgroundColor: '#36393E',
            }}
            onChangeText={value =>
              setData(
                { ...formData, new_password: value },
                delete errors.new_password,
              )
            }
            secureTextEntry={secureEntry2}
            value={new_password}
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.new_password}
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'md'} />

        <FormControl
          isRequired
          isInvalid={submited && 'confirm_password' in errors}>
          <Input
            variant="outline"
            placeholder="Confirm Password"
            style={{
              color: 'white',
              textAlign: 'center',
              backgroundColor: '#36393E',
            }}
            onChangeText={value => {
              setData({ ...formData, confirm_password: value }),
                delete errors.confirm_password;
            }}
            secureTextEntry={secureEntry3}
            value={confirm_password}
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.confirm_password}
          </FormControl.ErrorMessage>
        </FormControl>

        <OtrixDivider size={'md'} />
        <Button
          isLoading={loading}
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={() => submit()}>
          <Text style={GlobalStyles.buttonText}>Reset</Text>
        </Button>
        <OtrixDivider size={'md'} />
      </OtrixContent>
      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps({ params }) {
  return {};
}

export default connect(mapStateToProps)(ResetPasswordScreen);

const styles = StyleSheet.create({});
