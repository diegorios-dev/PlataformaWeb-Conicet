import { useState, useEffect } from "react";
import { getAllUsers } from "@features/user/services";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSetUser = (userList) => {
    setUsers(userList);
  };

const fetchUsers = async () => {
  try {
    const res = await getAllUsers();
    setUsers(res.users); // <-- CAMBIO AQUÍ
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, handleSetUser, fetchUsers };
}

export default useUsers;
