import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
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
import {MainStack} from '../navigation/Stacknavigation';
import AnimTab3 from '../navigation/Tabnavigation';
import {useSelector, useDispatch} from 'react-redux';
import {GetItem} from '../local-storage/function';
import {
  setCartQuantity,
  getCategoriesData,
  getProductsData
} from '../redux/actions';

const SplashScreen = props => {
  const [splashBool, setSplashBool] = React.useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const fetch = async () => {
      const getItem = await GetItem('user');
      const getCartData = await GetItem('CartData');
      if (getCartData !== null) {
        const parseData = await JSON.parse(getCartData);
          await dispatch(setCartQuantity(parseData));
      }
      if (getItem !== null) {
        setTimeout(async() => {
          await dispatch(getCategoriesData())
          await dispatch(getProductsData())
          setSplashBool(true);
          dispatch({
            type: 'USER_LOGGEDIN',
            value: true,
          });
        }, 5000);
      } else {
        setTimeout(() => {
          setSplashBool(true);
        }, 5000);
      }
    };

    fetch();
  }, []);
  return (
    <>
      {splashBool ? (
        state.loggedin ? (
          <AnimTab3 />
        ) : (
          <MainStack />
        )
      ) : (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Image
            source={require('./../../assets/images/Vector.png')}
            style={{
              width: wp('100%'),
              height: hp('50%'),
              position: 'absolute',
              top: wp(-23),
              opacity: 0.25,
              shadowOpacity: 0.1,
            }}
          />
          <LinearGradient
            colors={['white', '#ffffff00']}
            style={{
              width: wp('100%'),
              height: hp('25%'),
              position: 'absolute',
              top: wp(45),
              opacity: 0.5,
            }}></LinearGradient>
          <View style={styles.container}>
            <Image
              source={require('./../../assets/images/Logo.png')}
              style={styles.logoImageSize}
            />
            <View style={{flexDirection: 'row', marginTop: wp(3)}}>
              <Text
                style={{
                  fontSize: hp(3.5),
                  color: PRIMARY_GRADIENT_COLOR,
                  fontFamily: 'Viga-Regular',
                }}>
                Sowaan
              </Text>
              <Text
                style={{
                  fontSize: hp(3.5),
                  color: SECONDARY_GRADIENT_COLOR,
                  fontFamily: 'Viga-Regular',
                }}>
                ERP Food
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageSize: {
    width: 130,
    height: 130,
  },
});
export default SplashScreen;
