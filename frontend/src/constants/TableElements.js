export const columns = [
  { name: "TASK", uid: "name" },
  { name: "PROGRAMME", uid: "programme_id" },
  { name: "ASSIGNER", uid: "assigner_id" },
  { name: "ASSIGNEE", uid: "assignee_id" },
  { name: "TASK TYPE", uid: "task_type" },
  { name: "STATUS", uid: "status" },
  { name: "DEADLINE", uid: "deadline" },
  // { name: "ACTIONS", uid: "actions" },
];

export const statusColors = {
  NOT_STARTED: "danger",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
};
