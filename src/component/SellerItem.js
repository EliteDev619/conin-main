import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';

function SellerItem(props) {
  const seller = props.seller || {};
  const { firstname, lastname, telephone } = seller;
  const { setSelectedSeller, selectedSeller } = props;

  const onPress = () => {
    setSelectedSeller && setSelectedSeller(seller?.id);
  };

  const selected = seller?.id === selectedSeller;

  return (
    <Pressable
      style={[
        styles.cartContent,
        selected && { backgroundColor: Colors.dark_grey },
      ]}
      key={seller.id}
      onPress={onPress}>
      <View style={styles.cartBox}>
        <Text
          style={{
            color: selected ? Colors.white : Colors.themeColor,
            fontWeight: '700',
            marginLeft: 12,
          }}>
          {firstname} {lastname} ({telephone})
        </Text>

      </View>
    </Pressable>
  );
}

export default SellerItem;

const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    paddingVertical: 24,
    flex: 1,
  },

  infromationView: {
    flex: 1,
    marginLeft: wp('5%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
