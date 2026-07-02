import { useState, useEffect } from "react";
import { getAllUsers } from "@features/user/services";
import type { UserType } from "../types";

function useUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSetUser = (userList: UserType[]) => {
    setUsers(userList);
  };

const fetchUsers = async () => {
  try {
    const res = await getAllUsers();
    setUsers(Array.isArray(res) ? res : res.users ?? []);
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
