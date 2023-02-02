import { ACCESS_TOKEN, API_URL } from '@common/config';
import axios from 'axios';
import * as RootNavigation from '../../AppNavigator';

var authHeader = new Headers();
authHeader.append('accept', 'application/json');
authHeader.append('Content-Type', 'multipart/form-data');
authHeader.append('token', 'RuQChqz2FqJkP6wMAQiVlLx5BOTRIX');
const api_url = API_URL;

const getDataService = {
  getData: function (url) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + url, {
        method: 'GET',
        headers: authHeader,
      })
        .then(response => {
          return response.json();
        })
        .then(json => {
          if (json.status == 0 && json.message == 'unauthorize') {
            RootNavigation.navigate('UnauthorizeScreen', {});
          } else {
            resolve(json);
          }
        })
        .catch(function (error) {
          // ADD THIS THROW error
          reject(error);
        });
    });
  },

  postData: function (url, data = null) {
    return fetch(API_URL + url, {
      method: 'POST',
      headers: authHeader,
      body: data,
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.status == 0 && responseJson.message == 'unauthorize') {
          RootNavigation.navigate('UnauthorizeScreen', {});
        } else {
          return responseJson;
        }
      })
      .catch(error => {});
  },

  uploadToCloudinary: async (source, folder = 'unknown', adaptive = false) => {
    if (Platform.OS === 'ios') {
      source.uri = source?.uri?.replace('file://', '/');
    }
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('file', source);
      data.append('upload_preset', 'dmljgqvn');
      data.append('cloud_name', 'snaplist');
      data.append('folder', folder);
      data.append('api_key', '882925219281537');
      data.append('api_secret', 'ppqMDgtivesiIut2_uC0rSylJHM');

      const url = 'https://api.cloudinary.com/v1_1/snaplist/upload';

      axios({
        url,
        method: 'POST',
        data: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          //'Authorization':'Basic YnJva2VyOmJyb2tlcl8xMjM='
        },
      })
        .then(function (response) {
          resolve(response?.data?.secure_url);
        })
        .catch(function (error) {
          console.log(error);
          resolve(null);
        });
    });
  },

  jsonpostData: async function (url, data = null, token = null, cartToken) {
    return fetch(api_url + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        //  'Commerce-Cart-Token': cartToken,
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async responseJson => {
        return responseJson;
      })
      .catch(error => {});
  },
};
export default getDataService;
