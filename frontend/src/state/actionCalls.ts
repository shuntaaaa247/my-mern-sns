import axios from "axios";

interface ILoginCallParams {
  email: string,
  password: string
}

export const loginCall = async (user: ILoginCallParams, dispatch: React.Dispatch<any>) => {
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  console.log("loginCallが呼ばれました")
  dispatch({ type: "LOGIN_START" });
  try {
    //本番環境用
    // const res = await axios.post("/auth/login", user);
    //または
    //const res = await axios.post("https://my-mern-sns-api.onrender.com/api/auth/login", user);

    //本番環境用デバッグ
    const res = await axios.post(`${backendBaseUrl}/auth/login`, user);

    // const res = await axios.post("http://localhost:4000/api/auth/login", user);
    dispatch({type: "LOGIN_SUCCESS", payload: res.data});
    console.log("loginCall成功");
    console.log(res.data);
  } catch(err) {
    console.log("本番環境デバッグ2")
    console.log("loginCallでのエラー");
    console.log(err)
    dispatch({type: "LOGIN_ERROR", payload: err});
  }
}
