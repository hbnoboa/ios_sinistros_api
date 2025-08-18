const { Router } = require("express");
const {
  getSettingLists,
  getSettingList,
  postSettingListItem,
  putSettingListItem,
  deleteSettingListItem,
  editSettingListItem,
} = require("../controllers/settingListController");

const router = Router();

router.get("", getSettingLists);
router.get("/:key", getSettingList);
router.post("", postSettingListItem);
router.put("/:key", putSettingListItem);
router.put("/:key/edit", editSettingListItem);
router.delete("/:key", deleteSettingListItem);

module.exports = router;
