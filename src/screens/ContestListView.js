import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { OtrixContainer } from '@component';
import { _roundDimensions } from '@helpers/util';
import { _getWishlist, _addToWishlist } from '@helpers/FunctionHelper';
import { GlobalStyles } from '@helpers';
import {
  OtirxBackButton,
  OtrixContent,
  OtrixHeader,
  OtrixLoader,
} from '../component';
import ContestWrapper from '../component/Contest/ContestWrapper';
import getApi from '@apis/getApi';
import { useFocusEffect } from '@react-navigation/native';

function ContestListView(props) {
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      fetchData(1);
    }, []),
  );

  const fetchData = page => {
    setLoading(true);
    getApi
      .getData(`seller/contest?page=${page}`)
      .then(res => {
        if (res.status == 1) {
          if (page == 1) {
            setContests(res.contests.data);
          } else {
            setContests(prev => [...prev, ...res.contests.data]);
          }
          setLoading(false);
          setTotalPage(res.contests.last_page);
          setCurrentPage(res.contests.current_page);
        }
      })
      .catch(e => setLoading(false));
  };

  const paginate = () => {
    if (loading) return;
    if (totalPage > 1 && currentPage < totalPage) {
      fetchData(currentPage + 1);
    }
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#0A0A0A' }}>
      <OtrixHeader customStyles={{ backgroundColor: '#0A0A0A' }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> All Contests</Text>
        </View>
      </OtrixHeader>
      <OtrixContent action={paginate}>
        {contests.map(contest => {
          return <ContestWrapper contest={contest} key={contest.id} />;
        })}
      </OtrixContent>
      {loading && <OtrixLoader />}
    </OtrixContainer>
  );
}
function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}
export default connect(mapStateToProps, {})(ContestListView);
const styles = StyleSheet.create({});
