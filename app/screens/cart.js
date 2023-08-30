import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {
  BACKGROUND_COLOR,
  SECONDARY_GRADIENT_COLOR,
  PRIMARY_GRADIENT_COLOR,
} from '../../assets/colors';
import {
  getCategoriesData,
  getProductsData,
  getDetailDealData,
  setCartQuantity,
} from '../redux/actions';
const {width, height} = Dimensions.get('screen');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input, Icon} from '@rneui/base';
import {DeleteItem, GetItem, StoreItem} from './../local-storage/function';
import {baseUrlforImage} from '../constants/baseurl';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';

const RenderRight = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [-50, 0.5],
    outputRange: [1, 0.1],
  });

  const Style = {
    transform: [
      {
        scale,
      },
    ],
  };

  return (
    <View
      style={{
        width: wp('25%'),
        height: hp('15%'),
        backgroundColor: '#FEAD1D',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: hp(3),
        marginLeft: hp(-5),
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: hp(2),
      }}>
      <Animated.View style={Style}>
        <Icon name="trash-sharp" type="ionicon" color={'white'} />
      </Animated.View>
    </View>
  );
};
const InlineTextComponent = props => {
  return (
    <Text
      allowFontScaling={false}
      style={{
        fontFamily: 'Proxima Nova',
        fontSize: hp(1),
        color: 'gray',
        fontWeight: '700',
        width: wp('70%'),
        marginLeft: hp(3),
      }}>
      {props.name},
    </Text>
  );
};
const RenderItem = ({item, index, deleteItem, data}) => {
  const getTotalPriceofIndividualItem = prod => {
    if (prod.isDeal) {
      var suma = 0;
      prod.items.forEach(is => {
        is.extraToppings.forEach(im => {
          suma += im.rate;
        });
      });
      suma += prod.price;
      return suma * prod.qty;
    } else {
      var sum = 0;
      if (prod.extraToppings !== undefined) {
        var sum = 0;
        prod.extraToppings.forEach(i => {
          sum += i.rate;
        });
        sum += prod.price;
        return sum * prod.qty;
      } else {
        return prod.price * prod.qty;
      }
    }
  };
  return (
    <GestureHandlerRootView>
      <Swipeable
        useNativeAnimations
        overshootLeft={false}
        overshootRight={false}
        onSwipeableRightOpen={() => deleteItem(item.id)}
        renderRightActions={RenderRight}>
        <View
          style={{
            width: wp('90%'),
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: 15,
            alignSelf: 'center',
            shadowColor: '#5A6CEA12',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 2,
            marginTop: hp(2),
            paddingLeft: hp(2),
            paddingVertical: hp(1),
            marginBottom: index === data.length - 1 ? hp(2) : null,
          }}>
          <View
            style={{
              width: wp('90%'),
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri: `${baseUrlforImage}${
                    item.isDeal ? item.items[0].img : item.image
                  }`,
                }}
                style={{width: 80, height: 80, alignSelf: 'center'}}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignSelf: 'center'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'Proxima Nova',
                      fontSize: hp(2.2),
                      width: wp('70%'),
                      color: 'black',
                      marginLeft: hp(1),
                    }}>
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: wp('65%'),
                    }}>
                    {item.isDeal
                      ? item.items.map(it => {
                          return it.extraToppings.map((sf, index) => {
                            return (
                              <Text style={{marginLeft: hp(1), color: 'gray'}}>
                                {sf.name},
                              </Text>
                            );
                          });
                        })
                      : item.extraToppings !== undefined
                      ? item.extraToppings.map(ite => {
                          return (
                            <Text style={{marginLeft: hp(1), color: 'gray'}}>
                              {ite.name},
                            </Text>
                          );
                        })
                      : null}
                  </View>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'Proxima Nova',
                      fontSize: hp(2.2),
                      width: wp('70%'),
                      color: 'black',
                      marginLeft: hp(1),
                    }}>
                    Quantity: {item.qty}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'Proxima Nova',
                      fontSize: hp(3),
                      color: SECONDARY_GRADIENT_COLOR,
                      width: wp('70%'),
                      fontWeight: '700',
                      marginLeft: hp(1),
                    }}>
                    Rs. {getTotalPriceofIndividualItem(item)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default function Cart(props) {
  const isFocused = useIsFocused();

  const [data, setData] = useState([]);
  const [onScrollStart, setOnScrollStart] = useState(true);
  const [displayerVisible, setDisplayerVisible] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const fetch = async () => {
      const storageData = await GetItem('CartData');
      if (storageData !== null) {
        const storageDataparse = await JSON.parse(storageData);
        const price = await CountCartAmount(storageDataparse);
        setData(storageDataparse);
        setSubTotal(price);
        setTotal(price);
      } else {
        setData([]);
      }
    };
    if (isFocused) {
      fetch();
    }
  }, [isFocused]);

  const deleteItem = async id => {
    const temp = data.filter(item => item.id !== id);
    if (temp.length > 0) {
      setData(temp);
      const abc = await CountCartAmount(temp);
      setSubTotal(abc);
      setTotal(abc);
      dispatch(setCartQuantity(temp));
      StoreItem('CartData', temp);
    } else {
      setData([]);
      setTotal(0);
      setSubTotal(0);
      dispatch(setCartQuantity([]));
      DeleteItem('CartData');
    }
  };
  const CountCartAmount = async cardData => {
    let price = 0;

    if (cardData !== null && cardData.length > 0) {
      for (let i = 0; i < cardData.length; i++) {
        price += cardData[i].price * cardData[i].qty;
        if (cardData[i].isDeal) {
          for (let j = 0; j < cardData[i].items.length; j++) {
            //Loop on items toppings
            for (
              let k = 0;
              k < cardData[i].items[j].extraToppings.length;
              k++
            ) {
              //console.log(cardData[i].items[j].extraToppings[k].name,cardData[i].items[j].extraToppings[k].rate);
              price +=
                cardData[i].items[j].extraToppings[k].rate * cardData[i].qty;
            }
          }
        } else {
          if (cardData[i].extraToppings !== undefined) {
            for (let j = 0; j < cardData[i].extraToppings.length; j++) {
              //Loop on toppings
              price += cardData[i].extraToppings[j].rate * cardData[i].qty;
            }
          }
        }
        //Loop on items
      }

      //console.log(price);
    }
    console.log('pticaaaa', price);
    return price;

    //console.log(JSON.stringify(cardData, null,2));
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
        {data.length > 0 ? (
          <>
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
              Cart Items
            </Text>
            <View style={{height: hp('3%')}} />
            <FlatList
              data={data}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: hp(3), fontWeight: 'bold'}}>
                    NO ITEMS TO DISPLAY
                  </Text>
                </View>
              )}
              onScrollBeginDrag={() => setOnScrollStart(false)}
              onScrollToTop={() => setOnScrollStart(true)}
              renderItem={({item, index}) => (
                <>
                  <RenderItem
                    item={item}
                    index={index}
                    data={data}
                    deleteItem={deleteItem}
                  />
                </>
              )}
            />

            {data.length > 2 && onScrollStart ? (
              <View
                style={{
                  position: 'absolute',
                  right: wp('20%'),
                  bottom: hp(32),
                  backgroundColor: SECONDARY_GRADIENT_COLOR,
                  width: wp('60%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'auto',
                  paddingVertical: hp(1),
                  borderRadius: 25,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  Scroll for more Items
                </Text>
              </View>
            ) : null}

            <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('90%'),
                height: hp('27%'),
                borderRadius: 15,
                alignSelf: 'center',
                marginTop: hp(3),
                bottom: hp(2),
              }}>
              <Image
                source={require('./../../assets/images/Group.png')}
                style={{
                  width: wp('90%'),
                  height: 200,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  opacity: 0.2,
                }}
              />
              <View
                style={{
                  width: wp('80%'),
                  alignSelf: 'center',
                  marginTop: hp(1.5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  Sub Total
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  {subTotal} PKR
                </Text>
              </View>
              <View
                style={{
                  width: wp('80%'),
                  alignSelf: 'center',
                  marginTop: hp(0.5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  Discount
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  0 PKR
                </Text>
              </View>
              <View
                style={{
                  width: wp('80%'),
                  alignSelf: 'center',
                  marginTop: hp(0.5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  Delivery Charge
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.5),
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  0 PKR
                </Text>
              </View>
              <View
                style={{
                  width: wp('80%'),
                  alignSelf: 'center',
                  marginTop: hp(1.4),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(3),
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  Total
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(3),
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  {total} PKR
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  data.length > 0
                    ? props.navigation.navigate('Checkout')
                    : alert('First Add items to cart')
                }
                style={{
                  width: wp('80%'),
                  alignSelf: 'center',
                  borderRadius: 15,
                  marginTop: hp(1),
                  paddingVertical: hp(1),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(3),
                    color: SECONDARY_GRADIENT_COLOR,
                    fontWeight: '700',
                  }}>
                  Checkout
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <FastImage
              source={{uri: 'cart_empty', priority: FastImage.priority.high}}
              style={{width: 300, height: 250}}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(4),
                color: 'black',
                fontWeight: '700',
                textAlign: 'center',
                width: wp('80%'),
                marginTop: hp(3),
                alignSelf: 'center',
              }}>
              Your Cart is Empty!
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.5),
                color: 'black',
                textAlign: 'center',
                width: wp('90%'),
                alignSelf: 'center',
                marginTop: hp(3),
              }}>
              Order the best food in your town!
            </Text>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <LinearGradient
                colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  width: wp('45%'),
                  height: hp('6%'),
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
                  }}>
                  Order Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.9,
    marginVertical: 10,
  },
  likeDisplayer: {
    position: 'absolute',
    zIndex: 100000,
    left: '20%',
    top: '35%',
  },
});
