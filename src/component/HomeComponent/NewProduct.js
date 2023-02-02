import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import ProductView from '../ProductCompnent/ProductView';
import { logfunction } from '@helpers/FunctionHelper';

function Product(props) {
  const navigateToDetailPage = data => {
    props.navigation.navigate('ProductDetailScreen', { data: data });
  };

  const navigateToLoginPage = data => {
    props.navigation.navigate('LoginScreen', {});
  };

  const addToWishlist = id => {
    props.addToWishlist(id);
  };

  const { wishlistArr } = props;

  const renderCard = item => {
    return (
      <View style={styles.productBox} key={item.id.toString() + 'itemshop'}>
        <ProductView
          data={item}
          navToDetail={navigateToDetailPage}
          navToLogin={navigateToLoginPage}
          userAuth={props.userAuth}
          addToWishlist={addToWishlist}
          wishlistArray={wishlistArr}
          customerData={props.customerData}
        />
      </View>
    );
  };

  return (
    <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {props?.data?.length > 0 &&
          props?.data?.map((item, index) => {
            return renderCard(item);
          })}
      </View>
    </>
  );
}

export default React.memo(Product);

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  catBox: {
    height: hp('12.5%'),
    width: wp('15%'),
    marginHorizontal: wp('1%'),
    borderRadius: 5,
  },
  productBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'Colors.white',
    // shadowColor: 'grey',
    // shadowOffset: { width: 0, height: 0.4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    elevation: 6,
    // width: '100%',
    marginBottom: wp('3%'),
    borderRadius: wp('5%'),
    // paddingBottom: hp('1%'),
  },
});
