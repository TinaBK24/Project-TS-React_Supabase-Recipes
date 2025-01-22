import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import { Database } from "../utils/database.types";

const Recipe = () => {
    const { name } = useParams<{ name: string }>();
    const [singleRecipe, setSingleRecipe] = useState<Database['public']['Tables']['recipes']['Row']>();
    const [ingredients, setIngredients] = useState<Database['public']['Tables']['ingredients']['Row'][]>([]);

    const fetchRecipe = async () => {
        if (!name) return;

        const recipeResponse = await supabase
            .from('recipes')
            .select('*')
            .ilike('name', name)
            .single();

        if (recipeResponse.error) {
            console.error('Error getting prescription:', recipeResponse.error.message);
            return;
        }

        if (recipeResponse.data) {
            setSingleRecipe(recipeResponse.data);

            const ingredientsResponse = await supabase
                .from('ingredients')
                .select('*')
                .eq('recipe_id', recipeResponse.data.id);

            if (ingredientsResponse.error) {
                console.error('Error retrieving ingredients:', ingredientsResponse.error.message);
            } else if (ingredientsResponse.data) {
                setIngredients(ingredientsResponse.data);
            }
        }
    }

    useEffect(() => {
        fetchRecipe();
    }, [name])

    return (
        <>
            {singleRecipe ? (
                <section className="bg-white pb-10">
                    <div className="relative z-0 mb-12">
                        <img
                            src={singleRecipe.imageUrl}
                            alt=""
                            className="w-full h-64 object-cover"
                        />
                        <div className="bg-black opacity-50 absolute top-0 left-0 w-full h-full"></div>
                        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-white text-center">{singleRecipe.name}</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="p-4">
                            <p className="text-xl font-bold mb-2">Zutaten</p>
                            <ul className="list-disc ml-6 mb-4">
                                {ingredients.map((ingredient) => (
                                    <li key={ingredient.id}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</li>
                                ))}
                            </ul>
                            <p className="text-xl font-bold mb-2">Zubereitung</p>
                            <p>{singleRecipe.instructions}</p>
                        </div>
                    </div>
                </section>
            ) : (
                <p>Rezept nicht gefunden</p>
            )}
        </>
    );
}

export default Recipe;