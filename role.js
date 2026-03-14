import { getDatabase, ref, get } from "firebase/database";

export const isAdmin = async (user) => {

  if (!user) return false;

  const db = getDatabase();

  const snapshot = await get(ref(db, "users/" + user.uid));

  if (snapshot.exists()) {

    const data = snapshot.val();

    if (data.role === "admin") {
      return true;
    }

  }

  return false;
};