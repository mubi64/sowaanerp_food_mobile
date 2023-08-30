/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState
} from 'react-native';
import Toast from 'react-native-toast-message';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native'
import MyTabs from './app/navigation/Tabnavigation';
import { MainStack } from './app/navigation/Stacknavigation';
import { Provider } from 'react-redux';
import AnimTab3 from './app/navigation/Tabnavigation';
import { useSelector, useDispatch } from 'react-redux'
import SplashScreen from './app/screens/Splash';
import NetInfo from "@react-native-community/netinfo";
import NetworkIssue from './app/screens/networkissue';
import RNRestart from 'react-native-restart'; // Import package from node modules
import store from './app/redux/index';
import { GestureHandlerRootView,gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import NewAddress from './app/screens/NewAddress';
const App = () => {
 const [goOffline,setGoOffline] = useState(false)


 useEffect(() => {

  const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
    const offline = !(state.isConnected && state.isInternetReachable);
    setGoOffline(offline);
    if(offline === false && ( store.getState().loggedin && store.getState().categoriesData.length < 1 && store.getState().products.length < 1)){
      RNRestart.Restart()
    }
  });
  DeviceInfo.getUniqueId().then((uniqueId) => {
  console.log('wefwef',uniqueId)
    })
  return () => removeNetInfoSubscription();
}, []);
  return (
    
    <SafeAreaProvider>
      <Provider store={store}>
      <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
     
        {(goOffline)?
        <NetworkIssue />
        :
        <SplashScreen />
        }
       
      </SafeAreaView>
      <Toast ref={ref => Toast.setRef(ref)}  />

      </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
   
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default gestureHandlerRootHOC(App);
