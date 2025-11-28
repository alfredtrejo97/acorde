import { db } from "$lib/assets/js/firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where
} from "firebase/firestore";

const COLLECTION_NAME = "inventario";

export async function getAllProducts() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createProduct(data) {
    const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { id: ref.id, ...data };
}

export async function updateProduct(id, data) {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
}

export async function reduceStock(id, quantity) {
    const ref = doc(db, COLLECTION_NAME, id);
    const productDoc = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', id)));

    if (productDoc.empty) {
        throw new Error('Producto no encontrado');
    }

    const currentStock = productDoc.docs[0].data().Stock || 0;
    const newStock = Math.max(0, currentStock - quantity);

    await updateDoc(ref, {
        Stock: newStock,
        updatedAt: serverTimestamp()
    });

    return newStock;
}

