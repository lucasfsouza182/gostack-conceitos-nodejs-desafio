const express = require("express");
const cors = require("cors");

const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(req,res,next){
  const {id} = req.params;

  if(!isUuid(id)){
    return res.status(400).json({error: 'Invalid repository ID.'});
  }

  return next();
}

app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {id: uuid(),title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository)  
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositorytIndex = repositories.findIndex(rep => rep.id === id);

  if(repositorytIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }
  let repository = repositories[repositorytIndex];
  
  repository = {
    ...repository,
    title,
    url,
    techs,
  }

  repositories[repositorytIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repositorytIndex = repositories.findIndex(rep => rep.id === id);

  if(repositorytIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositorytIndex,1);

  return response.status(204).send(repositories);
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositorytIndex = repositories.findIndex(rep => rep.id === id);

  if(repositorytIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }
  
  const repository = repositories[repositorytIndex];
  const likes = Number(repository.likes) + 1;

  const newRepository = {
    ...repository,
    likes
  }

  repositories[repositorytIndex] = newRepository;

  return response.json(newRepository)
});

module.exports = app;
