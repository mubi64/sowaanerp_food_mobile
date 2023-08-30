import React, {useState,useEffect} from 'react';
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
import {Input, Icon, Divider} from '@rneui/base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useSelector, useDispatch} from 'react-redux';
import {
 getAddressesByUser,
 updateAddressDefault
} from '../redux/actions';
import store from '../redux';
import PutMethod from '../network calls/put';
import Toast from 'react-native-toast-message';
import { urlForSignUp } from '../constants/baseurl';
const MyAddresses = (props) => {
  const disptach =useDispatch()
  const [selectedCat, setSelectedCat] = useState(0);
  const [addressData,setAddressData] = useState([])
  const [statte, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [loader,setLoader] = useState(false)
  useEffect(()=>{
     const fetch = async ()=>{
   
    console.log('wdqwdwq',JSON.stringify(store.getState().addresses,null,2))
    setAddressData(store.getState().addresses)
     }
     fetch()

  },[])
  const changeAddress = async(name) => { 
    setLoader(true)
       const arr = store.getState().addresses.filter(item=>{
        return item.is_shipping_address === 1
       })
       console.log('wdwd',arr)
       const res = await PutMethod(urlForSignUp,
        {
          is_primary_address:1,
          is_shipping_address:1
        },
        `resource/Address/${name}`,
      )
      if(res.error !== undefined){
       
        Toast.show({
          type: 'error',
          position:"top",
          text1: `${res.error}👋`
        });
        setLoader(false)

      }
      else{
        const resp = await PutMethod(urlForSignUp,
          {
            is_primary_address:0,
            is_shipping_address:0
          },
          `resource/Address/${arr[0].name}`,
        )
        if(res.error !== undefined){
         
          Toast.show({
            type: 'error',
            position:"top",
            text1: `${res.error}👋`
          });
          setLoader(false)

        }
        else{
      
          const arr = store.getState().addresses
          const newfirstIndex = addressData.findIndex(i=>{
           return i.name == res.data.name
         }) 
         const newsecondIndex = addressData.findIndex(j=>{
          return j.name == resp.data.name
        })
        console.log(newfirstIndex)
        console.log(newsecondIndex)
        arr[newfirstIndex]=res.data
        arr[newsecondIndex]=resp.data
        console.log('wdwqd  swaaw',JSON.stringify(arr,null,2))
        await setAddressData(arr)
        await disptach({
          type:'UPDATE_ADDRESS',
          value:arr
        })
     
        
        setLoader(false)
        forceUpdate();
        }
      }
  }
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
        <ScrollView>
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
         <View style={{flexDirection:'row',justifyContent:'space-between',width: wp('95%'), alignSelf: 'center'}}>
         <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.5),
              color: 'black',
              fontWeight: '700',
            }}>
            My Addresses
          </Text>
          <Text
            allowFontScaling={false}
            onPress={()=>props.navigation.navigate('Address')}

            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.5),
              color: SECONDARY_GRADIENT_COLOR,
              fontWeight: '700',
              textDecorationLine:'underline'
        
            }}>
            +Add New Address
          </Text>
         </View>
        

          <View style={{height: hp('2%')}} />
          <View
            style={{width: wp('95%'), alignSelf: 'center', marginTop: hp(1.5)}}>
            {addressData.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{
                    width: 'auto',
                    height: 'auto',
                    paddingVertical: hp(3),
                    marginTop: hp(2),
                    paddingHorizontal: hp(4),
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: SECONDARY_GRADIENT_COLOR,
                    backgroundColor:(item.is_shipping_address && item.is_primary_address) ? 'rgba(197,129,249,0.3)' : null,
                  }}
                  onPress={() => (item.is_shipping_address && item.is_primary_address)?null:changeAddress(item.name)}>
                  {(item.is_shipping_address && item.is_primary_address)  ? (
                    <View
                      style={{
                        backgroundColor: '#f5f5f5',
                        width: wp('24%'),
                        height: 'auto',
                        paddingVertical: hp(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.3),
                          color: SECONDARY_GRADIENT_COLOR,
                        }}>
                        {item.address_title}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: SECONDARY_GRADIENT_COLOR,
                        width: wp('24%'),
                        height: 'auto',
                        paddingVertical: hp(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.3),
                          color: '#f5f5f5',
                        }}>
                        {item.address_title}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      fontFamily: 'Proxima Nova',
                      fontSize: hp(2.5),
                      color: 'black',
                      marginTop: hp(1.5),
                    }}>
                        {item.address_line1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={{alignSelf: 'center'}}
                        onPress={()=>props.navigation.goBack()}

          >
            <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('96%'),
                height: hp('7%'),
                borderRadius: 8,
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
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{height:hp('2%')}}></View>
        </ScrollView>
      </View>
      {(loader)?
            <View style={{backgroundColor:'rgba(255,255,255,0.6)',position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
            <Image source={require('./../../assets/images/loader.gif')} style={{width:200,height:200}}/>
          </View>
          :
          null
      }
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
export default MyAddresses;
