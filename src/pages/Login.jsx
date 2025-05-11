import { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const access_token = localStorage.getItem("access_token");
  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  }, []);
  const loginHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("https://testaoron.limsa.uz/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        login: e.target.login.value,
        password: e.target.password.value,
      }),
    })
      .then((data) => data.json())
      .then((req) => {
        if (req.success) {
          toast.success(req.data.message);
          localStorage.setItem("access_token", req.data.access_token);
          localStorage.setItem("refresh_token", req.data.refresh_token);
          navigate("/");
        } else {
          toast.error(req.message.message);
        }
        setIsLoading(false);
        console.log(req);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  return (
    <section className="h-screen w-dvw overflow-hidden flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={loginHandler}>
          <div className="mb-4">
            <label
              htmlFor="login"
              className="block text-gray-700 text-base font-semibold mb-2"
            >
              Login:
            </label>
            <input
              type="text"
              name="login"
              id="login"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-base font-semibold mb-2"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={isPasswordHidden ? "password" : "text"}
                name="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <span
                className="absolute right-4 text-xl text-gray-500 font-bold top-[50%] translate-y-[-50%] cursor-pointer"
                onClick={() => setIsPasswordHidden((i) => !i)}
              >
                {isPasswordHidden ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
          </div>
          <button
            disabled={isLoading}
            className={`w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-lg ${
              isLoading ? "cursor-progress" : "cursor-pointer"
            } p-2 text-white  text-lg font-semibold`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};
export default Login;
