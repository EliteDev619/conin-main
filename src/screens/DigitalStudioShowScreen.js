import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { OtrixContainer } from '@component';
import getApi from '@apis/getApi';
import { OtrixLoader } from '../component';
import { logfunction } from '../helpers/FunctionHelper';
import DigitalShowItemView from '../component/DigitalShowComponent/DigitalShowItemView';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from '@react-navigation/native';

function DigitalStudio(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [height, setHeight] = useState(0);
  const [current, setCurrent] = useState(null);
  let flatlistRef = useRef(null);

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/image/getImages?page=${page}`)
      .then(res => {
        logfunction('RESPONSE', res?.images?.data);
        setLoading(false);
        setTotalPage(res?.images?.last_page);
        setCurrentPage(res?.images?.current_page);
        if (page == 1) {
          setData([...res?.images?.data]);
        } else {
          setData(data => [...data, ...res?.images?.data]);
        }
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.renderToCurrent) {
      }
    });
    fetchData(1);

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, []);

  const paginate = () => {
    if (loading) {
      return;
    }
    if (totalPage > 1 && currentPage < totalPage) {
      fetchData(currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }
  };

  onLayout = event => {
    let { width, height } = event.nativeEvent.layout;
    setHeight(height);
  };

  // goIndex = () => {
  //   console.log('goIndex', current);
  //   flatlistRef.scrollToIndex({ animated: true, index: current.index });
  // };
  return (
    <OtrixContainer customStyles={{ backgroundColor: 'black' }}>
      {(!data.length || !height) && (
        <View
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onLayout={onLayout}>
          {!loading && <Text style={styles.alert}>You have seen all</Text>}
        </View>
      )}
      <View style={styles.slide}>
        <SwiperFlatList
          data={data}
          vertical={true}
          ref={ref => (flatlistRef = ref)}
          onMomentumScrollEnd={item => {
            if (item.index == data.length - 1) {
              paginate();
            }
          }}
          onChangeIndex={current => {
            const { index, prevIndex } = current;
            setCurrent(current);
          }}
          renderItem={({ item, index }) => {
            return (
              <DigitalShowItemView
                item={item}
                index={index}
                data={data}
                setData={setData}
                key={item?.id}
                navigate={props.navigation.navigate}
                setLoading={setLoading}
                height={height}
                current={current}
              />
            );
          }}
        />
      </View>
      {loading && (
        <View style={styles.loader}>
          <OtrixLoader />
        </View>
      )}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
const { width, height } = Dimensions.get('window');
export default connect(mapStateToProps, {})(DigitalStudio);
const styles = StyleSheet.create({
  slide: {
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
  },
  alert: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#AFB3BC',
  },
});
