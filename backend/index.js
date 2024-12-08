const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 3000;

console.log("DB_USER Name", process.env.DB_USER);
console.log("DB_PASS Name", process.env.DB_PASSWORD);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection code
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://harshakumara1998030944:o8P8L7mFO9MMocIZ@learnora.h7gt7.mongodb.net/?retryWrites=true&w=majority&appName=learnora`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database, usercollection, classcollection, coursecollection, studentcollection, teachercollection, resultcollection, subjectcollection, admincollection, cartcollection, paymentcollection, appliedcollection;

async function connectToDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create database and collections
    database = client.db("learnora");
    usercollection = database.collection("users");
    classcollection = database.collection("classes");
    coursecollection = database.collection("course");
    studentcollection = database.collection("students");
    teachercollection = database.collection("teachers");
    subjectcollection = database.collection("subjects");
    admincollection = database.collection("admins");
    cartcollection = database.collection("carts");
    paymentcollection = database.collection("payments");
    appliedcollection = database.collection("applied");

    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if database connection fails
  }
}

// Define routes
app.post('/new-class', async (req, res) => {
  try {
    const newclass = req.body;
    const result = await studentcollection.insertOne(newclass);
    res.send(result);
  } catch (error) {
    console.error("Error in /new-class route:", error);
    res.status(500).send({ error: "An error occurred while creating a new class" });
  }
});

app.post('/new-courses',async(req,res)=>{
  try{
    const newcourse =req.body;
    const result=await coursecollection.insertOne(newcourse);
    res.send(result);
  }catch(error){
    console.error("Error in /new-course route:",error);
    res.status(500).send({error:"An error occurred while creating a new course"});
  }
//get class by title

})
app.get('/course',async(req,res)=>{
  const query={title:"Quantum Mechanics and Applications"};
  const result=await coursecollection.find().toArray();
  res.send(result);
})
//get class by 
app.get('/course/id', async(req,res)=>{
  const id=req.params.id;
  const query={owner_id:id};
  const result=await coursecollaction.find(query).toArray();
  res.send(result);
})

app.get('/new-course', async(req,res)=>{
  const result = await coursecollection.find().toArray();
  res.send(result);
})
//update classes title and reason

app.put('/update-class/:id',async(req,res)=>{
  const id=req.params.id;
  const title=res.body.title;
  const reason=res.body.reason; 
  const filter={_id:new ObjectId(id)};
  const updateDoc={
    $set:{
      title:title,
      reason:reason
    },
  };
  const result=await coursecollection.updateOne(filter,updateDoc);
  res.send(result);  
})
//update all class
app.put('/update-class/:id',async(req, res)=>{
      const id=req.params.id;
      const updateclass=req.body;
      const filter={_id:new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc={
        $set:{
          title:updateclass.title,
          descriptio:updateclass.description

        }
      };
      const result=await coursecollection.updateOne(filter,updateDoc,options);
      res.send(result);
})

//card collaction
app.post('/add-to-cart',async(req,res)=>{
    const newcart=req.body;
    const result=await cartcollection.insertOne(newcart);
    res.send(result);
})
app.get('/', (req, res) => {
  res.send('Hello Developer, how are you? I am Harsha Kumarasingha!');
});

// Start the server and connect to the database
app.listen(port, async () => {
  await connectToDatabase(); // Ensure database connection before starting the server
  console.log(`Example app listening on port ${port}`);
});
