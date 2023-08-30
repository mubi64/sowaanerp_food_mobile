import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  SECONDARY_GRADIENT_COLOR,
  PRIMARY_GRADIENT_COLOR,
} from '../../assets/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart'; // Import package from node modules

const NetworkIssue = () => {
  return (
    <>
      <View
        style={{
          backgroundColor: SECONDARY_GRADIENT_COLOR,
          height: hp('7%'),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'white',
            fontWeight: 'bold',
          }}>
          No Internet
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <FastImage
          source={{
            uri: 'no_wifi',
            priority: FastImage.priority.high,
          }}
          style={{width: 250, height: 250}}
        />
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(4),
            color: 'black',
            fontWeight: '700',
            textAlign: 'center',
            width: wp('80%'),
            marginTop: hp(3),
            alignSelf: 'center',
          }}>
          Connection Lost!
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'black',
            textAlign: 'center',
            width: wp('90%'),
            alignSelf: 'center',
            marginTop: hp(3),
          }}>
          Internet connection lost please check your connection!
        </Text>
     
      </View>
    </>
  );
};
export default NetworkIssue;
