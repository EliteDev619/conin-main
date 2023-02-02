import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { OtrixContainer, OtrixContent } from '@component';

import { GlobalStyles } from '@helpers';
import getApi from '@apis/getApi';
import {
  OtirxBackButton,
  OtrixAlert,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import DigitalItemView from '../component/DigitalShowComponent/DigitalItemView';
import { logfunction, numberWithComma } from '../helpers/FunctionHelper';
import { ConfirmDialog } from 'react-native-simple-dialogs';

function DigitalStudio(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [totalHearts, setTotalHearts] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const [currentWeekViews, setCurrentWeekViews] = useState(0);

  const [previousWeekViews, setPreviousWeekViews] = useState(0);

  const [holdItems, setHoldItems] = useState([]);
  const [showConfirm, setUserConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/image/getMyImages?page=${page}`)
      .then(res => {
        setLoading(false);
        if (res.status == 1) {
          logfunction('RESPONSE', res.images.data);
          setTotalPage(res.images.last_page);
          setCurrentPage(res.images.current_page);
          setTotalComments(res.total_comments);
          setTotalViews(res.total_views);
          setTotalHearts(res.total_likes);
          setCurrentWeekViews(res.current_week_views);
          setPreviousWeekViews(res.previous_week_views);
          if (page == 1) {
            setData([...res.images.data]);
          } else {
            setData(prev => [...prev, ...res.images.data]);
          }
        }
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(1);
    }, []),
  );

  const paginate = () => {
    if (loading) {
      return;
    }
    if (totalPage > 1 && currentPage < totalPage) {
      fetchData(currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleDelete = () => {
    setUserConfirm(false);
    let formData = new FormData();
    formData.append('items', JSON.stringify(holdItems));
    setLoading(true);
    setMessage('');
    getApi
      .postData('seller/image/delete', formData)
      .then(res => {
        console.log(res);
        setLoading(false);
        if (res.status == 1) {
          setMessage(res.message);
          setHoldItems([]);
          fetchData(1);
        }
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Back</Text>
        </View>
      </OtrixHeader>
      <OtrixContent action={() => paginate()}>
        {loading && <OtrixLoader />}
        <View
          style={[
            { flexDirection: 'row', flexWrap: 'wrap' },
            styles.totalInnerWrapper,
          ]}>
          <View style={styles.totalWrapper}>
            <View style={styles.totalInnerWrapper}>
              <Text style={styles.totalHeader}>
                Total Comments: {numberWithComma(totalComments)}
              </Text>
            </View>
          </View>
          <View style={styles.totalWrapper}>
            <View style={styles.totalInnerWrapper}>
              <Text style={styles.totalHeader}>
                Total Hearts: {numberWithComma(totalHearts)}
              </Text>
            </View>
          </View>
          <View style={styles.totalWrapper}>
            <View style={styles.totalInnerWrapper}>
              <Text style={styles.totalHeader}>
                Total Views: {numberWithComma(totalViews)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={[styles.totalWrapper, { paddingRight: 5 }]}>
            <View style={styles.totalInnerWrapper}>
              <Text style={[styles.totalHeader, { textAlign: 'center' }]}>
                Last Week
              </Text>
              <Text style={styles.totalContent}>
                {numberWithComma(previousWeekViews)}
              </Text>
            </View>
          </View>
          <View style={[styles.totalWrapper, { paddingLeft: 5 }]}>
            <View style={styles.totalInnerWrapper}>
              <Text style={[styles.totalHeader, { textAlign: 'center' }]}>
                This Week
              </Text>
              <Text style={styles.totalContent}>
                {numberWithComma(currentWeekViews)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smText, { paddingHorizontal: 15 }]}>
            Uploaded images will be publicly shared on digital studio page.
          </Text>
          <View>
            {data.map(item => {
              return (
                <DigitalItemView
                  item={item}
                  key={item.id}
                  setHoldItems={setHoldItems}
                  holdItems={holdItems}
                />
              );
            })}
          </View>
        </View>
      </OtrixContent>
      {/* <TouchableOpacity style={styles.uploadButton}> */}
      {/* <Text style={styles.buttonText}>Upload</Text> */}
      {/* </TouchableOpacity> */}
      {holdItems.length ? (
        <View style={styles.deleteBox}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setUserConfirm(true)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() =>
            props.navigation.navigate('DigitalStudioUploadScreen')
          }>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      )}
      {!!message && <OtrixAlert message={message} />}
      <ConfirmDialog
        title="Delete"
        message="Are you sure to delete?"
        onTouchOutside={() => setUserConfirm(false)}
        visible={showConfirm}
        negativeButton={{
          title: 'NO',
          onPress: () => setUserConfirm(false),
          // disabled: true,
          titleStyle: {
            color: 'red',
            colorDisabled: 'aqua',
          },
          style: {
            backgroundColor: 'transparent',
            backgroundColorDisabled: 'transparent',
          },
        }}
        positiveButton={{
          title: 'YES',
          onPress: handleDelete,
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(DigitalStudio);
const styles = StyleSheet.create({
  totalWrapper: {
    width: '50%',
  },
  totalInnerWrapper: {
    padding: 10,
    backgroundColor: '#36393E',
    borderRadius: 13,
  },
  totalHeader: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
    color: '#AFB3BC',
    textAlign: 'left',
  },
  totalContent: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 23,
    color: '#AFB3BC',
    textAlign: 'center',
  },
  smText: {
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 13,
  },
  uploadButton: {
    backgroundColor: '#36393E',
    padding: 20,
    margin: 5,
    borderRadius: 13,
  },
  buttonText: {
    color: '#AFB3BC',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 31,
    textAlign: 'center',
  },
  deleteBox: {
    width: '100%',
    padding: 30,
    paddingBottom: 50,
    display: 'flex',
    marginHorizontal: 'auto',
    backgroundColor: 'black',
  },
});
