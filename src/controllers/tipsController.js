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

// Update the likes of a tip
export const updateTipLikes = async (req, res, usersTips) => {
  const tipId = req.params.id;
  const { likes } = req.body;

  if (!likes) return res.status(400).send({ message: "Likes required" });

  try {
    const result = await usersTips.findOneAndUpdate(
      { _id: new ObjectId(tipId) },
      { $set: { likes } },
      { returnDocument: "after" }
    );

    if (!result.value)
      return res.status(404).send({ message: "Tip not found" });

    res.status(200).send(result.value);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update likes" });
  }
};

// Get trending tips
export const getTrendingTips = async (req, res, usersTips) => {
  try {
    const trendingTips = await usersTips
      .aggregate([
        { $match: { availability: "Public" } }, // only public tips
        {
          $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } }, // calculate likes length
        },
        { $sort: { likesCount: -1 } }, // sort by likesCount descending
        { $limit: 6 }, // take top 6
      ])
      .toArray();

    res.status(200).send(trendingTips);
  } catch (error) {
    console.error("Error fetching trending tips:", error);
    res.status(500).send({ message: "Failed to fetch trending tips" });
  }
};
