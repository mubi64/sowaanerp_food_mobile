import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState } from '@react-navigation/native';
import MyProfile from '../screens/myprofile';
import MyOrders from '../screens/myorders';
import SplashScreen from '../screens/Splash';
import OnBoardingScreen2 from '../screens/onBoardingScreen2';
import OnBoardingScreen1 from '../screens/onBoardingScreen1';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/SignUp';
import NewAddress from '../screens/NewAddress';
import MyAddresses from '../screens/myaddresses';
import SetYourLocation from '../screens/setYourLoc';
import UploadProfilePic from '../screens/uploadProfilePic';
import Bio from '../screens/Bio'
import SendForgetOpt from '../screens/sendforgetoptions';
import CodeVerification from '../screens/codeVerification';
import Done from '../screens/success';
import Tab from './Tabnavigation'
import Cart from '../screens/cart';
import Checkout from '../screens/checkout';
import Home from '../screens/home';
import Description from '../screens/description';
import DealDescription from '../screens/dealdescription';
import PizzaDescription from '../screens/pizzadescription';
import TrackOrder from '../screens/trackOrder';
import Filter from '../screens/filter';
import {Animated} from 'react-native'
const Stack = createStackNavigator();
const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: 'clamp',
            }),
            inverted
          ),
        },
      ],
    },
  };
};
export function ProfileStack({ navigation, route }) {
    React.useEffect(() => {
        if (route.state?.index) {
          navigation.setOptions({
            tabBarVisible: false,
          });
        } else {
          navigation.setOptions({
            tabBarVisible: true,
          });
        }
      }, [navigation, route.state?.index]);
  return (
    <Stack.Navigator headerMode="none" initialRouteName="MyProfile" >
      <Stack.Screen name="MyProfile" component={MyProfile}  options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="MyOrders" component={MyOrders}    options={{ cardStyleInterpolator: forSlide}}/>
      <Stack.Screen name="Logout" component={MainStack}    options={{ cardStyleInterpolator: forSlide}} />
    </Stack.Navigator>
  );
}
export function MainStack({ navigation, route }) {

  return (
    <Stack.Navigator headerMode="none" initialRouteName="OnBoard1"  >
      <Stack.Screen name="OnBoard1" component={OnBoardingScreen1}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="OnBoard2" component={OnBoardingScreen2}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="Login" component={LoginScreen}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="SignUp" component={SignupScreen}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="ForgetPassword" component={SendForgetOpt}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="CodeVerify" component={CodeVerification}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name='Success' component={Done}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name='Bio' component={Bio}   options={{ cardStyleInterpolator: forSlide}}/>
      <Stack.Screen name='Loc' component={SetYourLocation}   options={{ cardStyleInterpolator: forSlide}}/>
      <Stack.Screen name='UploadProfile' component={UploadProfilePic}   options={{ cardStyleInterpolator: forSlide}} />

      <Stack.Screen name="Address" component={NewAddress}   options={{ cardStyleInterpolator: forSlide}} />

      <Stack.Screen name="Tab" component={Tab} />
    </Stack.Navigator>
  );
}
export function CartStack({ navigation, route }) {
    React.useEffect(() => {
        if (route.state?.index) {
          navigation.setOptions({
            tabBarVisible: false,
          });
        } else {
          navigation.setOptions({
            tabBarVisible: true,
          });
        }
      }, [navigation, route.state?.index]);
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Cart" >
      <Stack.Screen name="Cart" component={Cart}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="Checkout" component={Checkout}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="Address" component={NewAddress}   options={{ cardStyleInterpolator: forSlide}}/>
      <Stack.Screen name="AddressList" component={MyAddresses}  options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="success" component={Done}  options={{ cardStyleInterpolator: forSlide}} />
     <Stack.Screen name="Tab" component={Tab}   options={{ cardStyleInterpolator: forSlide}} />
      
    </Stack.Navigator>
  );
}

export function HomeStack({ navigation, route }) {
  console.log('route',route)
    React.useEffect(() => {
        if (route.state?.index) {
          navigation.setOptions({
            tabBarVisible: false,
          });
        } else {
          navigation.setOptions({
            tabBarVisible: true,
          });
        }
      }, [navigation, route.state?.index]);
  return (
    <Stack.Navigator headerMode="none" initialRouteName="HomeScreen" >
      <Stack.Screen name="HomeScreen" component={Home}   options={{ cardStyleInterpolator: forSlide}}/>
      <Stack.Screen name="Description" component={Description}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="PizzaDescription" component={PizzaDescription}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="DealDescription" component={DealDescription}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name='Filter' component={Filter}   options={{ cardStyleInterpolator: forSlide}} />
      <Stack.Screen name="OrderTrack" component={TrackOrder}   options={{ cardStyleInterpolator: forSlide}} />

    </Stack.Navigator>
  );
}