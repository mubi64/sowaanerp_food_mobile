import React, {useState, useRef} from 'react';
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
import PostMethod from '../network calls/post';
import Toast from 'react-native-toast-message';
import { urlForSignUp } from '../constants/baseurl';
const CodeVerification = props => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');
  const [val4, setVal4] = useState('');
  const [loading, setLoading] = useState(false);
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);
  const verifyCode = async () => {
    setLoading(true)
    if (val1 === '' || val2 === '' || val3 === '' || val4 === '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${'Fill All values'}👋`,
      });
      setLoading(false)

    } else {
      const res = await PostMethod(
        urlForSignUp,
        {
          email: props.route.params.eemail,
          code: `${val1}${val2}${val3}${val4}`,
          isSms: true,
        },
        'method/sowaan_oms.sowaan_oms.api.auth.verify_user',
      );
      if (res.error !== undefined) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: `${res.error}👋`,
        });
        setLoading(false)

      } else {
        console.log('wdqdwq',res.message.success )
        if (res.message.success === false) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: `${'Invalid Code'}👋`,
          });
          setLoading(false)

        } 
        else {
          const resp = await PostMethod(
            urlForSignUp,
            {
              customer_name:props.route.params.name,
              customer_type: 'Individual',
              customer_group: 'Individual',
              email_id: props.route.params.eemail,
              mobile_no: props.route.params.mobile,
              territory: 'All Territories',
            },
            'resource/Customer',
          );
          if (resp.error !== undefined) {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: `${resp.error}👋`,
            });
            setLoading(false)
    
          }
          else{
            Toast.show({
              type: 'success',
              position: 'top',
              text1: `${'You are verified'}👋`,
            });
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
          })
          }
       
        }
      }
    }
  };
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
            onPress={() => props.navigation.goBack()}
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
          Enter 4-digit Verification code
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
          Code send to +92{props.route.params.mobile} . This code will expired
          in 01:30
        </Text>

        <View style={{height: hp('5%')}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Input
            allowFontScaling={false}
            ref={firstRef}
            containerStyle={{
              width: wp('20%'),
              alignSelf: 'center',
              marginTop: 20,
            }}
            maxLength={1}
            inputStyle={{
              textAlign: 'center',
              color: PRIMARY_GRADIENT_COLOR,
              fontSize: wp(5),
              fontWeight: 'bold',
            }}
            keyboardType="number-pad"
            inputContainerStyle={{
              borderWidth: 0.7,
              borderRadius: 12,
              borderColor: '#f5f5f5',
              backgroundColor: 'white',
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS,
              elevation: 5,
              borderBottomWidth: 0.5,
            }}
            onChangeText={text => {
              if (text.length > 0) {
                setVal1(text);
                secondRef.current.focus();
              } else {
                firstRef.current.focus();
              }
            }}
          />
          <Input
            allowFontScaling={false}
            ref={secondRef}
            containerStyle={{
              width: wp('20%'),
              alignSelf: 'center',
              marginTop: 20,
            }}
            maxLength={1}
            inputStyle={{
              textAlign: 'center',
              color: PRIMARY_GRADIENT_COLOR,
              fontSize: wp(5),
              fontWeight: 'bold',
            }}
            keyboardType="number-pad"
            inputContainerStyle={{
              borderWidth: 0.7,
              borderRadius: 12,
              borderColor: '#f5f5f5',
              backgroundColor: 'white',
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS,
              elevation: 5,
              borderBottomWidth: 0.5,
            }}
            onChangeText={text => {
              if (text.length > 0) {
                setVal2(text);
                thirdRef.current.focus();
              } else {
                secondRef.current.focus();
              }
            }}
          />
          <Input
            allowFontScaling={false}
            ref={thirdRef}
            containerStyle={{
              width: wp('20%'),
              alignSelf: 'center',
              marginTop: 20,
            }}
            maxLength={1}
            inputStyle={{
              textAlign: 'center',
              color: PRIMARY_GRADIENT_COLOR,
              fontSize: wp(5),
              fontWeight: 'bold',
            }}
            keyboardType="number-pad"
            inputContainerStyle={{
              borderWidth: 0.7,
              borderRadius: 12,
              borderColor: '#f5f5f5',
              backgroundColor: 'white',
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS,
              elevation: 5,
              borderBottomWidth: 0.5,
            }}
            onChangeText={text => {
              if (text.length > 0) {
                setVal3(text);
                fourthRef.current.focus();
              } else {
                thirdRef.current.focus();
              }
            }}
          />
          <Input
            allowFontScaling={false}
            ref={fourthRef}
            containerStyle={{
              width: wp('20%'),
              alignSelf: 'center',
              marginTop: 20,
            }}
            onChangeText={text=>setVal4(text)}
            maxLength={1}
            inputStyle={{
              textAlign: 'center',
              color: PRIMARY_GRADIENT_COLOR,
              fontSize: wp(5),
              fontWeight: 'bold',
            }}
            keyboardType="number-pad"
            inputContainerStyle={{
              borderWidth: 0.7,
              borderRadius: 12,
              borderColor: '#f5f5f5',
              backgroundColor: 'white',
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS,
              elevation: 5,
              borderBottomWidth: 0.5,
            }}
          />
        </View>
        {/* <View style={{width:wp('90%'),height:hp('25%'),backgroundColor:'white',borderRadius:15,alignSelf:'center',
        shadowColor: '#5A6CEA12',
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 2}}>
            <View style={{width:wp('80%'),alignSelf:'center',flexDirection:'row',marginTop:hp(2)}}>
                <Image source={require('./../../assets/images/pin-logo.png')} style={{width:50,height:50}} />
                <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3),
            color: 'black',
            fontWeight: '700',
            width: wp('70%'),
            marginLeft: hp(1),
            alignSelf:'center'
          }}>
          Your Location
        </Text>
            </View>
            <TouchableOpacity style={{width:wp('80%'),height:hp('8%'),borderRadius:15,alignSelf:'center',backgroundColor:'#F6F6F6',marginTop:hp(3),justifyContent:'center',alignItems:'center'}}>
             <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3),
            color: 'black',
            fontWeight: '700',
          }}>
           Set Location
                </Text>    
            </TouchableOpacity>
        </View> */}
        <View style={{height: hp('30%')}} />
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          disabled={loading}
          onPress={() => verifyCode() }>
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
              Verify
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
export default CodeVerification;
