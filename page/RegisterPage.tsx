import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Screen } from '../types';

interface RegisterPageProps {
  setScreen: (s: Screen) => void;
}

const RegisterPage = ({ setScreen }: RegisterPageProps) => (
  <div className="min-h-screen flex w-full">
     {/* Right Side Form (swapped position for variety) */}
     <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background order-2 lg:order-1">
        <div className="w-full max-w-md">
           <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start cursor-pointer" onClick={() => setScreen('home')}>
             <div className="bg-primary p-2 rounded-lg text-white"><UtensilsCrossed size={24} /></div>
             <span className="text-2xl font-bold text-textMain">Foodie Delight</span>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-2 text-center">Create Account</h2>
              <p className="text-center text-gray-500 mb-6 text-sm">Join us to start your delicious journey</p>
              
              <form className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full rounded-xl border-gray-200 bg-background h-12 px-4 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold">Email</label>
                    <input type="email" placeholder="name@example.com" className="w-full rounded-xl border-gray-200 bg-background h-12 px-4 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold">Password</label>
                    <input type="password" placeholder="Create a password" className="w-full rounded-xl border-gray-200 bg-background h-12 px-4 focus:ring-primary focus:border-primary" />
                 </div>
                 <button type="button" onClick={() => setScreen('home')} className="w-full bg-primary text-white font-bold h-12 rounded-xl hover:bg-primaryDark transition-all mt-2">Sign Up</button>
              </form>
              
              <div className="mt-6 text-center">
                 <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <button onClick={() => setScreen('login')} className="text-primary font-bold hover:underline">
                       Login
                    </button>
                 </p>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-gray-500">Or sign up with</span></div>
              </div>

              <div>
                 <button className="flex items-center justify-center gap-2 w-full h-12 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors">
                    <span className="text-red-500 font-bold">G</span> Google
                 </button>
              </div>
           </div>
        </div>
     </div>

     {/* Left Side Image */}
     <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Restaurant Background" />
        <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
           <h1 className="text-5xl font-bold mb-4">Join The Club</h1>
           <p className="text-xl opacity-90 max-w-md">Get exclusive access to secret menus, special events and more.</p>
        </div>
     </div>
  </div>
);

export default RegisterPage;
