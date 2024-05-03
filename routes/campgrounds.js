const express =         require('express');
const router =          express.Router();
const catchAsync =      require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground, rememberDestination } = require('../middleware');
const campgrounds =     require('../controllers/campgrounds');
const multer =          require('multer');
const { storage } =     require('../cloudinary');
const upload =          multer({ storage });


router.route('/')
    .get(rememberDestination, catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampground)); 
    
router.get('/new', rememberDestination, isLoggedIn, catchAsync(campgrounds.renderNewForm));

router.route('/:id')
    .get(rememberDestination, catchAsync(campgrounds.renderCampground))
    .put(isLoggedIn, isAuthor, validateCampground, upload.array('image'), catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', rememberDestination, isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;