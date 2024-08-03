import { db } from "../config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function getDocuments(collectionName, userEmail) {
  let result = [];
  let error = null;

  try {
    const q = query(
      collection(db, collectionName),
      where("email", "==", userEmail)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Fetched documents for ${userEmail}`);
  } catch (e) {
    console.error(`Error fetching documents for ${userEmail}:`, e);
    error = e;
  }

  return { result, error };
}
