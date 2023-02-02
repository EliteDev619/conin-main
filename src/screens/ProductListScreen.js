import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixLoader,
  OtrixDivider,
  FlatListProductView,
  OtirxBackButton,
  OtrixNotfoundComponent,
  FilterTags,
  FilterComponent,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { addToWishList } from '@actions';
import { emptyBox } from '@common/config';
import { bindActionCreators } from 'redux';
import { filter } from '@common';
import {
  _addToWishlist,
  _getWishlist,
  logfunction,
} from '@helpers/FunctionHelper';
import { ProductListSkeleton } from '@skeleton';
import getApi from '@apis/getApi';
import { useFocusEffect } from '@react-navigation/native';
import { echo } from '../redux/Api/echo';
import { LiveUpdate } from '../component';

function ProductListScreen(props) {
  const { title, id, type, childerns, productList, description } =
    props.route.params;
  const [state, setState] = React.useState({
    data: [],
    loader: false,
    currentPage: 1,
    totalPages: 1,
    childCategories: childerns != undefined ? childerns : [],
    selectedTag: id,
    selectedFilters: [id],
    wishlistArr: [],
    filterModelVisible: false,
    loading: true,
    filterLoading: false,
    filterPrice: null,
    filterPriceRange: null,
    filterRating: null,
    filterAplied: false,
  });
  const {
    selectedFilters,
    selectedTag,
    filterPrice,
    filterPriceRange,
    filterRating,
    data,
    totalPages,
    loading,
    loader,
    filterModelVisible,
    currentPage,
    childCategories,
    headingTitle,
    filterAplied,
  } = state;

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', res => {
      if (res.sender == 'price update') {
        let { data } = state;
        for (let i = 0; i < data?.length; i++) {
          if (data[i].id == res.receiver.id) {
            data[i].price = res.receiver.price;
            data[i].product_price = res.receiver.productPrice;
            setState({
              ...state,
              data,
            });
            return;
          }
        }
      }
    });
    return () => echo.channel('chat-channel').stopListening('.message.new');
  });

  const fetchData = (
    ID,
    page,
    filterApplied = false,
    range,
    fprice = null,
    frating = null,
  ) => {
    let url = '';
    if (type == 'category') {
      url = 'getProductByCategory/' + ID + '?page=' + page;
    } else if (type == 'menufacturer') {
      url = 'getProductByManufacturer/' + ID + '?page=' + page;
    }

    //add filter to url
    if (filterApplied == true && fprice != null) {
      logfunction('PRICE IN ', fprice);
      url = url + '&filterPrice=' + fprice;
    }
    if (filterApplied == true && range != null && range.min != 40) {
      url = url + '&filterPriceRange=' + range.min + ',' + range.max;
    }
    if (filterApplied == true && frating != null) {
      url = url + '&filterRating=' + frating;
    }
    if (type === 'newProduct') {
      url = `getNewProductsV1?page=${page}`;
    }

    if (type === 'trending') {
      url = `getTrendingProductsV1?page=${page}`;
    }

    logfunction('URL  HERE YES', url);
    logfunction('FILTER ', filterApplied);

    try {
      getApi.getData(url, []).then(response => {
        if (response.status == 1) {
          logfunction('PRODUUC RESPONSE ', response);

          setState(prevstate => ({
            ...prevstate,
            data:
              filterApplied == true
                ? response.productsList.data
                : [...prevstate.data, ...response.productsList.data],
            selectedTag: ID,
            filterPriceRange: range,
            totalPages: response.productsList.last_page,
            loading: false,
            loader: false,
          }));
        }
      });
    } catch (error) {}
  };

  //fetch data fro new,deals of the day and trending products
  const fetchDataForNDT = url => {
    logfunction('PRODUCT LIST ', url);
    getApi.getData(url, []).then(response => {
      if (response.status == 1) {
        logfunction('PRODUUCT RESPONSE ', response);
        setState(prevstate => ({
          ...prevstate,
          data: response.data,
          loading: false,
          loader: false,
        }));
      }
    });
  };

  //when filter tag clicked
  const filterClick = (type, value) => {
    logfunction('type ', type);
    logfunction('value ', value);

    if (type == 'price') {
      setState({
        ...state,
        filterPrice: value,
      });
    }
    if (type == 'rating') {
      setState({
        ...state,
        filterRating: value,
      });
    }
  };

  //when Category  clicked
  const onCategoryClick = (type, value) => {
    let title = headingTitle;
    if (value != id) {
      logfunction('childCategories ', childCategories);
      logfunction('Value ', value);
      let index = childCategories.findIndex(c => c.category_id === value);
      logfunction('index ', index);
      title = childCategories[index].category_description?.name;
    }
    logfunction('title ', title);

    setState({
      ...state,
      title: title,
      data: [],
      currentPage: 1,
    });

    fetchData(value, 1);
  };

  const addToWishlist = async id => {
    logfunction('IDD ', id);
    if (props.USER_AUTH == true) {
      let wishlistData = await _addToWishlist(id);
      props.addToWishList(wishlistData, id);
    } else {
      props.navigation.navigate('LoginScreen', { backToPrevious: 1 });
    }
  };

  const paginate = () => {
    if (totalPages > 1 && currentPage <= totalPages) {
      setState({
        ...state,
        loader: true,
        currentPage: currentPage + 1,
      });
      fetchData(id, currentPage + 1);
    }
  };

  const applyFilter = val => {
    setState({
      ...state,
      // filterPriceRange: val,
      filterAplied: true,
      filterModelVisible: false,
      data: [],
      currentPage: 1,
      loading: true,
    });
    setTimeout(() => {
      fetchData(id, 1, true, val, filterPrice, filterRating);
    }, 300);
  };

  const closeFilterModel = clearFilter => {
    logfunction('CLEAR ', clearFilter);
    if (clearFilter) {
      setState({
        ...state,
        filterPrice: null,
        filterRating: null,
        filterModelVisible: false,
        filterAplied: false,
        loading: true,
        currentPage: 1,
        data: [],
      });
      setTimeout(() => {
        fetchData(id, 1, false);
      }, 300);
    } else {
      setState({
        ...state,
        filterModelVisible: false,
      });
    }
  };

  useEffect(() => {
    switch (type) {
      case 'category':
        fetchData(id, 1);
        break;
      case 'menufacturer':
        fetchData(id, 1);
        break;
      case 'newProduct':
        //fetchDataForNDT('getNewProducts');
        fetchData('', 1);
        break;
      case 'dealsoftheday':
        fetchDataForNDT('getDODProducts');
        break;
      case 'trending':
        //fetchDataForNDT('getTrendingProducts');
        fetchData('', 1);
        break;
      default:
        fetchData(id, 1);
        break;
    }
  }, []);

  const renderFooter = () => {
    return (
      //Footer View
      <View>
        {loader && <OtrixLoader />}
        <OtrixDivider size={'sm'} />
      </View>
    );
  };

  const { wishlistData } = props;

  return (
    <OtrixContainer
      customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
      {/* Header */}
      <OtrixHeader
        customStyles={{ backgroundColor: Colors.backgroundColor_dark }}>
        <TouchableOpacity
          style={[GlobalStyles.headerLeft, { flexShrink: 1, marginLeft: 0 }]}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter]}>
          <Text style={GlobalStyles.headingTxt}>{title}</Text>
        </View>
        {/*{type == 'category' || type == 'menufacturer' ? (*/}
        {/*  <TouchableOpacity*/}
        {/*    style={GlobalStyles.headerRight}*/}
        {/*    onPress={() => setState({ ...state, filterModelVisible: true })}>*/}
        {/*    <Image source={filter} style={styles.filter} />*/}
        {/*  </TouchableOpacity>*/}
        {/*) : (*/}
        {/*  <View style={{ flex: 0.1 }} />*/}
        {/*)}*/}
        <LiveUpdate />
      </OtrixHeader>
      <View
        style={{
          backgroundColor: '#222222',
          borderRadius: 13,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginHorizontal: 20,
        }}>
        <Text
          style={{
            color: 'white',
          }}>
          {description}
        </Text>
      </View>

      <OtrixDivider size={'sm'} />
      {/* Horizontal Tag List */}
      {childCategories.length > 0 && (
        <View style={{ height: hp('6%') }}>
          <ScrollView
            style={{ flexDirection: 'row', marginHorizontal: wp('1%') }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FilterTags
              tagName={title}
              type={'tag'}
              tagID={id}
              key={id.toString()}
              selected={selectedTag}
              onFilterPress={onCategoryClick}
            />
            {childCategories.map((item, index) => (
              <FilterTags
                type={'tag'}
                tagName={item.category_description?.name}
                tagID={item.category_id}
                key={item.category_id.toString()}
                selected={selectedTag}
                onFilterPress={onCategoryClick}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content Start from here */}
      {loading ? (
        <ProductListSkeleton />
      ) : (
        <View style={styles.content}>
          {data.length > 0 ? (
            <FlatList
              style={{ padding: wp('1%') }}
              data={data}
              horizontal={false}
              numColumns={2}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              ListFooterComponent={renderFooter}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={({ item, index }) => (
                <FlatListProductView
                  data={item}
                  key={item.id}
                  imageViewBg={Colors.backgroundColor_dark}
                  navToDetail={() => {
                    props.navigation.navigate('ProductDetailScreen', {
                      data: item,
                    });
                  }}
                  addToWishlist={() => addToWishlist}
                  wishlistArray={wishlistData}
                  customerData={props.customerData}
                />
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          ) : (
            <OtrixNotfoundComponent
              image={emptyBox}
              title={'Product not found!'}
            />
          )}
        </View>
      )}
      {/* Fitler Model Start From Here */}
      <Modal visible={filterModelVisible}>
        <FilterComponent
          selectedFilter={selectedFilters}
          applyFilter={applyFilter}
          onFilterPress={filterClick}
          closeFilter={closeFilterModel}
          filterPriceVal={filterPrice}
          filterRatingVal={filterRating}
          filterPriceRangeVal={filterPriceRange}
        />
      </Modal>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    wishlistData: state.wishlist.wishlistData,
    USER_AUTH: state.auth.USER_AUTH,
    customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToWishList,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProductListScreen);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: wp('3%'),
  },

  menuImage: {
    width: wp('5%'),
    height: hp('4%'),
    tintColor: Colors.secondry_text_color,
  },

  filter: {
    height: _roundDimensions()._height * 0.028,
    width: _roundDimensions()._height * 0.028,
  },
  bannerStyle: {
    resizeMode: 'contain',
    width: wp('100%'),
    height: hp('16%'),
    alignSelf: 'center',
  },
  modelView: {
    height: hp('100%'),
    width: wp('100%'),
    backgroundColor: Colors.backgroundColor_dark,
  },
});
