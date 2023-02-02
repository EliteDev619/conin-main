import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { OtrixContainer, OtrixHeader } from '@component';
import { _roundDimensions } from '@helpers/util';
import getApi from '@apis/getApi';

import { Colors, GlobalStyles } from '../helpers';
import { OtrixContent, OtrixLoader } from '../component';
import * as RootNavigation from '../AppNavigator';
import { coin15 } from '../common';

function Guide(props) {
  const {
    params: { type },
  } = props.route;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const title = type => {
    switch (type) {
      case 'privacy':
        return 'Privacy Policy';
      case 'term':
        return 'Terms Of Service';
      case 'community':
        return 'Community Guidelines';
    }
  };

  const fetchData = type => {
    setLoading(true);
    getApi
      .getData(`getGuide/${type}`)
      .then(response => {
        setLoading(false);
        setData(response);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(type);
  }, []);

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => RootNavigation.navigate('ProfileScreen')}>
        <OtrixHeader
          customStyles={{
            backgroundColor: Colors.backgroundColor_dark,
            justifyContent: 'flex-start',
            padding: 20,
          }}>
          <View style={styles.headerContent}>
            <Icon name={'angle-left'} style={styles.arrowLeft} />
            <Text style={styles.title}>{title(type)}</Text>
          </View>
        </OtrixHeader>
      </TouchableOpacity>
      {loading ? (
        <OtrixLoader />
      ) : (
        <OtrixContent>
          <Image source={coin15} />
          {data.map(item => {
            return (
              <View style={styles.box}>
                <Text style={styles.boxTitle}>{item.title}</Text>
                <Text style={styles.boxContent}>{item.content}</Text>
              </View>
            );
          })}
        </OtrixContent>
      )}
    </OtrixContainer>
  );
}

export default Guide;

const styles = StyleSheet.create({
  arrowLeft: {
    color: Colors.white,
    fontSize: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 30,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
    color: Colors.white,
  },
  box: {
    backgroundColor: '#222222',
    paddingVertical: 20,
    paddingHorizontal: 30,
    margin: 5,
    borderRadius: 13,
  },
  boxTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20.83,
  },
  boxContent: {
    marginTop: 15,
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18.23,
  },
});
