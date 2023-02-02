import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { OtrixContainer, OtrixContent } from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';
import { _getWishlist, _addToWishlist } from '@helpers/FunctionHelper';
import { SliderBox } from 'react-native-image-slider-box';
import getApi from '@apis/getApi';
import { LiveUpdate, OtrixLoader } from '../component';
import moment from 'moment';
import { echo } from '../redux/Api/echo';
import { arrow } from '../common';

function News(props) {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [progress, setProgress] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      getApi.getData('getBannerImages').then(response => {
        const imgs = response.images.map(image => {
          return 'http://coinnow.life/uploads/banner/' + image.image;
        });
        getApi.getData('autoPriceTimer').then(res => {
          if (res.status == 1) {
            if (res.percent < 50) {
              setProgress(res.percent + 50);
            } else {
              setProgress(res.percent - 50);
            }
          }
        });
        setImages(imgs);
      });
      fetchData(1);
    }, []),
  );

  useFocusEffect(() => {
    let progressTimer = setInterval(() => {
      getApi.getData('autoPriceTimer').then(res => {
        if (res.status == 1) {
          if (res.percent < 50) {
            setProgress(res.percent + 50);
          } else {
            setProgress(res.percent - 50);
          }
        }
      });
    }, 5000);
    echo.channel('chat-channel').listen('.message.new', data => {
      if (data.sender == 'news-sent') {
        // if (data.receiver.id == 'all') {
        //   fetchData(1);
        //   return;
        // }
        setNews([data.receiver, ...news]);
        return;
      }
    });

    return () => {
      echo.channel('chat-channel').stopListening('.message.new');
      clearInterval(progressTimer);
    };
  });

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`news?page=${page}`)
      .then(res => {
        setCurrentPage(page);
        if (page === 1) {
          setNews([...res.data.data]);
        } else {
          setNews([...news, ...res.data.data]);
        }
        setTotalPage(res.data.last_page);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  const renderItems = data => {
    return data.map(item => {
      switch (item.type) {
        case 'default':
          return (
            <View key={item.id} style={styles.defaultBlock}>
              <Text style={styles.headerText}>
                Coinnow Official News{' '}
                {item.created_at &&
                  moment(item.created_at).format('DD MMM YYYY hh:mm a')}
              </Text>
              <Text style={styles.defaultText}>{item.content}</Text>
            </View>
          );
        case 'seller':
          return (
            <View
              key={item.id}
              style={[styles.defaultBlock, { backgroundColor: '#AA98A9' }]}>
              <Text style={[styles.headerText, { color: 'black' }]}>
                Famous Person News{' '}
                {item.created_at &&
                  moment(item.created_at).format('DD MMM YYYY hh:mm a')}
              </Text>
              <Text style={[styles.defaultText, { color: 'black' }]}>
                {item.content}
              </Text>
            </View>
          );
        case 'price updated all':
          return (
            <View
              key={item.id}
              style={[styles.defaultBlock, { backgroundColor: '#003867' }]}>
              <Text style={[styles.headerText, { color: 'white' }]}>
                Price Change News{' '}
                {item.created_at &&
                  moment(item.created_at).format('DD MMM YYYY hh:mm a')}
              </Text>
              <Text style={[styles.defaultText, { color: 'white' }]}>
                {item.content}
              </Text>
            </View>
          );
        default:
          return (
            <View
              key={item.id}
              style={[styles.defaultBlock, { backgroundColor: '#6C5B7B' }]}>
              <Text style={[styles.headerText, { color: 'black' }]}>
                Price Change News{' '}
                {item.created_at &&
                  moment(item.created_at).format('DD MMM YYYY hh:mm a')}
              </Text>
              <Text style={[styles.defaultText, { color: 'black' }]}>
                {item.content}
              </Text>
            </View>
          );
      }
    });
  };

  const paginate = () => {
    if (loading) {
      return;
    }
    if (totalPage > 1 && currentPage < totalPage) {
      setLoading(true);
      setCurrentPage(prevState => prevState + 1);
      fetchData(currentPage + 1);
    }
  };
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixContent action={paginate}>
        {/* SearchBar Component */}
        {/* <SearchBar navigation={props.navigation} /> */}

        {/* SlideBar */}
        <SliderBox
          images={images}
          ImageComponentStyle={{
            borderRadius: 10,
            width: '90%',
            marginTop: 15,
            marginRight: 30,
          }}
          sliderBoxHeight={150}
          resizeMethod={'resize'}
          resizeMode={'cover'}
          autoplay
          circleLoop
          dotStyle={{
            width: 0,
          }}
        />
        <View style={styles.progress}>
          <View
            style={[
              styles.progressBar,
              {
                marginLeft: 100 - progress + '%',
              },
            ]}>
            <View style={styles.bar} />
          </View>
          <View
            style={[
              styles.progressBar,
              {
                marginLeft: '50%',
                marginTop: 0,
              },
            ]}>
            <Image source={arrow} />
          </View>
        </View>
        <LiveUpdate />
        <View>{renderItems(news)}</View>
        {loading && <OtrixLoader />}
      </OtrixContent>
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(News);
const styles = StyleSheet.create({
  headerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6%'),
    marginTop: 10,
    color: Colors.white,
  },
  defaultBlock: {
    backgroundColor: 'black',
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
  },
  defaultText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
  },
  headerText: {
    color: 'red',
    fontSize: 8,
    fontWeight: '400',
    lineHeight: 10.42,
    textAlign: 'center',
    marginBottom: 15,
  },
  progress: {
    backgroundColor: '#36393E',
    height: 58,
    borderRadius: 13,
    marginTop: 10,
  },
  bar: {
    backgroundColor: '#3B7A57',
    height: 30,
    borderWidth: 2,
    borderColor: '#3B7A57',
    width: 0,
    borderRadius: 13,
    marginBottom: 5,
  },
  progressBar: {
    width: 14,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
});
