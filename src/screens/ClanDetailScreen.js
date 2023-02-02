import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { OtrixContainer, OtrixContent } from '@component';
import { _roundDimensions } from '@helpers/util';
import { _getWishlist, _addToWishlist } from '@helpers/FunctionHelper';
import { ClanDetailBanner, coinImage } from '../common';
import { GlobalStyles } from '@helpers';
import { numberWithComma } from '../helpers/FunctionHelper';
import { Button, Flex, Spacer } from 'native-base';
import {
  OtirxBackButton,
  OtrixAlert,
  OtrixDivider,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import getApi from '@apis/getApi';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BalanceHistoryItem from '../component/HistoryComponent/BalanceHistoryItem';
import { bindActionCreators } from 'redux';
import { authData } from '@actions';

function ClanDetailScreen(props) {
  const { item } = props.route?.params;
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [join, setJoin] = useState(false);
  const [state, setState] = React.useState({
    historyList: [],
    currentPage: 1,
    totalPages: 1,
    loader: false,
  });
  const [showConfirm, setUserConfirm] = useState(false);
  const { historyList, totalPages, currentPage, loader } = state;

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/clans/${item?.id}/history?page=` + page, [])
      .then(response => {
        if (response.status == 1) {
          setLoading(false);
          setState(prevstate => ({
            ...prevstate,
            historyList:
              page == 1
                ? response.data.data
                : [...prevstate.historyList, ...response.data.data],
            totalPages: response.data.last_page,
            loader: false,
          }));
        }
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (item?.id) fetchData(1);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, [item]);

  useEffect(() => {
    if (props?.customerData?.clan_id) {
      setJoin(true);
    } else {
      setJoin(false);
    }
  }, [props?.customerData]);

  const paginate = () => {
    if (loader) return;
    if (totalPages > 1 && currentPage <= totalPages) {
      setState({
        ...state,
        loader: true,
        currentPage: currentPage + 1,
      });
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    return (
      //Footer View
      <View>
        {loader && <OtrixLoader />}
        <OtrixDivider size={'sm'} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <BalanceHistoryItem
      navigation={props.navigation}
      history={item}
      hidden={true}
    />
  );

  const joinClan = () => {
    setLoading(true);
    getApi
      .getData(`seller/clans/${item?.id}/join`)
      .then(res => {
        if (res.status == 1) {
          setMessage({
            type: 'success',
            message: res.message,
          });
          setJoin(true);
        } else {
          setMessage({
            type: 'error',
            message: 'Failed',
          });
        }
        setLoading(false);
        setUserConfirm(false);

        getApi.getData('seller/getSeller', []).then(response => {
          if (response.status === 1) {
            props.authData(response.data);
          }
        });
      })
      .catch(() => {
        setLoading(false);
        setUserConfirm(false);
      });
  };

  const leaveClan = () => {
    setLoading(true);
    getApi
      .getData(`seller/clans/${item?.id}/leave`)
      .then(res => {
        if (res.status == 1) {
          setMessage({
            type: 'success',
            message: res.message,
          });
          setJoin(false);
        } else {
          setMessage({
            type: 'error',
            message: 'Failed',
          });
        }
        setLoading(false);
        setUserConfirm(false);

        getApi.getData('seller/getSeller', []).then(response => {
          if (response.status === 1) {
            props.authData(response.data);
          }
        });
      })
      .catch(() => {
        setLoading(false);
        setUserConfirm(false);
      });
  };
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ClansList')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}>Clan Detail</Text>
        </View>
      </OtrixHeader>
      <OtrixContent>
        <View style={{ width: '100%', height: 143 }}>
          <Image
            source={{
              uri: 'http://coinnow.life/public/uploads/clan/' + item?.image,
            }}
            style={{
              width: wp('92%'),
              borderRadius: 13,
              height: '100%',
            }}
          />
        </View>

        <View>
          <Flex direction="row" style={{ marginTop: 15 }}>
            <View style={styles.leftbox}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: '#AFB3BC',
                }}>
                {item?.title}
              </Text>
              <Text style={styles.smFont}>
                Clan Owner: {item?.owner.firstname + ' ' + item?.owner.lastname}
              </Text>
              <Text style={styles.smFont}>
                Clan Item: {item?.product?.product_description?.name}
              </Text>
              <Flex direction="row">
                <Text
                  style={[
                    styles.smFont,
                    {
                      backgroundColor: '#3AFA95',
                      color: 'black',
                      paddingVertical: 2,
                      borderRadius: 4,
                      paddingHorizontal: 6,
                    },
                  ]}>
                  {item?.members?.length} Members
                </Text>
              </Flex>
            </View>
            <Spacer />
            {join ? (
              <Button
                style={styles.joinButton}
                onPress={() => setUserConfirm(true)}>
                <Text style={styles.joinButtonText}>Leave Clan</Text>
              </Button>
            ) : (
              <Button
                style={styles.joinButton}
                onPress={() => setUserConfirm(true)}>
                <Text style={styles.joinButtonText}>Join Clan</Text>
              </Button>
            )}
          </Flex>
          {historyList.length > 0 ? (
            <FlatList
              style={{ padding: wp('1%') }}
              data={historyList}
              horizontal={false}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          ) : null}
        </View>
        {loading && <OtrixLoader />}
        <ConfirmDialog
          title={join ? 'Leave' : 'Join'}
          message="Are you sure?"
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
            onPress: join ? leaveClan : joinClan,
            titleStyle: {
              // color: "red",
              colorDisabled: 'aqua',
            },
          }}
        />
      </OtrixContent>
      {message && <OtrixAlert type={message.type} message={message.message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClanDetailScreen);
const styles = StyleSheet.create({
  leftbox: {
    backgroundColor: 'white',
    borderRadius: 13,
    paddingHorizontal: 25,
    paddingVertical: 7,
    width: '65%',
  },
  smFont: {
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 11.72,
    color: '#AFB3BC',
    marginVertical: 2,
  },
  joinButton: {
    width: '33%',
    backgroundColor: '#D3C1F7',
    borderRadius: 13,
  },
  joinButtonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20.83,
  },
  imageView: {
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius: 5,
    width: 100,
  },
});
