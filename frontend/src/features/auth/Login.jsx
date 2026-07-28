import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { roleRoutes } from '../../utils/roleRoutes';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(roleRoutes[user.role] || '/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await loginUser(formData);

      const { token, id, fullName, email, role } = response.data;

      login(
        {
          id,
          fullName,
          email,
          role,
        },
        token
      );

      navigate(roleRoutes[role] || '/login');
    } catch (err) {
      const messages = err.response?.data?.messages;

      setError(
        messages
          ? messages.join(', ')
          : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-50">

      <div className="min-h-screen w-full flex flex-col lg:flex-row">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-green-800 text-white p-12 flex-col justify-between">

          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl">
                🌾
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Smart Traders <span className="text-green-300">AI</span>
                </h1>

                <p className="text-green-200">
                  Connecting Farms to Opportunities
                </p>
              </div>

            </div>

          </div>


          <div>

            <p className="text-green-300 font-semibold mb-4">
              SMART AGRICULTURE MARKETPLACE
            </p>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Grow Together.
              <br />

              <span className="text-green-300">
                Trade Smarter.
              </span>
            </h2>

            <p className="text-green-100 text-lg max-w-lg">
              Smart Traders AI connects farmers, vendors, and buyers
              through a smart agricultural marketplace.
            </p>

          </div>


          <div className="grid grid-cols-3 gap-4">

            <div className="bg-green-700 p-5 rounded-xl">
              <div className="text-3xl mb-3">
                👨‍🌾
              </div>

              <h3 className="font-bold">
                Farmers
              </h3>

              <p className="text-green-200 text-sm mt-2">
                Sell your crops easily.
              </p>
            </div>


            <div className="bg-green-700 p-5 rounded-xl">
              <div className="text-3xl mb-3">
                🏪
              </div>

              <h3 className="font-bold">
                Vendors
              </h3>

              <p className="text-green-200 text-sm mt-2">
                Find quality products.
              </p>
            </div>


            <div className="bg-green-700 p-5 rounded-xl">
              <div className="text-3xl mb-3">
                🤖
              </div>

              <h3 className="font-bold">
                AI Powered
              </h3>

              <p className="text-green-200 text-sm mt-2">
                Get smart insights.
              </p>
            </div>

          </div>

        </div>


        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden text-center mb-8">

              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-4">
                🌾
              </div>

              <h1 className="text-2xl font-bold text-green-800">
                Smart Traders <span className="text-green-600">AI</span>
              </h1>

              <p className="text-gray-500 text-sm">
                Connecting Farms to Opportunities
              </p>

            </div>


            {/* LOGIN CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

              <div className="mb-8">

                <p className="text-green-600 font-semibold text-sm mb-2 text-center">
                  WELCOME BACK
                </p><br></br>

                <h2 className="text-3xl font-bold text-gray-800">
                  Login
                </h2>

              </div>


              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}


              <form onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className="mb-5">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />

                </div>


                {/* PASSWORD */}
                <div className="mb-6">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>

                  </div>

                </div>


                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

              </form>


              {/* REGISTER */}
              <p className="text-center text-sm text-gray-500 mt-6">

                Don't have an account?{' '}

                <Link
                  to="/register"
                  className="text-green-700 font-semibold"
                >
                  Create Account
                </Link>

              </p>


              <div className="border-t mt-6 pt-4 text-center">

                <p className="text-xs text-gray-400">
                  🌱 Connecting Farmers • Vendors • Buyers
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;