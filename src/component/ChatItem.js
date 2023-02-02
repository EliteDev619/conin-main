import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../helpers';
import { dateToFromNowDaily } from '../helpers/FunctionHelper';

function ChatItem(props) {
  const {
    message,
    sender: { firstname, lastname },
    created_at,
  } = props.data;
  return (
    <View style={{ marginVertical: 24 }}>
      <View style={styles.userItem}>
        <Text style={styles.username}>#{`${firstname} ${lastname}`}</Text>
        <Text style={styles.messageTime}>{dateToFromNowDaily(created_at)}</Text>
      </View>
      <View>
        <Text style={styles.userTitle}>{message}</Text>
      </View>
    </View>
  );
}

export default ChatItem;

const styles = StyleSheet.create({
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
