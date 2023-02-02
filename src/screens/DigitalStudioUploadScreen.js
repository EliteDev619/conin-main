import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Flex, Button, FormControl, TextArea } from 'native-base';

import {
  OtirxBackButton,
  OtrixAlert,
  OtrixContainer,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import { Colors, GlobalStyles } from '../helpers';
import getApi from '@apis/getApi';
export default function DigitalStudioUploadScreen(props) {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [comment, setComment] = useState('');

  const { open } = state;

  const handleSubmit = async () => {
    if (!response) {
      if (!response) {
        setErrors(prev => ({
          ...prev,
          image: 'Video must be required.',
        }));
      }
      return;
    }
    if (response?.assets[0]?.duration > 20) {
      setErrors(prev => ({
        ...prev,
        image: 'Video must be less than 20s.',
      }));
      return;
    }
    setErrors({});
    setLoading(true);
    setMessage('');
    const uploadedVideoUrl = await getApi.uploadToCloudinary(
      {
        name: 'contest.mp4',
        type: response?.assets[0].type,
        uri: response?.assets[0].uri,
      },
      'temporary/test',
      true,
    );
    let formData = new FormData();

    formData.append('image', uploadedVideoUrl);
    formData.append('comment', comment ? comment : ' ');
    getApi
      .postData('seller/image/upload', formData)
      .then(res => {
        if (res.status == 1) {
          setMessage(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('DigitalStudioScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Back</Text>
        </View>
      </OtrixHeader>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {response?.assets &&
          response?.assets.map(({ uri }) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{ width: 200, height: 200 }}
                source={{ uri: uri }}
              />
            </View>
          ))}
        <Provider>
          <Portal>
            <FAB.Group
              fabStyle={styles.fab}
              open={open}
              icon={open ? 'minus' : 'plus'}
              actions={[
                // {
                //   icon: 'camera',
                //   small: false,
                //   onPress: () => {
                //     launchCamera(
                //       {
                //         saveToPhotos: true,
                //         mediaType: 'photo',
                //         includeBase64: true,
                //       },
                //       setResponse,
                //     );
                //   },
                // },
                {
                  icon: 'image-area',
                  small: false,
                  onPress: () => {
                    launchImageLibrary(
                      {
                        selectionLimit: 0,
                        mediaType: 'video',
                      },
                      setResponse,
                    );
                  },
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        </Provider>
        <FormControl isRequired isInvalid={'image' in errors}>
          {'image' in errors && (
            <FormControl.ErrorMessage style={{ margin: 10 }}>
              {errors.image}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <FormControl isRequired isInvalid={'comment' in errors}>
          <TextArea
            placeholder="caption"
            style={styles.textarea}
            placeholderTextColor={Colors.input_fontColor_dark}
            value={comment}
            keyboardType="twitter"
            h={110}
            borderWidth={0}
            borderBottomWidth={0.5}
            borderColor="rgba(209, 209, 209, 0.17)"
            onChangeText={val => {
              setComment(val);
              if (!val)
                setErrors({
                  ...errors,
                  comment: 'Comment is required',
                });
              else {
                setErrors({});
              }
            }}></TextArea>
          <Flex direction="row" align="center" mt={2}>
            {'comment' in errors && (
              <FormControl.ErrorMessage>
                {errors.comment}
              </FormControl.ErrorMessage>
            )}
          </Flex>
        </FormControl>
      </View>
      <Flex direction="row" align="center" mt={2} style={styles.postBox}>
        {loading ? (
          <OtrixLoader />
        ) : (
          <Button
            onPress={handleSubmit}
            backgroundColor={'#222222'}
            style={styles.post}>
            <Text
              style={{
                color: '#AFB3BC',
                margin: 20,
                fontWeight: '700',
                fontSize: 16,
              }}>
              Post
            </Text>
          </Button>
        )}
      </Flex>
      {!!message && <OtrixAlert message={message} />}
    </OtrixContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#EA5B70',
  },
  textarea: {
    fontFamily: 'DM Sans',
    backgroundColor: Colors.input_backgroundColor_dark,
    fontSize: 14,
    lineHeight: 18.23,
    letterSpacing: 1,
    borderRadius: 10,
    color: Colors.input_fontColor_dark,
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  commentBox: {
    height: 166,
    backgroundColor: '#36393E',
    borderRadius: 13,
    padding: 10,
    marginTop: 15,
    margin: 20,
  },
  post: {
    borderRadius: 13,
    width: '100%',
  },
  postBox: {
    padding: 10,
  },
});
