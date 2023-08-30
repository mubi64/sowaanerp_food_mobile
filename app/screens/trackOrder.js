import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  FlatList,
  Image,
  Animated
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
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useEffect} from 'react';
import DashedLine from 'react-native-dashed-line';
import {PanGestureHandler } from 'react-native-gesture-handler';
const TrackOrder = props => {
  const [loc, setLoc] = React.useState('');
  const [lat, setLat] = React.useState(24.8601);
  const [long, setLong] = React.useState(67.0565);
  const [longDelta, setLongDelta] = React.useState(0.0121);
  const [latDelta, setLatDelta] = React.useState(0.015);
  const [animationBottom] = React.useState(new Animated.Value(0))
  const [forceFully, setforceFully] = useState(Math.floor(Math.random() * 100));
  const [enablePan,setEnablePan] = useState(true)
  useEffect(() => {
    console.log(JSON.stringify(props.route.params.data,null,2))
  }, []);
  const onRegChange = reg => {};
  const bringUpActionSheet = ()=>{
    Animated.timing(animationBottom,{
      toValue:1,
      duration:300,
      useNativeDriver:false
    }).start()
  }
  const endUpActionSheet = ()=>{
    Animated.timing(animationBottom,{
      toValue:0,
      duration:300,
      useNativeDriver:false
    }).start()
  }

    const actionSheetInterpolate = animationBottom.interpolate({
      inputRange:[0,1],
      outputRange:[-hp('27%'),0],
      extrapolate: 'clamp',
    })

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <MapView
        style={{width: wp('100%'), height: hp('100%')}}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        }}
        minZoomLevel={13}
        maxZoomLevel={20}
     >
          <Marker
            coordinate={{
              latitude:24.8601,
              longitude:67.0565,
              latitudeDelta:0.03,
              longitudeDelta:0.03
            }}
            image={require('./../../assets/images/home_marker1.png')}
            
          />
          <Marker
            coordinate={{
              latitude:24.8653,
              longitude:67.0562,
              latitudeDelta:0.03,
              longitudeDelta:0.03
            }}
            image={require('./../../assets/images/rider_image.png')}
            
          />
      </MapView>
      
      <PanGestureHandler
        // activeOffsetX={[-10, 10]}
        /* or */
        activeOffsetY={[-10, 10]}
      onGestureEvent={(e)=>{
               if(e.nativeEvent.translationY<0){
                bringUpActionSheet()
               }
               else if(e.nativeEvent.translationY>0){
                endUpActionSheet()
               }
                  }}
                
      >
   
      <Animated.View
        style={{
          width: wp('100%'),
          height: hp('45%'),
          position: 'absolute',
          bottom:actionSheetInterpolate,
        }}>
  

       
        <View
          style={{
            backgroundColor: SECONDARY_GRADIENT_COLOR,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: hp('18%'),
          }}>
            <View style={{width:wp('15%'),height:hp('1%'),marginTop:wp(2),borderRadius:15,alignSelf:'center',backgroundColor:'white'}}></View>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'white',
              fontWeight: '700',
              alignSelf: 'center',
              marginTop: wp(2),
            }}>
            Estimated delivery time is 6:19 PM
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: '#f5f5f5',
              fontWeight: '700',
              alignSelf: 'center',
              marginTop: wp(2),
            }}>
            Your order is already on its way
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: wp(3),
              width: wp('90%'),
              alignSelf: 'center',
            }}>
              <Icon name="receipt" type="material" size={wp(8)} color={(props.route.params.data.order_status === "Pending" || props.route.params.data.order_status === "Preparing" || props.route.params.data.order_status === "On The Way")?"#AEC670":"white"} />
            <View style={{alignSelf:'center'}}>
              <DashedLine style={{width:wp('15%'),marginLeft:wp(3)}}  dashLength={5} dashColor={(props.route.params.data.order_status === "Preparing" || props.route.params.data.order_status === "On The Way")?"#AEC670":"white"} />
            </View>
            <Icon name="pizza" type="ionicon" size={wp(8)} color={(props.route.params.data.order_status === "Preparing" || props.route.params.data.order_status === "On The Way")?"#AEC670":"white"} containerStyle={{marginLeft:wp(3)}} />
            <View style={{alignSelf:'center'}}>
              <DashedLine style={{width:wp('15%'),marginLeft:wp(3)}}  dashLength={5} dashColor={(props.route.params.data.order_status === "On The Way")?"#AEC670":"white"} />
            </View>
            <Icon name="bike-fast" type="material-community" size={wp(8)} color={(props.route.params.data.order_status === "On The Way")?"#AEC670":"white"} containerStyle={{marginLeft:wp(3)}} />
            <View style={{alignSelf:'center'}}>
              <DashedLine style={{width:wp('10%'),marginLeft:wp(3)}}  dashLength={5} dashColor="white" />
            </View>
            <Icon name="checkcircle" type="antdesign" size={wp(8)} color="white" containerStyle={{marginLeft:wp(3)}} />

          </View>
        </View>
        <View style={{backgroundColor:'white',height:hp('27%')}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              fontWeight: '700',
              marginTop: wp(2),
              marginLeft:wp(2)
            }}>
            Ordered Items 
          </Text>
        <FlatList
                       data={[
                         'All',
                         'SeaFood',
                         'Salad',
                         'Pizza',
                         'Burgers',
                         'Drinks',
                       ]}
                       horizontal={true}
                       style={{marginTop: hp(1)}}
                       showsHorizontalScrollIndicator={false}
                       renderItem={({item, index}) => {
                         return (
                           <View
                             style={{
                               width: 'auto',
                               paddingVertical: hp(1.5),
                               flexDirection: 'row',
                               borderRightColor: '#D3D3D3',
                               borderRightWidth: 1,
                               paddingHorizontal: hp(1.5),
                               height:hp('12%')
                             }}>
                             <Image
                               source={require('./../../assets/images/pizza-pic.png')}
                               style={{width: 70, height: 70, borderRadius: 15}}
                             />
                             <View style={{alignSelf:'center'}}>
                               <Text
                                 allowFontScaling={false}
                                 style={{
                                   fontFamily: 'Proxima Nova',
                                   fontSize: hp(2),
                                   color: 'black',
                                   fontWeight: '700',
                                   marginLeft: hp(0.5),
                                 }}>
                                 {item}
                               </Text>
                               <Text
                                 allowFontScaling={false}
                                 style={{
                                   fontFamily: 'Proxima Nova',
                                   fontSize: hp(2),
                                   fontWeight: '700',
                                   marginLeft: hp(0.5),
                                 }}>
                                 500 PKR x2
                               </Text>
                               <Text
                                 allowFontScaling={false}
                                 style={{
                                   fontFamily: 'Proxima Nova',
                                   fontSize: hp(2),
                                   fontWeight: '700',
                                   marginLeft: hp(0.5),
                                  //  marginTop: hp(0.5),
                                 }}>
                                 1000 PKR
                               </Text>
                             </View>
                           </View>
                         );
                       }}
            />
            {(props.route.params.data.order_status === 'Pending') ?
                 <TouchableOpacity style={{width:wp('80%'),height:hp('6%'),borderColor:'red',borderWidth:2,borderRadius:8,alignSelf:'center',position:'absolute',bottom:wp(3),alignItems:'center',justifyContent:'center'}}>
                     <Text
                            allowFontScaling={false}
                            style={{
                              fontFamily: 'Proxima Nova',
                              fontSize: hp(2),
                              fontWeight: '700',
                              color:'red',
                              alignSelf:'center'
                             //  marginTop: hp(0.5),
                            }}>
                            CANCEL YOUR ORDER
                          </Text>
            

              </TouchableOpacity>
              :
              null
            }
                  
                     </View>
      </Animated.View>
      </PanGestureHandler>
      <View
        style={{
          backgroundColor: 'white',
          width: wp('14%'),
          height: hp('7%'),
          borderRadius: 15,
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
          onPress={() => props.navigation.goBack()}
        />
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
export default TrackOrder;
