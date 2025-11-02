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

export const getAllUsers = async (req, res, users) => {
  const result = await users.find().toArray();
  res.send(result);
};
