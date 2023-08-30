import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  VirtualizedList,
  Animated
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from './../../assets/colors';
import {LOGO} from '../../assets/imageConstant';
import {
  getCategoriesData,
  getProductsData,
  setSingleProductData,
  getAddressesByUser,
  getOrders
} from '../redux/actions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input, Icon, Card} from '@rneui/base';
import Carousel from 'react-native-snap-carousel';
import {useSelector, useDispatch} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {baseUrlforImage} from '../constants/baseurl';
import { GetItem } from '../local-storage/function';
import store from '../redux';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useIsFocused } from "@react-navigation/native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators'
const Home = props => {
  const [selectedCat, setSelectedCat] = useState(0);
  const state = useSelector(state => state);
  const [loader, setLoader] = useState(true);
  const [animationBottom] = React.useState(new Animated.Value(0))
  const [mrgBottom,setMrgBottom] = React.useState(0)
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetch = async () => {
      const userData = await GetItem('user')
      if(userData !== null){
        const parseData = await JSON.parse(userData)
        await dispatch(getOrders(parseData.email))
        await setLoader(false);
        await dispatch(getAddressesByUser(parseData.email))
      }
   
    };
 
    if (isFocused) {
      fetch();
    }
  }, [isFocused]);
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
      outputRange:[-hp('17%'),0],
      extrapolate: 'clamp',
    })

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: 'floralwhite',
          borderRadius: 5,
          height: hp('15%'),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 11.95,
          elevation: 2,
        }}>
        <Image
          source={{
            uri: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?w=740&t=st=1655277133~exp=1655277733~hmac=67c9ad639c0c353d9ca4a2c95c5e81df7e80deeb8c12058223bf0b0023d4e84a',
          }}
          style={{width: wp('45%'), height: hp('45%')}}
        />
        <Text style={{fontSize: hp(2)}}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
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

      <View style={[styles.container,{marginBottom:store.getState().viewOrdersonHome.length>0?hp('10%'):null}]}>
        <ScrollView>
          <View style={{height: hp('2%')}} />
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Viga-Regular',
                  fontSize: hp(4),
                  color: 'black',
                  fontWeight: '700',
                  width: wp('70%'),
                }}>
                Find Your
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Viga-Regular',
                  fontSize: hp(4),
                  color: 'black',
                  fontWeight: '700',
                  width: wp('70%'),
                }}>
                Favourite Food!
              </Text>
            </View>
            <View
              style={{
                width: wp('16%'),
                height: hp('8%'),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 15,
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,
                elevation: 2,
              }}>
              <Icon
                name="bell"
                color={PRIMARY_GRADIENT_COLOR}
                type="feather"
                size={wp(8)}
              />
            </View>
          </View>
          <View style={{height: hp('2%')}} />
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Input
              allowFontScaling={false}
              placeholder="What do you want to order?"
              containerStyle={{width: wp('81%'), marginLeft: wp(-2.5)}}
              inputContainerStyle={{
                borderRadius: 8,
                borderColor: '#F4F4F4',
                borderWidth: 2,
                paddingLeft: 10,
                fontSize: hp(2.2),
                color: '#DA6317',
                fontFamily: 'Proxima Nova',
                backgroundColor: 'rgba(249, 168, 77, 0.1)',
              }}
              inputStyle={{
                fontSize: hp(2.3),
                color: '#DA6317',
                fontFamily: 'Proxima Nova',
              }}
              placeholderTextColor={'#DA6317'}
              leftIcon={
                <Icon
                  name="search"
                  type="material"
                  color={'#DA6317'}
                  size={wp(8)}
                />
              }
            />
            <View
              style={{
                backgroundColor: 'rgba(249, 168, 77,0.2)',
                width: wp('14%'),
                height: hp('7%'),
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="ios-options"
                type="ionicon"
                size={hp(5)}
                color="#DA6317"
                onPress={() => props.navigation.navigate('Filter')}
              />
            </View>
          </View>
          <Image
            source={require('./../../assets/images/promo-advertising.png')}
            style={{
              width: wp('95%'),
              height: hp('30%'),
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: wp(-8),
            }}
          />
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.6),
                color: 'black',
                fontWeight: 'bold',
                width: wp('70%'),
              }}>
              Categories
            </Text>
          </View>
          
          <View
            style={{width: wp('95%'), alignSelf: 'center', marginTop: hp(1.5)}}>
            <FlatList
              data={state.categoriesData.length > 0 ? state.categoriesData : []}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={{
                      width: 'auto',
                      height: hp('5%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: hp(4),
                      borderRadius: 25,
                      borderWidth: 2,
                      borderColor: SECONDARY_GRADIENT_COLOR,
                      marginLeft: index > 0 ? hp(2) : null,
                      backgroundColor:
                        selectedCat === index ? 'rgba(197,129,249,0.3)' : null,
                    }}
                    onPress={() => setSelectedCat(index)}>
                    <Text
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2.3),
                        color: 'black',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
    
         
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.6),
                marginTop: hp(2),
                color: 'black',
                fontWeight: 'bold',
              }}>
              Deals
            </Text>
           
          </View>
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
            }}>
            <FlatList
              data={
                state.deals.length > 0
                  ? state.deals
                  : [1, 2, 3, 4, 5, 6, 6, 7, 7]
              }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={{
                      width: wp('45%'),
                      paddingVertical: hp(1.5),
                      backgroundColor: 'white',
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 9,
                      },
                      marginLeft: index > 0 ? hp(2) : hp(0.5),
                      marginRight:
                        index === [1, 2, 3, 4, 5, 6, 6, 7, 7].length - 1
                          ? hp(0.5)
                          : null,
                      shadowOpacity: 0.48,
                      shadowRadius: 11.95,
                      marginTop: hp(1),
                      marginBottom: hp(2),
                      elevation: 6,
                    }}
                    onPress={() => {
                      dispatch(setSingleProductData(item));
                      props.navigation.navigate('DealDescription');
                    }}>
                    {loader ? (
                      <View style={{alignSelf: 'center'}}>
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            width={100}
                            height={100}
                            borderRadius={50}
                          />
                        </SkeletonPlaceholder>
                      </View>
                    ) : (
                      <Image
                        source={{uri: `${baseUrlforImage}${item.image}`}}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          alignSelf: 'center',
                        }}
                      />
                    )}
                    {loader ? (
                      <View style={{alignSelf: 'center', marginTop: hp(2)}}>
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            width={100}
                            height={20}
                            borderRadius={4}
                          />
                        </SkeletonPlaceholder>
                      </View>
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.4),
                          marginTop: hp(2),
                          color: 'black',
                          fontWeight: '700',
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                    )}
                    {loader ? (
                      <View style={{alignSelf: 'center', marginTop: hp(2)}}>
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            width={80}
                            height={20}
                            borderRadius={4}
                          />
                        </SkeletonPlaceholder>
                      </View>
                    ) : (
                      <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            marginTop: hp(0.5),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '600',
                            marginLeft: hp(0.5),
                            alignSelf: 'center',
                          }}>
                          Rs.
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2.4),
                            marginTop: hp(0.5),
                            color: 'black',
                            fontWeight: '700',
                          }}>
                          {item.standard_rate}
                        </Text>
                      </View>
                    )}

                    <Icon
                      name="ios-heart-sharp"
                      type="ionicon"
                      color="#d60265"
                      containerStyle={{position: 'absolute', top: 5, right: 5}}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View
            style={{
              width: wp('95%'),
              alignSelf: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.6),
                marginTop: hp(1.5),
                color: 'black',
                fontWeight: 'bold',
              }}>
              Recommended for you
            </Text>
          
          </View>
          <FlatList
            data={
              state.productlist.length > 0
                ? state.productlist
                : [1, 2, 3, 4, 5, 56, 6, 7, 7]
            }
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: wp('90%'),
                    paddingVertical: hp(1.5),
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    flexDirection: 'row',
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,
                    marginTop: hp(1),
                    marginBottom: hp(2),
                    elevation: 6,
                  }}
                  onPress={() =>{ 
                    dispatch(setSingleProductData(item));
                    if(item.has_variants===1) {
                      props.navigation.navigate('PizzaDescription')

                    }
                    else{
                      props.navigation.navigate('Description')

                    }
                   }}>
                  {loader ? (
                    <View style={{marginLeft: hp(2)}}>
                      <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item
                          width={80}
                          height={80}
                          borderRadius={40}
                        />
                      </SkeletonPlaceholder>
                    </View>
                  ) : (
                    <Image
                      source={{uri: `${baseUrlforImage}${item.image}`}}
                      style={{width: 80, height: 80, marginLeft: hp(1.5)}}
                    />
                  )}
                  <View style={{marginLeft: hp(1), alignSelf: 'center'}}>
                    {loader ? (
                      <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item
                          width={140}
                          height={20}
                          borderRadius={4}
                        />
                      </SkeletonPlaceholder>
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.4),
                          color: 'black',
                          fontWeight: '700',
                          width:wp('50%')
                        }}>
                        {item.name}
                      </Text>
                    )}

                    {loader ? (
                      <View style={{marginTop: hp(1)}}>
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            width={80}
                            height={20}
                            borderRadius={4}
                          />
                        </SkeletonPlaceholder>
                      </View>
                    ) : (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            marginTop: hp(0.5),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '600',
                            marginLeft: hp(0.5),
                            alignSelf: 'center',
                          }}>
                          Rs.
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2.4),
                            marginTop: hp(0.5),
                            color: 'black',
                            fontWeight: '700',
                          }}>
                          {item.standard_rate}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Icon
                    name="ios-heart-sharp"
                    type="ionicon"
                    color="#d60265"
                    containerStyle={{position: 'absolute', top: 5, right: 5}}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
     
      </View>
      {(store.getState().viewOrdersonHome.length>0)?
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
         height: hp('28%'),
         position: 'absolute',
         bottom:actionSheetInterpolate,
       }}>
 

      
       <View
         style={{
           backgroundColor: SECONDARY_GRADIENT_COLOR,
           height: hp('12%'),
         }}>
           <View style={{width:wp('15%'),height:hp('.8%'),marginTop:wp(2),borderRadius:15,alignSelf:'center',backgroundColor:'white'}}></View>
           <PulseIndicator color="#AEC670" size={hp(5)} style={{marginTop:hp(1)}} />

         <Text
           allowFontScaling={false}
           style={{
             fontFamily: 'Proxima Nova',
             fontSize: hp(2.5),
             color: 'white',
             fontWeight: '700',
             alignSelf: 'center',
             marginTop: wp(1),
           }}>
           {store.getState().viewOrdersonHome.length} {store.getState().viewOrdersonHome.length > 1 ? 'Orders are' : 'Order is'} in progress
         </Text>
         <View
           style={{
             flexDirection: 'row',
             marginTop: wp(3),
             width: wp('90%'),
             alignSelf: 'center',
           }}>
       
         </View>
       </View>
       <View style={{backgroundColor:'white',height:hp('30%')}}>
       <Text
           allowFontScaling={false}
           style={{
             fontFamily: 'Proxima Nova',
             fontSize: hp(2.2),
             fontWeight: '700',
             marginTop: wp(2),
             marginLeft:wp(2)
           }}>
          On Going Orders
         </Text>
         <View
              style={{width: wp('95%'), alignSelf: 'center', marginTop: hp(1.5)}}>
              <FlatList
                data={store.getState().viewOrdersonHome}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        width:'auto',
                        height: hp('10%'),
                        paddingHorizontal: hp(.5),
                        borderRadius: 8,
                        marginLeft: index > 0 ? hp(2) : null,
                        backgroundColor:'white',
                        borderColor:'gray',
                        borderWidth:1
                      }}
                      onPress={()=>props.navigation.navigate('OrderTrack',{
                          data:item
                      })}
                      >
                        <View style={{flexDirection:'row'}}>
                
                        <PulseIndicator color="#AEC670" size={hp(5)} style={{}} />
                        <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'black',
                          fontWeight:'bold',
                          alignSelf:'center'
                        }}>
                        Order No# {item.name.substring(8,item.name.length)}
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 'auto',
                          height: hp('2.7%'),
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingHorizontal: hp(2),
                          borderRadius: 25,
                          borderWidth: 2,
                          marginLeft:wp(3),
                          alignSelf:'center',
                          borderColor: SECONDARY_GRADIENT_COLOR,
                          backgroundColor: 'rgba(197,129,249,0.3)',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(1.8),
                            color: 'black',
                          }}>
                          {item.order_status}
                        </Text>
                      </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',marginLeft:wp(2)}}>
                            <Icon
                            name='location'
                            type='ionicon'
                            />
                              <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                          fontWeight:'bold',
                          alignSelf:'center',
                          width:wp('50%')
                        }}>
                        {item.shipping_address.substring(0,22)}...
                      </Text>
                        </View>
  
                    
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
                    </View>
     </Animated.View>
     </PanGestureHandler>
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
export default Home;
