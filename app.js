const express = require("express")
require("dotenv").config()

const app = express()

app.use(express.json())

const port = process.env.APP_PORT ?? 5000

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list")
}

app.get("/", welcome)

const movieHandlers = require("./movieHandlers")

const { validateMovie, validateUser } = require("./validators.js")
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js")

app.get("/api/movies", movieHandlers.getMovies)
app.get("/api/movies/:id", movieHandlers.getMovieById)
app.get("/api/users", movieHandlers.getUsers)
app.get("/api/users/:id", movieHandlers.getUsersById)

// app.post("/api/users", movieHandlers.postUser)
app.post("/api/users", validateUser, hashPassword, movieHandlers.postUser)

app.post(
  "/api/login",
  movieHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
)

app.use(verifyToken)

// app.post("/api/movies", movieHandlers.postMovie)
app.post("/api/movies", validateMovie, movieHandlers.postMovie)
// app.post("/api/movies", validateUser, movieHandlers.postUser)

app.put("/api/movies/:id", movieHandlers.updateMovie)
// app.put("/api/users/:id", movieHandlers.updateUser)
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie)
// app.put("/api/users/:id", validateUser, movieHandlers.updateUser)

app.delete("/api/movies/:id", movieHandlers.deleteMovie)
app.delete("/api/users/:id", movieHandlers.deleteUser)

app.put("/api/users/:id", validateUser, hashPassword, movieHandlers.updateUser)

// const isItDwight = (req, res) => {
//   if (
//     req.body.email === "dwight@theoffice.com" &&
//     req.body.password === "123456"
//   ) {
//     res.send("Credentials are valid")
//   } else {
//     res.sendStatus(401)
//   }
// }

app.post("/api/login")

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened")
  } else {
    console.log(`Server is listening on ${port}`)
  }
})
