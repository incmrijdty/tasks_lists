const express = require('express');
const router = express.Router();
const listsController = require('../controllers/listsController');


router.get('/', listsController.getListsView);
router.post("/add", listsController.createNewList);
router.get("/:name", listsController.getListView);
router.delete("/:name", listsController.deleteList);
router.post('/:name/add-book', listsController.addBookToUserList);
router.delete('/:name/delete-book/:id', listsController.deleteBookFromUserList);

module.exports = router;
