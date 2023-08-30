import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef ,useState} from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Animated ,Dimensions} from 'react-native'
import Icon, { Icons } from '../components/Icons';
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';
import Home from './../screens/home'
import Profile from './../screens/myprofile'
import Cart from './../screens/cart'
import Favourites from '../screens/favourites';
import { HomeStack, CartStack, ProfileStack } from './Stacknavigation';
import { PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR , } from '../../assets/colors';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import store from '../redux';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const TabArr = [
  { route: 'Home', label: 'Home', type: Icons.Feather, icon: 'home', component:HomeStack, color: Colors.primary, alphaClr: Colors.primaryAlpha },
  { route: 'Search', label: 'Cart', type: Icons.Ionicons, icon: 'cart', component:CartStack, color: Colors.primary, alphaClr: Colors.primaryAlpha},
  { route: 'Favourite', label: 'Favourite', type: Icons.Ionicons, icon: 'heart', component:Favourites, color: Colors.primary, alphaClr: Colors.primaryAlpha},
  { route: 'User', label: 'Profile', type: Icons.FontAwesome, icon: 'user', component:ProfileStack, color: Colors.primary, alphaClr: Colors.primaryAlpha},

];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);
  const [translateValue] = useState(new Animated.Value(0)); 
  useEffect(() => {
    if (focused) { // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
     
      textViewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <Animatable.View>
        <Animatable.View
   
          style={[StyleSheet.absoluteFillObject, { backgroundColor:'white', borderRadius: 8 }]} />
        <Animated.View style={[styles.btn, { backgroundColor:focused ?PRIMARY_GRADIENT_COLOR:Colors.white}]}>
        <View>
          <Icon type={item.type} name={item.icon} color={focused ? SECONDARY_GRADIENT_COLOR:PRIMARY_GRADIENT_COLOR} />
          {(item.label === 'Cart' && focused === false)?
                    <View style={{backgroundColor:SECONDARY_GRADIENT_COLOR,width:'auto',paddingHorizontal:5,height:17,borderRadius:15/2,position:'absolute',bottom:15,right:-5,justifyContent:'center',alignItems:'center'}}>
                 <Text style={{
                  color:'white'
                }}>{store.getState().cartQuantity}</Text>
                    </View>
              :
              null
              }
          </View>
          <Animatable.View
            ref={textViewRef}>
            {focused && <View style={{flexDirection:'row'}}>
              <Text style={{
              color: SECONDARY_GRADIENT_COLOR, paddingHorizontal: 8,fontWeight:'bold',fontSize:widthPercentageToDP(4)
            }}>{item.label}</Text>
             {(item.label === 'Cart')?
                 <Text style={{
                  color: SECONDARY_GRADIENT_COLOR
                }}>({store.getState().cartQuantity})</Text>
              :
              null
              }
            </View>
            }
          </Animatable.View>
        </Animated.View>
      </Animatable.View>
    </TouchableOpacity>
  )
}

export default function AnimTab3() {
  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => navigation.navigate(route.name),
});
  return (
    <Tab.Navigator
    
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height:70,
          position:'absolute',
          bottom:30,
         
        }
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
        
            options={({ route }) => ({
                tabBarStyle: ((route) => {
                  const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                  if (routeName ==='Description' || routeName === "OrderTrack" || routeName === "PizzaDescription" || routeName === 'DealDescription' || routeName === 'Filter' || routeName === 'Checkout' || routeName === 'Address' || routeName === 'AddressList' || routeName === 'success' || routeName === 'MyOrders' || routeName === 'Logout' ) {
                    return { display: "none" }
                  }
                  return 
                })(route),
                tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} ind={index}  />,
              })
              
              
            }
            listeners={tabBarListeners}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  }
})