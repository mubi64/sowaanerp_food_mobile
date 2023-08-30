import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  clear,
} from 'react-native-google-places-autocomplete';

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
import {Input, Icon, Divider, Avatar} from '@rneui/base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {DeleteItem, GetItem} from '../local-storage/function';
import {useDispatch} from 'react-redux';
const MyProfile = props => {
  const [selectedCat, setSelectedCat] = React.useState(0);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [initialName, setInitialName] = React.useState('');
  const dispatch = useDispatch();
  React.useEffect(async () => {
    const getData = await GetItem('user');
    const getparseData = await JSON.parse(getData);
    let name = getparseData.name
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let init = [...name.matchAll(rgx)] || [];

    init = (
      (init.shift()?.[1] || '') + (init.pop()?.[1] || '')
    ).toUpperCase();


    setInitialName(init);
    setName(getparseData.name);
    setEmail(getparseData.email);
  }, []);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          width: wp('100%'),
          height: hp('60%'),
          alignSelf: 'center',
        }}>
        <Image
          source={require('./../../assets/images/Group.png')}
          style={{
            width: wp('100%'),
            height: 350,
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0.2,
          }}
        />
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3),
            color: 'white',
            fontWeight: '700',
            marginLeft: hp(3),
            marginTop: hp(3),
          }}>
          My Profile
        </Text>
        <View style={{height: hp('1%')}} />
        <Avatar
          title={initialName}
          size={wp(30)}
          rounded
          containerStyle={{alignSelf: 'center',height:wp('35%'),width:wp('35%'),borderRadius:wp('35%')/2,backgroundColor:PRIMARY_GRADIENT_COLOR}}
        />
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3),
            color: 'white',
            fontWeight: '700',
            marginTop: hp(1),
            alignSelf: 'center',
          }}>
          {name}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'white',
            fontWeight: '700',
            marginTop: hp(1),
            alignSelf: 'center',
          }}>
          {email}
        </Text>
      </LinearGradient>
      <View
        style={{
          height: hp('45%'),
          width: wp('100%'),
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: '#f5f5f5',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            fontWeight: '700',
            marginLeft: hp(3),
            marginTop: hp(3),
          }}>
          Account Overview
        </Text>
        <TouchableOpacity
          style={{
            width: wp('90%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: hp(2),
          }}
          onPress={() => props.navigation.navigate('AddressList')}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: 'rgba(146, 6, 228, 0.15)',
                width: wp('12%'),
                height: hp('7%'),
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="home"
                type="ionicon"
                size={hp(3.5)}
                color={SECONDARY_GRADIENT_COLOR}
              />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                fontWeight: '700',
                marginLeft: hp(3),
                alignSelf: 'center',
              }}>
              My Addresses
            </Text>
          </View>
          <Icon
            name="right"
            type="ant-design"
            size={hp(3)}
            containerStyle={{alignSelf: 'center'}}
            color={SECONDARY_GRADIENT_COLOR}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: wp('90%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: hp(2),
          }}
          onPress={() => props.navigation.navigate('MyOrders')}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: 'rgba(146, 6, 228, 0.15)',
                width: wp('12%'),
                height: hp('7%'),
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="receipt"
                type="ionicon"
                size={hp(3.5)}
                color={SECONDARY_GRADIENT_COLOR}
              />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                fontWeight: '700',
                marginLeft: hp(3),
                alignSelf: 'center',
              }}>
              My Orders
            </Text>
          </View>
          <Icon
            name="right"
            type="ant-design"
            size={hp(3)}
            containerStyle={{alignSelf: 'center'}}
            color={SECONDARY_GRADIENT_COLOR}
          />
        </TouchableOpacity>
        <View
          style={{
            width: wp('90%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: hp(2),
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: 'rgba(146, 6, 228, 0.15)',
                width: wp('12%'),
                height: hp('7%'),
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="lock"
                type="entypo"
                size={hp(3.5)}
                color={SECONDARY_GRADIENT_COLOR}
              />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                fontWeight: '700',
                marginLeft: hp(3),
                alignSelf: 'center',
              }}>
              Change Password
            </Text>
          </View>
          <Icon
            name="right"
            type="ant-design"
            size={hp(3)}
            containerStyle={{alignSelf: 'center'}}
            color={SECONDARY_GRADIENT_COLOR}
          />
        </View>
        <TouchableOpacity
          style={{
            width: wp('90%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: hp(2),
          }}
          onPress={() => {
            DeleteItem('user');
            dispatch({
              type: 'USER_LOGGEDIN',
              value: false,
            });
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: 'rgba(146, 6, 228, 0.15)',
                width: wp('12%'),
                height: hp('7%'),
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="logout"
                type="ant-design"
                size={hp(3.5)}
                color={SECONDARY_GRADIENT_COLOR}
              />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                fontWeight: '700',
                marginLeft: hp(3),
                alignSelf: 'center',
              }}>
              Logout
            </Text>
          </View>
          <Icon
            name="right"
            type="ant-design"
            size={hp(3)}
            containerStyle={{alignSelf: 'center'}}
            color={SECONDARY_GRADIENT_COLOR}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImageSize: {
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
});
export default MyProfile;
