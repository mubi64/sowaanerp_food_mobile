import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Image
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

const UploadProfilePic = (props) => {
  const [image, setImage] = useState('');
  const [imageBool, setImageBool] = useState(false);
  const ImagePicker = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        setImage(response.assets[0].uri);
        setImageBool(true);
      }
    });
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      const grantedGallery = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Gallery Permission",
          message:"App needs access to your photos",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED && grantedGallery === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera({mediaType: 'photo', saveToPhotos: true},response => {
            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              // console.log('User tapped custom button: ', response.customButton);
            } else {
              // setImage(response.assets[0].uri);
              // setImageBool(true);
              console.log('wdwd',response)
            }
          })
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }    
  const ImagePicker2 = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    launchCamera(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        // setImage(response.assets[0].uri);
        // setImageBool(true);
        console.log('wdwd',response)
      }
    });
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
              onPress={()=>props.navigation.goBack()}

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
          Upload Your Photo Profile
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
          This data will be displayed in your account profile for security
        </Text>
        {imageBool ? (
          <>
            <Image
              source={{uri: image}}
              containerStyle={{alignSelf:'center'}}
              style={{
                width: wp('80%')/1.2,
                height: hp('50%')/1.2,
                marginTop: hp(4),
                borderRadius:15
              }} >
                <Icon
              name="cancel"
              containerStyle={{position: 'absolute', top: 5, right: 5}}
              color='white'
              onPress={()=>{
                setImage('')
                setImageBool(false)
              }}
            />
              </Image>
            
          </>
        ) : (
          <>
            <TouchableOpacity onPress={ImagePicker}>
              <View
                style={{
                  width: wp('90%'),
                  height: hp('18%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.48,
                  shadowRadius: 11.95,
                  elevation: 2,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginTop: hp(3),
                }}>
                <Image
                  source={require('./../../assets/images/gallery-icon.png')}
                  style={{width: 100, height: 100}}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={requestCameraPermission}>
              <View
                style={{
                  width: wp('90%'),
                  height: hp('18%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.48,
                  shadowRadius: 11.95,
                  elevation: 2,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginTop: hp(3),
                }}>
                <Image
                  source={require('./../../assets/images/camera-icon.png')}
                  style={{width: 100, height: 100}}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </>
        )}

        <View style={{height: hp('5%')}} />
        <TouchableOpacity style={{alignSelf: 'center'}}
                                onPress={()=>props.navigation.navigate('Loc')}

        >
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
export default UploadProfilePic;
