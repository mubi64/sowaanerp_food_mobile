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

const NewPassword = () => {
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
          Reset your password here
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

        <View style={{height: hp('10%')}} />
        <Input
          allowFontScaling={false}
          keyboardType="email-address"
          placeholder="New Password"
          containerStyle={{width: wp('95%'), alignSelf: 'center'}}
          inputContainerStyle={{
            borderRadius: 8,
            borderColor: '#F4F4F4',
            borderWidth: 2,
            paddingLeft: 10,
            fontSize: hp(2.2),
            marginTop: hp(-1.5),
            color: '#3B3B3B',
            fontFamily: 'Proxima Nova',
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 2,
          }}
          inputStyle={{
            fontSize: hp(2.3),
            color: '#3B3B3B',
            fontFamily: 'Proxima Nova',
          }}
        
          rightIcon={
            <Icon
              name="eye"
              type="font-awesome-5"
              color={SECONDARY_GRADIENT_COLOR}
              size={wp(5)}
            />
          }
          rightIconContainerStyle={{marginRight: hp(1)}}
        />
        <View style={{height: hp('1%')}} />
        <Input
          allowFontScaling={false}
          keyboardType="email-address"
          placeholder="Confirm Password"
          containerStyle={{width: wp('95%'), alignSelf: 'center'}}
          inputContainerStyle={{
            borderRadius: 8,
            borderColor: '#F4F4F4',
            borderWidth: 2,
            paddingLeft: 10,
            fontSize: hp(2.2),
            marginTop: hp(-1.5),
            color: '#3B3B3B',
            fontFamily: 'Proxima Nova',
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 2,
          }}
          inputStyle={{
            fontSize: hp(2.3),
            color: '#3B3B3B',
            fontFamily: 'Proxima Nova',
          }}
    
          rightIcon={
            <Icon
              name="eye"
              type="font-awesome-5"
              color={SECONDARY_GRADIENT_COLOR}
              size={wp(5)}
            />
          }
          rightIconContainerStyle={{marginRight: hp(1)}}
        />
        <View style={{height: hp('15%')}} />
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
export default NewPassword;
