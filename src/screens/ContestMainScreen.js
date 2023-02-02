import { FormControl, Input } from 'native-base';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  OtrixAlert,
  OtrixContainer,
  OtrixContent,
  OtrixLoader,
} from '../component';
import ContestItem from '../component/Contest/ContestItem';
import ContestWrapper from '../component/Contest/ContestWrapper';
import getApi from '@apis/getApi';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function ContestMainScreen(props) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [contests, setContests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getContests();
    }, []),
  );

  useEffect(() => {
    getStars(1, '');
  }, []);

  useEffect(() => {
    getStars(1, searchKeyword);
  }, [searchKeyword]);

  const getStars = (page, keyword) => {
    setLoading(true);
    getApi
      .getData(`seller/stars?page=${page}&key=${keyword}`)
      .then(res => {
        if (res.status == 1) {
          if (page == 1) {
            setStars(res.stars.data);
          } else {
            setStars(prev => [...prev, ...res.stars.data]);
          }
          setLoading(false);
          setTotalPage(res.stars.last_page);
          setCurrentPage(res.stars.current_page);
        }
      })
      .catch(e => {
        setLoading(false);
      });
  };

  const getContests = () => {
    getApi
      .getData(`seller/contest`)
      .then(res => {
        console.log(res);
        if (res.status == 1) {
          setContests(res.contests.data);
        }
      })
      .catch(e => console.log(e));
  };

  const paginate = () => {
    if (loading) return;
    if (totalPage > 1 && currentPage < totalPage) {
      getStars(currentPage + 1, searchKeyword);
    }
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#0A0A0A' }}>
      <OtrixContent action={paginate}>
        {contests[1] && <ContestWrapper contest={contests[1]} />}
        {contests[0] && <ContestWrapper contest={contests[0]} />}
        {contests[0] && (
          <View style={styles.viewAll}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ContestListScreen');
              }}>
              <Text style={styles.viewAllText}>View all contests</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ marginVertical: 20 }}>
          <FormControl>
            <Input
              variant=""
              placeholder="Search"
              style={{
                textAlign: 'center',
                backgroundColor: 'black',
                borderRadius: 13,
                fontSize: 16,
                fontWeight: '700',
                marginVertical: 10,
                color: 'white',
              }}
              placeholderTextColor="white"
              onChangeText={val => setSearchKeyword(val)}
              value={searchKeyword}
            />
          </FormControl>
        </View>
        {stars.map(star => (
          <ContestItem
            star={star}
            key={star.id}
            setMessage={setMessage}
            setStars={setStars}
            stars={stars}
            getContests={getContests}
          />
        ))}
      </OtrixContent>
      {loading && <OtrixLoader />}
      {message != null && (
        <OtrixAlert message={message.content} type={message.type} />
      )}
    </OtrixContainer>
  );
}

export default ContestMainScreen;

const styles = StyleSheet.create({
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewAllText: {
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 15,
  },
});
