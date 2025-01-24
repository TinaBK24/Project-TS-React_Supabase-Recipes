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

            <section className="bg-white">
                <Banner />
                {user ? (
                    <>
                        <PopularRecipes favRezepte={favRezepte} setFavRezepte={setFavRezepte} popularRecipes={popularRecipes} setPopularRecipes={setPopularRecipes} />
                        <OtherRecipes favRezepte={favRezepte} setFavRezepte={setFavRezepte} popularRecipes={popularRecipes} />
                    </>
                ) : (
                    <div className="h-96 flex justify-center items-center">
                        <Link
                            to="/login"
                            className="text-2xl font-bold border-solid border-2 border-black p-4 bg-yellow-200 rounded-lg"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
}

export default Recipes;