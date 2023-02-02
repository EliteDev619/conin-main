import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { GlobalStyles, Colors } from '@helpers';
import FastImage from 'react-native-fast-image';
import { ASSETS_DIR, CURRENCY, APP_URL_ENV } from '@env';
import moment from 'moment';

function OrdersComponent(props) {

    let item = props.history || {};
    const { type, quantity, created_at, amount, receiver, sender } = item;
    const product = item.product || {};
    // console.log('ajdfkjalfjlajdlf', item)
    const product_description = product.product_description || {};
    const img = React.useMemo(() => {
        return !!item.product?.image && !!item.product?.product_description?.name
            ? ASSETS_DIR + 'product/' + item.product?.image
            : APP_URL_ENV + 'assets/img/default.png';
    }, [item.product]);

    const message = React.useMemo(() => {
        let msg;
        const name = product_description?.name || 'Product Deleted';
        switch(type){
            case 'item_buy':
                msg = `You Bought ${quantity} ${name} From ${product.seller_id == null ? "Item shop" : "Marketplace"}`;
                return msg;
                break;
            case 'item_sell_auto':
                msg = `${quantity} ${name} Was Auto Listed To Sell`
                return msg;
                break;
            case 'item_sell_list':
                msg = `You Listed ${quantity} ${name} To Sell`
                return msg;
                break;
        } 
    }, [type, product_description]);
    const message1 = React.useMemo(() => {
        let msg;
        const name = product_description?.name || 'Product Deleted';
      
               
  
    }, [type, product_description]);
    return (
        <>
            {
                message != null && <>
                    <OtrixDivider size={'md'} />

                    <View style={styles.cartContent} key={item.id}>
                        <View style={styles.cartBox}>
                            <View style={styles.infromationView}>
                                <View>
                                    <Text style={styles.name}>{message} (At {moment(created_at).format('DD MMM YYYY hh:mm a')})</Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>
                </>
            }
        </>
    );
}

export default OrdersComponent;

const styles = StyleSheet.create({
    cartContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222222',
        borderRadius: wp('2%'),
        padding: 10, 
    },    
    cartContent1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222222',
        borderRadius: wp('2%'),
        padding: 10, 
        marginTop : 20
    },
    cartBox: {
        flexDirection: 'row',
        //justifyContent: 'center',
        alignItems: 'center',
        width: wp('90%'),
        flex: 1,
    },
    imageView: {
        backgroundColor: Colors.light_white,
        borderRadius: wp('1.5%'),
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: undefined,
        aspectRatio: 1,
        width: wp('15.5%'),
    },
    infromationView: {
        flex: 1,
        marginBottom: hp('1.4%'),
        marginLeft: 12,
        marginTop: hp('1%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    name: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: Fonts.Font_Bold,
    },
    orderDate: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: wp('3%'),
        fontFamily: Fonts.Font_Regular,
    },
});
