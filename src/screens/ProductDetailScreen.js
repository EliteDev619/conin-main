import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixContent,
  OtrixDivider,
  OtirxBackButton,
  OtrixLoader,
  SimilarProduct,
  OtrixAlert,
  RatingComponent,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { coinImage } from '@common';

import { _roundDimensions } from '@helpers/util';
import { bottomCart, checkround2, close } from '@common';
import { SliderBox } from 'react-native-image-slider-box';
import Timeline from 'react-native-timeline-flatlist';
import {
  Badge,
  ScrollView,
  Button,
  Input,
  FormControl,
  InfoOutlineIcon,
} from 'native-base';
import Fonts from '../helpers/Fonts';
import { bindActionCreators } from 'redux';
import { addToCart, addToWishList } from '@actions';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import Stars from 'react-native-stars';
import RenderHtml from 'react-native-render-html';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';
import getApi from '@apis/getApi';
import {
  numberWithComma,
  logfunction,
  _addToWishlist,
} from '@helpers/FunctionHelper';
import { ASSETS_DIR, CURRENCY } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { echo } from '../redux/Api/echo';
import { useFocusEffect } from '@react-navigation/native';
import { LiveUpdate, OtrixHeader } from '../component';
import { Dimensions } from 'react-native';
function ProductDetailScreen(props) {
  const scrollRight = useRef();
  const { cartCount, USER_AUTH, wishlistData, userData } = props;
  const [prices, setPrices] = useState([]);
  const [showConfirm, setUserConfirm] = useState(false);
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  const [buying, setBuying] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [errors, setErrors] = React.useState({});
  const [timelineData, setTimelineData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  // const lineChartData = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43],
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //     {
  //       data: [30, 30, 30, 30, 30, 30],
  //       color: (opacity = 1) => `rgba(255, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  //   legend: ['Rainy Days'], // optional
  // };

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    origins: [],
    prices: [],
    created_at: [],
  });

  const [state, setState] = React.useState({
    loading: true,
    productPrice: 0,
    productCount: 1,
    productDetail: null,
    value: null,
    isFocus: false,
    productDescription: null,
    productSpecial: null,
    productAttributes: null,
    productImages: null,
    productRelated: null,
    productOption: [],
    fetchCart: false,
    productReview: null,
    optionColor: 0,
    optionSelect: 0,
    optionSize: 0,
    showZoom: false,
    zoomImages: [],
    message: null,
    type: 'error',
    optionColorPrice: 0,
    optionSelectPrice: 0,
    optionSizePrice: 0,
  });
  const {
    loading,
    productDetail,
    productOption,
    productPrice,
    fetchCart,
    productReview,
    productImages,
    productAttributes,
    productDescription,
    isFocus,
    productRelated,
    productSpecial,
    optionColor,
    optionSelect,
    optionSize,
    productCount,
    zoomImages,
    showZoom,
    msg,
    optionColorPrice,
    optionSelectPrice,
    optionSizePrice,
    message,
    type,
  } = state;

  const fetchData = (id, page) => {
    setLoader(true);
    getApi
      .getData(`productPrice/${id}?page=${page}`)
      .then(res => {
        setLoader(false);
        if (res.data) {
          setTotalPage(res.last_page);
          // let data = [];
          // res.data.map(item => {
          //   data = [
          //     ...data,
          //     {
          //       time: moment(item.created_at).format('DD MMM YYYY'),
          //       title: item.price,
          //     },
          //   ];
          // });
          if (page == 1) {
            setTimelineData(res.data);
          } else {
            setTimelineData(prevState => [...prevState, ...data]);
          }
        }
      })
      .catch(err => {
        setLoader(false);
      });
    getApi.getData(`seller/getPriceChangeHistory/${id}`).then(res => {
      setLineChartData(res);
    });
  };

  const paginate = () => {
    if (loader) {
      return;
    }
    if (totalPage > 1 && currentPage < totalPage && productDetail) {
      fetchData(productDetail.id, currentPage + 1);
      setCurrentPage(prevState => prevState + 1);
    }
  };

  useEffect(() => {
    if (productDetail) {
      fetchData(productDetail.id, 1);
    }
  }, [productDetail]);

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', data => {
      if (
        data.sender == 'price update' &&
        props.route.params.data.id == data.receiver.id
      ) {
        setPrices(data.receiver.productPrice);
        setState({
          ...state,
          productPrice: data.receiver.price,
        });
        const newPrice = {
          time: moment(data.receiver.productPrice[0].created_at).format(
            'DD MMM YYYY hh:mm:ss a',
          ),
          title: data.receiver.productPrice[0].price,
        };
        setTimelineData(prevState => [newPrice, ...prevState]);
        return;
      }
    });
    return () => echo.channel('chat-channel').stopListening('.message.new');
  });

  const _CartData = () => {
    // setState({ ...state, fetchCart: false })
  };

  const showOutOfStock = () => {
    setTimeout(() => {
      setState({ ...state, message: null });
    }, 2500);
    setState({ ...state, message: 'Product out of stock', type: 'error' });
  };

  const onPressBuy = () => {
    setUserConfirm(false);
    if (loading) {
      return;
    }

    if (productDetail.quantity < 1) {
      showOutOfStock();
      return;
    }
    setBuying(true);
    let sendData = new FormData();
    sendData.append('id', productDetail?.id);
    sendData.append('quantity', quantity);

    getApi
      .postData('seller/buyProduct', sendData)
      .then(response => {
        logfunction('RESPONSE ORDER  ', response);
        if (response.status == 1) {
          setState({
            ...state,
            message: response.message,
            type: 'success',
          });
        } else {
          setState({
            ...state,
            message: response.message,
            type: 'error',
          });
        }
        setTimeout(() => {
          setState({
            ...state,
            message: null,
          });
        }, 3000);
        getDetails();
        setBuying(false);
      })
      .catch(e => {
        setBuying(false);
      });
  };

  const _addToCart = () => {
    const mode = userData?.mode;
    if (USER_AUTH == true) {
      setState({ ...state, fetchCart: true });

      let sendData = new FormData();
      sendData.append('quantity', productCount);
      sendData.append('product_id', productDetail.id);
      sendData.append(
        'options',
        JSON.stringify({
          optionColorSelected: optionColor,
          optionSizeSelected: optionSize,
          optionSelectSelected: optionSelect,
        }),
      );
      logfunction('Sample requrest  ', sendData);
      getApi.postData('seller/addToCart', sendData).then(response => {
        logfunction('response response  ', response);

        if (response.status == 1) {
          props.addToCart(response.cartCount);
          setState({
            ...state,
            message: response.message,
            fetchCart: false,
            type: 'success',
          });
        } else {
          setState({
            ...state,
            message: response.message,
            fetchCart: false,
            type: 'error',
          });
        }

        setTimeout(() => {
          setState({
            ...state,
            message: null,
          });
        }, 3000);
      });
    } else {
      props.navigation.navigate('LoginScreen');
    }
  };

  const addToWish = async id => {
    let wishlistData = await _addToWishlist(id);
    props.addToWishList(wishlistData, id);
  };

  const colorChange = data => {
    logfunction('COlor Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - parseFloat(optionColorPrice);

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionColor: data.product_option_id,
      productPrice: calculatePrice,
      optionColorPrice: data.price,
    });
  };

  const sizeChange = data => {
    logfunction('COlor Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - parseFloat(optionSizePrice);

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionSize: data.product_option_id,
      productPrice: calculatePrice,
      optionSizePrice: data.price,
    });
  };

  const setOptionSelect = (selected, data) => {
    logfunction('Select Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - optionSelectPrice;

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionSelect: selected,
      productPrice: calculatePrice,
      optionSelectPrice: data.price,
    });
  };

  let optionArr = [];
  const buildSelect = (item, index) => {
    let label =
      item.price != null ? item.label + ' (+' + item.price + ')' : item.label;
    optionArr.push({
      price: item.price,
      label: label,
      value: item.product_option_id,
    });
    let last = Object.keys(productOption).length - 1;
    if (index == last) {
      return (
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          iconStyle={styles.iconStyle}
          data={optionArr}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={optionSelect}
          onChange={item => {
            setOptionSelect(item.value, item);
          }}
          renderLeftIcon={() => (
            <Icon
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      );
    }
  };

  const getDetails = () => {
    const { data } = props.route.params;
    setPrices(data.product_price);
    const id = data.id;
    logfunction('PRODUCT ID ', id);
    // getApi.postData('incrementProductView/' + id, []).then(response => {
    //   console.log(response);
    // });
    logfunction('Product detail  ', 'productDetail/' + id);
    getApi.getData('productDetail/' + id, []).then(response => {
      logfunction('RESPONSE DETAIL ', response);
      let productData = response.data;
      //product details
      let images = [];
      let zoomImages = [];
      if (productData.data.image != null) {
        images.push(
          'http://coinnow.life/public/uploads/product/' +
            productData.data.image,
        );
        zoomImages.push({
          url:
            'http://coinnow.life/public/uploads/product/' +
            productData.data.image,
        });
      } else {
        images.push(
          'http://coinnow.life/public/uploads/assets/img/default.png',
        );
        zoomImages.push({
          url: 'http://coinnow.life/public/uploads/assets/img/default.png',
        });
      }

      logfunction('OPTIONS  ', Object.keys(productData.productOptions).length);
      if (productData.productImages && productData.productImages.length > 0) {
        for (let i = 0; i < productData.productImages.length; i++) {
          images.push(
            'http://coinnow.life/public/uploads/product/' +
              productData.productImages[i].image,
          );
          zoomImages.push({
            url:
              'http://coinnow.life/public/uploads/product/' +
              productData.productImages[i].image,
          });
        }
      }

      let special = 0;

      if (productData.productSpecial != null) {
        let startDate = moment(
          productData.productSpecial.start_date,
          'DD/MM/YYYY',
        );
        let endDate = moment(productData.productSpecial.end_date, 'DD/MM/YYYY');
        logfunction('Product Special  ', productData.productSpecial);

        if (
          startDate <= moment(new Date(), 'DD/MM/YYYY') &&
          endDate >= moment(new Date(), 'DD/MM/YYYY')
        ) {
          special = productData.productSpecial.price;
        }
      }
      setState({
        ...state,
        productDetail: productData.data,
        productDescription: productData?.data?.product_description,
        productPrice: special > 0 ? special : productData.data.price,
        basePrice: special > 0 ? special : productData.data.price,
        productSpecial: special,
        productRelated: productData.reletedProducts,
        productAttributes: productData.productAttributes,
        productImages: images,
        productOption: productData.productOptions,
        zoomImages: zoomImages,
        productReview: {
          totalReview: productData.totalReviews,
          avgRating: productData.avgReview,
          star1: productData.star1,
          star2: productData.star2,
          star3: productData.star3,
          star4: productData.star4,
          star5: productData.star5,
        },
        loading: false,
      });
      logfunction('PRODUCT DETAIL ', parseFloat(productData.avgReview));
      logfunction(
        'productData.productRelatedAttribute ',
        productData.productAttributes,
      );
    });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const { width } = useWindowDimensions();
  const tagsStyles = {
    p: {
      color: Colors.white,
      fontFamily: Fonts.Font_Reguler,
      fontSize: wp('3.5%'),
      lineHeight: hp('2.4%'),
    },
  };

  return (
    <OtrixContainer
      customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}></View>
      </OtrixHeader>
      {loading ? (
        <OtrixLoader />
      ) : (
        <>
          <OtrixContent
            customStyles={styles.productDetailView}
            // action={paginate}
          >
            {/* Product Detail View */}
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ paddingHorizontal: 20, width: '50%' }}>
                {productImages && productImages.length > 0 && (
                  <SliderBox
                    images={productImages}
                    // onCurrentImagePressed={index =>
                    //   setState({ ...state, showZoom: true })
                    // }
                    style={styles.container}
                    dotColor={Colors.themeColor}
                    inactiveDotColor="#90A4AE"
                    sliderBoxHeight={hp('25%')}
                    paginationBoxVerticalPadding={20}
                    autoplay={true}
                    ImageComponentStyle={{
                      borderRadius: 15,
                      width: '50%',
                      padding: 5,
                    }}
                    circleLoop={true}
                    resizeMode={'cover'}
                    dotStyle={{
                      width: 8,
                      height: 8,
                      borderRadius: 15,
                      marginHorizontal: 0,
                      padding: 0,
                      margin: 0,
                    }}
                  />
                )}
              </View>
              <View style={{ paddingHorizontal: 20, width: '50%' }}>
                <View style={{ marginLeft: 10 }}>
                  <View
                    style={{
                      height: 25,
                    }}>
                    <Text style={[styles.headingTxt, { marginLeft: 20 }]}>
                      {productDescription?.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 68,
                      backgroundColor: '#222222',
                      borderRadius: 13,
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                    }}>
                    <Text style={styles.headingTxt}>Price</Text>
                    <View style={styles.subContainer}>
                      {productSpecial > 0 ? (
                        <View style={styles.SpcialView}>
                          <Text style={styles.price}>
                            {CURRENCY}
                            {numberWithComma(productPrice)}{' '}
                          </Text>
                          <Text style={styles.originalPrice}>
                            {CURRENCY}
                            {numberWithComma(productDetail.price)}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <View style={GlobalStyles.coinWrapper}>
                            <Image
                              source={coinImage}
                              style={[
                                GlobalStyles.coinImage,
                                { marginLeft: 6 },
                              ]}
                            />
                            <Text style={styles.price}>
                              {numberWithComma(productPrice)}{' '}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      height: 68,
                      backgroundColor: '#222222',
                      borderRadius: 13,
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                      marginTop: 10,
                    }}>
                    <Text style={styles.headingTxt}>Quantity</Text>
                    <Text style={styles.headingTxt}>
                      {productDetail.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Content Start from here */}

            <ScrollView
              style={styles.childView}
              showsVerticalScrollIndicator={false}>
              {/* Name Container*/}

              {props.userData?.clan_id &&
                props.userData?.clan?.product_id == productDetail?.id && (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      marginTop: 10,
                      marginLeft: 10,
                    }}>
                    Your Clan Price:{' '}
                    {productPrice - props.userData?.clan?.discount} coins
                  </Text>
                )}

              {/* Options And Heart Icon */}
              <View style={styles.colorView}>
                {/* Option */}
                <View style={{ flexDirection: 'column', flex: 0.85 }}>
                  {Object.keys(productOption).length > 0 &&
                    Object.keys(productOption).map((item, index) => (
                      <View key={item.toString()}>
                        <View style={styles.colorContainer}>
                          <Text style={styles.containerTxt}>{item}:</Text>
                          <ScrollView
                            ref={scrollRight}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{
                              flexDirection: 'row',
                              marginHorizontal: wp('1%'),
                            }}>
                            {productOption[item].map((childItem, index) =>
                              childItem.type == 'Color' ? (
                                <View
                                  style={{ flexDirection: 'column' }}
                                  key={childItem.product_option_id.toString()}>
                                  <TouchableOpacity
                                    style={[
                                      styles.box,
                                      { backgroundColor: childItem.color_code },
                                    ]}
                                    onPress={() => colorChange(childItem)}>
                                    {optionColor != null &&
                                      childItem.product_option_id ==
                                        optionColor && (
                                        <Image
                                          source={checkround2}
                                          style={styles.colorimageView}
                                        />
                                      )}
                                  </TouchableOpacity>
                                  {childItem.price != null && (
                                    <Text style={styles.optionPrice}>
                                      +{childItem.price}
                                    </Text>
                                  )}
                                </View>
                              ) : childItem.type == 'Radio' ||
                                childItem.type == 'Checkbox' ? (
                                <View
                                  style={{ flexDirection: 'column' }}
                                  key={childItem.product_option_id.toString()}>
                                  <TouchableOpacity
                                    style={[
                                      styles.box,
                                      styles.sizeBox,
                                      {
                                        borderColor:
                                          optionSize ==
                                          childItem.product_option_id
                                            ? Colors.themeColor
                                            : 'rgb(225, 225, 225)',
                                      },
                                    ]}
                                    key={index}
                                    onPress={() => sizeChange(childItem)}>
                                    <Text
                                      style={[
                                        styles.sizeTxt,
                                        {
                                          color: 'white',
                                        },
                                      ]}>
                                      {childItem.label}
                                    </Text>
                                  </TouchableOpacity>
                                  {childItem.price != null ? (
                                    <Text style={styles.optionPrice}>
                                      +{childItem.price}
                                    </Text>
                                  ) : null}
                                </View>
                              ) : (
                                buildSelect(childItem, index)
                              ),
                            )}
                          </ScrollView>
                          <TouchableOpacity
                            style={{ justifyContent: 'center', top: hp('1%') }}
                            onPress={() => {
                              scrollRight.current.scrollTo({ x: 1500 });
                            }}>
                            <Icon name="right" style={styles.arrowRight}></Icon>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    width: wp('90%'),
                    minHeight: productDetail.points ? 225 : 85,
                    backgroundColor: '#222222',
                    borderRadius: 13,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                  }}>
                  <Text style={[styles.headingTxt, { fontSize: wp('3.8%') }]}>
                    <Text>
                      {productDescription?.description
                        ? productDescription.description.slice(
                            3,
                            productDescription.description.length - 4,
                          )
                        : ''}
                    </Text>
                  </Text>
                </View>
              </View>
              {lineChartData &&
                lineChartData.prices &&
                !!lineChartData.prices.length && (
                  <LineChart
                    data={{
                      datasets: [
                        {
                          data: lineChartData.prices,
                          // data: [1, 2, 3],
                          color: (opacity = 1) =>
                            `rgba(134, 65, 244, ${opacity})`, // optional
                          strokeWidth: 1, // optional
                        },
                      ],
                      legend: ["Today's Price Change"],
                    }}
                    width={wp('90%')}
                    height={220}
                    chartConfig={{
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: '#08130D',
                      backgroundGradientToOpacity: 0.5,
                      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                      strokeWidth: 1, // optional, default 3
                      barPercentage: 0.5,
                      useShadowColorFromDataset: false, // optional
                      propsForDots: {
                        r: '3',
                      },
                    }}
                    decorator={() => {
                      return tooltipPos.visible ? (
                        <View>
                          <Svg>
                            <Rect
                              x={tooltipPos.x}
                              width="2"
                              height="72%"
                              fill="rgb(26, 255, 146)"
                            />
                            <TextSVG
                              x={tooltipPos.posX + 5}
                              y={200}
                              fill="rgb(26, 255, 146)"
                              fontSize="16"
                              fontWeight="bold"
                              textAnchor="middle">
                              {tooltipPos.value}
                            </TextSVG>
                            <TextSVG
                              x={tooltipPos.posX + 5}
                              y={215}
                              fill="rgb(26, 255, 146)"
                              fontSize="12"
                              textAnchor="middle">
                              {tooltipPos.created_at}
                            </TextSVG>
                          </Svg>
                        </View>
                      ) : null;
                    }}
                    onDataPointClick={data => {
                      let isSamePoint =
                        tooltipPos.x === data.x && tooltipPos.y === data.y;
                      let posX = data.x;
                      if (data.x > Dimensions.get('window').width - 105) {
                        posX = Dimensions.get('window').width - 105;
                      }
                      const created_at = moment(
                        lineChartData.created_at[data.index],
                      ).format('YYYY/MM/DD hh:mm:ss');
                      isSamePoint
                        ? setTooltipPos(previousState => {
                            return {
                              ...previousState,
                              value: data.value,
                              visible: !previousState.visible,
                              created_at: created_at,
                              posX: posX,
                            };
                          })
                        : setTooltipPos({
                            x: data.x,
                            value: data.value,
                            y: data.y,
                            visible: true,
                            created_at: created_at,
                            posX: posX,
                          });
                    }}
                  />
                )}
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 5,
                  marginTop: 10,
                }}>
                {productDetail.points ? (
                  <Text
                    style={{ color: 'white', fontSize: 10, lineHeight: 13.02 }}>
                    Power Impact: {productDetail.points}
                  </Text>
                ) : (
                  <Text
                    style={{ color: 'white', fontSize: 10, lineHeight: 13.02 }}>
                    Purchasing Power Required:{' '}
                    {productDetail.power ? productDetail.power : 0}
                  </Text>
                )}
                <LiveUpdate />
              </View>
              {!productDetail.points && (
                <View
                  style={{
                    marginTop: 20,
                  }}>
                  <BarChart
                    data={{
                      labels:
                        timelineData
                          ?.slice(0, 6)
                          .sort((a, b) => (a.date > b.date ? 1 : -1))
                          .map((p, index) =>
                            moment(p.created_at).format('hh:mma'),
                          ) || [],
                      datasets: [
                        {
                          data:
                            timelineData
                              ?.slice(0, 6)
                              .sort((a, b) => (a.date > b.date ? 1 : -1))
                              .map((p, index) => p.price || 0) || [],
                        },
                      ],
                    }}
                    width={wp('90%')}
                    height={170}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero={true}
                    withInnerLines={false}
                    showBarTops={false}
                    withHorizontalLabels={false}
                    withVerticalLabels={true}
                    showValuesOnTopOfBars={true}
                    style={{
                      padding: 0,
                      margin: 0,
                      borderRadius: 13,
                      borderBottomRightRadius: 15,
                      paddingRight: 0,
                      paddingLeft: 0,
                    }}
                    chartConfig={{
                      backgroundGradientFrom: Colors.backgroundColor_dark,
                      backgroundGradientTo: Colors.backgroundColor_dark,
                      color: () => 'white',
                      labelColor: () => 'white',
                      strokeWidth: 2,
                      propsForDots: {
                        r: '0',
                        strokeWidth: '2',
                        stroke: 'red',
                      },
                      propsForLabels: {
                        fontSize: 12,
                      },
                    }}
                  />
                </View>
              )} */}
              <View style={styles.footerView}>
                <View
                  style={{
                    flex: 0.65,
                    marginLeft: 0,
                    marginRight: 10,
                    borderRadius: 13,
                    height: 68,
                  }}>
                  <Input
                    variant=""
                    keyboardType="numeric"
                    value={quantity ? quantity.toString() : ''}
                    onChangeText={value => {
                      setQuantity(parseInt(value ? value : 0));
                      delete errors.quantity;
                    }}
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      backgroundColor: '#222222',
                      height: 68,
                      fontWeight: '700',
                      fontSize: 24,
                      lineHeight: 31.25,
                      borderRadius: 13,
                    }}
                  />
                  {'quantity' in errors && (
                    <Text style={{ color: 'red', fontSize: 10 }}>
                      {errors.quantity}
                    </Text>
                  )}
                </View>
                <Button
                  isLoading={buying}
                  size="md"
                  variant="solid"
                  bg="#222222"
                  style={[
                    GlobalStyles.button,
                    {
                      flex: 0.35,
                      marginRight: 0,
                      marginLeft: 10,
                      height: 68,
                      borderRadius: 13,
                    },
                  ]}
                  onPress={() => {
                    if (quantity <= 0 && !quantity) {
                      setErrors({
                        quantity: 'Quantity is not validated.',
                      });
                      return;
                    }
                    setUserConfirm(true);
                  }}>
                  <Text
                    style={[
                      GlobalStyles.buttonText,
                      {
                        fontWeight: '700',
                        fontSize: 30,
                        lineHeight: 39.06,
                      },
                    ]}>
                    BUY
                  </Text>
                </Button>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    width: wp('90%'),
                    backgroundColor: '#222222',
                    borderRadius: 13,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ color: '#AFB3BC', fontSize: 14 }}>
                    Median Price
                  </Text>
                  <Text style={{ color: '#AFB3BC', fontSize: 14 }}>
                    {numberWithComma(productDetail.origin_price)}
                  </Text>
                </View>
              </View>
              {/* {!productDetail.points && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: -60,
                  }}>
                  <View
                    style={{
                      flex: 0.8,
                    }}>
                    <Timeline
                      data={timelineData}
                      style={{ marginTop: 20 }}
                      titleStyle={{
                        textAlign: 'left',
                        color: '#AA98A9',
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 20.83,
                        marginTop: -10,
                        paddingBottom: 10,
                      }}
                      timeStyle={{
                        textAlign: 'right',
                        color: '#AA98A9',
                        fontWeight: '400',
                        width: 150,
                      }}
                      lineColor="#6C5B7B"
                      circleColor="#6C5B7B"
                    />
                  </View>
                  {timelineData.length ? (
                    <View
                      style={{
                        flex: 0.2,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontSize: 18,
                          color: '#6C5B7B',
                          lineHeight: 23.44,
                          width: 13,
                          textAlign: 'center',
                        }}>
                        PRICE {'  '} TREE
                      </Text>
                    </View>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              )} */}
              <OtrixDivider size="md" />

              {loader && <OtrixLoader />}
              {/* Rating Container*/}
              {/*<RatingComponent reviewData={productReview} />*/}

              {/* Similar Product Component  */}
              {productRelated.length > 0 && (
                <SimilarProduct
                  navigation={props.navigation}
                  reletedData={productRelated}
                />
              )}
            </ScrollView>
          </OtrixContent>

          {/* Zoom image */}
          <Modal visible={showZoom} transparent={true}>
            <ImageViewer
              imageUrls={zoomImages}
              saveToLocalByLongPress={false}
              backgroundColor={Colors.input_backgroundColor_dark}
              renderIndicator={(currentIndex, allSize) => {
                return (
                  <View style={styles.pageindexview}>
                    <TouchableOpacity
                      onPress={() => setState({ ...state, showZoom: false })}
                      style={{ padding: 8 }}>
                      <Image square source={close} style={styles.cancleIcon} />
                    </TouchableOpacity>
                    <Text style={styles.pageindextext}>
                      {currentIndex} / {allSize}
                    </Text>
                  </View>
                );
              }}
            />
          </Modal>

          {/* Bottom View */}

          {message != null && <OtrixAlert type={type} message={message} />}
        </>
      )}
      <ConfirmDialog
        title="Buy"
        message="Are you sure to buy?"
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
          onPress: onPressBuy,
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
    cartCount: state.cart.cartCount,
    wishlistData: state.wishlist.wishlistData,
    USER_AUTH: state.auth.USER_AUTH,
    userData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToCart,
      addToWishList,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);

