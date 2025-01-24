import { useEffect, useState } from 'react'
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';

export const useFetchDocuments = (docCollention, search, uid = null) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (cancelled) return;

            setLoading(true);

            const collenctionRef = await collection(db, docCollention)

            try {
                let q;
                
                if (search) {
                    q = await query(collenctionRef, where("tagsArray", "array-contains", search), orderBy('createdAt', 'desc'));
                } else {
                    q = await query(collenctionRef, orderBy('createdAt', 'desc'));
                }

                await onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                    )
                })

                setLoading(false);
            } catch (error) {
                console.log(error);

                setError(error.message);
                setLoading(false);
            }
        }

        loadData();

    }, [docCollention, documents, search, uid, cancelled]);

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { documents, loading, error };
}