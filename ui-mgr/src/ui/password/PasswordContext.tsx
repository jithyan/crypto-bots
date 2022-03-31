import React, { useContext, useLayoutEffect, useState } from "react";

export const Password = {
  current: "",
};

const PasswordContext = React.createContext({
  password: "",
  setShowPasswordModal: (arg: boolean) => {},
  setPassword: (password: string) => {},
  showPasswordModal: false,
});

export function usePasswordContext() {
  const val = useContext(PasswordContext);

  if (!val) {
    throw new Error(
      "PasswordContext is not present. Call this hook as a child of that context."
    );
  }

  return val;
}

export function PasswordContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    Password.current = password;
  }, [password]);

  return (
    <PasswordContext.Provider
      value={{ setShowPasswordModal, password, setPassword, showPasswordModal }}
    >
      {children}
    </PasswordContext.Provider>
  );
}
