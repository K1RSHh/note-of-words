import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { motion } from "motion/react"; //
import { toast } from "react-hot-toast";

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      isLogin ? "Signing in..." : "Creating account...",
    );

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!", { id: loadingToast });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account successfully created!", { id: loadingToast });
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error has occurred";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        layout // Дозволяє формі плавно змінювати розмір
        className="bg-neutral-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-neutral-800"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isLogin ? "Welcome back" : "Join us"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-3xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            required
          />

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }} //
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-colors cursor-pointer mt-4 shadow-lg shadow-blue-900/20"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <p className="text-neutral-500 text-sm">
            {isLogin ? "New to the platform?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 ml-2 font-bold hover:text-blue-300 transition-colors cursor-pointer"
            >
              {isLogin ? "Register now" : "Log in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
