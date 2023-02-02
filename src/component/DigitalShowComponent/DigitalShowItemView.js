import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import { ASSETS_DIR } from '@env';
import { Flex, Button } from 'native-base';
import getApi from '@apis/getApi';
import {
  numberWithComma,
  commentIcon,
  investIcon,
  investOnIcon,
} from '../../common';
import { ConfirmDialog } from 'react-native-simple-dialogs';

// const video = {
//   // uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   uri: 'https://res.cloudinary.com/snaplist/video/upload/v1669984258/temporary/products/contest_elzoot.mp4',
//   type: 'mp4',
// };

function DigitalShowItemView(props) {
  const { item, index, data, setData, height } = props;
  const [booked, setBooked] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState(null);
  const [play, setPlay] = useState(false);
  let player = useRef(null);
  useEffect(() => {
    play && setPlay(false);
    if (props?.current?.index === index) {
      player?.seek(0);
      setPlay(true);
    }
  }, [props?.current?.index]);
  useEffect(() => {
    setBooked(!!item?.contests?.length);
  }, [item]);

  const windowWidth = Dimensions.get('window');
  const video = React.useMemo(() => {
    if (item.image) {
      return {
        uri: item.image,
        // uri: 'https://res.cloudinary.com/snaplist/video/upload/v1669984258/temporary/products/contest_elzoot.mp4',
        type: 'mp4',
      };
    }
  }, [item.image]);
  const hire = id => {
    let formData = new FormData();
    formData.append('digital_id', id);
    getApi
      .postData(`seller/invest`, formData)
      .then(res => {
        if (res.status == 1) {
          setBooked(true);
        }
        setMessage(res.message);
      })
      .catch(e => {});
  };

  const toogleVoteImage = () => {
    // Vibration.vibrate();
    let formData = new FormData();
    formData.append('id', item?.id);
    let temp = [...data];
    if (
      temp[index] &&
      temp[index].sellers &&
      temp[index].sellers[0] &&
      temp[index].sellers[0]?.pivot?.heart == '0'
    ) {
      temp[index] = {
        ...temp[index],
        sellers: [
          {
            pivot: {
              heart: '1',
            },
          },
        ],
      };
    } else {
      temp[index] = {
        ...temp[index],
        sellers: [
          {
            pivot: {
              heart: '0',
            },
          },
        ],
      };
    }
    setData([...temp]);
    getApi
      .postData('seller/image/toogleVoteImage', formData)
      .then(res => {})
      .catch(e => {});
  };

  const onPressBuy = id => {
    setConfirm(false);
    hire(id);
  };

  return (
    <View>
      <View style={[styles.imageBox, { height: height }]}>
        <Video
          source={video} // Can be a URL or a local file.
          ref={ref => {
            player = ref;
          }} // Store reference
          controls={false}
          autoplay={play}
          repeat={true}
          paused={!play}
          resizeMode="cover"
          // onBuffer={this.onBuffer} // Callback when remote video is buffering
          onError={error => {
            console.log(error);
          }} // Callback when video cannot be loaded
          style={{ width: windowWidth.width, height: height }}
        />
      </View>
      <View style={[styles.actionBox]}>
        <Flex
          direction="row"
          justify={'space-between'}
          marginTop={2}
          style={{ width: windowWidth.width }}>
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
          <View style={{ paddingRight: 10 }}>
            <Button style={styles.button} onPress={toogleVoteImage}>
              <Icon
                style={[
                  styles.heart,
                  {
                    color:
                      item?.sellers[0]?.pivot?.heart == '1'
                        ? 'rgba(255, 0, 0, 0.8)'
                        : 'rgba(249, 249, 249, 0.8)',
                  },
                ]}
                name="heart"
                size={23}
              />
            </Button>
            <Button
              style={[styles.button, { marginBottom: 30 }]}
              onPress={() => {
                props.navigate('DigitalStudioCommentScreen', {
                  image_id: item.id,
                  currentPage: props.currentPage,
                });
              }}>
              <Image source={commentIcon} style={{ width: 25, height: 25 }} />
            </Button>
            {booked ? (
              <Button style={styles.button} onPress={() => {}}>
                <Image
                  source={investOnIcon}
                  style={{ width: 25, height: 25, opacity: 0.9 }}
                />
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '700',
                    fontSize: 4,
                    textAlign: 'center',
                  }}>
                  Booked
                </Text>
              </Button>
            ) : (
              <Button style={styles.button} onPress={() => setConfirm(true)}>
                <Image
                  source={investIcon}
                  style={{ width: 25, height: 25, opacity: 0.9 }}
                />
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '700',
                    fontSize: 4,
                    textAlign: 'center',
                  }}>
                  INVEST
                </Text>
              </Button>
            )}
          </View>
        </Flex>
        <Text style={styles.owner}>
          {item?.owner?.firstname + ' ' + item?.owner?.lastname}
        </Text>
      </View>
      <Text style={styles.views}>{numberWithComma(item?.views_count)}</Text>
      <ConfirmDialog
        title="Invest"
        message="Are you sure to invest?"
        onTouchOutside={() => setConfirm(false)}
        visible={confirm}
        negativeButton={{
          title: 'NO',
          onPress: () => setConfirm(false),
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
          onPress: () => {
            onPressBuy(item?.id);
          },
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
      <ConfirmDialog
        title="Alert"
        message={message}
        onTouchOutside={() => setMessage(null)}
        visible={!!message}
        positiveButton={{
          title: 'Close',
          onPress: () => setMessage(null),
          titleStyle: {
            // color: "red",
            colorDisabled: 'aqua',
          },
        }}
      />
    </View>
  );
}

export default DigitalShowItemView;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 8,
    margin: 4,
    opacity: 0.9,
  },
  heart: {
    color: 'rgb(249, 249, 249)',
  },
  message: {
    color: '#292B2E',
  },
  owner: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    margin: 5,
    textAlign: 'right',
    paddingRight: 10,
  },
  comment: {
    color: 'white',
    fontWeight: '400',
    fontSize: 10,
  },
  imageBox: {
    display: 'flex',
    position: 'relative',
    // height: '100%',
  },
  actionBox: {
    position: 'absolute',
    top: '60%',
    left: 0,
  },
  views: {
    position: 'absolute',
    top: '10%',
    color: 'white',
    right: '5%',
    fontWeight: '700',
    fontSize: 18,
  },
});
