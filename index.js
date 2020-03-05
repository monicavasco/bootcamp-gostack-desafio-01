const express = require("express");

const app = express();
app.use(express.json());

const projects = [];
let requestsCount = 0;

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(proj => proj.id == id);
  if (!project) {
    return res.status(404).json({ message: "Project does not exist" });
  }
  return next();
}

function countRequests(req, res, next) {
  requestsCount++;
  console.log(`Requests until now: ${requestsCount}`);
  return next();
}

app.use(countRequests);

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title, tasks = [] } = req.body;

  projects.push({
    id,
    title,
    tasks
  });

  return res.json(projects);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id);
  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(proj => proj.id == id);
  projects.splice(index, 1);
  return res.json({ message: "Project deleted." });
});

app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(proj => proj.id == id);
  project.tasks.push(title);
  return res.json(project);
});

app.listen(3001);