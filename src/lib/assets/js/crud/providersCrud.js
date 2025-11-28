import { db } from "$lib/assets/js/firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "proveedores";

export async function getAllProviders() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createProvider(data) {
    const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { id: ref.id, ...data };
}

export async function updateProvider(id, data) {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProvider(id) {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
}
