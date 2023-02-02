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
import { coinImage, diamond, digital } from '../../common';
import OtrixLoader from '../OtrixComponent/OtrixLoader';
import getApi from '@apis/getApi';

function ContestItem(props) {
  const { star, setMessage, stars, setStars, getContests } = props;
  const [hiring, setHiring] = useState(false);

  const hire = id => {
    setMessage(null);
    setHiring(true);
    let formData = new FormData();
    formData.append('star_id', id);
    getApi
      .postData(`seller/invest`, formData)
      .then(res => {
        setHiring(false);
        if (res.status == 1) {
          getContests();
          setMessage({ type: 'success', content: res.message });
          let temp = stars;
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].id == id) {
              temp[i].contests = [1];
              break;
            }
          }
          setStars([...temp]);
        } else {
          setMessage({ type: 'error', content: res.message });
        }
      })
      .catch(e => {
        setHiring(false);
      });
  };
  return (
    <View style={[styles.productBox]}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={[styles.imageView]}>
          <FastImage
            style={styles.image}
            source={digital}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.description}>
            <Text style={styles.name}>
              {star.firstname + ' ' + star.lastname}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <FastImage
                style={[{ height: 24, width: 24 }]}
                source={diamond}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={styles.coinText}>400</Text>
            </View>
            <Text style={styles.views}>
              {numberWithComma(star.view_counts)} views
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            {star?.contests?.length ? (
              <Text
                style={[
                  styles.buttonText,
                  { color: 'black', paddingRight: 20 },
                ]}>
                Booked
              </Text>
            ) : (
              <TouchableOpacity onPress={() => hire(star.id)}>
                <View style={styles.button}>
                  {hiring ? (
                    <OtrixLoader />
                  ) : (
                    <Text style={styles.buttonText}>Hire</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default ContestItem;

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'flex-start',
    borderRadius: 13,
    width: '100%',
    maxWidth: wp('100%'),
    backgroundColor: 'black',
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
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 23,
    marginLeft: 'auto',
  },
  coinText: {
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 16,
  },
  description: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
  },
  smText: {
    color: '#AFB3BC',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 13,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    margin: 2,
  },
  views: {
    color: '#949700',
    fontWeight: '700',
    fontSize: 12,
    margin: 2,
  },
  button: {
    width: 91,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
