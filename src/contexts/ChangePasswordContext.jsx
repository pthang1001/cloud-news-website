import { createContext, useContext, useState } from "react";
import ChangePasswordModal from "../components/ChangePasswordModal/ChangePasswordModal";

const ChangePasswordContext = createContext(null);

export const ChangePasswordProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChangePassword = () => setIsOpen(true);
  const closeChangePassword = () => setIsOpen(false);

  return (
    <ChangePasswordContext.Provider value={{ openChangePassword, closeChangePassword }}>
      {children}
      <ChangePasswordModal isOpen={isOpen} onClose={closeChangePassword} />
    </ChangePasswordContext.Provider>
  );
};

export const useChangePassword = () => {
  const ctx = useContext(ChangePasswordContext);
  if (!ctx) throw new Error("useChangePassword must be used within ChangePasswordProvider");
  return ctx;
};