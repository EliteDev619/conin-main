import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixContent,
  OtrixDivider,
  HomeCategoryView,
  NewProduct,
} from '@component';
import { HomeSkeleton } from '@skeleton';
import { addToWishList } from '@actions';
import { bindActionCreators } from 'redux';
import { _roundDimensions } from '@helpers/util';
import { _addToWishlist, logfunction } from '@helpers/FunctionHelper';
import getApi from '@apis/getApi';
import { SliderBox } from 'react-native-image-slider-box';
import { useFocusEffect } from '@react-navigation/native';
import { LiveUpdate, OtrixLoader } from '../component';
import { setNewProducts } from '../redux/Action/general';
function SupplierPage(props) {
  const [state, setState] = React.useState({
    homePageData: [],
    loading: true,
    profileImageURL: null,
  });
  const { setNewProducts, newProducts } = props;
  const [loading1, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [images, setImages] = React.useState([]);

  const addToWish = async id => {
    let wishlistData = await _addToWishlist(id);
    props.addToWishList(wishlistData, id);
  };

  const fetchData = page => {
    return getApi
      .getData(`getNewProductsV1?page=${page}`)
      .then(response => {
        setLoading(false);
        if (response.status == 1) {
          setCurrentPage(response.productsList.current_page);
          setTotalPage(response.productsList.last_page);
          if (page == 1) {
            setNewProducts(response.productsList.data);
            return;
          } else {
            setNewProducts([...newProducts, ...response.productsList.data]);
          }
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };
  useFocusEffect(
    useCallback(() => {
      if (props.product) {
        if (props.product.id == 'all') {
          fetchData(1).then(() => {
            props.setNewProduct(null);
          });
          return;
        }
        for (let i = 0; i < newProducts?.length; i++) {
          if (newProducts[i].id == props.product.id) {
            newProducts[i].price = props.product.price;
            newProducts[i].product_price = props.product.productPrice;
            setNewProducts([...newProducts]);
            return;
          }
        }
      }
    }, [props.product]),
  );

  useEffect(() => {
    console.log('component will mount');
    getApi.getData('getBannerImages').then(response => {
      const imgs = response.images.map(image => {
        return 'http://coinnow.life/uploads/banner/' + image.image;
      });
      setImages(imgs);
    });
    fetchData(1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getApi
        .getData('getHomePage', [])
        .then(response => {
          if (response.status == 1) {
            logfunction('RESPONSEEE ', response);
            setState({
              ...state,
              homePageData: response.data,
              loading: false,
            });
          }
        })
        .catch(err => {
          setState({
            ...state,
            loading: false,
          });
        });
    }, []),
  );

  const paginate = () => {
    console.log(currentPage, totalPage, loading);
    if (loading1) return;
    if (currentPage < totalPage && totalPage > 1) {
      setLoading(true);
      fetchData(currentPage + 1);
    }
    return;
  };

  const { homePageData, loading } = state;
  const { wishlistData, customerData } = props;
  logfunction('profile Image ', customerData);
  logfunction('wishlistData wishlistData ', wishlistData);
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#0A0A0A' }}>
      {loading ? (
        <HomeSkeleton />
      ) : (
        <OtrixContent action={paginate}>
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

          <HomeCategoryView
            navigation={props.navigation}
            data={homePageData.categories}
          />
          <LiveUpdate />

          <NewProduct
            navigation={props.navigation}
            wishlistArr={wishlistData}
            data={newProducts.length > 0 ? newProducts : []}
            arr={newProducts}
            addToWishlist={addToWish}
            userAuth={props.USER_AUTH}
            customerData={props.customerData}
          />

          {loading1 && <OtrixLoader />}
        </OtrixContent>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    USER_AUTH: state.auth.USER_AUTH,
    wishlistData: state.wishlist.wishlistData,
    wishlistCount: state.wishlist.wishlistCount,
    customerData: state.auth.USER_DATA,
    newProducts: state.cart.newProducts,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToWishList,
      setNewProducts,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SupplierPage);
