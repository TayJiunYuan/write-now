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

export const getUsersWithoutCredentials = () => {
  return api
    .get("/users/without-credentials")
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

export const getTasksByProgrammeId = (programmeID) => {
  return api
    .get("/tasks", {
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

export const createNewMeeting = (meetingData) => {
  return api
    .post("/meetings/create", meetingData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating meeting:", error);
      throw error;
    });
};

export const createNewTask = (taskData) => {
  return api
    .post("/tasks", taskData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const updateTask = (taskData) => {
  return api
    .put(`/tasks/${taskData.id}`, taskData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const createNewProgramme = (taskData) => {
  return api
    .post("/programmes", taskData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const sendTaskAI = (action) => {
  return api
    .post("/tasks/task_details_with_ai", action)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};
