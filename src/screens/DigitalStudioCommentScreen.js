import React, { useEffect, useState, useRef, useCallback } from 'react';

import { OtrixContainer, OtrixHeader, OtirxBackButton } from '@component';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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

function DigitalStudioCommentScreen(props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef(null);
  const image_id = props?.route?.params?.image_id;
  const current = props?.route?.params?.currentPage;

  useFocusEffect(
    useCallback(() => {
      fetchData(1);
    }, []),
  );

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/image/getCommentsByImageId/${image_id}?page=${page}`)
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
    if (!message) {
      setErrors({
        ...errors,
        message: 'Message is required',
      });
      return;
    }
    setLoading(true);
    let sendData = new FormData();
    sendData.append('content', message);
    sendData.append('image_id', image_id);
    getApi
      .postData('seller/image/postCommentImage', sendData)
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
      <OtrixHeader
        customStyles={{
          backgroundColor: Colors.backgroundColor_dark,
          marginTop: -1,
        }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() =>
            props.navigation.navigate('DigitalStudioShowScreen', {
              current: current,
            })
          }>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Back</Text>
        </View>
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
        {comments.map(comment => {
          return (
            <View key={comment.id}>
              <View style={styles.postBox}>
                <Flex direction="row" align="center">
                  <Text style={styles.commentTitle}>
                    {comment.owner.firstname + ' ' + comment.owner.lastname}
                  </Text>
                  <Text style={styles.commentTime}>
                    {moment(comment.created_at).format('DD MMM hh:mm a')}
                  </Text>
                </Flex>
                <Text style={styles.commentContent}>{comment.comment}</Text>
              </View>
            </View>
          );
        })}
        {loading && <OtrixLoader />}
      </ScrollView>
      <View style={styles.commentBox}>
        <FormControl isRequired isInvalid={'message' in errors}>
          <TextArea
            placeholder="Write your comment"
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

export default connect(mapStateToProps)(DigitalStudioCommentScreen);

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
