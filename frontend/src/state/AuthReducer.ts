import { IAuthState } from "./AuthContext";
import { IUser } from "./AuthContext";

interface IAction {
  type: string,
  payload: IUser | null
}

const AuthReducer = (state: IAuthState, action: IAction): IAuthState => {
  switch(action.type) {
    case "LOGIN_START":
      console.log("AuthReducer LOGIN_START")
      return {
        user: null,
        isFetching: true,
        error: false
      };
    case "LOGIN_SUCCESS":
      console.log("AuthReducer LOGIN_SCCESS")
      return {
        /*
        どこかのコンポーネントからuseReducerのdispatchを経由してこのAuthReducerが呼ばれる。
        この時、コンポーネントからは引数actionとして、userの情報がjson形式で送られてきて、
        この関数でそれを含めたjson形式の情報をuseReducerにreturnすることでuseReducerのstateが変わり、グローバルのステートが変わる。
        */
        user: action.payload, 
        isFetching: false,
        error: false
      };
    case "LOGIN_ERROR":
      return {
        user: null,
        isFetching: false,
        error: true
      }
    default:
      return state;
  }
}

export default AuthReducer;