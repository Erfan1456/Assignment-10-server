import { ObjectId } from "mongodb";
// Create a new user
export const createUser = async (req, res, users) => {
  const newTip = {
    ...req.body,
    createdAt: new Date(), // add current timestamp
  };

  try {
    const result = await users.insertOne(newTip);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create tip" });
  }
};

// Get all users
export const getAllUsers = async (req, res, users) => {
  const result = await users.find().toArray();
  res.send(result);
};

// ✅ Get 6 active gardeners (using MongoDB limit)
export const getActiveGardeners = async (req, res, users) => {
  try {
    const activeGardeners = await users
      .find({ status: "Active" })
      .limit(6)
      .toArray();

    res.status(200).send(activeGardeners);
  } catch (error) {
    console.error("Error fetching active gardeners:", error);
    res.status(500).send({ message: "Failed to fetch active gardeners" });
  }
};
