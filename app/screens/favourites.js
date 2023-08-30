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
  FlatList
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

const Favourites = () => {
  const [changeLayout,setChangeLayout] = useState(false)
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
          Favourites
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:wp('92%'),alignSelf:'center'}}>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2),
            color: 'black',
            fontWeight: '600',
            width: wp('70%'),
            alignSelf:'center'
          }}>
          These are the favourite one of yours...
        </Text>
        {(changeLayout)?
         <Icon
         name='grid'
         type='entypo'
         size={hp(5)}
         containerStyle={{alignSelf:'center'}}
         onPress={()=>setChangeLayout(!changeLayout)}
        />
        :
        <Icon
        name='list'
        type='entypo'
        size={hp(5)}
        containerStyle={{alignSelf:'center'}}
        onPress={()=>setChangeLayout(!changeLayout)}

       />
        }
       
        </View>
       
      

        <View style={{height: hp('3%')}} />
        <View style={{width:wp('95%'),alignSelf:'center'}}>
            {(changeLayout)?
         <FlatList
         data={[1,2,3,4,5,56,6,7,7]}
         style={{marginBottom:hp(15)}}
        showsVerticalScrollIndicator={false}
         renderItem={({item})=>{
           return(
             <View style={{width:wp('90%'),paddingVertical:hp(1.5),alignSelf:'center',backgroundColor:'white',borderRadius:12, shadowColor: '#000',
             shadowOffset: {
               width: 0,
               height: 9,
             },
             flexDirection:'row',
             shadowOpacity: 0.48,
             shadowRadius: 11.95,
             marginTop:hp(1),
             marginBottom:hp(2),
             elevation: 6}}>
                 <Image source={require('./../../assets/images/pizza-pic.png')} style={{width:80,height:80,marginLeft:hp(1.5)}} />
                <View style={{marginLeft:hp(1),alignSelf:'center'}}>
                 <Text
             allowFontScaling={false}
             style={{
               fontFamily: 'Proxima Nova',
               fontSize: hp(2.5),
               color: 'black',
               fontWeight: '700',
               textAlign:'center'
             }}>
             Arabian Pizza Grill
           </Text>
           <View style={{flexDirection:'row'}}>
           <Text
             allowFontScaling={false}
             style={{
               fontFamily: 'Proxima Nova',
               fontSize: hp(2),
               marginTop: hp(.5),
               color:SECONDARY_GRADIENT_COLOR,
               fontWeight: '600',
               marginLeft:hp(.5),
               alignSelf:'center'
             }}>
             Rs.
           </Text>
           <Text
             allowFontScaling={false}
             style={{
               fontFamily: 'Proxima Nova',
               fontSize: hp(2.5),
               marginTop: hp(.5),
               color: 'black',
               fontWeight: '700',
             }}>
             1500
           </Text>
           
           </View>
           </View>
           <Icon name='ios-heart-sharp' type='ionicon' color='#d60265' containerStyle={{position:'absolute',top:5,right:5}} />
             </View>
           )
         }}
        />
        :
        <FlatList
        data={[1,2,3,4,5,6,6]}
        numColumns={2}
        key={Math.random() * 100000}
        style={{marginBottom:hp(15)}}
        showsVerticalScrollIndicator={false}
        renderItem={({item,index})=>{
         return(
           <View style={{width:wp('45%'),paddingVertical:hp(1.5),backgroundColor:'white',borderRadius:12, shadowColor: '#000',
           shadowOffset: {
             width: 0,
             height: 9,
           },
           marginLeft:(index%2===0)?hp(.5):hp(2),
           marginRight:(index===[1,2,3,4,5,6,6,7,7].length-1)?hp(.5):null,
           shadowOpacity: 0.48,
           shadowRadius: 11.95,
           marginTop:hp(1),
           marginBottom:hp(2),
           elevation: 6}}>
               <Image source={{uri:'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&w=1000&q=80'}} style={{width:100,height:100,borderRadius:50,alignSelf:'center'}} />
               <Text
           allowFontScaling={false}
           style={{
             fontFamily: 'Proxima Nova',
             fontSize: hp(2.5),
             marginTop: hp(2),
             color: 'black',
             fontWeight: '700',
             textAlign:'center'
           }}>
           Deals - 8
         </Text>
         <View style={{alignSelf:'center',flexDirection:'row'}}>
         <Text
           allowFontScaling={false}
           style={{
             fontFamily: 'Proxima Nova',
             fontSize: hp(2),
             marginTop: hp(.5),
             color:SECONDARY_GRADIENT_COLOR,
             fontWeight: '600',
             marginLeft:hp(.5),
             alignSelf:'center'
           }}>
           Rs.
         </Text>
         <Text
           allowFontScaling={false}
           style={{
             fontFamily: 'Proxima Nova',
             fontSize: hp(2.5),
             marginTop: hp(.5),
             color: 'black',
             fontWeight: '700',
           }}>
           9000
         </Text>
         
         </View>
         <Icon name='ios-heart-sharp' type='ionicon' color='#d60265' containerStyle={{position:'absolute',top:5,right:5}} />
           </View>
         )
        }}
        />
        }
   

        </View>

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
export default Favourites;
