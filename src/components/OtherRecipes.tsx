import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Database } from "../utils/database.types";
import { Link } from "react-router-dom";
import { fetchFavoriteRecipes, toggleFavoriteRecipe } from "../utils/favoriteRecipes";

interface OtherRecipesProps {
    favRezepte: Database["public"]["Tables"]["recipes"]["Row"][];
    setFavRezepte: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>;
    popularRecipes: Database["public"]["Tables"]["recipes"]["Row"][];
}

const OtherRecipes: React.FC<OtherRecipesProps> = ({ favRezepte, setFavRezepte, popularRecipes }) => {
    const [otherRecipes, setOtherRecipes] = useState<Database['public']['Tables']['recipes']['Row'][]>([]);
    const popularIds = popularRecipes.map(recipe => recipe.id) || [];

    const fetchOtherRecipes = async () => {
        const otherResponse = await supabase
            .from('recipes')
            .select('*')
            .order('created_at', { ascending: false })
            .not('id', 'in', `(${popularIds.join(',')})`);

        if (otherResponse.data) setOtherRecipes(otherResponse.data);
    }

    useEffect(() => {
        fetchOtherRecipes();
    }, [popularIds]);

    useEffect(() => {
        fetchFavoriteRecipes(setFavRezepte);
    }, []);

    const handleToggleFavorite = async (recipeId: string) => {
        // Перевірка, чи рецепт уже є у фаворитах
        const isCurrentlyFavorite = favRezepte.some((favRecipe) => favRecipe.id === recipeId);

        // Оновлення глобального стану
        if (isCurrentlyFavorite) {
            setFavRezepte(favRezepte.filter((recipe) => recipe.id !== recipeId));
        } else {
            const addedRecipe = otherRecipes.find((recipe) => recipe.id === recipeId);
            if (addedRecipe) {
                setFavRezepte([...favRezepte, addedRecipe]);
            }
        }

        // Виклик функції для оновлення в Supabase
        await toggleFavoriteRecipe(recipeId, favRezepte, setFavRezepte, popularRecipes);
    };

    return (
        <>
            {/* otherRecipes */}
            <section>
                <h2 className="text-3xl font-semibold text-center mb-7">Neueste Rezepte</h2>
                {otherRecipes.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 pb-10 px-28">
                        {otherRecipes.map((recipe) => {
                            const isFavorite = favRezepte.some(
                                (favRecipe) => favRecipe.id === recipe.id
                            );

                            return (
                                <div key={`${recipe.id}-${isFavorite}`} className="w-full flex bg-neutral-100 rounded-2xl">
                                    {recipe.imageUrl && (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.name}
                                            className="w-44 h-full object-cover rounded-l-2xl"
                                        />
                                    )}
                                    <div className="p-6 flex flex-col justify-between gap-2">
                                        <h2 className="text-2xl font-semibold">{recipe.name}</h2>
                                        <p>{recipe.description}</p>
                                        <Link
                                            to={`/recipes/${recipe.name.toLowerCase()}`}
                                            className="bg-yellow-300 flex items-center justify-center rounded-3xl py-1 px-6 w-fit font-semibold"
                                        >
                                            Zum Rezept
                                        </Link>

                                        <button
                                            onClick={() => handleToggleFavorite(recipe.id)}
                                            className={`mt-4 w-fit ${isFavorite ? "text-red-500" : "text-gray-500"}`}
                                        >
                                            {isFavorite ? "❤️" : "🤍"} Favorit
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-3xl font-semibold text-center pb-7">Loading...</p>
                )}
            </section></>
    );
}

export default OtherRecipes;