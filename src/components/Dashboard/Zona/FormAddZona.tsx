import { useState, useEffect } from "react";
import { postNewZona, getAllZonas } from "../../../services/zonaService";
import useNavegation from "../../../hooks/useNavegation";

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
        <div>
            <div className="p-8">
                <button 
                    onClick={goBack}  
                    className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base"
                >
                    Volver
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg" >
                <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    placeholder="Localidad que deseas agregar"
                    className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                    required
                />
                
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    aniadir Zona
                </button>
            </form>

            <div className="mb-6">
                <div className="flex justify-center mt-8">
                    <div className="max-h-60 w-96 bg-gray-100 rounded-lg shadow-md overflow-y-auto flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-2 border-b ">Zonas Cargadas</h2>
                        {zonas.map((zona) => (
                            <div key={zona.id} className="w-full p-2 border-b text-center">
                                <h3>{zona.locality}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAddZona;