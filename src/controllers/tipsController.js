import { ObjectId } from "mongodb";

// Create a new tip
export const createTips = async (req, res, usersTips) => {
  const newTip = {
    ...req.body,
    createdAt: new Date(), // add current timestamp
    updatedAt: new Date(),
  };

  try {
    const result = await usersTips.insertOne(newTip);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create tip" });
  }
};

// Get all tips
export const getAllTips = async (req, res, usersTips) => {
  const result = await usersTips.find().toArray();
  res.send(result);
};

// Get a tip by id
export const getTipById = async (req, res, usersTips) => {
  const id = req.params.id;
  const result = await usersTips.findOne({ _id: new ObjectId(id) });
  res.send(result);
};

// Update a tip
export const updateTip = async (req, res, usersTips) => {
  const { id } = req.params;
  const updatedData = {
    ...req.body,
    updatedAt: new Date(), // optional: track when the tip was updated
  };

  try {
    const result = await usersTips.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Tip not found" });
    }

    const updatedTip = await usersTips.findOne({ _id: new ObjectId(id) });
    res.status(200).send(updatedTip);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update tip" });
  }
};

// Delete a tip
export const deleteTip = async (req, res, usersTips) => {
  const id = req.params.id;

  try {
    const result = await usersTips.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Tip not found" });
    }

    res.send(result); // contains deletedCount
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).send({ message: "Failed to delete tip" });
  }
};
