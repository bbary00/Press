import { createStore, combineReducers } from "redux";
import mainPageReducer from "./mainPage-reducer";

let reducers = combineReducers({
    mainPage: mainPageReducer
})

let store = createStore(reducers)



export default store