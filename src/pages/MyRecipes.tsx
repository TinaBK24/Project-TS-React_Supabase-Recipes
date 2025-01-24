import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import { Database } from "../utils/database.types";
import { toggleFavoriteRecipe } from "../utils/favoriteRecipes";
import Banner from "../components/Banner";

const MyRecipes = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { user, favRezepte, setFavRezepte, popularRecipes } = useContext(UserContext)

    const ladeFavoriten = async () => {
        try {
            const benutzer = await supabase.auth.getUser();

            if (!benutzer.data?.user) {
                console.error("Kein Benutzer angemeldet!");
                return;
            }

            const { data, error } = await supabase
                .from("recipe_favorites")
                .select(`recipe_id, recipes(*)`)
                .eq("user_id", benutzer.data.user.id);

            if (error) {
                throw error;
            }

            const rezepteDaten = (data?.map((item) => item.recipes) as unknown) as Database["public"]["Tables"]["recipes"]["Row"][];
            setFavRezepte(rezepteDaten);
        } catch (fehler) {
            console.error("Fehler beim Laden der Rezepte:", fehler);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ladeFavoriten();
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session) {
                ladeFavoriten();
            } else {
                console.log("Der Benutzer ist nicht angemeldet.");
            }
        };
        checkSession();
    }, []);

    return (
        <section className="bg-white">
            <Banner />

            {user ? (
                loading ? (
                    <p className="text-3xl font-semibold text-center pb-10" > Rezepte werden geladen...</p>
                ) : favRezepte.length > 0 ? (
                    <div>
                        <h1 className="text-3xl font-semibold text-center mb-7">Lieblingsrezepte</h1>
                        <div className="flex flex-wrap justify-center gap-5 pb-10">
                            {favRezepte.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="flex flex-col justify-between gap-5 w-72 bg-neutral-100 rounded-2xl"
                                >
                                    <div>
                                        {recipe.imageUrl && (
                                            <img
                                                src={recipe.imageUrl}
                                                alt={recipe.name}
                                                className="w-full h-48 object-cover rounded-t-2xl"
                                            />
                                        )}
                                        <div className="px-5 mt-3">
                                            <h2 className="text-2xl font-semibold">{recipe.name}</h2>
                                            <p>{recipe.description}</p>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <Link
                                            to={`/recipes/${recipe.name ? recipe.name.toLowerCase() : ''}`}
                                            className="bg-yellow-300 flex items-center justify-center rounded-3xl py-1 px-6 w-fit font-semibold"
                                        >Zum Rezept</Link>

                                        <button
                                            onClick={() => toggleFavoriteRecipe(recipe.id, favRezepte, setFavRezepte, popularRecipes)}
                                            className={`mt-4 w-fit ${favRezepte.some((favRecipe) => favRecipe.id === recipe.id) ? 'text-red-500' : 'text-gray-500'}`}
                                        >
                                            {favRezepte.some((favRecipe) => favRecipe.id === recipe.id) ? '❤️' : '🤍'} Favorit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-3xl font-semibold text-center pb-10">Keine Favoriten gefunden.</p>
                )
            ) : (
                <section className="bg-white h-96 flex justify-center items-center">
                    <Link
                        to="/login"
                        className="text-2xl font-bold border-solid border-2 border-black p-4 bg-yellow-200 rounded-lg"
                    >
                        Login
                    </Link>
                </section >
            )}
        </section >
    );
}

export default MyRecipes;