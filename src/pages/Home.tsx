import React from "react";
import Banner from "../components/Banner";
import PopularRecipes from "../components/PopularRecipes";
import { Database } from "../utils/database.types";

interface HomeProps {
    popularRecipes: Database['public']['Tables']['recipes']['Row'][];
    setPopularRecipes: React.Dispatch<React.SetStateAction<Database['public']['Tables']['recipes']['Row'][]>>;
}

const Home: React.FC<HomeProps> = (props) => {
    return (
        <section className="bg-white">
            <Banner />
            <PopularRecipes popularRecipes={props.popularRecipes} setPopularRecipes={props.setPopularRecipes} />
        </section>
    );
}

export default Home;