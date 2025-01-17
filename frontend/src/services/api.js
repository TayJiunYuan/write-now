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

export const getTasks = () => {
  return api
    .get("/tasks")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
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

export const getEmailsShortSum = (userId) => {
  return api
    .get(`/emails/with_short_summary/${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getEmailsLongSum = (userId, emailId) => {
  return api
    .get(`/emails/${userId}/${emailId}/long_summary`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getTaskDetailsWithAI = (actionItem) => {
  const requestBody = {
    action_item: actionItem,
  };

  return api
    .post(`/tasks/task_details_with_ai`, requestBody)
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

export const getTaskFileName = (taskId) => {
  return api
    .get(`/tasks/${taskId}/file_name`)
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
