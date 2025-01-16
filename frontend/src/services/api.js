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

export const getMeetings = (programmeID) => {
  return api
    .get("/meetings", {
      params: {
        programme_id: programmeID,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const createMeetings = (meetingData) => {
  return api
    .post("/meetings")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating meeting:", error);
      throw error;
    });
};
