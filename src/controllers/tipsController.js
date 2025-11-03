import { ObjectId } from "mongodb";

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

export const getAllTips = async (req, res, usersTips) => {
  const result = await usersTips.find().toArray();
  res.send(result);
};

export const getTipById = async (req, res, usersTips) => {
  const id = req.params.id;
  const result = await usersTips.findOne({ _id: new ObjectId(id) });
  res.send(result);
};
