import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { OtrixContainer, OtrixContent, OtrixAlert } from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import {
  doLogout,
  setProfileButtonImages,
  setProfileSpecialItems,
} from '@actions';
import { coinImage, digital, contestIcon, cameraIcon } from '@common';
import Fonts from '@helpers/Fonts';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-root-toast';
import getApi from '@apis/getApi';
import { useFocusEffect } from '@react-navigation/native';
import { echo } from '../redux/Api/echo';
import { dateToFromNowDaily } from '../helpers/FunctionHelper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as RootNavigation from '../AppNavigator';
import { OtrixLoader } from '../component';

const { width } = Dimensions.get('window');

function ProfileScreen(props) {
  const [state, setState] = useState({
    profileImage: null,
    profileImageURL: null,
    type: 'error',
    message: null,
  });
  // const [specialItems, setSpecialItems] = useState([]);
  const [showMessage, setShowLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState({});
  const { buttonImages, setButtonImages, specialItems, setSpecialItems } =
    props;

  const mode = authData?.mode;
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setLoading(true);
      if (props.customerData) {
        getProfile();
      }
      fetchData().then(() => setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let image = null;
    if (authData && authData.image != null) {
      if (authData.creation == null || authData.creation == 'D') {
        image = 'http://coinnow.life/public/uploads/user/' + authData.image;
      } else {
        image = authData.image;
      }
    }
    setState({
      ...state,
      profileImageURL: image,
    });
  }, [profileImage]);

  const getProfile = () => {
    getApi.getData('seller/getSeller', []).then(response => {
      console.error('response', response);
      if (response.status === 1) {
        setAuthData(response.data);
        setSpecialItems(response.specials || []);
      }
    });
  };

  const fetchData = () => {
    return getApi
      .getData(
        `seller/chat/getMessagesByReceiver?receiver=${props.customerData.id}`,
      )
      .then(res => {
        setMessages(res);
      });
  };

  const onLogout = () => {
    props.doLogout();
    getApi.getData('seller/logout', []).then(response => {});
    Toast.show('Successfully Logout', {
      duration: 2000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  useFocusEffect(() => {
    echo.channel('chat-channel').listen('.message.new', data => {
      if (data.receiver == authData.id) {
        fetchData();
      }
    });
    return () => echo.channel('chat-channel').stopListening('.message.new');
  });

  const handleChange = value => {
    setUsername(value);
    getApi.getData(`seller/chat/users?user=${value}`).then(res => {
      setUsers(res);
    });
  };

  const { profileImage, profileImageURL, type, message } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: '#0A0A0A' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity
          style={{
            marginTop: 15,
            backgroundColor: 'black',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Image
            source={digital}
            style={{ height: 80, width: 80, borderRadius: 40 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'flex-start',
            marginTop: 15,
            backgroundColor: 'black',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 15,
            width: '70%',
          }}
          onPress={() => props.navigation.navigate('BalanceHistory')}>
          <Text
            style={{
              fontSize: 16,
              color: '#D2D2D2',
              textTransform: 'uppercase',
            }}>
            {authData && authData.firstname} {authData && authData.lastname}
          </Text>
          <Text style={[{ color: '#D2D2D2', fontSize: 12, lineHeight: 14.02 }]}>
            {authData && authData.email}
          </Text>
          <View style={[GlobalStyles.coinWrapper]}>
            <Image
              source={coinImage}
              style={[GlobalStyles.coinImage, { width: 24, height: 24 }]}
            />
            <Text
              style={[
                styles.itemText,
                {
                  fontSize: 18,
                  color: '#D2D2D2',
                  marginBottom: 5,
                },
              ]}>
              {authData?.balance || 0}
            </Text>
          </View>
          {authData?.verified ? (
            <View
              style={{
                backgroundColor: '#33AFA95',
                padding: 4,
                borderRadius: 5,
              }}>
              <Text style={{ color: 'black' }}>Verified</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
      {/* <View style={styles.container}>
            <OtrixDivider size={'sm'} />
            <View style={styles.itemsWrapper}>
              <TouchableOpacity
                style={[
                  styles.itemContainer1,
                  { height: 70, backgroundColor: '#222222' },
                ]}
                onPress={() => props.navigation.navigate('BalanceHistory')}>
                <View style={GlobalStyles.coinWrapper}>
                  <Image
                    source={coinImage}
                    style={[
                      GlobalStyles.coinImage,
                      { marginLeft: 6, width: 45, height: 45 },
                    ]}
                  />
                  <Text style={styles.itemText}>
                    {authData?.balance || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}
      <View style={{ paddingHorizontal: 15 }}>
        <ScrollView horizontal={true}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('SendCoin')}>
            <Text style={styles.linkText}>Send Coin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('Inventory')}>
            <Text style={styles.linkText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('news')}>
            <Text style={styles.linkText}>News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('BalanceHistory')}>
            <Text style={styles.linkText}>Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('History')}>
            <Text style={styles.linkText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('Expenses')}>
            <Text style={styles.linkText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('Earnings')}>
            <Text style={styles.linkText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('CommentScreen')}>
            <Text style={styles.linkText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              props.navigation.navigate('Guide', { type: 'privacy' })
            }>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              props.navigation.navigate('Guide', { type: 'term' })
            }>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              props.navigation.navigate('Guide', { type: 'community' })
            }>
            <Text style={styles.linkText}>Community Guidelines</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('EditProfileScreen')}>
            <Text style={styles.linkText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('ChangePasswordScreen')}>
            <Text style={styles.linkText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => props.navigation.navigate('SecurityQuestionScreen')}>
            <Text style={styles.linkText}>Security Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: '#FF0000' }]}
            onPress={onLogout}>
            <Text style={styles.linkText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}>
        {messages && messages.length
          ? messages.map(item => (
              <TouchableOpacity
                onPress={() =>
                  RootNavigation.navigate('DMChat', {
                    receiver_id:
                      item.message.receiver_id != authData.id
                        ? item.message.receiver_id
                        : item.message.sender_id,
                    receiver:
                      item.message.receiver_id != authData.id
                        ? `${item.message.receiver.firstname} ${item.message.receiver.lastname}`
                        : `${item.message.sender.firstname} ${item.message.sender.lastname}`,
                  })
                }
                key={item.message.id}>
                <View
                  style={{
                    marginVertical: 5,
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <View style={styles.userItem}>
                      <Text style={styles.username}>
                        #
                        {item.message.sender &&
                          (item.message.receiver_id != authData.id
                            ? `${item?.message?.receiver?.firstname} ${item?.message?.receiver?.lastname}`
                            : `${item?.message?.sender?.firstname} ${item?.message?.sender?.lastname}`)}
                      </Text>
                      <Text style={styles.messageTime}>
                        {dateToFromNowDaily(item.message.created_at)}
                      </Text>
                      {item.message.receiver_id != authData.id ? (
                        <Icon name="paper-plane" style={styles.messageTime} />
                      ) : (
                        <Icon name="comment" style={styles.messageTime} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.userTitle}>
                        {item.message.message}
                      </Text>
                    </View>
                  </View>
                  {item.unread_message_count ? (
                    <Text
                      style={{
                        color: Colors.white,
                        backgroundColor: 'red',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 10,
                      }}>
                      {item.unread_message_count}
                    </Text>
                  ) : (
                    false
                  )}
                </View>
              </TouchableOpacity>
            ))
          : false}
      </ScrollView>
      <View style={{ marginTop: 'auto', paddingHorizontal: 20 }}>
        <View style={styles.userList}>
          {users && users.length
            ? users.map(user => (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('DMChat', {
                      receiver_id: user.id,
                      receiver: `${user.firstname} ${user.lastname}`,
                    })
                  }
                  key={user.email}>
                  <Text style={styles.userItemText}>{user.email}</Text>
                </TouchableOpacity>
              ))
            : false}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('ContestListScreen')}>
            <Image source={contestIcon} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('DigitalStudioScreen')}>
            <Image source={cameraIcon} style={{ width: 32, height: 32 }} />
          </TouchableOpacity> */}
          <TextInput
            placeholder="search by username"
            style={styles.textInputSearchStyle}
            placeholderTextColor={Colors.input_fontColor_dark}
            value={username}
            onChangeText={handleChange}
          />
        </View>
      </View>
      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
    buttonImages: state.auth.PROFILE_BUTTON_IMAGES,
    specialItems: state.auth.PROFILE_SPECIAL_ITEMS,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      doLogout,
      setButtonImages: setProfileButtonImages,
      setSpecialItems: setProfileSpecialItems,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  textInputSearchStyle: {
    fontFamily: 'DM Sans',
    backgroundColor: Colors.input_backgroundColor_dark,
    fontSize: 14,
    lineHeight: 18.23,
    letterSpacing: 1,
    borderRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 16,
    color: Colors.input_fontColor_dark,
    width: '100%',
  },
  userList: {
    flexDirection: 'row',
    color: Colors.white,
    flexWrap: 'wrap',
  },
  userItemText: {
    color: Colors.white,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: Colors.input_backgroundColor_dark,
    margin: 5,
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userItemFront: {
    flexDirection: 'row',
  },
  username: {
    color: Colors.white,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
  },
  userTitle: {
    color: Colors.white,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18.2,
    letterSpacing: 1,
    paddingLeft: 10,
  },
  messageTime: {
    paddingTop: 6,
    color: Colors.white,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    fontWeight: '400',
    paddingLeft: 10,
  },
  avatarStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 13,
  },
  container: {
    //height: hp('25%'),
    backgroundColor: '#292B2E',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 0,
  },
  image: {
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
    width: wp('20%'),
    alignSelf: 'center',
  },
  specialImage: {
    // resizeMode: 'contain',
    height: 40,
    // aspectRatio: 1.1,
    width: 40,
  },
  specialItem: {
    backgroundColor: '#bbb',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  username: {
    color: Colors.white,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
  },
  email: {
    color: Colors.secondry_text_color,
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#1F497B',
    marginHorizontal: 0,
    borderRadius: 15,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0.8,
    padding: 10,
    marginHorizontal: wp('3%'),
  },
  icon: {
    fontSize: wp('5.5%'),
    color: Colors.secondry_text_color,
  },
  itemContainer: {
    width: (width - 48) / 2,
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#1F497B',
    marginHorizontal: 0,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  itemContainer1: {
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'black',
    marginHorizontal: 0,
    borderRadius: 12,
    marginBottom: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    width: '100%',
    backgroundColor: '#36393E',
  },
  itemsWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  itemText: {
    paddingTop: 5,
    color: 'white',
    fontFamily: Fonts.Font_Bold,
    fontSize: 32,
    lineHeight: 33.85,
  },
  imgButton: {
    width: '100%',
    position: 'relative',
    height: 64,
    marginBottom: 9,
    borderRadius: 12,
  },
  linkButton: {
    backgroundColor: '#0047FF',
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
});
