import express from 'express'

const app = express();
const PORT = 4000;

app.use(express.json());
// 1. DATA SOURCE: In-memory array
let users = [
    { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" },
    { id: "2", firstName: "Rahul", lastName: "Sharma", hobby: "Cricket" },
    { id: "3", firstName: "Priya", lastName: "Patel", hobby: "Cooking" },
    { id: "4", firstName: "Amit", lastName: "Kumar", hobby: "Photography" },
    { id: "5", firstName: "Neha", lastName: "Singh", hobby: "Dancing" }
];
// 2. LOGGING MIDDLEWARE (Requirement 4.1)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
    );
  });
  next();
});
// validation middleware
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;

  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({
      message: "firstName, lastName and hobby are required fields"
    });
  }

  next();
}

// get user -- Fetch all Users
app.get('/users',(req,res)=>{
    res.status(200).json(users)
});

// get user by id -- Fetch one user by id
app.get('/user/:id',(req,res)=>{
    const user = users.find(u => u.id == req.params.id);
    if(!user){
        return res.status(404).json({message:"user not found"});

    }
    res.status(200).json(user);
});

// post -- add new user
app.post('/user',validateUser,(req,res)=>{
    const newUser = {
        id:(users.length+1).toString(),
        ...req.body
    };
    users.push(newUser);
    res.status(201).json({
        message:"user created successfully",
        user:newUser
    });
});

// PUT /user/:id - Update user
app.put("/user/:id", validateUser, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    id: req.params.id,
    ...req.body
  };

  res.status(200).json({
    message: "User updated successfully",
    user: users[index]
  });
});

// DELETE /user/:id - Delete user
app.delete("/user/:id", (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users.splice(index, 1);

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser
  });
});
// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!"
  });
});


app.listen(PORT ,()=>{
    console.log(`App is listening on PORT ${PORT}`);  
})
