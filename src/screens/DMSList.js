import React, { useEffect, useState } from 'react';

import { OtrixContainer, OtrixHeader, OtrixContent } from '@component';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@helpers';
import getApi from '@apis/getApi';
import { connect } from 'react-redux';
import { ChatItem, OtrixLoader } from '../component';
import { echo } from '../redux/Api/echo';
import { dateToFromNowDaily } from '../helpers/FunctionHelper';
import * as RootNavigation from '../AppNavigator';

function DMSList(props) {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    return getApi
      .getData(
        `seller/chat/getMessagesByReceiver?receiver=${props.authUser.id}`,
      )
      .then(res => {
        setMessages(res);
      });
  };

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', data => {
      if (data.receiver == props.authUser.id) {
        fetchData();
      }
    });
    return () => echo.channel('chat-channel').stopListening('.message.new');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchData().then(() => setLoading(false));
    }, []),
  );

  const handleChange = value => {
    setUsername(value);
    getApi.getData(`seller/chat/users?user=${value}`).then(res => {
      setUsers(res);
    });
  };

  return (
    <OtrixContainer
      customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      <OtrixHeader
        customStyles={{
          backgroundColor: Colors.backgroundColor_dark,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => RootNavigation.navigate('ProfileScreen')}>
          <View style={styles.headerContent}>
            <Icon name={'angle-left'} style={styles.arrowLeft} />
            <Text style={styles.title}>DMS</Text>
          </View>
        </TouchableOpacity>
      </OtrixHeader>
      <OtrixContent>
        {loading && <OtrixLoader />}
        <View>
          <TextInput
            placeholder="search by username"
            style={styles.textInputSearchStyle}
            placeholderTextColor={Colors.input_fontColor_dark}
            value={username}
            onChangeText={handleChange}
          />
          <View style={styles.userList}>
            {users && users.length
              ? users.map(user => (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('DMChat', {
                        receiver_id: user.id,
                        receiver: `${user.firstname} ${user.lastname}`,
                      })
                    }
                    key={user.email}>
                    <Text style={styles.userItemText}>{user.email}</Text>
                  </TouchableOpacity>
                ))
              : false}
          </View>
        </View>
        {messages && messages.length
          ? messages.map(item => (
              <TouchableOpacity
                onPress={() =>
                  RootNavigation.navigate('DMChat', {
                    receiver_id:
                      item.message.receiver_id != props.authUser.id
                        ? item.message.receiver_id
                        : item.message.sender_id,
                    receiver:
                      item.message.receiver_id != props.authUser.id
                        ? `${item.message.receiver.firstname} ${item.message.receiver.lastname}`
                        : `${item.message.sender.firstname} ${item.message.sender.lastname}`,
                  })
                }
                key={item.message.id}>
                <View
                  style={{
                    marginVertical: 12,
                    backgroundColor: Colors.input_backgroundColor_dark,
                    padding: 10,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <View style={styles.userItem}>
                      <Text style={styles.username}>
                        #
                        {item.message.sender &&
                          (item.message.receiver_id != props.authUser.id
                            ? `${item?.message?.receiver?.firstname} ${item?.message?.receiver?.lastname}`
                            : `${item?.message?.sender?.firstname} ${item?.message?.sender?.lastname}`)}
                      </Text>
                      <Text style={styles.messageTime}>
                        {dateToFromNowDaily(item.message.created_at)}
                      </Text>
                      {item.message.receiver_id != props.authUser.id ? (
                        <Icon name="paper-plane" style={styles.messageTime} />
                      ) : (
                        <Icon name="comment" style={styles.messageTime} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.userTitle}>
                        {item.message.message}
                      </Text>
                    </View>
                  </View>
                  {item.unread_message_count ? (
                    <Text
                      style={{
                        color: Colors.white,
                        backgroundColor: 'red',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 10,
                      }}>
                      {item.unread_message_count}
                    </Text>
                  ) : (
                    false
                  )}
                </View>
              </TouchableOpacity>
            ))
          : false}
      </OtrixContent>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps)(DMSList);

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowLeft: {
    color: Colors.white,
    fontSize: 24,
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
  headingTxt: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    lineHeight: 20.83,
    fontWeight: '700',
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
    paddingHorizontal: 14,
    paddingBottom: 16,
    color: Colors.input_fontColor_dark,
  },
  userList: {
    flexDirection: 'row',
    color: Colors.white,
    flexWrap: 'wrap',
  },
  userItemText: {
    color: Colors.white,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: Colors.input_backgroundColor_dark,
    margin: 5,
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userItemFront: {
    flexDirection: 'row',
  },
  username: {
    color: Colors.white,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
  },
  userTitle: {
    color: Colors.white,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18.2,
    letterSpacing: 1,
    paddingLeft: 10,
  },
  messageTime: {
    paddingTop: 6,
    color: Colors.white,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    fontWeight: '400',
    paddingLeft: 10,
  },
  avatarStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 13,
  },
});
