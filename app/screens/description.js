import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from '../../assets/colors';
import {LOGO} from '../../assets/imageConstant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '@rneui/base';
import {useSelector, useDispatch} from 'react-redux';
import {baseUrlforImage} from '../constants/baseurl';
import {GetItem, StoreItem} from './../local-storage/function';
import {setCartQuantity} from '../redux/actions';
import store from '../redux';
const Description = props => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddtoCart = async () => {
    const storageData = await GetItem('CartData');
    if (storageData === null) {
      const array = [
        {
          id: 1,
          name: store.getState().singleProductData.name,
          price: store.getState().singleProductData.standard_rate,
          qty: quantity,
          image: store.getState().singleProductData.image,
          isDeal: false,
          notes: '',
          orderTime: new Date().toLocaleString(),
          expanded: false,
          prefix: `${'MAZ'}-${new Date().getDate()}${
            new Date().getMonth() + 1
          }${new Date().getFullYear()}-${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`,
          station:store.getState().singleProductData.station,
          show_in_kitchen: store.getState().singleProductData.show_in_kitchen,
          status: "Making",
          made: false,
          ready: false,
          new:true,
          prevQuan: ''
        }
      ];
      dispatch(setCartQuantity(array));
      StoreItem('CartData', array);
      props.navigation.navigate('HomeScreen');
    } else {
      const storageParseData = JSON.parse(storageData);
      const index = storageParseData.findIndex(element => {
        return element.name === store.getState().singleProductData.name;
      });
      if (index > -1) {
        storageParseData[index].qty += quantity;

        dispatch(setCartQuantity(storageParseData));

        StoreItem('CartData', storageParseData);
        props.navigation.navigate('HomeScreen');
      } else {
        storageParseData.push({
          name: store.getState().singleProductData.name,
          price: store.getState().singleProductData.standard_rate,
          qty: quantity,
          isPrint: false,
          image: store.getState().singleProductData.image,
          isDeal: false,
          notes: '',

          prefix: `${'MAZ'}-${new Date().getDate()}${
            new Date().getMonth() + 1
          }${new Date().getFullYear()}-${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`,
          station: store.getState().singleProductData.station,
          show_in_kitchen: store.getState().singleProductData.show_in_kitchen,
          status: 'Making',
          made: false,
          ready: false,
          new: true,
          prevQuan: '',
        });
        storageParseData[storageParseData.length - 1].id =
          storageParseData[storageParseData.length - 2].id + 1;
        storageParseData[storageParseData.length - 1].qty =
          storageParseData[storageParseData.length - 2].id + 1;
        dispatch(setCartQuantity(storageParseData));
        StoreItem('CartData', storageParseData);
        props.navigation.navigate('HomeScreen');
      }
    }
  };
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('40%'),
          position: 'absolute',
          top: wp(-25),
          opacity: 0.19,
          shadowOpacity: 0.07,
        }}
      />
      <LinearGradient
        colors={['white', '#ffffff00']}
        style={{
          width: wp('100%'),
          height: hp('15%'),
          position: 'absolute',
          top: wp(35),
          opacity: 0.5,
        }}></LinearGradient>
      <View style={styles.container}>
        <ScrollView>
          <View style={{height: hp('2%')}} />
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Icon
              name="chevron-back-sharp"
              type="ionicon"
              size={hp(5)}
              color="black"
              onPress={() => props.navigation.navigate('HomeScreen')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(3),
                color: 'black',
                fontWeight: '700',
                alignSelf: 'center',
              }}>
              Details
            </Text>
            <Icon
              name="ios-heart-sharp"
              type="ionicon"
              color="#d60265"
              size={hp(5)}
            />
          </View>
          <View
            style={{
              shadowColor: '#000',
              // add shadows for Android only
              elevation: 10,

              // add shadows for iOS only
              shadowColor: 'black',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.5,
            }}>
            <Image
              source={{
                uri: `${baseUrlforImage}${
                  store.getState().singleProductData.image
                }`,
              }}
              style={{
                width: 230,
                height: 230,
                borderRadius: 230 / 2,
                marginTop: hp(3),
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(4),
                color: 'black',
                fontWeight: '700',
                alignSelf: 'center',
                marginTop: hp(4),
                width: wp('55%'),
              }}>
              {store.getState().singleProductData.name}
            </Text>
            <View style={{flexDirection: 'row', marginTop: hp(4)}}>
              <TouchableOpacity
                style={{
                  width: wp('10%'),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: wp('10%'),
                  backgroundColor: SECONDARY_GRADIENT_COLOR,
                  marginRight: hp(1),
                }}>
                <Icon
                  name="minus"
                  type="ant-design"
                  color="white"
                  onPress={() => setQuantity(state => state - 1)}
                  disabled={quantity === 1 ? true : false}
                />
              </TouchableOpacity>
              <Text style={{marginRight: hp(1), fontSize: hp(4)}}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={{
                  width: wp('10%'),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: wp('10%'),
                  backgroundColor: SECONDARY_GRADIENT_COLOR,
                }}>
                <Icon
                  name="add"
                  type="ionicon"
                  color="white"
                  onPress={() => setQuantity(state => state + 1)}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: hp('2.5%')}} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.9),
              fontWeight: '700',
              width: wp('90%'),
              alignSelf: 'center',
            }}>
            Description
          </Text>
          <View style={{height: hp('1.5%')}} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.2),
              fontWeight: '600',
              width: wp('90%'),
              alignSelf: 'center',
              textAlign: 'justify',
            }}>
            {store.getState().singleProductData.description}
          </Text>
          <View style={{height: hp('11%')}}></View>
        </ScrollView>
        <LinearGradient
          colors={['#000000', '#ffffff00']}
          start={{x: 0.3, y: 2}}
          end={{x: 0.3, y: 0}}
          style={{
            width: wp('100%'),
            height: hp('6%'),

            position: 'absolute',
            bottom: wp(14),
            opacity: 0.9,
          }}></LinearGradient>
        <View
          style={{
            width: wp('100%'),
            height: hp('10%'),
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp('90%'),
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: hp(3),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  marginTop: hp(0.5),
                  color: SECONDARY_GRADIENT_COLOR,
                  fontWeight: '600',
                  alignSelf: 'center',
                }}>
                Rs.
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Varela-Regular',
                  fontSize: hp(4),
                  color: 'black',
                  fontWeight: '700',
                  alignSelf: 'center',
                }}>
                {store.getState().singleProductData.standard_rate}
              </Text>
            </View>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => handleAddtoCart()}>
              <LinearGradient
                colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  width: wp('45%'),
                  height: hp('6%'),
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp(3),
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: 'white',
                    fontSize: hp(2.5),
                    fontFamily: 'Proxima Nova',
                    fontWeight: '700',
                  }}>
                  Add to Cart
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  logoImageSize: {
    width: 200,
    height: 188,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
export default Description;