const styles = StyleSheet.create({
  productDetailView: {
    backgroundColor: Colors.backgroundColor_dark,
    marginHorizontal: 0,
    borderTopRightRadius: wp('13%'),
    borderTopLeftRadius: wp('13%'),
  },
  container: {
    backgroundColor: 'black',
    width: '50%',
    height: hp('25%'),
    borderRadius: 13,
    padding: 10,
  },
  childView: {
    marginHorizontal: wp('5%'),
    paddingBottom: hp('1.8%'),
  },
  menuImage: {
    width: wp('6%'),
    height: hp('6%'),
    resizeMode: 'contain',
    tintColor: Colors.themeColor,
  },
  colorView: {
    flexDirection: 'row',
    flex: 1,
  },
  colorContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  containerTxt: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.white,
    textAlign: 'left',
  },
  box: {
    height: hp('3.5%'),
    width: wp('13%'),
    flexDirection: 'column',
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.backgroundColor_dark,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionPrice: {
    fontSize: wp('2.7%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.white,
    textAlign: 'center',
  },
  borderBox: {
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },
  colorimageView: {
    height: hp('2%'),
    width: wp('4%'),
    borderRadius: 50,
    marginHorizontal: wp('1%'),
  },
  arrowRight: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.text_color,
  },
  heartIconView: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontSize: 16,
    fontFamily: '400',
    flex: 0.8,
    color: Colors.white,
    marginLeft: 5,
  },
  subContainer: {
    flexDirection: 'row',
  },
  stock: {
    flex: 0.2,
    fontSize: wp('3%'),
    textAlignVertical: 'center',
    fontFamily: Fonts.Font_Semibold,
    textAlign: 'right',
  },
  productPrice: {
    fontSize: wp('5.5%'),
    fontFamily: Fonts.Font_Bold,
    textAlignVertical: 'center',
    color: Colors.themeColor,
    flex: 0.8,
  },
  starView: {
    flex: 0.2,
  },
  myStarStyle: {
    color: '#ffd12d',
    backgroundColor: 'transparent',
    marginHorizontal: 1,
    textShadowRadius: 1,
  },
  myEmptyStarStyle: {
    color: 'gray',
  },
  reviewTxt: {
    fontFamily: Fonts.Font_Reguler,
    fontSize: wp('2.5%'),
    marginTop: hp('0.3%'),
    textAlign: 'center',
    color: Colors.white,
  },
  description: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Reguler,
    lineHeight: hp('2.4%'),
    color: Colors.white,
  },

  footerView: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor_dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  countBox: {
    backgroundColor: Colors.input_backgroundColor_dark,
    flexDirection: 'row',
    flex: 0.2,
    height: hp('4.8%'),
    marginHorizontal: wp('1%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    borderRadius: 5,
    justifyContent: 'center',
  },
  countTxt: {
    fontSize: wp('4.5%'),
    flex: 0.6,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.text_color,
    fontFamily: Fonts.Font_Semibold,
  },
  arrowContainer: {
    flex: 0.4,
    flexDirection: 'column',
  },
  plusminusArrow: {
    fontSize: wp('5.2%'),
  },
  cancleIcon: {
    marginLeft: wp('3%'),
    height: wp('6%'),
    width: wp('6%'),
    tintColor: Colors.black,
  },
  pageindexview: {
    position: 'absolute',
    marginTop: wp('4.5%'),
    flexDirection: 'row',
  },
  sizeBox: {
    height: hp('3%'),
    width: wp('12.5%'),
    marginHorizontal: wp('1.4%'),
    backgroundColor: Colors.input_backgroundColor_dark,
  },
  sizeTxt: {
    fontSize: wp('3.5%'),
    color: Colors.white,
    fontFamily: Fonts.Font_Reguler,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  pageindextext: {
    width: wp('15%'),
    textAlign: 'center',
    fontSize: wp('4.5%'),
    color: Colors.black_text,
    marginHorizontal: wp('34%'),
  },
  dropdown: {
    height: 40,
    width: wp('60%'),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  SpcialView: {
    flex: 0.8,
    flexDirection: 'row',
  },
  originalPrice: {
    color: Colors.white,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.8%'),
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontFamily: '400',
    textAlignVertical: 'center',
    color: 'white',
  },
  headingtext: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('4%'),
    marginTop: wp('2%'),
    marginBottom: wp('2%'),
    textAlign: 'left',
    textTransform: 'uppercase',
    padding: 2,
  },
  attributeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp('1.2%'),
    paddingHorizontal: wp('3%'),
  },
  attributeTitle: {
    fontFamily: Fonts.Font_Segoe_UI_Reguler,
    fontSize: wp('4%'),
    width: wp('30%'),
    textAlign: 'left',
  },
  attributeInfo: {
    fontFamily: Fonts.Font_Segoe_UI_Reguler,
    fontSize: wp('4%'),
    width: wp('55%'),
    textAlign: 'left',
  },
});
