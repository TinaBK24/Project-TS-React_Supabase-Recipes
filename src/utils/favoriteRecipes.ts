import { supabase } from "../utils/supabaseClient";
import { Database } from "./database.types";

export const fetchFavoriteRecipes = async (
    setFavRezepte: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>
) => {
    const user = await supabase.auth.getUser();

    if (!user.data?.user) {
        const savedFavs = localStorage.getItem("favRezepte");
        if (savedFavs) {
            setFavRezepte(JSON.parse(savedFavs));
        }
        return;
    }

    const { data, error } = await supabase
        .from("recipe_favorites")
        .select("recipe_id, recipes(*)")
        .eq("user_id", user.data.user.id);

    if (error) {
        console.error("Fehler beim Laden der Favoriten:", error);
        return;
    }

    const recipes = data?.map(item => item.recipes).flat() || [];
    console.log("Loaded favorites from supabase:", recipes);
    setFavRezepte(recipes);

    localStorage.setItem("favRezepte", JSON.stringify(recipes));


};

export const toggleFavoriteRecipe = async (
    recipeId: string,
    favRezepte: Database["public"]["Tables"]["recipes"]["Row"][],
    setFavRezepte: React.Dispatch<React.SetStateAction<Database["public"]["Tables"]["recipes"]["Row"][]>>,
    popularRecipes: Database["public"]["Tables"]["recipes"]["Row"][]
) => {
    const user = await supabase.auth.getUser();

    if (!user.data?.user) {
        console.error("Kein Benutzer angemeldet!");
        return;
    }

    const existingFavorite = favRezepte.find((favRecipe) => favRecipe.id === recipeId);

    if (existingFavorite) {
        const { error } = await supabase
            .from("recipe_favorites")
            .delete()
            .match({ user_id: user.data.user.id, recipe_id: recipeId });

        if (error) {
            console.error("Fehler beim Entfernen des Rezepts aus den Favoriten:", error);
            return;
        }

        setFavRezepte((prev) => prev.filter((favRecipe) => favRecipe.id !== recipeId));

        localStorage.setItem(
            "favRezepte",
            JSON.stringify(favRezepte.filter((favRecipe) => favRecipe.id !== recipeId))
        );
        console.log("Rezept aus den Favoriten entfernt!");
    } else {
        const { error } = await supabase
            .from("recipe_favorites")
            .insert([{ user_id: user.data.user.id, recipe_id: recipeId }]);

        if (error) {
            console.error("Fehler beim Hinzufügen des Rezepts zu den Favoriten:", error);
            return;
        }

        const favRecipe = popularRecipes.find((recipe) => recipe.id === recipeId);
        if (favRecipe) {
            setFavRezepte((prev) => [...prev, favRecipe]);

            localStorage.setItem("favRezepte", JSON.stringify([...favRezepte, favRecipe]));
        }

        console.log("Rezept erfolgreich zu den Favoriten hinzugefügt!");
    }
};
