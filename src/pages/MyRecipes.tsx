import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import { Database } from "../utils/database.types";
import { toggleFavoriteRecipe } from "../utils/favoriteRecipes";
import Banner from "../components/Banner";

const MyRecipes = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { favRezepte, setFavRezepte, popularRecipes } = useContext(UserContext)

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

            // Витягування рецептів та їх оновлення
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

    return (
        <section className="bg-white">
            <Banner />
            <h1 className="text-3xl font-semibold text-center mb-7">Die beliebtesten Rezepte</h1>
            {loading ? (
                <p className="text-3xl font-semibold text-center pb-7">Rezepte werden geladen...</p>
            ) : favRezepte.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-5 pb-10">
                    {favRezepte.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="w-72 bg-neutral-100 rounded-2xl"
                        >
                            {recipe.imageUrl && (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.name}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />
                            )}
                            <div className="p-5 flex flex-col gap-2">
                                <h2 className="text-2xl font-semibold">{recipe.name}</h2>
                                <p>{recipe.description}</p>
                                <Link
                                    to={`/recipes/${recipe.name.toLowerCase()}`}
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
            ) : (
                <p className="text-3xl font-semibold text-center pb-7">Keine Favoriten gefunden.</p>
            )}
        </section>
    );
}

export default MyRecipes;