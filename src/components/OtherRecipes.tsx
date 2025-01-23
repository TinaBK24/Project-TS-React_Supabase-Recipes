import { useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Database } from "../utils/database.types";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { fetchFavoriteRecipes, toggleFavoriteRecipe } from "../utils/favoriteRecipes";

const OtherRecipes = () => {
    const [otherRecipes, setOtherRecipes] = useState<Database['public']['Tables']['recipes']['Row'][]>([]);
    const { popularRecipes, favRezepte, setFavRezepte } = useContext(UserContext);
    const popularIds = popularRecipes.map(recipe => recipe.id) || [];

    const fetchOtherRecipes = async () => {
        const otherResponse = await supabase
            .from('recipes')
            .select('*')
            .order('created_at', { ascending: false })
            .neq('id', popularIds[0])
            .neq('id', popularIds[1])
            .neq('id', popularIds[2]);

        if (otherResponse.data) setOtherRecipes(otherResponse.data);
    }

    useEffect(() => {
        fetchOtherRecipes();
    }, [popularIds]);

    useEffect(() => {
        fetchFavoriteRecipes(setFavRezepte);
    }, []);

    return (
        <>
            {/* otherRecipes */}
            <section>
                <h2 className="text-3xl font-semibold text-center mb-7">Neueste Rezepte</h2>
                {otherRecipes.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 pb-10 px-28">
                        {otherRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="w-full flex bg-neutral-100 rounded-2xl"
                            >
                                {recipe.imageUrl && (
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.name}
                                        className="w-44 h-48 object-cover rounded-l-2xl"
                                    />
                                )}
                                <div className="p-6 flex flex-col justify-between gap-2">
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
                    <p className="text-3xl font-semibold text-center pb-7">Loading...</p>
                )}
            </section></>
    );
}

export default OtherRecipes;