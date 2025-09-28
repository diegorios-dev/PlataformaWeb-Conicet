import { useState , useEffect } from 'react';
import { getUsers } from "../services/userService";

function useUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleUser = (word) => {
        setUsers(word)
    }


    const fetchUsers = async () => {
        try {
            const res  = await getUsers();
            setUsers(res);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log("Usuarios cargados:", users);

    return {users , loading ,handleUser}
    
}

export default useUsers;