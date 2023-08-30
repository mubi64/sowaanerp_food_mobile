import React, {useState,useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from '../../assets/colors';

import {baseUrlforImage} from '../constants/baseurl';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '@rneui/base';
import {
  getCategoriesData,
  getProductsData,
  getDetailDealData,
  setCartQuantity,
} from '../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import store from '../redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {GetItem,StoreItem} from './../local-storage/function'
import { forceTouchGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/ForceTouchGestureHandler';
const DealDescription = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const [selectDealProduct, setSelectDealProduct] = useState(0);
  const [keep, setKeep] = useState(false);
  const [email, setEmail] = useState(false);
  const [emaila, setEmaila] = useState(false);
  const [emaile, setEmaile] = useState(false);
  const [dealItemArr, setDealItemArr] = useState([]);
  const [billableArray, setBillableArray] = useState([]);
  const [flavourArray, setFlavourArray] = useState([]);
  const [dealItemForCart, setDealItemForCart] = useState([]);
  const [statte, updateState] = React.useState();
  const [quantity,setQuantity] = useState(1)
  const [forBillable,setForBillable] = useState(5)
  const [forFlavour,setForFlavour] = useState(5)
  const flavourMoreAnimation = useRef(new Animated.Value(hp('17%'))).current;
  const billableMoreAnimation = useRef(new Animated.Value(hp('17%'))).current;
  const [viewFullFlavours,setViewFullFlavours] = useState(false)
  const [viewFullBillable,setViewFullBillable] = useState(false)


  const forceUpdate = React.useCallback(() => updateState({}), []);

  //  React.useEffect(()=>{
  //    checkBillableItems(selectDealProduct)
  //  },[dealItemArr])
  React.useEffect(() => {
    const fetch = async () => {
      await dispatch(
        getDetailDealData(store.getState().singleProductData.name),
      );

      const dealsItemArr = [];
      for (let i = 0; i < store.getState().DealDetail.items.length; i++) {
        var item = store.getState().DealDetail.items[i];
        for (let index = 0; index < item.qty; index++) {
          let value = await getImage(item.item_code);
          dealsItemArr.push({
            ...item,
            id: dealsItemArr.length + 1,
            img: value,
            selectedFlavour: '',
            IsSelected: false,
          });
        }
      }
      const abc = dealsItemArr.map(item => {
        return {
          item_name: item.item_code,
          rate: 0,
          img:item.img,
          IsSelected: false,
          selectedFlavour: '',
          extraToppings: [],
        };
      });
      for (let i = 0; i < abc.length; i++) {
        let bool = await isItemPizza(abc[i].item_name);
        abc[i].isPizza = bool;
      }

      const array = [
        {
          name: store.getState().singleProductData.name,
          qty: 1,
          price: store.getState().singleProductData.standard_rate,
          items: abc,
          isDeal: true,
          notes: '',
          prefix: `${'MAZ'}-${new Date().getDate()}${
            new Date().getMonth() + 1
            }${new Date().getFullYear()}-${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`,
            station:store.getState().singleProductData.station,
            show_in_kitchen: store.getState().singleProductData.show_in_kitchen,
            status: "Making",
            made: false,
            ready: false,
            new:true,
            prevQuan: ''
        },
        
      ];
      await setDealItemForCart(array);
      await setDealItemArr(dealsItemArr);
      await checkBillableItems(selectDealProduct, dealsItemArr);
      await checkFlavourItems(selectDealProduct, dealsItemArr);
    };
    fetch();
  }, []);

  const getImage = async name => {
    const array = state.products.filter(item => {
      return item.name === name;
    });

    return array[0].image;
  };
  const isItemPizza = item_name => {
    const productData = state.products.filter(item => {
      return item.name === item_name;
    });
    const data = state.posdata.deals_addons.filter(item => {
      return item.applicable_category === productData[0].item_group;
    });
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < store.getState().products.length; j++) {
          if (
            store.getState().products[j].item_group === data[i].item_cateogory
          ) {
            return true;
          }
        }
        if (i === data.length - 1) {
          return false;
        }
      }
    } else {
      return false;
    }
  };
  const checkFlavourItems = (dealProductIndex, arr) => {
    const obj = arr[dealProductIndex];
    const flavour_array = [];
    const productData = state.products.filter(item => {
      return item.name === obj.item_code;
    });
    const data = state.posdata.deals_addons.filter(item => {
      return item.applicable_category === productData[0].item_group;
    });
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < store.getState().products.length; j++) {
          if (
            store.getState().products[j].item_group === data[i].item_cateogory
          ) {
            flavour_array.push(store.getState().products[j]);
          }
        }
        if (i === data.length - 1) {
          setFlavourArray(flavour_array);
        }
      }
    } else {
      setFlavourArray([]);
    }
  };

  const checkBillableItems = (dealProductIndex, arr) => {
    const obj = arr[dealProductIndex];
    const billable_array = [];
    const productData = state.products.filter(item => {
      return item.name === obj.item_code;
    });

    const data = state.posdata.billable_items_category.filter(item => {
      return item.applicable_category === productData[0].item_group;
    });
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < store.getState().products.length; j++) {
          if (
            store.getState().products[j].item_group === data[i].items_category
          ) {
            billable_array.push(store.getState().products[j]);
          }
        }
        if (i === data.length - 1) {
          setBillableArray(billable_array);
        }
      }
    } else {
      setBillableArray([]);
    }
  };
  const getItem = name => {
    var arr = dealItemForCart;
    if(arr[0].items[selectDealProduct].extraToppings.length>0){
      const array = arr[0].items[selectDealProduct].extraToppings.filter(x => {
        return x.name === name;
      });
   
      if (array.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    else{
      return false
    }
   
  };

  const checkExtraToppingsArray = name => {
    const arr = dealItemForCart;
    const array = arr[0].items[selectDealProduct].extraToppings.findIndex(
      element => {
        return name === element.name;
      },
    );
    console.log('wdwda',{
      index: array,
      bool: true,
      name: name,
    })
    if (array > -1) {
      return {
        index: array,
        bool: true,
        name: name,
      };
    } else {
      return {
        index: array,
        bool: false,
        name: name,
      };
    }
  };

const handleAddToCart = async () => {
 
      const arrayFilter = dealItemForCart[0].items.filter(it => {
          return it.isPizza === true && it.selectedFlavour===''
      })
      if(arrayFilter.length>0){
          alert(`Please select flavour of ${arrayFilter[0].item_name}`)
      }
      else{
              const storageData = await GetItem('CartData')
              console.log('dwdqdq',storageData)
      if (storageData === null) {
          const array = [dealItemForCart[0]]
          array[0].id = 1
          array[0].orderTime = new Date().toLocaleString()
          array[0]["customer"] = "";
          array[0].qty = quantity
          dispatch(setCartQuantity(array))
          StoreItem('CartData', array)

        props.navigation.goBack();

      }
      else {
          const storageParseData = JSON.parse(storageData)
          storageParseData.push(dealItemForCart[0])
          storageParseData[storageParseData.length - 1].id = storageParseData[storageParseData.length - 2].id + 1
          storageParseData[storageParseData.length - 1].qty = quantity
          dispatch(setCartQuantity(storageParseData))
          StoreItem('CartData', storageParseData)
      
         props.navigation.goBack();

      } 
      }
    
  

}

 const pushAndRemoveExtraToppings = async item => {
    const arr = dealItemForCart;

    const val = checkExtraToppingsArray(item.name);
    
    if (val.bool) {
      const array = arr[0].items[selectDealProduct].extraToppings.filter(ite => {
          return ite.name !== val.name;
        },
      );
  
      arr[0].items[selectDealProduct].extraToppings = array;
      console.log('delete', JSON.stringify(arr, null, 2));

        setDealItemForCart(arr);
        forceUpdate();
    } else {
      console.log('dwqwdq',val)

      arr[0].items[selectDealProduct].extraToppings.push({
        name: item.name,
        rate: item.standard_rate,
      });

      console.log('push', JSON.stringify(arr, null, 2));

      setDealItemForCart(arr);
      forceUpdate();
    }
  };
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('40%'),
          position: 'absolute',
          top: wp(-25),
          opacity: 0.19,
          shadowOpacity: 0.07,
        }}
      />
      <LinearGradient
        colors={['white', '#ffffff00']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          width: wp('100%'),
          height: hp('15%'),
          position: 'absolute',
          top: wp(35),
          opacity: 0.5,
        }}></LinearGradient>
      <View style={styles.container}>
        <ScrollView>
          <View style={{height: hp('2%')}} />
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Icon
              name="chevron-back-sharp"
              type="ionicon"
              size={hp(5)}
              color="black"
              onPress={() => props.navigation.navigate('HomeScreen')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(3),
                color: 'black',
                fontWeight: '700',
                alignSelf: 'center',
              }}>
              Details
            </Text>
            <Icon
              name="ios-heart-sharp"
              type="ionicon"
              color="#d60265"
              size={hp(5)}
            />
          </View>
          <View
            style={{
              shadowColor: '#000',
              // add shadows for Android only
              elevation: 10,

              // add shadows for iOS only
              shadowColor: 'black',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.5,
            }}>
            <Image
              source={{
                uri: `${baseUrlforImage}${
                  store.getState().singleProductData.image
                }`,
              }}
              style={{
                width: 230,
                height: 230,
                borderRadius: 230 / 2,
                marginTop: hp(3),
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(4),
                color: 'black',
                fontWeight: '700',
                alignSelf: 'center',
                marginTop: hp(4),
                width: wp('55%'),
              }}>
              {store.getState().singleProductData.name}
            </Text>
            <View style={{flexDirection: 'row', marginTop: hp(4)}}>
              <TouchableOpacity
                style={{
                  width: wp('10%'),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: wp('10%'),
                  backgroundColor: SECONDARY_GRADIENT_COLOR,
                  marginRight: hp(1),
                }}
                onPress={()=>setQuantity(state=>state-1)}
                 disabled={(quantity===1)?true:false}
                >

                <Icon name="minus" type="ant-design" color="white" />
              </TouchableOpacity>
              <Text style={{marginRight: hp(1), fontSize: hp(4)}}>{quantity}</Text>
              <TouchableOpacity
                style={{
                  width: wp('10%'),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: wp('10%'),
                  backgroundColor: SECONDARY_GRADIENT_COLOR,
                }}
                onPress={()=>setQuantity(state=>state+1)}
                >
                <Icon name="add" type="ionicon" color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: hp('2.5%')}} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.9),
              fontWeight: '700',
              width: wp('90%'),
              alignSelf: 'center',
              color: 'black',
            }}>
            Deal Products
          </Text>
          <View style={{height: hp('1.5%')}} />
          <Animated.View style={{width: wp('95%'), alignSelf: 'center'}}>
            {dealItemArr.length > 0 ? (
              <FlatList
                data={dealItemArr}
                disableVirtualization={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        width: wp('45%'),
                        paddingVertical: hp(1.5),
                        backgroundColor: 'white',
                        borderWidth: index === selectDealProduct ? 1 : null,
                        borderColor:
                          index === selectDealProduct
                            ? SECONDARY_GRADIENT_COLOR
                            : null,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 9,
                        },
                        marginLeft: index > 0 ? hp(2) : hp(1),
                        marginRight:
                          index === dealItemArr.length - 1
                            ? hp(1)
                            : null,
                        shadowOpacity: 0.48,
                        shadowRadius: 11.95,
                        marginTop: hp(1),
                        marginBottom: hp(1),
                        elevation: 6,
                      }}
                      onPress={async () => {
                        await setSelectDealProduct(index);
                        await checkBillableItems(index, dealItemArr);
                        await checkFlavourItems(index, dealItemArr);
                      }}>
                      <Image
                        source={{
                          uri:
                            item.img !== null
                              ? `${baseUrlforImage}${item.img}`
                              : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png',
                        }}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 120 / 2,
                          alignSelf: 'center',
                          resizeMode: 'contain',
                        }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          marginTop: hp(2),
                          marginLeft: hp(2),
                          color: 'black',
                          fontWeight: '700',
                        }}>
                        {item.item_code}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : null}
          </Animated.View>
          <View style={{height: hp('2.5%')}} />
          {flavourArray.length > 0 ? (
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(2.9),
                fontWeight: '700',
                width: wp('90%'),
                alignSelf: 'center',
                color: 'black',
              }}>
              Flavours
            </Text>
          ) : null}

          <View style={{height: hp('1.5%')}} />
          <Animated.View style={{width: wp('90%'), alignSelf: 'center',height:(viewFullFlavours)?'auto':flavourMoreAnimation}}>
            <FlatList
              data={flavourArray}
              showsHorizontalScrollIndicator={false}
          
              renderItem={({item, index}) => {
                
                return (
                  <>
                 
                   <TouchableOpacity style={{width: wp('90%'), alignSelf: 'center'}}
                   onPress={()=>{
                    const arr = dealItemForCart
                    arr[0].items[selectDealProduct].selectedFlavour=item.name
                    setDealItemForCart(arr)
                    forceUpdate()
                   }}
                   >
                   <View style={{flexDirection: 'row'}}>
                     {item.name === dealItemForCart[0].items[selectDealProduct].selectedFlavour ? (
                       <LinearGradient
                         colors={[
                           PRIMARY_GRADIENT_COLOR,
                           SECONDARY_GRADIENT_COLOR,
                         ]}
                         start={{x: 0, y: 0}}
                         end={{x: 1, y: 1}}
                       
       
                        
                         style={{
                           width: wp('6%'),
                           height: wp('6%'),
                           borderRadius: wp('3%'),
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
                           width: wp('6%'),
                           height: wp('6%'),
                           borderRadius: wp('3%'),
                         }}></View>
                     )}

                     <Text
                       allowFontScaling={false}
                       style={{
                         fontFamily: 'Proxima Nova',
                         fontSize: hp(2.2),
                         color: 'black',
                         alignSelf: 'center',
                         marginLeft: hp(2),
                       }}>
                       {item.name}
                     </Text>
                   </View>
                   <View style={{height: hp('1.5%')}} />
                 </TouchableOpacity>
          
                 
                  </>
                );
              }}
            />
          </Animated.View>
          {(viewFullFlavours)?
          null
        :
        <Text style={{
          fontFamily: 'Proxima Nova',
             fontSize: hp(2.5),
             fontWeight:'bold',
             color: SECONDARY_GRADIENT_COLOR,
             marginLeft: hp(4)}}
             onPress={()=>{
            
                Animated.timing(flavourMoreAnimation,{
                  toValue:hp('35%'),
                  duration:500,
                  useNativeDriver:false
                }).start(()=>{
                  setViewFullFlavours(true)
                })
             
             }}
             > View more </Text>
        }
         
          <View style={{height: hp('2.5%')}} />
          {billableArray.length > 0 ? (
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Exo-Regular',
                fontSize: hp(2.9),
                fontWeight: '700',
                width: wp('90%'),
                alignSelf: 'center',
                color: 'black',
              }}>
              Extra Toppings
            </Text>
          ) : null}
          <View style={{height: hp('1.5%')}} />
          <Animated.View style={{width: wp('90%'), alignSelf: 'center',height:(viewFullBillable)?'auto':billableMoreAnimation}}>
            <FlatList
              data={billableArray}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View style={{width: wp('90%'), alignSelf: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>pushAndRemoveExtraToppings(item)}>
                        {getItem(item.name)?
                        <View>
                           <LinearGradient
                           colors={[
                             PRIMARY_GRADIENT_COLOR,
                             SECONDARY_GRADIENT_COLOR,
                           ]}
                           start={{x: 0, y: 0}}
                           end={{x: 1, y: 1}}
                           style={{
                             width: wp('6%'),
                             height: wp('6%'),
                             alignItems: 'center',
                             justifyContent: 'center',
                           }}>
                           <Icon name="check" color="white" size={hp(2.5)} />
                         </LinearGradient>
                         </View>
                         :
                         <View
                         style={{
                           backgroundColor: 'white',
                           borderWidth: 2,
                           borderColor: SECONDARY_GRADIENT_COLOR,
                           width: wp('6%'),
                           height: wp('6%'),
                         }}
                        ></View>
                      }
                       
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2.2),
                            color: 'black',
                            alignSelf: 'center',
                            marginLeft: hp(2),
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                          alignSelf: 'center',
                          marginLeft: hp(2),
                        }}>
                        Rs. {item.standard_rate}
                      </Text>
                    </View>
                    <View style={{height: hp('1.5%')}} />
                  </View>
                );
              }}
            />
          </Animated.View>
          {(viewFullBillable)?
          null
        :
        <Text style={{
          fontFamily: 'Proxima Nova',
             fontSize: hp(2.5),
             fontWeight:'bold',
             color: SECONDARY_GRADIENT_COLOR,
             marginLeft: hp(4)}}
             onPress={()=>{
            
                Animated.timing(billableMoreAnimation,{
                  toValue:hp('35%'),
                  duration:500,
                  useNativeDriver:false
                }).start(()=>{
                  setViewFullBillable(true)
                })
             
             }}
             > View more </Text>
        }
          <View style={{height: hp('2.5%')}} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.9),
              fontWeight: '700',
              width: wp('90%'),
              alignSelf: 'center',
              color: 'black',
            }}>
            Description
          </Text>
          <View style={{height: hp('1.5%')}} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.2),
              fontWeight: '600',
              width: wp('90%'),
              alignSelf: 'center',
              textAlign: 'justify',
            }}>
            {store.getState().DealDetail.description}
          </Text>
          <View style={{height: hp('14%')}}></View>
        </ScrollView>
        <LinearGradient
          colors={['#000000', '#ffffff00']}
          start={{x: 0.3, y: 2}}
          end={{x: 0.3, y: 0}}
          style={{
            width: wp('100%'),
            height: hp('6%'),

            position: 'absolute',
            bottom: wp(14),
            opacity: 0.9,
          }}></LinearGradient>
        <View
          style={{
            width: wp('100%'),
            height: hp('10%'),
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp('90%'),
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: hp(3),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(3),
                  marginTop: hp(0.5),
                  color: SECONDARY_GRADIENT_COLOR,
                  fontWeight: '600',
                  alignSelf: 'center',
                }}>
                Rs.
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Varela-Regular',
                  fontSize: hp(4),
                  color: 'black',
                  fontWeight: '700',
                  alignSelf: 'center',
                }}>
                {store.getState().singleProductData.standard_rate}
              </Text>
            </View>
            <TouchableOpacity style={{alignSelf: 'center'}}
            onPress={()=>handleAddToCart()}
            >
              <LinearGradient
                colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  width: wp('45%'),
                  height: hp('6%'),
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
                  Add to Cart
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    width: 200,
    height: 188,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
export default DealDescription;
