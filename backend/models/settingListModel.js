const mongoose = require("mongoose");

const settingListSchema = new mongoose.Schema(
  {
    event_status: {
      type: [String],
      required: false,
    },
    operation_type: {
      type: [String],
      required: false,
    },
    regulatory: {
      type: [String],
      required: false,
    },
    event_nature: {
      type: [String],
      required: false,
    },
    event_nature_type: {
      type: [String],
      required: false,
    },
    transported_load: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SettingList", settingListSchema);
