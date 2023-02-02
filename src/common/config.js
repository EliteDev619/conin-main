import {
  APP_URL_ENV,
  BASE_URL_ENV,
  API_URL_ENV,
  ACCESS_TOKEN_ENV,
  ABLY_PUBLIC_KEY_ENV,
} from '@env';
export const APP_URL = APP_URL_ENV;
export const BASE_URL = BASE_URL_ENV;
export const API_URL = API_URL_ENV;

export const ACCESS_TOKEN = ACCESS_TOKEN_ENV;

export const ABLY_PUBLIC_KEY = ABLY_PUBLIC_KEY_ENV;

export const AppStyle = {
  default: {
    paddingHorizontal: 15,
  },
};
export const currency = '₹';
export const logo = require('../assets/images/logo.png');
export const logImg = require('../assets/images/log2.png');
export const splashlogo = require('../assets/images/splash.gif');
export const stripeBadge = require('../assets/images/stripe_badge_transparent.png');
export const arrow = require('../assets/images/arrow.png');
export const splashVideo = require('../assets/video/splash_show.mp4');

export const message = require('../assets/images/message.png');
export const diamond = require('../assets/images/diamond.png');
//bottom tab images
export const bottomHome = require('../assets/images/bottomtab/Bottom_Home.png');
export const coin15 = require('../assets/images/COIN15.png');
export const bottomHomeFill = require('../assets/images/bottomtab/Botto_Home_Fill.png');
export const bottomCategory = require('../assets/images/bottomtab/Bottom_Category.png');
export const bottomCategoryFill = require('../assets/images/bottomtab/Bottom_Category_Fill.png');
export const bottomCart = require('../assets/images/bottomtab/Bottom_cart.png');
export const bottomCart2 = require('../assets/images/bottomtab/Bottom_cart2.png');
export const bottomProfile = require('../assets/images/bottomtab/Bottom_Profile.png');
export const bottomProfileFill = require('../assets/images/bottomtab/Bottom_Profile_Fill.png');
export const bottomSetting = require('../assets/images/bottomtab/Bottom_Setting.png');
export const bottomSettingFill = require('../assets/images/bottomtab/Bottom_Setting_Fill.png');
export const coinImage = require('../assets/images/coin.png');
//social images
export const google = require('../assets/images/google.png');
export const facebook = require('../assets/images/facebook.jpg');
export const twitter = require('../assets/images/twitter.jpg');

//common images
export const menu = require('../assets/images/menu.png');
export const offerBanner = require('../assets/images/banner2.jpg');
export const back = require('../assets/images/back.png');
export const filter = require('../assets/images/filter.png');
export const checkaround = require('../assets/images/check.png');
export const close = require('../assets/images/cancel.png');
export const checkround2 = require('../assets/images/check2.png');
export const circle = require('../assets/images/circle.png');
export const checked = require('../assets/images/checked.png');
export const avatarImg = require('../assets/images/man.jpg');
export const heart = require('../assets/images/heart.png');
export const avatarImg2 = require('../assets/images/user.png');
export const emptyBox = require('../assets/images/box.png');
export const congratulation = require('../assets/images/congratulation.png');
export const shipping = require('../assets/images/shipping_fast.png');
export const refund = require('../assets/images/my_return.png');
export const ClanDetailBanner = require('../assets/images/clan_detail_banner.png');
export const backgroundImage = require('../assets/images/background.png');

export const contestIcon = require('../assets/images/contest.png');
export const cameraIcon = require('../assets/images/camera.png');

export const digital = require('../assets/images/buttons/digital.png');

export const heartIcon = require('../assets/images/icons/heart.png');
export const commentIcon = require('../assets/images/icons/commet.png');
export const investIcon = require('../assets/images/icons/invest.png');
export const investOnIcon = require('../assets/images/icons/invest_on.png');

HEADER = new Headers();
HEADER.append('Accept', 'application/json');
HEADER.append('Content-Type', 'application/x-www-form-urlencoded');
