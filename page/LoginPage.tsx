import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Screen } from '../types';

interface LoginPageProps {
  setScreen: (s: Screen) => void;
}

const LoginPage = ({ setScreen }: LoginPageProps) => (
  <div className="min-h-screen flex w-full">
     {/* Left Side Image */}
     <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Food Background" />
        <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
           <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
           <p className="text-xl opacity-90 max-w-md">Discover thousands of delicious dishes and exclusive offers.</p>
        </div>
     </div>
     
     {/* Right Side Form */}
     <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
           <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start cursor-pointer" onClick={() => setScreen('home')}>
             <div className="bg-primary p-2 rounded-lg text-white"><UtensilsCrossed size={24} /></div>
             <span className="text-2xl font-bold text-textMain">Foodie Delight</span>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
              <form className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold">Email</label>
                    <input type="email" placeholder="name@example.com" className="w-full rounded-xl border-gray-200 bg-background h-12 px-4 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-xl border-gray-200 bg-background h-12 px-4 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="flex justify-end">
                    <a href="#" className="text-primary text-sm font-bold hover:underline">Forgot password?</a>
                 </div>
                 <button type="button" onClick={() => setScreen('admin-dashboard')} className="w-full bg-primary text-white font-bold h-12 rounded-xl hover:bg-primaryDark transition-all">Sign In</button>
              </form>
              
              <div className="mt-6 text-center">
                 <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button onClick={() => setScreen('register')} className="text-primary font-bold hover:underline">
                       Create one
                    </button>
                 </p>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-gray-500">Or continue with</span></div>
              </div>

              <div>
                 <button className="flex items-center justify-center gap-2 w-full h-12 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors">
                    <span className="text-red-500 font-bold">G</span> Google
                 </button>
              </div>
           </div>
        </div>
     </div>
  </div>
);

export default LoginPage;
