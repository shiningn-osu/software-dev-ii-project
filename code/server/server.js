import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
// cors for ensuring access only from our frontend
app.use(cors({
  origin: "https://meal-match-9nx72i8vk-duncan-eversons-projects.vercel.app/"
}))

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the RESTful API!", data: "Some data" });
});

app.post("/api/data", (req, res) => {
  const { input } = req.body;
  res.json({ received: input, status: "Success" });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
