import React, { useEffect, useState, useRef, useCallback } from 'react';

import { OtrixContainer, OtrixHeader, OtrixContent } from '@component';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Colors } from '@helpers';
import getApi from '@apis/getApi';
import { connect } from 'react-redux';
import { OtrixLoader } from '../component';
import * as RootNavigation from '../AppNavigator';
import { Flex, TextArea, Button, Spacer, FormControl } from 'native-base';
import moment from 'moment';
import { GlobalStyles } from '../helpers';
import { useFocusEffect } from '@react-navigation/native';

function CommentScreen(props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      fetchData(1);
    }, []),
  );

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`getComments?page=${page}`)
      .then(res => {
        setCurrentPage(page);
        if (page === 1) {
          setComments([...res.data]);
        } else {
          setComments([...comments, ...res.data]);
        }
        setTotalPage(res.last_page);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
    return;
  };

  const paginate = () => {
    if (loading) return;
    if (totalPage > 1 && currentPage < totalPage) {
      setCurrentPage(prev => prev + 1);
      fetchData(currentPage + 1);
    }
  };

  const handleSubmitMessage = () => {
    setLoading(true);
    if (!message) {
      setErrors({
        ...errors,
        message: 'Message is required',
      });
      return;
    }
    let sendData = new FormData();
    sendData.append('user_id', props.authUser.id);
    sendData.append('content', message);
    getApi
      .postData('postComment', sendData)
      .then(res => {
        setLoading(false);
        setMessage('');
        fetchData(1);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  return (
    <OtrixContainer
      customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      <OtrixHeader customStyles={{ backgroundColor: '#0066FF', marginTop: -1 }}>
        <Text
          style={{
            color: 'white',
            fontWeight: '700',
            fontSize: 14,
            lineHeight: 18.2,
            letterSpacing: 1,
          }}>
          English, español, हिन्दी, বাংলা, 日本, عربي , اردو.
        </Text>
      </OtrixHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={[GlobalStyles.contentView]}
        onContentSizeChange={() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}
        ref={scrollViewRef}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            paginate();
          }
        }}
        scrollEventThrottle={400}>
        <View style={styles.postBox}>
          <Flex direction="row" align="center">
            <Text style={[styles.commentTitle, { color: '#B10000' }]}>
              Customer Support
            </Text>
          </Flex>
          <Text style={styles.commentContent}>Welcome to coinnow tech.</Text>
          <Text style={styles.commentContent}>
            Please message us here for deposit and withdraw requests.
          </Text>
          <Text style={styles.commentContent}>
            Envíenos un mensaje aquí para solicitudes de depósito y retiro.
          </Text>
          <Text style={styles.commentContent}>
            जमा और निकासी अनुरोधों के लिए कृपया हमें यहां संदेश भेजें।
          </Text>
          <Text style={styles.commentContent}>
            কয়েন কিনার জন্য অথবা উইথড্র করার জন্য এখানে মেসেজ করুন।
          </Text>
          <Text style={styles.commentContent}>
            入金および出金のリクエストについては、こちらにメッセージを送信してください。
          </Text>
          <Text style={styles.commentContent}>
            يرجى مراسلتنا هنا لطلبات الإيداع والسحب.
          </Text>
          <Text style={styles.commentContent}>
            ڈیپازٹ اور واپس لینے کی درخواستوں کے لیے براہ کرم ہمیں یہاں میسج
            کریں۔
          </Text>
        </View>
        {comments.map(comment => {
          return (
            <View key={comment.id}>
              <View style={styles.postBox}>
                <Flex direction="row" align="center">
                  <Text style={styles.commentTitle}>
                    {props.authUser.firstname + ' ' + props.authUser.lastname}
                  </Text>
                  <Text style={styles.commentTime}>
                    {moment(comment.created_at).format('DD MMM hh:mm a')}
                  </Text>
                </Flex>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
              {comment.reply && (
                <View style={styles.postBox}>
                  <Flex direction="row" align="center">
                    <Text style={[styles.commentTitle, { color: '#B10000' }]}>
                      Customer Support
                    </Text>
                    <Text style={styles.commentTime}>
                      {moment(comment.replyed_at).format('DD MMM hh:mm a')}
                    </Text>
                  </Flex>
                  <Text style={styles.commentContent}>{comment.reply}</Text>
                </View>
              )}
            </View>
          );
        })}
        {loading && <OtrixLoader />}
      </ScrollView>
      <View style={styles.commentBox}>
        <FormControl isRequired isInvalid={'message' in errors}>
          <TextArea
            placeholder="Please explain your issue"
            style={styles.textarea}
            placeholderTextColor={Colors.input_fontColor_dark}
            value={message}
            keyboardType="twitter"
            h={110}
            borderWidth={0}
            borderBottomWidth={0.5}
            borderColor="rgba(209, 209, 209, 0.17)"
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
            }}></TextArea>
          <Flex direction="row" align="center" mt={2}>
            {'message' in errors && (
              <FormControl.ErrorMessage>
                {errors.message}
              </FormControl.ErrorMessage>
            )}
            <Spacer />
            <Button
              onPress={handleSubmitMessage}
              w={'80px'}
              h={'36px'}
              backgroundColor={'#222222'}
              style={styles.post}>
              <Text
                style={{
                  color: '#B10000',
                }}>
                Post
              </Text>
            </Button>
          </Flex>
        </FormControl>
      </View>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps)(CommentScreen);

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
  commentBox: {
    height: 166,
    backgroundColor: '#36393E',
    borderRadius: 13,
    padding: 10,
    marginTop: 15,
    margin: 20,
  },
  postBox: {
    padding: 12,
    borderRadius: 13,
    backgroundColor: '#222222',
    marginTop: 15,
  },
  textarea: {
    fontFamily: 'DM Sans',
    backgroundColor: Colors.input_backgroundColor_dark,
    fontSize: 14,
    lineHeight: 18.23,
    letterSpacing: 1,
    borderRadius: 10,
    color: Colors.input_fontColor_dark,
  },
  post: {
    borderRadius: 13,
  },
  commentTitle: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
  },
  commentTime: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    color: 'white',
    marginLeft: 15,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 18.2,
    letterSpacing: 1,
    color: 'white',
    paddingTop: 10,
  },
});
