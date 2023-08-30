import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Image,
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
import {Input, Icon} from '@rneui/base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const SendForgetOpt = () => {
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('100%'),
          position: 'absolute',
          top: wp(-90),
          right: wp(-42),
          opacity: 0.19,
          transform: [{rotate: '45deg'}],
          shadowOpacity: 0.1,
          resizeMode: 'contain',
        }}
      />

      <View style={styles.container}>
        <View style={{height: hp('3%')}} />
        <View
          style={{
            backgroundColor: 'rgba(249, 168, 77,0.2)',
            width: wp('14%'),
            height: hp('7%'),
            borderRadius: 8,
            marginLeft: hp(3),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="chevron-back-sharp"
            type="ionicon"
            size={hp(5)}
            color="#DA6317"
          />
        </View>
        <View style={{height: hp('4%')}} />

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3.5),
            color: 'black',
            fontWeight: '700',
            width: wp('70%'),
            marginLeft: hp(3),
          }}>
          Forgot password?
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2),
            color: 'black',
            fontWeight: '600',
            width: wp('70%'),
            marginLeft: hp(3),
            marginTop: hp(3),
          }}>
          Select which contact details should we use to reset your password
        </Text>

        <View style={{height: hp('5%')}} />
        <View
          style={{
            width: wp('90%'),
            height: hp('15%'),
            backgroundColor: 'white',
            borderRadius: 15,
            alignSelf: 'center',
            shadowColor: '#5A6CEA12',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 2,
          }}>
          <View
            style={{
              width: wp('80%'),
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: hp(2),
            }}>
            <Image
              source={require('./../../assets/images/Chat.png')}
              style={{width: 45, height: 45}}
            />
            <View style={{alignSelf: 'center'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.5),
                  width: wp('70%'),

                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Via sms:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  color: 'black',
                  width: wp('70%'),
                  fontWeight: '700',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                •••• •••• 4567
              </Text>
            </View>
          </View>
        </View>
        <View style={{height: hp('5%')}} />

        <View
          style={{
            width: wp('90%'),
            height: hp('15%'),
            backgroundColor: 'white',
            borderRadius: 15,
            alignSelf: 'center',
            shadowColor: '#5A6CEA12',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 2,
          }}>
          <View
            style={{
              width: wp('80%'),
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: hp(2),
            }}>
            <Image
              source={require('./../../assets/images/email.png')}
              style={{width: 45, height: 45, resizeMode:'contain'}}
            />
            <View style={{alignSelf: 'center'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.5),
                  width: wp('70%'),

                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Via E-mail:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  color: 'black',
                  width: wp('70%'),
                  fontWeight: '700',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                ••••@gmail.com
              </Text>
            </View>
          </View>
        </View>
        <View style={{height: hp('10%')}} />
        <TouchableOpacity style={{alignSelf: 'center'}}>
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
              Next
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
});
export default SendForgetOpt;
