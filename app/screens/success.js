import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
import {CommonActions} from '@react-navigation/native';

const Done = props => {
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('60%'),
          position: 'absolute',
          top: wp(-25),
          opacity: 0.19,
          shadowOpacity: 0.1,
        }}
      />
      <LinearGradient
        colors={['white', '#ffffff00']}
        style={{
          width: wp('100%'),
          height: hp('35%'),
          position: 'absolute',
          top: wp(65),
          opacity: 0.5,
        }}></LinearGradient>
      <View style={styles.container}>
        <View style={{height: hp('30%')}} />
        <Image
          source={require('./../../assets/images/done.png')}
          style={styles.logoImageSize}
        />
        <View style={{marginTop: wp(3), alignSelf: 'center'}}>
          {props.route.params.from === 'checkout' ? (
            <>
              <Text
                style={{
                  fontSize: hp(5),
                  color: PRIMARY_GRADIENT_COLOR,
                  fontFamily: 'Viga-Regular',
                  textAlign: 'center',
                }}>
                Order Placed
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  color: 'black',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Thank you for order
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: hp(5),
                  color: PRIMARY_GRADIENT_COLOR,
                  fontFamily: 'Viga-Regular',
                  textAlign: 'center',
                }}>
                Congrats
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  color: 'black',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Your Profile Is Ready To Use
              </Text>
            </>
          )}
        </View>
        <View style={{height: hp('10%')}} />
        {props.route.params.from === 'checkout' ? (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Cart', params:{
                  from:'checkout'
                        } }],
           
            })
            }}>
            <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('55%'),
                height: hp('7%'),
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
                Try Another Order
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() =>
              props.navigation.reset({
                index: 0,
                routes: [{name: 'home'}],
              })
            }>
            <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('45%'),
                height: hp('7%'),
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
                Try Order
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
export default Done;
