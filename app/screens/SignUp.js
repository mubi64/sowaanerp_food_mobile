import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
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
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {Input, Icon} from '@rneui/base';
import PostMethod from '../network calls/post';
import {urlForSignUp} from '../constants/baseurl';
const SignupScreen = props => {
  const [keep, setKeep] = useState(false);
  const [email, setEmail] = useState(false);
  const [passwordSecureEntry, setPasswordSecureEntry] = useState(true);
  const [name, setName] = useState('');
  const [eemail, seteEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
 const [loader,setLoader] = useState(false)
  const submitDetails =async() => {
   if(name===''||eemail===''||mobile===''||password===''){
    Toast.show({
      type: 'error',
      position:"top",
      text1: `${'Fill all values'}👋`,
    });
   }
   else{
    setLoader(true)
    const res= await PostMethod(
      urlForSignUp,
      {
        email: eemail,
        mobile_no: mobile,
        full_name: name,
        password: password,
      },
      'method/sowaan_oms.sowaan_oms.api.auth.create_new_user',
    )
      if(res.error !== undefined){
        setLoader(false)
        Toast.show({
          type: 'error',
          position:"top",
          text1: `${res.error}👋`
        });
      
      }
      else{
        if(res.message==='Already registered'){
          Toast.show({
            type: 'success',
            position:"top",
            text1: `${res.message}👋`
          });
          setLoader(false)
        }
        else{
          Toast.show({
            type: 'success',
            position:"top",
            text1: `${res.message}👋`
          }); 
          setLoader(false) 
          setName('')
          seteEmail('')
          setPassword('')
          setMobile('')     
          props.navigation.navigate('CodeVerify',{
            eemail,
            mobile,
            name

          })
       
        }

      }
    
   }
    

    
  
    //   var response =  await fetch(`http://192.168.100.46:8000/api/method/sowaan_oms.sowaan_oms.api.auth.create_new_user`,{
    //     method:"POST",
    //     headers: {
    //        'Content-Type': 'application/json;charset=UTF-8',
    //        "Access-Control-Allow-Origin": "*",
    //    },
    //     body:JSON.stringify({
    //       email:eemail,
    //       mobile_no:mobile,
    //       full_name:name,
    //       password: password
    //     })
    // }).then(res=>res.json()).then((success)=>{
    //     console.log('dataassss',success)

    //   alert(success.message)
    //   props.navigation.navigate('')
    // }).catch(err=>{
    //    alert(err.message)
    // })
  };
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('48%'),
          position: 'absolute',
          top: wp(-23),
          opacity: 0.2,
          shadowOpacity: 0.1,
        }}
      />
      <LinearGradient
        colors={['white', '#ffffff00']}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 2}}
        style={{
          width: wp('100%'),
          height: hp('28%'),
          position: 'absolute',
          top: wp(45),
          opacity: 0.5,
        }}></LinearGradient>
      <View style={styles.container}>
        <ScrollView>
          <View style={{height: hp('5%')}} />
          <Image
            source={require('./../../assets/images/Logo.png')}
            style={styles.logoImageSize}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: wp(2),
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: hp(3.5),
                color: PRIMARY_GRADIENT_COLOR,
                fontFamily: 'Viga-Regular',
              }}>
              Sowaan
            </Text>
            <Text
              style={{
                fontSize: hp(3.5),
                color: SECONDARY_GRADIENT_COLOR,
                fontFamily: 'Viga-Regular',
              }}>
              ERP Food
            </Text>
          </View>
          <View style={{height: hp('2%')}} />

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3.5),
              color: 'black',
              fontWeight: '700',
              textAlign: 'center',
              width: wp('90%'),
              alignSelf: 'center',
            }}>
            Sign up
          </Text>
          <Input
            allowFontScaling={false}
            placeholder="Full Name"
            containerStyle={{width: wp('88%'), alignSelf: 'center'}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: hp(2.2),
              marginTop: hp(2),
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
            onChangeText={text => setName(text)}
            inputStyle={{
              fontSize: hp(2.3),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
            leftIcon={
              <Icon
                name="user-alt"
                type="font-awesome-5"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
          />
          <Input
            allowFontScaling={false}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={text => seteEmail(text)}
            containerStyle={{width: wp('88%'), alignSelf: 'center'}}
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
        
            leftIcon={
              <Icon
                name="email"
                type="material"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
          />
          <Input
            allowFontScaling={false}
            keyboardType="number-pad"
            placeholder="Phone Number (e.g 3xx-xxxxxxx)"
            containerStyle={{width: wp('88%'), alignSelf: 'center'}}
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
            onChangeText={text => setMobile(text)}

            leftIcon={
              <Icon
                name="phone"
                type="material"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
          />
          <Input
            allowFontScaling={false}
            placeholder="Password"
            secureTextEntry={passwordSecureEntry}
            containerStyle={{width: wp('88%'), alignSelf: 'center'}}
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
            leftIcon={
              <Icon
                name="lock"
                type="material"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
            onChangeText={text => setPassword(text)}

            rightIcon={
              <>
                {passwordSecureEntry ? (
                  <Icon
                    name="eye"
                    type="font-awesome-5"
                    color={SECONDARY_GRADIENT_COLOR}
                    size={wp(5)}
                    onPress={() => setPasswordSecureEntry(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome-5"
                    color={SECONDARY_GRADIENT_COLOR}
                    size={wp(5)}
                    onPress={() => setPasswordSecureEntry(true)}
                  />
                )}
              </>
            }
            rightIconContainerStyle={{marginRight: hp(1)}}
          />
          <View style={{width: wp('80%'), alignSelf: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              {keep ? (
                <LinearGradient
                  colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  onTouchEnd={() => setKeep(false)}
                  style={{
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="check" color="white" size={hp(2.5)} />
                </LinearGradient>
              ) : (
                <View
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: SECONDARY_GRADIENT_COLOR,
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                  }}
                  onTouchEnd={() => setKeep(true)}></View>
              )}

              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  color: PRIMARY_GRADIENT_COLOR,
                  alignSelf: 'center',
                  marginLeft: hp(1),
                }}>
                Keep me signed in
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: hp(2)}}>
              {email ? (
                <LinearGradient
                  colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  onTouchEnd={() => setEmail(false)}
                  style={{
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="check" color="white" size={hp(2.5)} />
                </LinearGradient>
              ) : (
                <View
                  onTouchEnd={() => setEmail(true)}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: SECONDARY_GRADIENT_COLOR,
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                  }}></View>
              )}

              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  color: PRIMARY_GRADIENT_COLOR,
                  alignSelf: 'center',
                  marginLeft: hp(1),
                }}>
                Email me about special pricing
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => submitDetails()}>
            <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('50%'),
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
                Create Account
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: PRIMARY_GRADIENT_COLOR,
              textAlign: 'center',
              width: wp('90%'),
              alignSelf: 'center',
              marginTop: hp(1.5),
              textDecorationLine: 'underline',
            }}
            onPress={()=>props.navigation.navigate('Login')}
            >
            Already have an account?
          </Text>
        </ScrollView>
        {(loader)?
            <View style={{backgroundColor:'rgba(255,255,255,0.6)',position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
            <Image source={require('./../../assets/images/loader.gif')} style={{width:200,height:200}}/>
          </View>
          :
          null
      }
    
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
export default SignupScreen;
