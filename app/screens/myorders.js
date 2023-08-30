import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  FlatList,
  ScrollView,
  Image,
  Animated,
  Pressable,
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
import {GetItem} from '../local-storage/function';
import {getAddressesByUser, getOrders} from '../redux/actions';
import store from '../redux';
import Toast from 'react-native-toast-message';
import {urlForSignUp} from '../constants/baseurl';
import {RotationGestureHandler} from 'react-native-gesture-handler';
import {useScrollToTop} from '@react-navigation/native';
import GetMethod from '../network calls/get';
import {baseUrlforImage} from '../constants/baseurl';
import FastImage from 'react-native-fast-image';
const MyOrders = props => {
  const disptach = useDispatch();
  const ref = React.useRef(null);
  const [animated, setBounceValue] = useState(new Animated.Value(-50));
  const orderItemAnimation = useRef(new Animated.Value(0)).current;
  const duration = 1000;
  const [selectedItem, setSelectedItem] = useState('All');
  const [orderData, setOrderData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  //Is the animated view hidden or not?
  const [isHidden, setIsHidden] = useState(true);
  const [viewItems, setViewItems] = useState(true);
  const [animationBottom] = React.useState(new Animated.Value(0));
  const [loader, setLoader] = React.useState(true);
  const [detailsObj, setDetailsObj] = React.useState(null);

  //I toggle the animated slide with this method
  const toggleSlide = () => {
 
    if (isHidden) {
      setIsHidden(false);

      //Here I hide (slide down) the animated View container

      Animated.timing(orderItemAnimation, {
        toValue:hp('25%'),
        duration: duration,
        useNativeDriver:false,
      }).start(() => {

      });
      // Animated.timing(animated, {
      //   toValue: 0,
      //   duration: duration,
      //   useNativeDriver: true,
      // }),
    }

    // Animated.spring(
    //   bounceValue,
    //   {
    //     toValue: toValue,
    //     velocity: 3,
    //     tension: 2,
    //     friction: 8,
    //     useNativeDriver: true
    //   }
    // )
    else {
      Animated.timing(orderItemAnimation, {
        toValue: 0,
        duration: duration,
        useNativeDriver:false,
      }).start(() => {
        setIsHidden(true);
      });
      // Animated.timing(animated, {
      //   toValue: 0,
      //   duration: duration,
      //   useNativeDriver: true,
      // }),
    }
  };
  const getTimeofOrder = time => {
    const arrayOfItems = time.split(' ');
    return arrayOfItems[1].substring(0, 5);
  };
  const bringUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const endUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const actionSheetInterpolate = animationBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [-hp('100%'), 0],
    extrapolate: 'clamp',
  });

  React.useEffect(() => {
    const fetch = async () => {
      var array = [];
      store.getState().ordersData.forEach(async (item, index) => {
        const lt = await getAddresslat(item.customer_address);
        const ln = await getAddresslong(item.customer_address);

        item.lat = lt;
        item.lng = ln;
        // console.log(JSON.stringify(item,null,2))
        if (index === store.getState().ordersData.length - 1) {
          array.push(item);
          await setOrderData(store.getState().ordersData);
          setLoader(false);
        } else {
          array.push(item);
        }
      });

      // setOrderData(store.getState().ordersData)
    };
    fetch();
  }, []);

  const getAddresslat = address_name => {
    const filteredArray = store.getState().addresses.filter(item => {
      return item.name === address_name;
    });

    return parseFloat(filteredArray[0].latitude);
  };
  const getItemsofOrder = async (saleOrderName, ind) => {
    setLoader(true);
    const data = await GetMethod(
      urlForSignUp,
      undefined,
      `method/frappe.client.get_list?doctype=Sales Order Item&parent=Sales Order&fields=["item_code", "qty", "is_topping", "topings", "image","amount"]&filters=[["parent","=","${saleOrderName}"],["is_topping","=",0]]&page_length_limit=5000`,
    );
    console.log('my data',data)
    const parseData = await data.json();
    const arr = parseData.message.map(item => {
      const parseJSONdataToppings = JSON.parse(item.topings);
      item.topings = parseJSONdataToppings;
      return item;
    });
    console.log('dwdw', JSON.stringify(detailsObj, null, 2));
    setOrderItems(arr);
    setLoader(false);
    bringUpActionSheet();
  };
  const getAddresslong = async address_name => {
    const filteredArray = store.getState().addresses.filter(item => {
      return item.name === address_name;
    });
    return parseFloat(filteredArray[0].longitude);
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

      <View
        style={styles.container}
        onTouchEnd={() => {
          if (isHidden === false) {
            setIsHidden(true);
          }
        }}>
        <ScrollView
          onScrollBeginDrag={() => {
            setIsHidden(true);
          }}
          ref={ref}>
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
              onPressIn={() => props.navigation.goBack()}
            />
          </View>
          <View style={{height: hp('4%')}} />

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
              marginLeft: hp(3),
            }}>
            My Orders History
          </Text>
          <Pressable
            style={{
              width: wp('60%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: wp(3),
              alignSelf: 'flex-end',
              height: 'auto',
              borderRadius: wp(3),
              paddingVertical: hp(2),
              backgroundColor: 'white',
              borderColor: '#8f06e4',
              borderWidth: 1,
              marginTop: wp(3),
            }}
            onPress={() => toggleSlide()}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '700',
                marginLeft: wp(2),
              }}>
              {selectedItem}
            </Text>
            <Icon
              name="down"
              type="ant-design"
              size={hp(2.5)}
              containerStyle={{alignSelf: 'center', marginRight: wp(2)}}
              color={SECONDARY_GRADIENT_COLOR}
            />
          </Pressable>

          <View style={{height: hp('2%')}} />

          {orderData.map((item, index) => {
            return (
              <>
                <View
                  style={{
                    width: wp('96%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    borderRadius: 8,
                    alignSelf: 'center',
                    shadowColor: '#5A6CEA12',
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,
                    elevation: 10,
                    paddingVertical: hp(3),
                    borderWidth: 2,
                    borderColor: '#f5f5f5',
                  }}>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="receipt"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                          fontWeight: '700',
                          marginLeft: hp(1),
                          alignSelf: 'center',
                        }}>
                        Order Id # {item.name.substring(8, item.name.length)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 'auto',
                        height: hp('3.5%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: hp(2),
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: SECONDARY_GRADIENT_COLOR,
                        backgroundColor: 'rgba(197,129,249,0.3)',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                        }}>
                        {item.order_status}
                      </Text>
                    </View>
                  </View>
                  {/* <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      width: wp('90%'),
                      height: hp('15%'),
                      alignSelf: 'center',
                      marginTop: hp(2),
                    }}
                    region={{
                      latitude: item.lat,
                      longitude: item.lng,
                      latitudeDelta: 0.03,
                      longitudeDelta: 0.03,
                    }}
                    liteMode={true}>
                    <Marker
                      coordinate={{latitude: item.lat, longitude: item.lng}}>
                      <Icon
                        name="location"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                        size={hp(5)}
                      />
                    </Marker>
                  </MapView> */}
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order On
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        {/* Total Items: {item.total_qty} */}{' '}
                        {item.delivery_date} {getTimeofOrder(item.creation)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order Quantity
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Total Items: {item.total_qty}{' '}
                        {/* Total: {item.net_total} PKR */}
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order Cost
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Total: {item.net_total} PKR{' '}
                        {/* Total: {item.net_total} PKR */}
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1,
                          width: wp('30%'),
                          borderRadius: wp(1),
                          paddingVertical: wp(2.5),
                          backgroundColor: SECONDARY_GRADIENT_COLOR,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={() => {
                        setDetailsObj(item);
                        getItemsofOrder(item.name);
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        View Details
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{height: hp('2%')}} />
              </>
            );
          })}
        </ScrollView>
        {isHidden ? null : (
          <Animated.View
            style={[
              {
                width: wp('60%'),
                borderRadius: wp(2),
                borderWidth: 1,
                borderColor: 'lightgray',
                height:orderItemAnimation,
                position: 'absolute',
                top: wp(60),
                right: wp(3),
                backgroundColor: 'white',
              }
            ]}>
            {[
              'All',
              'Pending',
              'Preparing',
              'On the way',
              'Completed',
              'Cancel',
            ].map(item => {
              return (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    setSelectedItem(item);
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'Proxima Nova',
                      fontSize: hp(2),
                      fontWeight: '700',
                      marginLeft: wp(2),
                      paddingVertical: wp(1),
                    }}>
                    {item}
                  </Text>
                  {selectedItem === item ? (
                    <Icon
                      containerStyle={{
                        marginRight: wp(3),
                        paddingVertical: wp(1),
                      }}
                      name="check"
                      type="antdesign"
                      color="#8f06e4"
                      size={hp(2.5)}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </Animated.View>
        )}                                                                                                                                     
      </View>
      <Animated.View
        style={{
          width: wp('100%'),
          height: hp('100%'),
          position: 'absolute',
          bottom: actionSheetInterpolate,
          backgroundColor: 'white',
        }}>
        <View style={{height: hp('4%')}}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp('95%'),
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              fontWeight: 'bold',
              marginLeft: wp(4),
            }}>
            Ordered Details
          </Text>
          <Icon
            name="close"
            type="antdesign"
            size={wp(7)}
            color="black"
            containerStyle={{alignSelf: 'center'}}
            onPress={() => endUpActionSheet()}
          />
        </View>
        <View style={{height: hp('4%')}}></View>

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'black',
            fontWeight: '700',
            marginLeft: hp(1),
            alignSelf: 'center',
          }}>
          Order Id #{' '}
          {detailsObj
            ? detailsObj.name.substring(8, detailsObj.name.length)
            : null}
        </Text>

        <View style={{ height: hp('2%') }}></View>
        <ScrollView>
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Delivery Address
          </Text>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              width: wp('90%'),
              height: hp('20%'),
              alignSelf: 'center',
              marginTop: hp(2),
              borderRadius: hp(5),
            }}
            region={{
              latitude: detailsObj ? detailsObj.lat : 0,
              longitude: detailsObj ? detailsObj.lng : 0,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            liteMode={true}>
            <Marker
              coordinate={{
                latitude: detailsObj ? detailsObj.lat : 0,
                longitude: detailsObj ? detailsObj.lng : 0,
              }}>
              <Icon
                name="location"
                type="ionicon"
                color={SECONDARY_GRADIENT_COLOR}
                size={hp(5)}
              />
            </Marker>
          </MapView>
        </View>

        <View style={{height: hp('2%')}}></View>
        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Ordered Items
          </Text>
        </View>
        <View>
          {orderItems.length > 0 &&
            orderItems.map(item => {
              return (
                <View
                style={{
                  backgroundColor: 'white',
                  height: 'auto',
                  paddingVertical: hp(2),
                  width: wp('90%'),
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={{
                      uri: `${baseUrlforImage}${item.image}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60 / 2,
                      borderWidth: 2,
                      borderColor: SECONDARY_GRADIENT_COLOR,
                    }}
                    resizeMode="cover"
                  />
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                        width: wp('40%'),
                      }}>
                      {item.item_code}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: wp('45%'),
                        marginLeft: wp(1),
                        marginTop: wp(1),
                      }}>
                      {item.topings !== null
                        ? item.topings.map((ite, index) => {
                            return (
                              <Text style={{marginLeft: hp(1), color: 'gray'}}>
                                {ite.name +
                                  ' (' +
                                  item.qty +
                                  ' x ' +
                                  ite.rate +
                                  ' PKR)'}
                                {item.topings.length - 1 === index ? null : ','}
                              </Text>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                    marginLeft: wp(3),
                  }}>
                  {item.qty} x {item.amount} PKR
                </Text>
              </View>
             )
           })
          }
        </View>
  
        <View style={{height: hp('1%')}}></View>

        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center'}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
        
            }}>
             Sub-Total
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              
            }}>
           {detailsObj
            ? `${detailsObj.net_total} PKR`
            : null}
          </Text>
        </View>
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
             Delivery Charges
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
       
            }}>
           {detailsObj
            ? `${0} PKR`
            : null}
          </Text>
        </View>
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
             GST TAX
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
           {detailsObj
            ? `${0} PKR`
            : null}
          </Text>
        </View>
        <View style={{height: hp('1%')}}></View>

        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: "#AEC670",
              fontWeight: 'bold',
            }}>
             Total
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: "#AEC670",
              fontWeight: 'bold',
            }}>
             {detailsObj
            ? `${detailsObj.net_total} PKR`
            : null}
          </Text>
          </View>
          <View style={{ height: hp('4%') }}></View>
        </ScrollView>
      </Animated.View>
      {loader ? (
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('./../../assets/images/loader.gif')}
            style={{width: 200, height: 200}}
          />
        </View>
      ) : null}
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
export default MyOrders;
