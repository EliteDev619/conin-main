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
import { coinImage } from '../common';
import { GlobalStyles, Colors } from '@helpers';
import { numberWithComma } from '../helpers/FunctionHelper';
import { Button, Spacer } from 'native-base';
import {
  OtirxBackButton,
  OtrixAlert,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import getApi from '@apis/getApi';
import { Title } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';

function ClansList(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/joinClans?page=${page}`)
      .then(res => {
        setLoading(false);
        if (page === 1) {
          setData([...res.data]);
        } else {
          setData([...data, ...res.data]);
        }
        setTotalPage(res.last_page);
        setCurrentPage(page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (props?.customerData?.clan_id) {
        props.navigation.navigate('ProfileScreen');
      }
    }, [props?.customerData]),
  );

  const paginate = () => {
    if (totalPage > currentPage && !loading && currentPage > 0) {
      fetchData(currentPage + 1);
    }
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
          <Text style={GlobalStyles.headingTxt}> Clan List</Text>
        </View>
      </OtrixHeader>
      <OtrixContent action={paginate}>
        {data.map(item => {
          return (
            <View style={styles.clanItem} key={item.id}>
              <View style={styles.imageView}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item?.product?.image
                      ? 'http://coinnow.life/public/uploads/product/' +
                        item?.product?.image
                      : 'http://coinnow.life/public/uploads/assets/img/default.png',
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <View>
                <Title style={styles.detailText}>{item?.title}</Title>
                <Title style={styles.detailText}>
                  {item?.owner?.firstname + ' ' + item?.owner?.lastname}
                </Title>
                <Title style={styles.detailText}>
                  {item?.product?.product_description?.name}
                </Title>
                <Title style={styles.detailText}>
                  Discount: {item?.discount} coins
                </Title>
                <Title style={styles.detailText}>
                  Join Cost: {item?.fee} coins
                </Title>
              </View>
              <Spacer />
              <View>
                <Button
                  style={styles.joinButton}
                  onPress={() => {
                    props.navigation.navigate('ClanDetailScreen', {
                      item: item,
                    });
                  }}>
                  <Title
                    style={{
                      fontWeight: '700',
                      fontSize: 10,
                      lineHeight: 13.02,
                    }}>
                    Visit
                  </Title>
                </Button>
              </View>
            </View>
          );
        })}
        {loading && <OtrixLoader />}
      </OtrixContent>
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(ClansList);
const styles = StyleSheet.create({
  clanItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 13.02,
  },
  joinButton: {
    backgroundColor: '#3AFA95',
    borderRadius: 4,
    height: 37,
    width: 64,
  },
  imageView: {
    backgroundColor: Colors.backgroundColor_dark,
    height: 78,
    width: 78,
    borderRadius: wp('2.5%'),
    overflow: 'hidden',
    marginRight: 20,
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    aspectRatio: 0.9,
    width: '100%',
  },
});
