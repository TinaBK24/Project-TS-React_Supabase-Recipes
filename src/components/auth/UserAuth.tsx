import { useContext, useRef } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

type User = {
    email: string;
    password: string;
    options: {
        data: {
            firstName: string;
            lastName: string;
        }
    }
}

const UserAuth = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);



    async function register(): Promise<void> {
        const newUser: User = {
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            options: {
                data: {
                    firstName: "",
                    lastName: "",
                }
            }
        }

        const { data, error } = await supabase.auth.signUp({
            email: newUser.email,
            password: newUser.password,
            options: newUser.options
        })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            console.error("Ungültiges E-Mail-Format");
            alert("Ungültiges E-Mail-Format");
            return;
        }

        if (newUser.password.length < 6) {
            console.error("Das Passwort muss mindestens 8 Zeichen lang sein");
            alert("Das Passwort muss mindestens 8 Zeichen lang sein");
            return;
        }

        if (error) {
            console.error("Registrierungsfehler:", error.message);
            return;
        }

        console.log("Benutzer erfolgreich registriert:", data);

        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
    }

    async function login(): Promise<void> {
        const newUser: User = {
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            options: {
                data: {
                    firstName: "",
                    lastName: "",
                }
            }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: newUser.email,
            password: newUser.password
        })

        if (error) {
            console.error("Login-Fehler:", error.message);
            alert("Fehler bei der Anmeldung");
            return;
        }

        console.log("Benutzer erfolgreich angemeldet:", data);

        if (data.user && data.user.id !== user?.id) {
            setUser(data.user);
            navigate("/recipes");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-96">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">User Authentication</h2>
                <form className="space-y-4">
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </form>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={register}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Register
                    </button>
                    <button
                        onClick={login}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserAuth;