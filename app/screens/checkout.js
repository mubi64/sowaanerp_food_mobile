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
import {GetItem,DeleteItem} from './../local-storage/function';
import store from '../redux';
import PostMethod from '../network calls/post';
import {urlForSignUp} from '../constants/baseurl';
import Toast from 'react-native-toast-message';
import { useIsFocused } from "@react-navigation/native";
import { setCartQuantity } from '../redux/actions';
import { useDispatch } from 'react-redux';
const Checkout = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [defaultAddress, setDefaultAddress] = React.useState('');
  const [items, setItems] = React.useState([]);
  const [subtotal, setSubTotal] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [customer, setCustomer] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [storageDataForOrder,setStorageDataForOrder] = React.useState([])

  React.useEffect(() => {
    const fetch = async () => {
      let SaleItems = [];

      const storageData = await GetItem('CartData');
     
      const userData = await GetItem('user');
      if (userData !== null) {
        const parseData = await JSON.parse(userData);
        setCustomer(parseData.name);
      }
      const arr = store.getState().addresses.filter(item => {
        return item.is_shipping_address === 1;
      });
      setDefaultAddress(arr[0].address_line1);
      if (storageData !== null) {
        const storageDataparse = await JSON.parse(storageData);
        console.log(JSON.stringify(storageDataparse,null,2))
        const price = await CountCartAmount(storageDataparse);

        for (let ind = 0; ind < storageDataparse.length; ind++) {
          if (storageDataparse[ind].isDeal == false) {
            SaleItems.push({
              item_code: storageDataparse[ind].name,
              qty: storageDataparse[ind].qty,
              rate: storageDataparse[ind].price,
              amount: storageDataparse[ind].price * storageDataparse[ind].qty,
              topings: (storageDataparse[ind].extraToppings !== undefined && storageDataparse[ind].extraToppings.length > 0) ? JSON.stringify(storageDataparse[ind].extraToppings) : null 
            });

            if (
              storageDataparse[ind].extraToppings !== undefined &&
              storageDataparse[ind].extraToppings.length > 0
            ) {
              for (
                let i = 0;
                i < storageDataparse[ind].extraToppings.length;
                i++
              ) {
                SaleItems.push({
                  item_code: storageDataparse[ind].extraToppings[i].name,
                  qty: storageDataparse[ind].qty,
                  rate: storageDataparse[ind].extraToppings[i].rate,
                  amount:
                    storageDataparse[ind].extraToppings[i].rate *
                    storageDataparse[ind].qty,
                  is_topping: 1,
                });
              }
            }
          } else {
            SaleItems.push({
              item_code: storageDataparse[ind].name,
              qty: storageDataparse[ind].qty,
              rate: storageDataparse[ind].price,
              amount: storageDataparse[ind].price * storageDataparse[ind].qty,
            });

            if (storageDataparse[ind].items.length > 0) {
              for (let i = 0; i < storageDataparse[ind].items.length; i++) {
                if (storageDataparse[ind].items[i].extraToppings.length > 0) {
                  SaleItems[SaleItems.length-1].topings = JSON.stringify(storageDataparse[ind].items[i].extraToppings)
                  for (
                    let k = 0;
                    k < storageDataparse[ind].items[i].extraToppings.length;
                    k++
                  ) {
                    SaleItems.push({
                      item_code:
                        storageDataparse[ind].items[i].extraToppings[k].name,
                      qty: storageDataparse[ind].qty,
                      rate: storageDataparse[ind].items[i].extraToppings[k]
                        .rate,
                      amount:
                        storageDataparse[ind].items[i].extraToppings[k].rate *
                        storageDataparse[ind].qty,
                      is_topping: 1
                    });
                  }
                }
              }
            }
          }
        }
        setItems(SaleItems);
        setSubTotal(price);
        setTotal(price);
        setStorageDataForOrder(storageDataparse)
      }
    };
    if(isFocused){
      fetch();
    }
  }, [isFocused]);
 
  const submitSalesOrder = async () => {
    setLoader(true);
    const encodedJsonObject = JSON.stringify({
      sale_invoice_type: 'Delivery',
      table_num: '',
      company: 'Lasani Pizza Time',
      pos_profile:'',
      sale_invoice_json_string: JSON.stringify(storageDataForOrder),
      customer_name: customer,
      sale_invoice_status: 'Making',
      coming_order_ip: '',
      due_date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      total_qty: storageDataForOrder.length,
      total_billing_amount:total,
      base_net_total:total,
      total: total,
      net_total:total,
      taxes: '',
      sale_invoice_name: storageDataForOrder[0].prefix,
      is_paid:false,
      data_sync:true,
    });
    const res = await PostMethod(
      urlForSignUp,
      {
        is_pos: false,
        mode_of_payment: 'Cash',
        customer: customer,
        posting_date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
        posa_is_printed: false,
        items: items,
        data_for_kitchen:encodedJsonObject,
        order_type: 'Sales',
        delivery_date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      },
      'resource/Sales Order',
    );
    console.log('wdqwdq',{
      is_pos: false,
      mode_of_payment: 'Cash',
      customer: customer,
      posting_date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      posa_is_printed: false,
      items: items,
      order_type: 'Sales',
      delivery_date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
    })
    if (res.error !== undefined) {
      setLoader(false);
    
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${res.error}👋`,
      });
    } else {
      DeleteItem('CartData')
      dispatch(setCartQuantity([]))
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'success', params:{
          from:'checkout'
                } }],
   
    })
      setLoader(false);
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
              onPress={() => props.navigation.goBack()}
            />
          </View>
          <View style={{height: hp('4%')}} />

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.5),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
              marginLeft: hp(3),
            }}>
            Checkout
          </Text>

          <View style={{height: hp('2%')}} />

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
                  name="location-outline"
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
                  Delivery Address
                </Text>
              </View>
              <Icon
                name="pencil"
                type="material-community"
                color={SECONDARY_GRADIENT_COLOR}
                onPress={() => props.navigation.navigate('AddressList')}
              />
            </View>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{
                width: wp('90%'),
                height: hp('15%'),
                alignSelf: 'center',
                marginTop: hp(2),
              }}
              region={{
                latitude: 24.8601,
                longitude: 67.0565,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 24.8601, longitude: 67.0565}}>
                <Icon
                  name="location"
                  type="ionicon"
                  color={SECONDARY_GRADIENT_COLOR}
                  size={hp(5)}
                />
              </Marker>
            </MapView>
            <Divider style={{marginVertical: hp(2)}} />
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
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  color: 'black',
                  fontWeight: '600',
                  alignSelf: 'center',
                  width: wp('70%'),
                }}>
                {defaultAddress}
              </Text>
              <Icon
                name="right"
                type="ant-design"
                color={SECONDARY_GRADIENT_COLOR}
                size={hp(3)}
                containerStyle={{alignSelf: 'center'}}
              />
            </View>
          </View>
          <View style={{height: hp('2%')}} />

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
                  name="wallet"
                  type="ant-design"
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
                  Payment Method
                </Text>
              </View>
            </View>

            <View
              style={{
                width: wp('90%'),
                flexDirection: 'row',
                marginTop: hp(2),
                alignSelf: 'center',
              }}>
              <Icon
                name="cash"
                color={'lightgreen'}
                type="ionicon"
                size={hp(4)}
                containerStyle={{alignSelf: 'center'}}
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
                Cash
              </Text>
            </View>
          </View>
          <View style={{height: hp('2%')}} />

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
                  type="font-awesome5"
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
                  Order Details
                </Text>
              </View>
            </View>
            {items.map(item => {
              return (
                <View
                  style={{
                    width: wp('90%'),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp(1),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2.2),
                        color: 'black',
                        fontWeight: '600',
                        alignSelf: 'center',
                      }}>
                      {item.qty}x
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2.2),
                        color: 'black',
                        fontWeight: '600',
                        marginLeft: hp(1),
                        alignSelf: 'center',
                      }}>
                      {item.item_code}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2.2),
                        color: 'black',
                        fontWeight: '600',
                        alignSelf: 'center',
                      }}>
                      Rs.
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2.2),
                        color: 'black',
                        fontWeight: '600',
                        marginLeft: hp(1),
                        alignSelf: 'center',
                      }}>
                      {item.amount}
                    </Text>
                  </View>
                </View>
              );
            })}

            <Divider
              style={{
                marginVertical: hp(2),
                width: wp('90%'),
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                width: wp('90%'),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(1),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  fontWeight: '600',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Sub Total
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    alignSelf: 'center',
                  }}>
                  Rs.
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    marginLeft: hp(1),
                    alignSelf: 'center',
                  }}>
                  {subtotal}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: wp('90%'),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(1),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  fontWeight: '600',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Discount
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    alignSelf: 'center',
                  }}>
                  Rs.
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    marginLeft: hp(1),
                    alignSelf: 'center',
                  }}>
                  0
                </Text>
              </View>
            </View>

            <View
              style={{
                width: wp('90%'),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(1),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  fontWeight: '600',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Delivery
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    alignSelf: 'center',
                  }}>
                  Rs.
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    marginLeft: hp(1),
                    alignSelf: 'center',
                  }}>
                  0
                </Text>
              </View>
            </View>

            <View
              style={{
                width: wp('90%'),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(1),
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Proxima Nova',
                  fontSize: hp(2.2),
                  fontWeight: '600',
                  marginLeft: hp(1),
                  alignSelf: 'center',
                }}>
                Total
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    alignSelf: 'center',
                  }}>
                  Rs.
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2.2),
                    fontWeight: '600',
                    marginLeft: hp(1),
                    alignSelf: 'center',
                  }}>
                  {total}
                </Text>
              </View>
            </View>
          </View>

          <View style={{height: hp('8%')}}></View>
        </ScrollView>
        <TouchableOpacity
          // onPress={()=>props.navigation.navigate('success',{
          //   from:'checkout'
          // })}
          onPress={() => submitSalesOrder()}
          style={{alignSelf: 'center', position: 'absolute', bottom: wp(5)}}>
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
              Place Order
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
export default Checkout;
