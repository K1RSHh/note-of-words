import { useState } from "react";
import useWordStore from "../store/WordStore"; //
import AuthModal from "./AuthModal";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User as UserIcon } from "lucide-react";

function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, logOut } = useWordStore(); //

  return (
    <header className="w-full flex justify-end p-6">
      <div className="flex items-center gap-4">
        <AnimatePresence mode="wait">
          {user ? (
            // Status: User logged in
            <motion.div
              key="user-logged"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-end">
                <span className="text-white text-xs opacity-60">
                  Logged in as
                </span>
                <span className="text-white text-sm font-medium">
                  {user.email}
                </span>
              </div>

              <div className="relative group">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-neutral-700 shadow-lg cursor-pointer transition-transform group-hover:scale-105">
                  <UserIcon size={24} />
                </div>

                <motion.button
                  onClick={logOut} //
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-14 right-0 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 whitespace-nowrap z-50 cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Status: Guest
            <motion.button
              key="guest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsAuthOpen(true)}
              className="px-6 py-2 bg-neutral-100 text-black font-bold rounded-xl hover:bg-white transition-all shadow-md cursor-pointer"
            >
              Login
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </header>
  );
}

export default Header;
