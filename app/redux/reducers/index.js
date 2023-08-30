const initialState = {
  userData: {},
  categoriesData: [],
  loggedin:false,
  deals:[],
  products:[],
  singleProductData:{},
  DealDetail:{},
  BillableItems:[],
  Flavours:[],
  posdata:{},
  productlist:[],
  addresses:[],
  address:'',
  ordersData:[],
  cartQuantity:0,
  viewOrdersonHome:[]
};
const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_USERDATA': {
      return {
        ...state,
        userData: action.value,
      };
    }
    case 'USER_LOGGEDIN': {
      return {
        ...state,
        loggedin: action.value,
      };
    }
    case 'SET_ORDERS_ON_HOME':{
       return {
        ...state,
        viewOrdersonHome:action.value
       }
    }
    case 'SET_CART_QTY': {
      return {
        ...state,
        cartQuantity: action.value,
      };
    }
    case 'GET_DEALS': {
      return {
        ...state,
        deals: action.value,
      };
    }
    case 'GET_PRODUCTS': {
      return {
        ...state,
        products: action.value,
      };
    }
    case 'DEAL_DETAIL': {
      return {
        ...state,
        DealDetail: action.value,
      };
    }
    case 'GET_CATEGORIES': {
      return {
        ...state,
        categoriesData: action.value,
      };
    }
    case 'GET_ORDERS': {
      return {
        ...state,
        ordersData: action.value,
      };
    }
    case 'SET_BILLABLE': {
      return {
        ...state,
        BillableItems: action.value,
      };
    }
    case 'SET_FLAVOURS': {
      return {
        ...state,
        Flavours: action.value,
      };
    }
    case 'SET_PRODUCT_LIST': {
      return {
        ...state,
        productlist: action.value,
      };
    }
    case 'POS_DATA':{
      return{
        ...state,
        posdata:action.value
      }
    }
    case 'SINGLE_PRODUCT_DATA':{
      return{
        ...state,
        singleProductData:action.value
      }
    }
    case 'SET_NEW_ADDRESS':{
      return{
        ...state,
        addresses:action.value
      }
        }
        case 'UPDATE_ADDRESS':{
          return{
            ...state,
            addresses:action.value
          }
            }
        case 'GET_ADDRESSES':{
          return{
            ...state,
            addresses:action.value
          }
        }
          case 'SET_ADDRESS_FIELD':{
            return{
              ...state,
              address:action.value
            }
              }
    default: {
      return state;
    }
  }
};
export default Reducer;
