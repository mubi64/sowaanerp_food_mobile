import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from './../../assets/colors';
import {LOGO} from '../../assets/imageConstant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input, Icon, Card} from '@rneui/base';
import Carousel from 'react-native-snap-carousel';

const Filter = (props) => {
  const [selectedCat, setSelectedCat] = useState(0);
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

      <View style={styles.container}>
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
                fontFamily: 'Proxima Nova',
                fontSize: hp(4),
                color: 'black',
                fontWeight: '700',
                width: wp('70%'),
              }}>
              Filter
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
              name="left"
              type="ant-design"
              color={PRIMARY_GRADIENT_COLOR}
              size={wp(6)}
              onPress={()=>props.navigation.goBack()}            />
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
            containerStyle={{width: wp('95%'), marginLeft: wp(-1)}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: hp(2.2),
              color: '#DA6317',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'rgba(249, 168, 77, 0.3)',
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
        </View>
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
            }}>
            Type
          </Text>
          <View
            style={{flexDirection: 'row', marginTop: hp(2), flexWrap: 'wrap'}}>
            {[1, 2].map(item => {
              return (
                <View
                  style={{
                    backgroundColor: 'rgba(249, 168, 77,0.2)',
                    width: 'auto',
                    height: hp('6%'),
                    borderRadius: 8,
                    paddingHorizontal: hp(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: hp(2),
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      fontSize: hp(2.8),
                      color: '#DA6317',
                      fontFamily: 'Proxima Nova',
                    }}>
                    Menu
                  </Text>
                </View>
              );
            })}
          </View>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
              marginTop: hp(1),
            }}>
            Distance
          </Text>
          <View
            style={{flexDirection: 'row', marginTop: hp(2), flexWrap: 'wrap'}}>
            {[1, 2].map(item => {
              return (
                <View
                  style={{
                    backgroundColor: 'rgba(249, 168, 77,0.2)',
                    width: 'auto',
                    height: hp('6%'),
                    borderRadius: 8,
                    paddingHorizontal: hp(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: hp(2),
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      fontSize: hp(2.8),
                      color: '#DA6317',
                      fontFamily: 'Proxima Nova',
                    }}>
                    {'< 10 Km'}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
              marginTop: hp(1),
            }}>
            Food
          </Text>
          <View
            style={{flexDirection: 'row', marginTop: hp(2), flexWrap: 'wrap'}}>
            {[1, 2].map(item => {
              return (
                <View
                  style={{
                    backgroundColor: 'rgba(249, 168, 77,0.2)',
                    width: 'auto',
                    height: hp('6%'),
                    borderRadius: 8,
                    paddingHorizontal: hp(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: hp(2),
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      fontSize: hp(2.8),
                      color: '#DA6317',
                      fontFamily: 'Proxima Nova',
                    }}>
                    Cake
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <TouchableOpacity
          style={{alignSelf: 'center', position: 'absolute', bottom: 0}}>
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
              Search
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
export default Filter;
