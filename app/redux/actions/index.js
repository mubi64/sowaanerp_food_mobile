import {urlForSignUp} from './../../constants/baseurl'
import GetMethod from '../../network calls/get'
import store from '..';
export const setCartQuantity = (arr) => {
    if(arr.length>0){
        var sum = 0
        arr.forEach(item=>{
            sum += item.qty
        })
        console.log('dqdqwd',sum)
         return{
            type:'SET_CART_QTY',
            value:sum
         }  
    }
    else{
        return{
            type:'SET_CART_QTY',
            value:0
         }  
    }
   
}
export const getCategoriesData = ()=>{
    return async dispatch => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,'resource/Item Group?limit_page_length=5000&fields=["name","show_in_pos_"]')
        const parseDataInJSON =  await request.json()
        const array = parseDataInJSON.data.filter(item=>{
            return item.show_in_pos_ === 1
        })
        array.unshift({name:'All'})
        dispatch({
            type:'GET_CATEGORIES',
            value:array
         });
      };
 
    
}

export const updateAddressDefault =async(updatedAdd,oldAdd) => {
    return async dispatch => {
     
      dispatch({
        type:'UPDATE_ADDRESS',
        value:arr
     }) 
    }
}
export const setNewAddress = (obj) => {
        const arr = store.getState().addresses
        arr.push(obj)
        return async dispatch => {
         dispatch({
            type:'SET_NEW_ADDRESS',
            value:arr
         }) 
    }
}

export const getProductsData = ()=>{
    return async dispatch => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,"resource/Item?limit_page_length=5000&fields=[\"name\", \"item_group\", \"standard_rate\", \"description\", \"image\", \"has_variants\", \"variant_of\", \"show_in_kitchen\", \"station\"]")
        const parseDataInJSON =  await request.json()
        const requestforPOSData = await GetMethod(`${urlForSignUp}`,undefined,"resource/Sowaan Tablet POS Settings/Sowaan Tablet POS Settings")
        const parseDataInJSONforPOS = await requestforPOSData.json()
        const singleProduct = parseDataInJSON.data.filter(item=>{
            const findDeal = parseDataInJSONforPOS.data.deals_group.findIndex(it=>it.category_items===item.item_group)
            const findBillable = parseDataInJSONforPOS.data.billable_items_category.findIndex(it=>it.items_category===item.item_group)
            const findAddons = parseDataInJSONforPOS.data.deals_addons.findIndex(it=>it.item_cateogory===item.item_group)
            if(findDeal < 0 && findBillable < 0 && findAddons < 0 && item.variant_of === null ) return item
        })
        const array = parseDataInJSON.data.filter(item=>{
                const index = parseDataInJSONforPOS.data.deals_group.findIndex(it=>it.category_items===item.item_group)
                if(index > -1) return item
            })

        const multiProduct = parseDataInJSON.data.filter(item=>{
            return item.has_variants === 1
        })
        const requestforPOSDataAll = await GetMethod(`${urlForSignUp}`,undefined,"resource/Sowaan Tablet POS Settings/Sowaan Tablet POS Settings")
        const parseDataInJSONforPOSAll = await requestforPOSDataAll.json()
     
        dispatch({
            type:'GET_PRODUCTS',
            value:parseDataInJSON.data
         });
         dispatch({
            type:'GET_DEALS',
            value:array
         })
         dispatch({
            type:'POS_DATA',
            value:parseDataInJSONforPOSAll.data
         })
         dispatch({
            type:'SET_PRODUCT_LIST',
            value:singleProduct
        })
      };
 
    
}

export const getDetailDealData = (item_name) => {
    return async (dispatch,getState) => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,`resource/Product Bundle/${item_name}`)

        const parseDataInJSON =  await request.json()
        
     dispatch({
            type:'DEAL_DETAIL',
            value: parseDataInJSON.data
        })
   
      }

}
export const setSingleProductData = (item) => {
     return async dispatch => {
        dispatch({
            type:'SINGLE_PRODUCT_DATA',
            value:item
        })
     }
}
export const getProductBundles = ()=>{
    return async dispatch => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,'resource/Sowaan Tablet POS Settings/Sowaan Tablet POS Settings')
        const parseDataInJSON =  await request.json()
        // const requestTwo = await GetMethod(`${urlForSignUp}`,undefined,"resource/Product Bundle/" + parseDataInJSON.data[0].name)
        // const parseDataInJSONtwo =  await requestTwo.json()

        dispatch({
            type:'GET_CATEGORIES',
            value:parseDataInJSON
         });
      };
 
    
}
export const getAddressesByUser = (email)=>{
    console.log('wdwqdq',email)
    return async dispatch => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,`resource/Address?filters=[["owner","like","%${email}%"]]&fields=["*"]&limit_page_length=5000`)
        const parseDataInJSON =  await request.json()
        console.log('dwdqqd',JSON.stringify(parseDataInJSON,null,2))
        // const requestTwo = await GetMethod(`${urlForSignUp}`,undefined,"resource/Product Bundle/" + parseDataInJSON.data[0].name)
        // const parseDataInJSONtwo =  await requestTwo.json()
        dispatch({
            type:'GET_ADDRESSES',
            value:parseDataInJSON.data
         });
      };
}
export const getOrders = (email)=>{
    console.log(email)
    return async dispatch => {
        const request = await GetMethod(`${urlForSignUp}`,undefined,`resource/Sales Order?filters=[["owner","like","%${email}%"]]&fields=["*"]&limit_page_length=5000`)
        const parseDataInJSON =  await request.json()
        const arr = parseDataInJSON.data.filter(item=>{
            return (item.order_status !== "Cancelled" && item.order_status !== "Delivered")
        })
        // const requestTwo = await GetMethod(`${urlForSignUp}`,undefined,"resource/Product Bundle/" + parseDataInJSON.data[0].name)
        // const parseDataInJSONtwo =  await requestTwo.json()
        
        dispatch({
            type:'GET_ORDERS',
            value:parseDataInJSON.data
         });
         dispatch({
            type:"SET_ORDERS_ON_HOME",
            value:arr
         })
      };
}
export const userLoggedIn = (value)=>{
  return{
    type:'USER_LOGGEDIN',
    value:value
  }
}
export const setOrderonHome = (value)=>{
    return{
      type:'SET_ORDERS_ON_HOME',
      value:value
    }
  }