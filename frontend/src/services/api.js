import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// programmes
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

// users
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

export const getUserByIdWithoutCredentials = (userId) => {
  return api
    .get(`/users/${userId}/without-credentials`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

// meetings
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

// tasks
export const getTasksByTaskId = (taskId) => {

  return api
    .get(`/tasks/${taskId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getTasksByProgrammeId = (programmeId) => {
  const queryParams = {
    programme_id: programmeId,
  };

  return api
    .get("/tasks", { params: queryParams })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getTasksByAssigner = (assignerId) => {
  const queryParams = {
    assigner_id: assignerId,
  };

  return api
    .get("/tasks", { params: queryParams })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getTasksByAssignee = (assigneeId) => {
  const queryParams = {
    assignee_id: assigneeId,
  };

  return api
    .get("/tasks", { params: queryParams })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getTasksByUserId = (userId) => {
  const queryParams = {
    assigner_id: userId,
    // assignee_id: userId,
  };

  return api
    .get("/tasks", { params: queryParams })
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

export const deleteTask = (taskId) => {
  return api
    .delete(`/tasks/${taskId}`)
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

// emails
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

// calendar
export const getCalendarEvents = (userId, startTime, endTime) => {
  const queryParams = {
    user_id: userId,
    start_time: startTime,
    end_time: endTime,
  };

  return api
    .get("/calendar/get_calendar_events", { params: queryParams })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};
