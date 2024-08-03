import { db } from "../config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default async function deleteData(collectionName, docId, userEmail) {
  let result = false;
  let error = null;

  try {
    console.log("deleting...");

    // query ID and email
    const q = query(
      collection(db, collectionName),
      where("id", "==", docId),
      where("email", "==", userEmail)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No document found for ID ${docId} and email ${userEmail}`);
      return { result: false, error: "Document not found" };
    }

    const doc = querySnapshot.docs[0];
    await deleteDoc(doc.ref);

    console.log(
      `Successfully deleted document ${docId} from ${collectionName} for user ${userEmail}`
    );
    result = true;
  } catch (e) {
    console.error(
      `Error deleting document ${docId} from ${collectionName} for user ${userEmail}:`,
      e
    );
    error = e;
  }

  return { result, error };
}
