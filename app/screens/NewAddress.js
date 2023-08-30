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
  Dimensions
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
import {Input, Icon, Divider} from '@rneui/base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { useEffect } from 'react';
import { GetItem } from '../local-storage/function';
import GetMethod from '../network calls/get';
import PostMethod from '../network calls/post';
import {useSelector, useDispatch} from 'react-redux';
import {
 setNewAddress
} from '../redux/actions';
import {urlForSignUp} from '../constants/baseurl';
import store from '../redux';
import Toast from 'react-native-toast-message';
const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

const NewAddress = (props) => {
  const [loc, setLoc] = React.useState('');
  const [lat, setLat] = React.useState(32.5839)
  const [long,setLong] = React.useState(71.5370)
  const [longDelta,setLongDelta] = React.useState(0.03)
  const [latDelta,setLatDelta] = React.useState(0.03 * (widthScreen/heightScreen ))
  const [country,setCountry] = React.useState('')
  const [city,setCity] = React.useState('')
  const [location_title,set_location_title] = useState('')
  const [onfocusinput,setonfocusInput]=useState(false)
const [loader,setLoader] = useState(false)
const [zoom,setZoom] = useState(15)
  const [forceFully,setforceFully] = useState(Math.floor(Math.random() * 100))
  const dispatch = useDispatch() 
  useEffect(()=>{
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&types=locality&key=`).then(res=>res.json()).then(data=>
    {
      console.log('wkjwh',JSON.stringify(data.results[0],null,2))
      setLoc(data.results[0].formatted_address)
      setCity(data.results[0].address_components[data.results[0].address_components.length-3].long_name)
      setCountry(data.results[0].address_components[data.results[0].address_components.length-1].long_name)
    }
      ).catch(err=>console.log(err))
   },[lat,long])
  const onRegChange=(reg)=>{

  }
  const addNewAddress = async() => {
    const getUserData = await GetItem('user')
    const parsedatagetuser = await JSON.parse(getUserData)
    if(location_title === ''){
      Toast.show({
        type: 'error',
        position:"top",
        text1: `${'Location title is must'}👋`,
      });
    }
    else{
      setLoader(true)
      console.log(lat,'wdwqqw2')
      const res= await PostMethod(
        urlForSignUp,
        {
          address_title:location_title,
          address_type:"Shipping",
          address_line1:loc,
          city:city,
          country:country,
          is_primary_address:(store.getState().addresses.length>0)?0:1,
          is_shipping_address:(store.getState().addresses.length>0)?0:1,
          latitude_:lat.toFixed(3).toString(),
          longitude:long.toFixed(3).toString(),
          links:[{link_doctype: "Customer", link_name:parsedatagetuser.name} ]

        },
        'resource/Address',
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
           await setNewAddress(res.data)
           props.navigation.goBack()
           Toast.show({
            type: 'success',
            position:"top",
            text1: `${'Successfully address added'}👋`
          });
          
        }
    }
  
     }  
  return (
    <>
      <MapView
        style={{width: wp('100%'), height: hp('100%')}}
        region={{
          latitude: lat,
          longitude:long,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        }}
        
        minZoomLevel={13}
         maxZoomLevel={20}
        onRegionChangeComplete={(region)=>{
          
          setLat(region.latitude)
          setLong(region.longitude)
         setLatDelta(region.latitudeDelta)
         setLongDelta(region.longitudeDelta)
        }}
        zoomEnabled={true}
        >
         
     {/* <Icon
            name="location"
            type="ionicon"
            color={SECONDARY_GRADIENT_COLOR}
            size={hp(5)}
            containerStyle={{position:'absolute',top:50,left:50}}
          /> */}
  
      {/* <View
        style={{
          height: hp('50%'),
          width: wp('100%'),
          position: 'absolute',
          bottom: 0,
          backgroundColor:'white',
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
            color: 'black',
            fontWeight: '700',
            marginLeft: hp(3),
            marginTop:hp(3)
          }}>
          New Address
        </Text>
        <GooglePlacesAutocomplete
          placeholder="Enter Your Location"
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            //   console.log(data);

            // console.log('lat', lat)
            // console.log('long', long)
           
          }}
          getDefaultValue={() => {
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyBm-xt-zBBtvE_AreqkHODWIsNvkrsU1Qw',
            language: 'en', // language of the results
            types: 'address', // default: 'geocode'
            //  components:'country:uk'
          }}
          styles={{
            textInput: {
              fontSize: wp(4),
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: '#f5f5f5',
              borderColor:SECONDARY_GRADIENT_COLOR,
              borderWidth:2
            },
            textInputContainer: {
              width: wp('90%'),
              alignSelf: 'center',
              marginTop:hp(3),
            
            },
      
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: ['formatted_address', 'geometry'],
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        />
          <TouchableOpacity
          style={{alignSelf: 'center',marginBottom:10}}
          onPress={()=>props.navigation.goBack()}

          >
          <LinearGradient
            colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              width: wp('90%'),
              height: hp('7%'),
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: hp(2.5),
                fontFamily: 'Proxima Nova',
                fontWeight: '700',
              }}>
              Save Location!
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}
            </MapView>
            
      <View
        style={{
          backgroundColor: 'rgb(249, 168, 77)',
          width: wp('14%'),
          height: hp('7%'),
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: hp(2),
          left: hp(2),
        }}>
        <Icon
          name="chevron-back-sharp"
          type="ionicon"
          size={hp(5)}
          color="#DA6317"
          onPress={()=>props.navigation.goBack()}

        />
      </View>
      <View
        style={{
          backgroundColor: 'rgb(249, 168, 77)',
          width: wp('14%'),
          height: hp('7%'),
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: hp(2),
          right: hp(2),
        }}>
        <Icon name="location" type="ionicon" size={hp(5)} color="#DA6317" />
      </View>
         <Icon
            name="location"
            type="ionicon"
            color={SECONDARY_GRADIENT_COLOR}
            size={hp(7)}
            containerStyle={{position:'absolute',top:wp(80),left:wp(45)}}
          /> 
          <View style={{ position:'absolute',
              top:wp(22),
              left:wp(4)}}>
             <GooglePlacesAutocomplete
          placeholder="Find Your Location"
        
          autoFocus={false}
          fetchDetails={true}
        
          onPress={(data, details) => {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${details.geometry.location.lat},${details.geometry.location.lng}&key=`).then(res=>res.json()).then(data=>
            {
              setLat(details.geometry.location.lat)
              setLong(details.geometry.location.lng)
              setLoc(data.results[0].formatted_address)
             setCity(data.results[0].address_components[data.results[0].address_components.length-3].long_name)
             setCountry(data.results[0].address_components[data.results[0].address_components.length-1].long_name)
        
            }
              ).catch(err=>console.log(err))
           
            // 'details' is provided when fetchDetails = true
            //   console.log(data);

            // console.log('lat', lat)
            // console.log('long', long)
           
          }}
          getDefaultValue={() => {
          }}
          
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: '',
            language: 'en', // language of the results
            types: 'address', // default: 'geocode'
            //  components:'country:uk'
          }}
          textInputProps={{
            placeholderTextColor:'#000',
            defaultValue:loc,
            value:(onfocusinput)?null:loc,
            onFocus:()=>{
              setonfocusInput(true)
            },
            onBlur:()=>{
              setonfocusInput(false)
            }
            
          }}
          styles={{
            textInput: {
              fontSize: wp(4),
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: '#f5f5f5',
              borderColor:SECONDARY_GRADIENT_COLOR,
              borderWidth:2,
              color:'black',
             
            },
            textInputContainer: {
              width: wp('90%'),
             
            
            },
      
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food' | 'fire_station' | 'shopping_mall' | 'bakery' | 'department_store',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: ['formatted_address', 'geometry'],
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        />
        </View>
        <View style={{width:wp('90%'),height:'auto',paddingVertical:hp(1.5),backgroundColor:'white',borderRadius:15,alignSelf:'center',
        shadowColor: '#5A6CEA12',
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 2,
        position:'absolute',
        top:hp(57)
        }}>
                 <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.2),
            color: 'grey',
            fontWeight: '700',
            width: wp('80%'),
            marginLeft: hp(1),
            alignSelf:'center'
          }}>
          Your Location
        </Text>
        <Input
            allowFontScaling={false}
            placeholder="Location name"
            onChangeText={text => set_location_title(text)}
            containerStyle={{width: wp('88%'), alignSelf: 'center',marginTop:wp(5)}}
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
                name="location"
                type="ionicon"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
          />
            <View style={{width:wp('80%'),alignSelf:'center',flexDirection:'row',marginTop:hp(2)}}>
                <Image source={require('./../../assets/images/pin-logo.png')} style={{width:50,height:50}} />
                <View>
         
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2),
            color: 'black',
            fontWeight: '700',
            width: wp('60%'),
            marginLeft: hp(1),
          }}>
          {loc}
        </Text>
                </View>
            
            </View>
            <TouchableOpacity style={{alignSelf: 'center'}}
            onPress={()=>addNewAddress()}
            >
          <LinearGradient
            colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              width: wp('80%'),
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
            Set Location
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
  },
  logoImageSize: {
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
});
export default NewAddress;
