import { useEffect, useState } from 'react'
import { db } from "../firebase/config";
import { doc, getDoc } from 'firebase/firestore';

// docCollection seria o nome da tabela
export const useFetchDocument = (docCollention, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        async function loadDocument() {
            if (cancelled) return;

            setLoading(true);

            try {

                const docRef = await doc(db, docCollention, id);
                const docSnap = await getDoc(docRef);

                setDocument(docSnap.data());

                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message);

                setLoading(false);
            }
        }

        loadDocument();

    }, [docCollention, id, cancelled]);

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { document, loading, error };
}