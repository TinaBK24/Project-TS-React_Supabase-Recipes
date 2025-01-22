import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import OtherRecipes from "../components/OtherRecipes";
import PopularRecipes from "../components/PopularRecipes";
import { Database } from "../utils/database.types";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

interface RecipesProps {
    popularRecipes: Database['public']['Tables']['recipes']['Row'][];
    setPopularRecipes: React.Dispatch<React.SetStateAction<Database['public']['Tables']['recipes']['Row'][]>>;
}

const Recipes: React.FC<RecipesProps> = (props) => {
    const { user } = useContext(UserContext);

    return (
        <>

            {user ? (
                <section className="bg-white">
                    <Banner />
                    <PopularRecipes
                        popularRecipes={props.popularRecipes}
                        setPopularRecipes={props.setPopularRecipes}
                    />
                    <OtherRecipes
                        popularRecipes={props.popularRecipes}
                        setPopularRecipes={props.setPopularRecipes}
                    />
                </section>
            ) : (
                <section className="bg-white h-96 flex justify-center items-center">
                    <Link
                        to="/login"
                        className="text-2xl font-bold border-solid border-2 border-black p-4 bg-yellow-200 rounded-lg"
                    >
                        Login
                    </Link>
                </section>
            )}
        </>
    );
}

export default Recipes;