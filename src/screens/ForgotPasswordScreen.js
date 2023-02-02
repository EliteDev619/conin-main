import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  OtirxBackButton,
  OtrixAlert,
  OtrixLoader,
} from '@component';
import {
  Input,
  Text,
  FormControl,
  Button,
  InfoOutlineIcon,
  Select,
} from 'native-base';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { logfunction } from '@helpers/FunctionHelper';
import Fonts from '../helpers/Fonts';
import { bindActionCreators } from 'redux';
import { doLogin } from '@actions';
import getApi from '@apis/getApi';

function SecurityQuestionScreen(props) {
  const [formData, setData] = React.useState({
    email: null,
    submited: false,
    loading: false,
    type: null,
    message: null,
    question: null,
    answer: null,
  });
  const [errors, setErrors] = React.useState({});
  const { question, answer, submited, loading, message, type, email } =
    formData;
  const [questions, setQuestions] = React.useState(null);

  // console.error(props.customerData.email);

  const validate = () => {
    setData({ ...formData, submited: true });
    if (!email) {
      if (email == null) {
        logfunction('FIeld ', 'Email is required');
        setErrors(errors => ({
          ...errors,
          email: 'Username is required',
        }));
      }
      return false;
    }

    return true;
  };

  const validateV1 = () => {
    setData({ ...formData, submited: true });

    if (answer == null) {
      logfunction('FIeld ', 'Answer is required');
      setErrors(errors => ({
        ...errors,
        answer: 'Answer is required',
      }));
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
      sendData.append('email', email);
      // sendData.append('answer', answer);
      // sendData.append('question_id', question);
      getApi
        .postData('seller/getQuestionsByEmail', sendData)
        .then(res => {
          if (res) {
            setQuestions(res);
            setData({
              ...formData,
              loading: false,
            });
          } else {
            setData({
              ...formData,
              type: 'error',
              message: 'You shoud set your security question',
              loading: false,
            });
          }
        })
        .catch(err => {
          setData({
            ...formData,
            loading: false,
          });
        });
    }
  };

  const submitV1 = () => {
    if (validateV1()) {
      setData({
        ...formData,
        loading: true,
      });
      let sendData = new FormData();
      sendData.append('answer', answer);
      sendData.append('email', email);
      getApi
        .postData('seller/checkQuestion', sendData)
        .then(res => {
          if (res.status == 1) {
            setData({
              ...formData,
              type: 'success',
              message: res.message,
              loading: false,
            });
            props.navigation.navigate('ResetPasswordScreen', {
              seller: email,
            });
          } else {
            setData({
              ...formData,
              type: 'error',
              message: res.message,
              loading: false,
            });
          }
        })
        .catch(err => {
          setData({
            ...formData,
            loading: false,
          });
        });
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
          <Text style={GlobalStyles.headingTxt}> Security Question</Text>
        </View>
      </OtrixHeader>
      {/* Content Start from here */}
      <OtrixContent customStyles={{ marginTop: 20 }}>
        {/* Login Form Start from here */}
        <Text style={{ color: 'white' }}>{questions?.question}</Text>
        {!questions ? (
          <FormControl
            isRequired
            style={{
              marginBottom: 10,
              borderRadius: 8,
              paddingVertical: 5,
            }}
            isInvalid={
              (submited && 'email' in errors) || 'invalidEmail' in errors
            }>
            <Input
              placeholder="Username"
              style={{
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#36393E',
              }}
              value={email}
              onChangeText={value => {
                setData({ ...formData, email: value }), delete errors.email;
              }}
            />
            {'invalidEmail' in errors == false && 'email' in errors && (
              <FormControl.ErrorMessage
                leftIcon={<InfoOutlineIcon size="xs" />}>
                {errors.email}
              </FormControl.ErrorMessage>
            )}
            {'invalidEmail' in errors && (
              <FormControl.ErrorMessage
                leftIcon={<InfoOutlineIcon size="xs" />}>
                {errors.invalidEmail}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        ) : (
          <React.Fragment>
            <FormControl
              isRequired
              style={{
                marginBottom: 10,
                borderRadius: 8,
                paddingVertical: 5,
              }}
              isInvalid={submited && 'answer' in errors}>
              <Input
                placeholder="Answer"
                style={{
                  color: 'white',
                  textAlign: 'center',
                  backgroundColor: '#36393E',
                }}
                value={answer}
                onChangeText={value => {
                  setData({ ...formData, answer: value }), delete errors.answer;
                }}
              />
              {'answer' in errors && (
                <FormControl.ErrorMessage
                  leftIcon={<InfoOutlineIcon size="xs" />}>
                  {errors.answer}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </React.Fragment>
        )}
        <Button
          size="md"
          variant="solid"
          bg={'#1F497B'}
          onPress={!questions ? submit : submitV1}>
          <Text style={{ padding: 5, borderRadius: 8, color: 'white' }}>
            Submit
          </Text>
        </Button>

        <OtrixDivider size={'md'} />
        {loading && <OtrixLoader />}
        {loading && <OtrixDivider size={'md'} />}
      </OtrixContent>
      {message != null && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    // customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      doLogin,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecurityQuestionScreen);

const styles = StyleSheet.create({
  forgotPassword: {
    fontSize: wp('3%'),
    textAlign: 'right',
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
    padding: 5,
  },
  registerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerTxt: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    fontFamily: Fonts.Font_Reguler,
    color: Colors.white,
  },
  signupTxt: {
    fontSize: wp('3.5%'),
    textAlign: 'right',
    fontFamily: Fonts.Font_Semibold,
    color: Colors.white,
  },
});
