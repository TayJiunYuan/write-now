import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// GET all hardcoded maps
export const getAllProgrammes = () => {
  return api
    .get("/programmes")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getUsers = () => {
  return api
    .get("/users")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getUserById = (userId) => {
  const queryParams = {
    user_id: userId,
  };

  return api
    .get("/users", { params: queryParams })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};
