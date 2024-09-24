const express = require("express");
const { getDb } = require("../../db");
const router = express.Router();

// Public Routes

// GET request - user
router.get("/create/:email", async (req, res) => {
  try {
    const db = await getDb();
    const usersCollection = db.collection("Users");

    const email = req.params.email;
    console.log(email);

    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// POST request - Create a new item
router.post("/create", async (req, res) => {
  try {
    const item = req.body;

    // Validate incoming data
    if (
      !item.name ||
      !item.email ||
      !item.username ||
      !item.phone ||
      !item.password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = await getDb();
    const usersCollection = db.collection("Users");

    console.log(item, "I am Item");

    const result = await usersCollection.insertOne(item);

    res.status(201).send(result);
  } catch (error) {
    console.error("Error creating item:", error.message);
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
});

// DELETE request - Delete an item by ID
router.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const usersCollection = db.collection("Users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.send(result);
    } else {
      res.status(404).json({ message: `Item with ID: ${id} not found` });
    }
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
});

// PATCH request - Update an item by ID
router.patch("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = req.body;
    const db = await getDb();
    const usersCollection = db.collection("Users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 1) {
      res.send(result);
    } else {
      res.status(404).json({ message: `Item with ID: ${id} not found` });
    }
  } catch (error) {
    console.error("Error updating item:", error.message);
    res
      .status(500)
      .json({ message: "Error updating item", error: error.message });
  }
});

module.exports = router;
