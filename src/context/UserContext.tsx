import { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { Database } from "../utils/database.types";

// Інтерфейс для контексту
interface IUserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    popularRecipes: Database['public']['Tables']['recipes']['Row'][];
    setPopularRecipes: React.Dispatch<React.SetStateAction<Database['public']['Tables']['recipes']['Row'][]>>;
    favRezepte: Database["public"]["Tables"]["recipes"]["Row"][];
    setFavRezepte: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>;
}

export const UserContext = createContext<IUserContext>(null!);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [popularRecipes, setPopularRecipes] = useState<Database["public"]["Tables"]["recipes"]["Row"][]>([]);
    const [favRezepte, setFavRezepte] = useState<Database["public"]["Tables"]["recipes"]["Row"][]>([]);

    useEffect(() => {
        const restoreSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session && !user) {
                setUser(data.session.user);
            }
        };

        restoreSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && (user === null || session.user.id !== user.id)) {
                setUser(session.user);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            const getFavRecipes = async () => {
                const { data, error } = await supabase
                    .from("recipe_favorites")
                    .select("*")
                    .eq("user_id", user.id);

                if (data) {
                    setFavRezepte(data);
                } else {
                    console.error(error);
                }
            };

            getFavRecipes();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, popularRecipes, setPopularRecipes, favRezepte, setFavRezepte }}>
            {children}
        </UserContext.Provider>
    );
};
