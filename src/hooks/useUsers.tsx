import { useState , useEffect } from 'react';
import { getAllUsers } from "../services/userService";

function useUsers() {

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSetUser = (user) => {
        setFilteredUsers([user]);
    };

    const fetchAllUsers = async () => {
        try {
            const res  = await getAllUsers();
            setUsers(res);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    console.log("Usuarios cargados:", users);

    return {users , loading ,handleSetUser , filteredUsers}
    
}

export default useUsers;