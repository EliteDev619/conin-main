import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  SellerStoreSearchProducts,
  OtrixLoader,
  OtrixContent,
  OtrixAlert,
  OtrixDivider,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';
import {
  _getWishlist,
  _addToWishlist,
  logfunction,
} from '@helpers/FunctionHelper';
import getApi from '@apis/getApi';
import { SliderBox } from 'react-native-image-slider-box';
import { useFocusEffect } from '@react-navigation/native';
import { LiveUpdate } from '../component';
function SellerStore(props) {
  const [state, setState] = React.useState({
    data: [],
    searchKeyword: '',
  });
  const [loader, setLoader] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [showMessage, setShowMessage] = React.useState(false);
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const bottomMenu = React.useRef();
  const selectedProduct = React.useRef(null);
  const [images, setImages] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getApi.getData('getBannerImages').then(response => {
        const imgs = response.images.map(image => {
          return 'http://coinnow.life/uploads/banner/' + image.image;
        });
        setImages(imgs);
      });
      fetchData(1);
    }, []),
  );

  useEffect(() => {
    const products = state.data;
    if (props.product) {
      for (let i = 0; i < products?.length; i++) {
        if (products[i].product.id == props.product.id) {
          products[i].product.price = props.product.price;
          setState({
            ...state,
            data: products,
          });
        }
      }
    }
  }, [props.product]);

  const onPressBuy = async item => {
    bottomMenu.current?.close();
    let sendData = new FormData();
    sendData.append('id', item?.id ? item?.id : selectedProduct.current?.id);
    return new Promise((resolve, reject) => {
      getApi
        .postData('seller/buyProductV1', sendData)
        .then(response => {
          logfunction('RESPONSE ORDER  ', response);
          if (response.status == 1) {
            setType('success');
            setMessage(response.message);
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
            }, 3000);
            fetchData(1, searchKeyword);
          } else {
            setType('error');
            setMessage(JSON.stringify(response.message));
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
            }, 3000);
          }
          resolve(response);
        })
        .catch(e => {
          resolve(e);
        });
    });
  };
  const fetchData = (page, text = '') => {
    if (text.length > -1) {
      getApi
        .getData(`getMarketplaceProducts?page=${page}&q=${text}`, [])
        .then(response => {
          if (response.status == 1) {
            logfunction('RESPONSEEE ', response.data);
            setLoader(false);
            setLoading(false);
            setTotalPages(response.data.last_page);
            setCurrentPage(page);
            if (page == 1) {
              setState(prevState => ({
                ...prevState,
                data: response.data.data,
              }));
            } else {
              setState(prevState => ({
                ...prevState,
                data: [...prevState.data, ...response.data.data],
              }));
            }
          }
        });
    }
  };
  const paginate = () => {
    if (loader) {
      return;
    }
    if (totalPages > 1 && currentPage < totalPages) {
      setLoader(true);
      fetchData(currentPage + 1, searchKeyword);
      setCurrentPage(prevState => prevState + 1);
    }
  };
  const renderFooter = () => {
    return (
      //Footer View
      <View>{loader && <OtrixLoader />}</View>
    );
  };
  const renderItem = ({ item, index }) =>
    item.product && (
      <SellerStoreSearchProducts
        onPressBuy={onPressBuy}
        navigation={props.navigation}
        product={item}
        isMine={props.customerData.id == item.seller_id}
        customerData={props.customerData}
      />
    );
  const { searchKeyword, data } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#0A0A0A' }}>
      <View style={styles.headerCenter}>
        <Text style={styles.headingTxt}>Marketplace</Text>
      </View>
      <OtrixContent action={() => paginate()} disableScroll={true}>
        {/* SearchBar Component */}

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
        <LiveUpdate />
        {loading ? (
          <OtrixLoader />
        ) : (
          <View style={{ flex: 1 }}>
            {data.length > 0 && (
              <FlatList
                data={data}
                horizontal={false}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(contact, index) => String(index)}
                ListFooterComponent={renderFooter}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 10 }}
                onEndReached={({ distanceFromEnd }) => {
                  // paginate();
                }}
              />
            )}
          </View>
        )}
      </OtrixContent>
      {showMessage && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(SellerStore);
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
});
