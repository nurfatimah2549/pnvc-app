import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { getDatabase, ref, get } from "firebase/database";

import { auth } from '../firebase';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {

      setUser(currentuser);

      if (currentuser) {

        const db = getDatabase();
        const snapshot = await get(ref(db, "users/" + currentuser.uid));

        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserRole(data.role);
          console.log("ROLE =", data.role);
        }

      } else {
        setUserRole(null);
      }

    });

    return unsubscribe;

  }, []);

  return (
    <userAuthContext.Provider value={{ user, userRole, login, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}