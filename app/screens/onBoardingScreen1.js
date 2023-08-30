import React from 'react'
import {View,Image,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { BACKGROUND_COLOR ,PRIMARY_GRADIENT_COLOR , SECONDARY_GRADIENT_COLOR } from '../../assets/colors'
import { LOGO } from '../../assets/imageConstant'
import { widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
const OnBoardingScreen1 = (props) => {
    return(
        <View style={styles.container}>
            <Image source={require('./../../assets/images/Illustartion.png')} style={{width:wp('90%'),height:hp('60%'),resizeMode:'contain',alignSelf:'center'}} />
            <Text allowFontScaling={false} style={{fontFamily:'Proxima Nova',fontSize:hp(4),color:'black',fontWeight:'700',textAlign:'center',width:wp('80%'),alignSelf:'center'}}>Find your  Comfort Food here</Text>
            <Text allowFontScaling={false} style={{fontFamily:'Proxima Nova',fontSize:hp(2.5),color:'black',textAlign:'center',width:wp('90%'),alignSelf:'center',marginTop:hp(5)}}>Here You Can find a chef or dish for every taste and color. Enjoy!</Text>
            <TouchableOpacity
            onPress={()=>props.navigation.navigate('OnBoard2')}
            >
                        <LinearGradient colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width:wp('45%'), height:hp('7%'), borderRadius: 8, alignItems: "center", justifyContent: "center", alignSelf: "center",marginTop:hp(3) }}>
                             <Text allowFontScaling={false} style={{ color: "white", fontSize:hp(3), fontFamily: "Proxima Nova" }}>
                                Next
                            </Text>
                          
                        </LinearGradient>
                    </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:BACKGROUND_COLOR,
    },
    logoImageSize:{
        width:130,
        height:130
    }
})
export default OnBoardingScreen1