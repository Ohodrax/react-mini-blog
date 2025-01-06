import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

import { db } from "../firebase/config";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // cleanup (eliminar resquicios de funções que podem ser executadas)
    // deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(null);

        try {

            const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(user, { displayName: data.displayName });

            setLoading(false);

            return user;

        } catch (error) {

            console.log(error)
            console.log(error.code)
            console.log(error.message)
            console.log(typeof error.message)

            let systemErrorMessage;

            switch (error.code) {
                case "auth/weak-password":
                    systemErrorMessage = "Sua senha deve conter no mínimo 6 caracteres.";
                break;

                case "auth/email-already-in-use":
                    systemErrorMessage = "Este e-mail já está em uso.";
                break;

                default:
                    systemErrorMessage = "Ocorreu um erro.";
                break;
            }

            setError(systemErrorMessage);
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { auth, createUser, error, loading }
}