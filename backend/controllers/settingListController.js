const SettingList = require("../models/settingListModel");

// Get all lists (returns the first document)
module.exports.getSettingLists = async (req, res) => {
  try {
    let doc = await SettingList.findOne();
    if (!doc) doc = await SettingList.create({});
    res.status(200).json(doc.toObject());
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single list document by ID
module.exports.getSettingList = (req, res) => {
  const { id } = req.params;
  SettingList.findById(id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ status: "not found" });
      }
      res.status(200).json(doc.toObject());
    })
    .catch((err) => {
      res.status(400).json({ status: "not found", message: err });
    });
};

// Create a new setting list document
module.exports.postSettingListItem = (req, res) => {
  SettingList.create(req.body)
    .then((doc) => {
      req.app.get("io")?.emit("settingListCreated", doc);
      res.status(200).json({
        status: "setting list created",
        data: doc.toObject(),
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "setting list not created",
        message: err,
      });
    });
};

// Add item to a list (PUT)
module.exports.putSettingListItem = (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (!value) return res.status(400).json({ status: "value required" });

  SettingList.findOne()
    .then(async (doc) => {
      if (!doc) doc = await SettingList.create({});
      if (!doc[key]) doc[key] = [];
      if (!doc[key].includes(value)) doc[key].push(value);
      await doc.save();
      req.app.get("io")?.emit("settingListChanged", { key, list: doc[key] });
      res.status(200).json({
        status: "item added",
        list: doc[key],
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "item not added",
        message: err,
      });
    });
};

// Remove item from a list (DELETE)
module.exports.deleteSettingListItem = (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  SettingList.findOne()
    .then(async (doc) => {
      if (!doc || !doc[key]) return res.status(200).json({ list: [] });
      doc[key] = doc[key].filter((item) => item !== value);
      await doc.save();
      req.app.get("io")?.emit("settingListChanged", { key, list: doc[key] });
      res.status(200).json({
        status: "item removed",
        list: doc[key],
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "item not removed",
        message: err,
      });
    });
};

module.exports.editSettingListItem = async (req, res) => {
  const { key } = req.params;
  const { oldValue, newValue } = req.body;
  if (!oldValue || !newValue)
    return res.status(400).json({ status: "oldValue and newValue required" });

  let doc = await SettingList.findOne();
  if (!doc) doc = await SettingList.create({});
  if (!doc[key]) doc[key] = [];

  // Remove o antigo e adiciona o novo
  doc[key] = doc[key].filter((v) => v !== oldValue);
  if (!doc[key].includes(newValue)) doc[key].push(newValue);
  await doc.save();

  req.app.get("io")?.emit("settingListChanged", { key, list: doc[key] });
  res.status(200).json({
    status: "item edited",
    list: doc[key],
  });
};
