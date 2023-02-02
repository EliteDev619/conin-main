import moment from 'moment';
import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import { ASSETS_DIR } from '@env';
import FastImage from 'react-native-fast-image';

function ContestWrapper(props) {
  const { contest } = props;
  const started_at = moment(contest.started_at);
  const ended_at = moment(contest.ended_at);
  const digitals = contest?.digitals?.sort(
    (a, b) => b.view_counts - a.view_counts,
  );
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Contest {contest.id}</Text>
        {contest.status == 1 ? (
          <Text style={styles.time}>
            contest ends in {ended_at.diff(started_at, 'days')}
            {' Days'}
          </Text>
        ) : contest.status == 0 ? (
          <Text style={[styles.time, { color: '#0047FF' }]}>Starts soon</Text>
        ) : (
          <Text style={[styles.time, { color: '#B10000' }]}>Contest ended</Text>
        )}
      </View>
      <ScrollView horizontal={true}>
        {Array(8)
          .fill()
          .map((val, index) => {
            if (digitals[index]) {
              const uri = contest?.digitals[index]?.image;
              return (
                <View
                  style={{ width: 78, marginHorizontal: 10 }}
                  key={contest?.digitals[index]?.id + '-' + contest?.id}>
                  <FastImage
                    style={{ height: 78, width: 78 }}
                    source={{
                      uri: uri,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 16,
                    }}>
                    {contest?.digitals[index]?.view_counts}
                  </Text>
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    width: 78,
                    marginHorizontal: 10,
                    backgroundColor: '#222222',
                    height: 78,
                    borderRadius: 13,
                  }}></View>
              );
            }
          })}
      </ScrollView>
    </View>
  );
}

export default ContestWrapper;
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
  },
  time: {
    color: '#949700',
    fontSize: 12,
  },
});
