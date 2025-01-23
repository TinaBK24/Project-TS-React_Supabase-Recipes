import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import OtherRecipes from "../components/OtherRecipes";
import PopularRecipes from "../components/PopularRecipes";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Recipes = () => {
    const { user, favRezepte, setFavRezepte, popularRecipes, setPopularRecipes } = useContext(UserContext);

    return (
        <>

            {user ? (
                <section className="bg-white">
                    <Banner />
                    <PopularRecipes favRezepte={favRezepte} setFavRezepte={setFavRezepte} popularRecipes={popularRecipes} setPopularRecipes={setPopularRecipes} />
                    <OtherRecipes />
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