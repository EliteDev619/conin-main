import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  ChatItem,
} from '@component';
import { Colors, GlobalStyles } from '../helpers';
import getApi from '@apis/getApi';
import { FormControl } from 'native-base';
import { echo } from '../redux/Api/echo';
import { OtrixLoader } from '../component';
import * as RootNavigation from '../AppNavigator';

function DMChat(props) {
  const {
    params: { receiver_id, receiver },
  } = props.route;
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const windowHeight = useWindowDimensions().height;

  const fetchData = () => {
    return getApi
      .getData(
        `seller/chat/getMessagesByChannel?user1=${receiver_id}&user2=${props.authUser.id}`,
      )
      .then(res => {
        setMessages([...res]);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchData().then(() => setLoading(false));
    }, []),
  );

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', data => {
      if (data.receiver == props.authUser.id) {
        fetchData();
      }
    });

    return () => {
      return () => echo.channel('chat-channel').stopListening('.message.new');
    };
  });

  const handleSubmitMessage = () => {
    if (!message) {
      setErrors({
        ...errors,
        message: 'Message is required',
      });
      return;
    }
    let sendData = new FormData();
    sendData.append('receiver_id', receiver_id);
    sendData.append('sender_id', props.authUser.id);
    sendData.append('message', message);
    setMessages([
      ...messages,
      {
        message: message,
        sender: {
          ...props.authUser,
        },
        created_at: Date.now(),
      },
    ]);
    setMessage('');
    getApi.postData('seller/chat/sendMessage', sendData);
  };

  return (
    <OtrixContainer
      customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      <TouchableOpacity
        onPress={() => RootNavigation.navigate('ProfileScreen')}>
        <OtrixHeader
          customStyles={{
            backgroundColor: Colors.backgroundColor_dark,
            justifyContent: 'flex-start',
            padding: 20,
          }}>
          <View style={styles.headerContent}>
            <Icon name={'angle-left'} style={styles.arrowLeft} />
            <Text style={styles.title}>{receiver}</Text>
          </View>
        </OtrixHeader>
      </TouchableOpacity>

      {loading && <OtrixLoader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={10}
        bounces={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={[GlobalStyles.contentView]}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}>
        {messages?.map(item => (
          <ChatItem key={item.id} data={item} />
        ))}
      </ScrollView>
      {/* <TouchableOpacity style={styles.moreMessages}>
        <Text style={styles.moreMessagesText}>See more messages below</Text>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Icon name={'angle-down'} style={styles.arrowDown} />
        </View>
      </TouchableOpacity> */}
      <FormControl isRequired isInvalid={'message' in errors}>
        <View style={styles.footer}>
          <TextInput
            placeholder="Send Message"
            style={styles.textInputSearchStyle}
            placeholderTextColor={Colors.input_fontColor_dark}
            value={message}
            keyboardType="twitter"
            onChangeText={val => {
              setMessage(val);
              if (!val)
                setErrors({
                  ...errors,
                  message: 'Message is required',
                });
              else {
                setErrors({});
              }
            }}
          />
          <TouchableOpacity
            style={styles.sendButtonStyle}
            onPress={handleSubmitMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
            <Icon name={'angle-right'} style={styles.arrowRight} />
          </TouchableOpacity>
          {'message' in errors && (
            <FormControl.ErrorMessage>
              {errors.message}
            </FormControl.ErrorMessage>
          )}
        </View>
      </FormControl>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DMChat);

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowLeft: {
    color: Colors.white,
    fontSize: 24,
  },
  arrowRight: {
    color: Colors.white,
    fontSize: 16,
  },
  arrowDown: {
    color: Colors.white,
    fontSize: 16,
  },
  title: {
    marginLeft: 30,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
    color: Colors.white,
  },
  textInputSearchStyle: {
    fontFamily: 'DM Sans',
    backgroundColor: Colors.input_backgroundColor_dark,
    fontSize: 14,
    lineHeight: 18.23,
    letterSpacing: 1,
    borderRadius: 10,
    paddingTop: 18,
    paddingLeft: 14,
    paddingBottom: 16,
    paddingRight: 80,
    color: Colors.input_fontColor_dark,
  },
  footer: {
    paddingTop: 7,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 13,
    borderTopWidth: 1,
    borderColor: Colors.input_backgroundColor_dark,
    position: 'relative',
  },
  moreMessages: {
    margin: 22,
    backgroundColor: Colors.input_backgroundColor_dark,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  moreMessagesText: {
    fontFamily: 'DM Sans',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 1,
    color: Colors.white,
    marginRight: 9,
    textAlign: 'center',
  },
  sendButtonText: {
    fontFamily: 'DM Sans',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 1,
    color: Colors.white,
    marginRight: 9,
  },
  sendButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 18,
    right: 35,
    zIndex: 1,
    backgroundColor: '#222222',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
