import {
    useContext,
    // useEffect, 
    // useState 
} from "react";
import Banner from "../components/Banner";
import PopularRecipes from "../components/PopularRecipes";
import { UserContext } from "../context/UserContext";
// import { fetchFavoriteRecipes } from "../utils/favoriteRecipes";

const Home = () => {
    const { favRezepte, setFavRezepte, popularRecipes, setPopularRecipes } = useContext(UserContext);
    // const [loading, setLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     const loadFavorites = async () => {
    //         await fetchFavoriteRecipes(setFavRezepte);
    //         setLoading(false);
    //     }
    // }, []);

    return (
        <section className="bg-white">
            <Banner />
            {/* {loading ? (
            <p className="text-3xl font-semibold text-center pb-7">Favoriten werden geladen...</p>
            ) : ( */}
            <PopularRecipes favRezepte={favRezepte} setFavRezepte={setFavRezepte} popularRecipes={popularRecipes} setPopularRecipes={setPopularRecipes} />
            {/* )} */}
        </section>
    );
}

export default Home;