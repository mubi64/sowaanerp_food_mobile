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
import {LOGO} from '../../assets/imageConstant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '@rneui/base';
import {useSelector, useDispatch} from 'react-redux';
import store from '../redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {GetItem,StoreItem} from './../local-storage/function'
import {baseUrlforImage} from '../constants/baseurl';
import {setCartQuantity} from '../redux/actions';
import RenderHtml from 'react-native-render-html';

const PizzaDescription = (props) => {
  const dispatch = useDispatch();

  const state = useSelector(state => state);

  const [selectDealProduct, setSelectDealProduct] = useState(0);
  
  const [keep, setKeep] = useState(false);
  const [email, setEmail] = useState(false);
  const [emaila, setEmaila] = useState(false);
  const [billableArray, setBillableArray] = useState([]);
  const [statte, updateState] = React.useState();
  const [quantity,setQuantity] = useState(1)
  const [emaile, setEmaile] = useState(false);
  const [variants,setVariants] = useState([])
  const [finaldata, setFInalData] = useState([])
  const billableMoreAnimation = useRef(new Animated.Value(hp('17%'))).current
  const [viewFullBillable,setViewFullBillable] = useState(false)
  const forceUpdate = React.useCallback(() => updateState({}), []);

  React.useEffect(()=>{
    const fetch=async()=>{
      const array = store.getState().products.filter(item => {
        return item.variant_of === store.getState().singleProductData.name
      })
      console.log('sdsaad',JSON.stringify(store.getState().singleProductData,null,2))
     const arr = [{
       name:array[selectDealProduct].name,
       qty:1,
       price:store.getState().singleProductData.standard_rate,
       extraToppings:[],
       isDeal:false,
       notes:'',
       isPrint: false,
       station:store.getState().singleProductData.station,
       image:store.getState().singleProductData.image,
       show_in_kitchen: store.getState().singleProductData.show_in_kitchen,
       status: "Making",
       made: false,
       ready: false,
       new:true,
       prevQuan: ''
     }]
     console.log('wdadawd',arr)
      await setFInalData(arr)
      await checkBillableItems(store.getState().singleProductData.item_group)
      await setVariants(array)
 
    }
   fetch();
  },[])
  const checkBillableItems = (category) => {
    
    // dealProductIndex, arr
    // const obj = arr[dealProductIndex];
    // const billable_array = [];
    // const productData = state.products.filter(item => {
    //   return item.name === obj.item_code;
    // });
   const billable_array = []
    const data = store.getState().posdata.billable_items_category.filter(item => {
      return item.applicable_category === category;
    });
    console.log('wqdwq',data)
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < store.getState().products.length; j++) {
          if (store.getState().products[j].item_group === data[i].items_category) {
            console.log(store.getState().products[j])
            billable_array.push(store.getState().products[j]);
          }
        }
        if (i === data.length - 1) {
          console.log('wqdwqdwqdq',billable_array)
          setBillableArray(billable_array);
        }
      }
    } else {
      setBillableArray([]);
    }
  };
  const handleAddToCart = async () => {
 
   
            const storageData = await GetItem('CartData')
    if (storageData === null) {
        const array = [finaldata[0]]
        array[0].id = 1
        array[0].name = variants[selectDealProduct].name
        array[0].orderTime = new Date().toLocaleString()
        array[0]["customer"] = "";
        array[0].qty = quantity
        console.log('initial item ', JSON.stringify(array,null,2))
        dispatch(setCartQuantity(array))
        StoreItem('CartData', array)

      props.navigation.goBack();

    }
    else {
        const storageParseData = JSON.parse(storageData)
        storageParseData.push(finaldata[0])
        storageParseData[storageParseData.length - 1].id = storageParseData[storageParseData.length - 2].id + 1
        storageParseData[storageParseData.length - 1].qty = quantity
        storageParseData[storageParseData.length - 1].name = variants[selectDealProduct].name

        console.log('new item ', JSON.stringify(storageParseData,null,2))
         dispatch(setCartQuantity(storageParseData))
        StoreItem('CartData', storageParseData)
    
       props.navigation.goBack();

    } 
  
  


}

  const getItem = name => {
    var arr = finaldata;
    if(arr[0].extraToppings.length>0){
      const array = arr[0].extraToppings.filter(x => {
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
  const pushAndRemoveExtraToppings = async item => {
    const arr = finaldata;
    const val = checkExtraToppingsArray(item.name);
    
    if (val.bool) {
      const array = arr[0].extraToppings.filter(ite => {
          return ite.name !== val.name;
        },
      );
      console.log('dwqwdq',val)
      arr[0].extraToppings = array;
      console.log('delete', JSON.stringify(arr, null, 2));

      setFInalData(arr);
        forceUpdate();
    } else {
      console.log('dwqwdq',val)

      arr[0].extraToppings.push({
        name: item.name,
        rate: item.standard_rate,
      });

      console.log('push', JSON.stringify(arr, null, 2));

      setFInalData(arr);
      forceUpdate();
    }
  };
  const checkExtraToppingsArray = name => {
    const arr = finaldata;
    const array = arr[0].extraToppings.findIndex(
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
              onPress={()=>props.navigation.navigate('HomeScreen')}
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
              source={{uri:`${baseUrlforImage}${store.getState().singleProductData.image}`}}
              style={{
                width: 230,
                height: 230,
                borderRadius:230/2,
                marginTop: hp(3),
                alignSelf: 'center',
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
            Variants
          </Text>
          <View style={{height: hp('1.5%')}} />
          <View style={{width: wp('95%'), alignSelf: 'center'}}>
            <FlatList
              data={variants}
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
                        index === variants.length -
                          1
                          ? hp(1)
                          : null,
                      shadowOpacity: 0.48,
                      shadowRadius: 11.95,
                      marginTop: hp(1),
                      marginBottom: hp(1),
                      elevation: 6,
                    }}
                    onPress={() => setSelectDealProduct(index)}>
                    <Image
                      source={{uri:`${baseUrlforImage}${item.image}`}}
                      style={{width: 100, height: 100, alignSelf: 'center'}}
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
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
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
            Extra topping
          </Text>
          <View style={{ height: hp('1.5%') }} />
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
          <View style={{ height: hp('1%') }} />
          <View style={{alignSelf:'center'}}>
          <RenderHtml
      contentWidth={wp('90%')}
      source={{html:`${store.getState().singleProductData.description}`}}
    />
          </View>
       
          {/* <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Exo-Regular',
              fontSize: hp(2.2),
              fontWeight: '600',
              ,
              alignSelf: 'center',
              textAlign: 'justify',
            }}>
            {store.getState().singleProductData.description}
          </Text> */}
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
export default PizzaDescription;
