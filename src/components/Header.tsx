import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { supabase } from "../utils/supabaseClient";

const Header = () => {
    const { favRezepte, user, setUser } = useContext(UserContext);

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Fehler beim Abmelden:", error.message);
        } else {
            setUser(null);
            console.log("Benutzer erfolgreich abgemeldet");
        }
    };

    return (
        <header className="flex justify-between items-center py-6 bg-white pl-40 pr-16 mt-6 text-xl">
            <div className="flex items-center gap-2">
                <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 5V1C7 0.734784 7.10536 0.48043 7.29289 0.292893C7.48043 0.105357 7.73478 0 8 0C8.26522 0 8.51957 0.105357 8.70711 0.292893C8.89464 0.48043 9 0.734784 9 1V5C9 5.26522 8.89464 5.51957 8.70711 5.70711C8.51957 5.89464 8.26522 6 8 6C7.73478 6 7.48043 5.89464 7.29289 5.70711C7.10536 5.51957 7 5.26522 7 5ZM12 6C12.2652 6 12.5196 5.89464 12.7071 5.70711C12.8946 5.51957 13 5.26522 13 5V1C13 0.734784 12.8946 0.48043 12.7071 0.292893C12.5196 0.105357 12.2652 0 12 0C11.7348 0 11.4804 0.105357 11.2929 0.292893C11.1054 0.48043 11 0.734784 11 1V5C11 5.26522 11.1054 5.51957 11.2929 5.70711C11.4804 5.89464 11.7348 6 12 6ZM16 6C16.2652 6 16.5196 5.89464 16.7071 5.70711C16.8946 5.51957 17 5.26522 17 5V1C17 0.734784 16.8946 0.48043 16.7071 0.292893C16.5196 0.105357 16.2652 0 16 0C15.7348 0 15.4804 0.105357 15.2929 0.292893C15.1054 0.48043 15 0.734784 15 1V5C15 5.26522 15.1054 5.51957 15.2929 5.70711C15.4804 5.89464 15.7348 6 16 6ZM28 13V14C27.9996 15.2719 27.5145 16.4959 26.6434 17.4227C25.7723 18.3496 24.5807 18.9096 23.3113 18.9888C22.6291 20.9182 21.4678 22.6426 19.9363 24H23C23.2652 24 23.5196 24.1054 23.7071 24.2929C23.8946 24.4804 24 24.7348 24 25C24 25.2652 23.8946 25.5196 23.7071 25.7071C23.5196 25.8946 23.2652 26 23 26H1C0.734784 26 0.48043 25.8946 0.292893 25.7071C0.105357 25.5196 0 25.2652 0 25C0 24.7348 0.105357 24.4804 0.292893 24.2929C0.48043 24.1054 0.734784 24 1 24H4.0675C2.79163 22.8728 1.76937 21.4878 1.06822 19.9364C0.367076 18.385 0.00298857 16.7025 0 15V9C0 8.73478 0.105357 8.48043 0.292893 8.29289C0.48043 8.10536 0.734784 8 1 8H23C24.3261 8 25.5979 8.52678 26.5355 9.46447C27.4732 10.4021 28 11.6739 28 13ZM22 10H2V15C2.00386 16.8776 2.53447 18.7164 3.5315 20.3075C4.52853 21.8985 5.95199 23.1778 7.64 24H16.36C18.048 23.1778 19.4715 21.8985 20.4685 20.3075C21.4655 18.7164 21.9961 16.8776 22 15V10ZM26 13C25.9998 12.3798 25.8074 11.7749 25.4492 11.2685C25.0911 10.7621 24.5848 10.3792 24 10.1725V15C23.9993 15.628 23.9491 16.2549 23.85 16.875C24.4705 16.6917 25.015 16.3127 25.4025 15.7946C25.79 15.2765 25.9996 14.647 26 14V13Z" fill="#2C2B2B" />
                </svg>
                <p>Die Rezeptwelt</p>
            </div>
            <nav className="flex gap-10 font-semibold">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/recipes">Rezepte</NavLink>
                <NavLink to="/my-recipes">Meine Rezepte
                    {user ? (`(${favRezepte.length})`) : ("")}
                </NavLink>
                <NavLink to="/about">Über uns</NavLink>
            </nav>
            {user ? (
                <button
                    onClick={logout}
                    className="font-semibold"
                >
                    Logout
                </button>
            ) : (
                <NavLink to="/login" className="font-semibold">
                    Login
                </NavLink>
            )}
        </header>
    );
}

export default Header;