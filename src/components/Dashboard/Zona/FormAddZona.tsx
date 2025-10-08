import { useState, useEffect } from "react";
import { postNewZona, getAllZonas } from "../../../services/zonaService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import { Plus, MapPin } from "lucide-react";

type Zona = {
    id: number;
    locality: string;
};

const FormAddZona = () => {
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [formData, setFormData] = useState({
        locality: "",
        site: { latitude: "", longitude: "" },
    });
    
    const { goBack } = useNavegation();

    useEffect(() => {
        getAllZonas()
            .then((zonas) => {
                setZonas(zonas);
            })
            .catch((err) => console.error("Error fetching zonas:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await postNewZona(formData);
            goBack();
        } catch (error) {
            console.error("Error creating zona:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8">
            <div className="w-full max-w-md">
                <BackButton />
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white  rounded-lg shadow-lg max-w-md w-full p-6 mt-6"
            >
                <div className="relative mb-6 ">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        placeholder="Localidad que deseas agregar"
                        className="w-full pl-10 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                    <Plus size={18} />
                    Añadir Zona
                </button>
            </form>

            <div className="w-full max-w-md mt-10">
                <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-h-64 flex flex-col items-center px-4 py-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600 border-b w-full pb-2 justify-center">
                        <MapPin size={20} />
                        Zonas Cargadas
                    </h2>
                    {zonas.length === 0 ? (
                        <p className="text-gray-500 mt-4">No hay zonas cargadas.</p>
                    ) : (
                        zonas.map((zona) => (
                            <div
                                key={zona.id}
                                className="w-full py-2 border-b last:border-b-0 flex items-center gap-2 justify-center text-gray-700"
                            >
                                <MapPin size={16} className="text-blue-500" />
                                <span className="font-medium">{zona.locality}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormAddZona;