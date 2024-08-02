import { db } from "../config";
import { doc, deleteDoc } from "firebase/firestore";

export default async function deleteData(collectionName, docId) {
  let result = false;
  let error = null;

  try {
    await deleteDoc(doc(db, collectionName, docId));
    result = true;
  } catch (e) {
    error = e;
  }

  return { result, error };
}
