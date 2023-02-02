import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';

function HomeCategory(props) {
  return (
    <View>
      <View style={styles.catHeading}>
        <View style={GlobalStyles.boxHeading}>
          <Text style={{ color: Colors.white }}>Item Categories</Text>
        </View>
        <TouchableOpacity
          style={{ flex: 0.5 }}
          onPress={() => props.navigation.navigate('Categories')}>
          <Text style={GlobalStyles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ padding: wp('1%') }}
        data={props.data}
        contentContainerStyle={{ paddingRight: wp('3%') }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.7}
        keyExtractor={(contact, index) => String(index)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.catBox}
            key={item.id}
            onPress={() => {
              props.navigation.navigate('ProductListScreen', {
                type: 'category',
                id: item.category_id,
                childerns: item.children != undefined ? item.children : [],
                title: item.category_description?.name,
                description: item.category_description?.meta_description,
              });
            }}>
            <View>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri:
                      'http://coinnow.life/public/uploads/category/' +
                      item.image,
                  }}
                  style={styles.imageView}
                  resizeMode="cover"
                />
              </View>
              <Text numberOfLines={2} style={styles.catName}>
                {item.category_description?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default HomeCategoryView = React.memo(HomeCategory);

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  catBox: {
    height: hp('12.5%'),
    width: wp('15%'),
    marginHorizontal: wp('1.5%'),
  },
  imageContainer: {
    backgroundColor: Colors.categoryBG,
    height: hp('7.5%'),
    borderRadius: 10,
  },
  imageView: {
    resizeMode: 'cover',
    alignSelf: 'center',
    height: hp('8%'),
    width: wp('15.5%'),
    borderRadius: 6,
  },
  catName: {
    fontSize: wp('3%'),
    fontFamily: Fonts.Font_Reguler,
    textAlign: 'center',
    color: Colors.white,
    marginTop: 4,
  },
});
