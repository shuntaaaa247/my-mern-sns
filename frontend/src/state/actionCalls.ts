import axios from "axios";

interface ILoginCallParams {
  email: string,
  password: string
}

export const loginCall = async (user: ILoginCallParams, dispatch: React.Dispatch<any>) => {
  console.log("loginCallが呼ばれました")
  dispatch({ type: "LOGIN_START" });
  try {
    // const res = await axios.post("/auth/login", user);
    const res = await axios.post("https://my-mern-sns-api.onrender.com/auth/login", user);
    dispatch({type: "LOGIN_SUCCESS", payload: res.data});
    console.log("loginCall成功");
    console.log(res.data);
  } catch(err) {
    console.log("loginCallでのエラー");
    console.log(err)
    dispatch({type: "LOGIN_ERROR", payload: err});
  }
}
