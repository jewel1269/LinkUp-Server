const express = require("express");
const { getDb } = require("../../db");
const router = express.Router();

// Public Routes

// GET request - Fetch all items
router.get("/posts", async (req, res) => {
  try {
    const db = await getDb();
    const postsCollection = db.collection("Posts");

    const items = await postsCollection.find().toArray();

    res.send(items)
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
});

// POST request - Create a new item
router.post("/items", async (req, res) => {
  try {
    const db = await getDb();
    const postsCollection = db.collection("Posts");
    const item = req.body;

    console.log(item, "I am Item");

    const result = await postsCollection.insertOne(item);

    res.send(result)
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
    const postsCollection = db.collection("Posts");

    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.send(result)
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
    const postsCollection = db.collection("Posts"); 

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 1) {
      res.send(result)
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
