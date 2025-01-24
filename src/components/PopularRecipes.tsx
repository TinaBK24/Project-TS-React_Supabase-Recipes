import { useContext, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";
import { fetchFavoriteRecipes, toggleFavoriteRecipe } from "../utils/favoriteRecipes";
import { Database } from "../utils/database.types";
import { UserContext } from "../context/UserContext";

interface PopularRecipesProps {
    favRezepte: Database["public"]["Tables"]["recipes"]["Row"][];
    setFavRezepte: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>;
    popularRecipes: Database["public"]["Tables"]["recipes"]["Row"][];
    setPopularRecipes: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>;
}

const PopularRecipes: React.FC<PopularRecipesProps> = ({ favRezepte, setFavRezepte, popularRecipes, setPopularRecipes }) => {
    const { user } = useContext(UserContext);

    const fetchPopularRecipes = async () => {
        const popularResponse = await supabase
            .from('recipes')
            .select('*')
            .order('rating', { ascending: false })
            .limit(3);


        if (popularResponse.data) setPopularRecipes(popularResponse.data);
    }

    useEffect(() => {
        fetchPopularRecipes();
    }, []);

    useEffect(() => {
        fetchFavoriteRecipes(setFavRezepte);
    }, []);

    return (
        <>
            {/* popularRecipes */}
            <section>
                <h1 className="text-3xl font-semibold text-center mb-7">Die beliebtesten Rezepte</h1>
                {popularRecipes.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 pb-10">
                        {popularRecipes.map((recipe) => (
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
                                        <h2 className="text-2xl font-semibold mb-2">{recipe.name}</h2>
                                        <p>{recipe.description}</p>
                                    </div>
                                </div>
                                <div className="px-5 pb-5">
                                    <Link
                                        to={`/recipes/${recipe.name.toLowerCase()}`}
                                        className="bg-yellow-300 flex items-center justify-center rounded-3xl py-1 px-6 w-fit font-semibold"
                                    >Zum Rezept</Link>

                                    {user ? (
                                        <button
                                            onClick={() => toggleFavoriteRecipe(recipe.id, favRezepte, setFavRezepte, popularRecipes)}
                                            className={`mt-4 w-fit ${favRezepte.some((favRecipe) => favRecipe.id === recipe.id) ? 'text-red-500' : 'text-gray-500'}`}
                                        >
                                            {favRezepte.some((favRecipe) => favRecipe.id === recipe.id) ? '❤️' : '🤍'} Favorit
                                        </button>
                                    ) : ("")}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-3xl font-semibold text-center pb-7">Keine beliebten Rezepte gefunden</p>
                )}
            </section></>
    );
}

export default PopularRecipes;