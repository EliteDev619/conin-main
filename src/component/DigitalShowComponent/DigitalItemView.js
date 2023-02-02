import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';

import { numberWithComma } from '@helpers/FunctionHelper';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { ASSETS_DIR } from '@env';

function DigitalItemView(props) {
  const [selected, setSelected] = useState(false);
  const { item, setHoldItems, holdItems } = props;

  const handleSelect = () => {
    const index = holdItems.indexOf(item.id);
    if (index == -1) {
      setHoldItems(prev => [...prev, item.id]);
      setSelected(true);
    } else {
      let temp = holdItems;
      temp.splice(index, 1);
      setHoldItems([...temp]);
      setSelected(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleSelect}>
      <View
        style={[styles.productBox, selected && { backgroundColor: 'black' }]}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={[styles.imageView]}>
            <FastImage
              style={styles.image}
              source={{ uri: item.image }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.description}>
              <View>
                <Text style={styles.commentText}>
                  {item.comments_count} comments
                </Text>
                <Text style={styles.commentText}>{item.views_count} views</Text>
              </View>
              <View style={styles.heartText}>
                <Text
                  style={{
                    color: '#AFB3BC',
                    fontWeight: '700',
                    fontSize: 18,
                    textAlign: 'right',
                    lineHeight: 23,
                  }}>
                  <Icon name={'heart'} size={18} />{' '}
                  {numberWithComma(item.sellers_count)}
                </Text>
                <Text
                  style={{
                    color: '#AFB3BC',
                    fontWeight: '700',
                    fontSize: 15,
                    lineHeight: 20,
                    textAlign: 'right',
                  }}>
                  Winning Counts:{' '}
                  {numberWithComma(
                    item.winning_counts ? item.winning_counts : 0,
                  )}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.smText,
                { textAlign: 'right', paddingRight: 10, paddingBottom: 5 },
              ]}>
              Published at {moment(item.created_at).format('MMM YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default DigitalItemView;

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'flex-start',
    borderRadius: 13,
    width: '100%',
    maxWidth: wp('100%'),
    backgroundColor: '#36393E',
    height: 78,
    marginVertical: 5,
  },
  imageView: {
    backgroundColor: Colors.backgroundColor_dark,
    height: 78,
    width: 78,
    borderRadius: wp('2.5%'),
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    aspectRatio: 0.9,
    width: '94%',
  },
  heartText: {
    marginLeft: 'auto',
  },
  commentText: {
    marginTop: 10,
    color: '#AFB3BC',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
  },
  description: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    marginTop: 0,
  },
  smText: {
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 13,
  },
});
