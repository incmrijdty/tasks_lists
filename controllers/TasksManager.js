const { STATUS_CODE } = require("../constants/statusCode");
const Task = require("../models/Task");
const { MENU_LINKS } = require("../constants/navigation");

exports.getTasksView = (req, res) => {

  const savedTasks = Task.getAll();

    res.render("tasksPage.ejs", {
      headTitle: "Your Tasks",
      path: "/",
      activeLinkPath: '/',
      menuLinks: MENU_LINKS,
      savedTasks,
    });
};

exports.createNewTask = (req, res) => {
  const rawId = req.body.id;
  const id = rawId?.trim();
  
  const existing = Task.findById(id);
  if (existing) {
    return res.status(STATUS_CODE.CONFLICT).json({ message: 'Task already exists' });
  }

  const newTask = new Task(id);
  Task.add(newTask);

  res.status(STATUS_CODE.FOUND).redirect("/");

};


exports.getTaskView = (request, response) => {
  const id = request.params.id;
  const task = Task.findById(id);
  const savedTasks = Task.getAll();

  response.render("task.ejs", {
    headTitle: "Task",
    path: `/${id}`,
    activeLinkPath: `/${id}`,
    menuLinks: MENU_LINKS,
    task,
    savedTasks
  });
};


exports.deleteTask = (req, res) => {
  const id = req.params.id;
  Task.deleteById(id);

  res.status(STATUS_CODE.OK).redirect("/");

};
