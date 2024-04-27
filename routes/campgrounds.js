const express =     require('express');
const router =      express.Router();
const catchAsync =  require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground, rememberDestination } = require('../middleware');
const campgrounds =   require('../controllers/campgrounds');

router.get('/', rememberDestination, catchAsync(campgrounds.index))

router.get('/new', rememberDestination, isLoggedIn, catchAsync(campgrounds.renderNewForm))

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', rememberDestination, catchAsync(campgrounds.renderCampground))

router.get('/:id/edit', rememberDestination, isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;