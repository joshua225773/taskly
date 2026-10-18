const router = require('express').Router();
const auth = require('../middleware/auth');
const { list, create, update, remove } = require('../controllers/taskController');

router.use(auth); // every task route needs login

router.get('/', list);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
