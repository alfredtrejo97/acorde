import { db } from "$lib/assets/js/firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

const COLLECTION_NAME = "balance";

function toTimestamp(v) {
    if (!v) return null;
    if (v instanceof Timestamp) return v;
    if (typeof v.toDate === "function") return v;
    if (typeof v === "string") {
        const d = new Date(v);
        return isNaN(d) ? null : Timestamp.fromDate(d);
    }
    if (v instanceof Date) return Timestamp.fromDate(v);
    return null;
}

export async function getAllBalance() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createBalance(data) {
    const payload = {
        ...data,
        monto: typeof data.monto === "string" ? Number(data.monto) : data.monto,
        fecha: toTimestamp(data.fecha),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { id: ref.id, ...payload };
}

export async function updateBalance(id, data) {
    const ref = doc(db, COLLECTION_NAME, id);
    const payload = {
        ...data,
        monto: typeof data.monto === "string" ? Number(data.monto) : data.monto,
        fecha: toTimestamp(data.fecha),
        updatedAt: serverTimestamp()
    };
    await updateDoc(ref, payload);
}

export async function deleteBalance(id) {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
}
