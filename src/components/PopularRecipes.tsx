import { useEffect } from "react";
import { Database } from "../utils/database.types";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";

interface PopularRecipesProps {
    popularRecipes: Database['public']['Tables']['recipes']['Row'][];
    setPopularRecipes: React.Dispatch<React.SetStateAction<Database['public']['Tables']['recipes']['Row'][]>>;
}

const PopularRecipes: React.FC<PopularRecipesProps> = (props) => {

    const fetchPopularRecipes = async () => {
        const popularResponse = await supabase
            .from('recipes')
            .select('*')
            .order('rating', { ascending: false })
            .limit(3);


        if (popularResponse.data) props.setPopularRecipes(popularResponse.data);
    }

    useEffect(() => {
        fetchPopularRecipes();
    })

    return (
        <>
            {/* popularRecipes */}
            <section>
                <h1 className="text-3xl font-semibold text-center mb-7">Die beliebtesten Rezepte</h1>
                {props.popularRecipes.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 pb-10">
                        {props.popularRecipes.map((recipe) => (
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Keine beliebten Rezepte gefunden</p>
                )}
            </section></>
    );
}

export default PopularRecipes;