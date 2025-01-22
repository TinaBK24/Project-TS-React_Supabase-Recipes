import { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

// Інтерфейс для контексту
interface IUserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Створення контексту
export const UserContext = createContext<IUserContext>(null!);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const restoreSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session && !user) {  // Перевірка, чи змінився user
                setUser(data.session.user);
            }
        };

        restoreSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && (user === null || session.user.id !== user.id)) { // Обновлюємо лише якщо user змінився
                setUser(session.user);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [user]);  // Додаємо залежність на user

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
