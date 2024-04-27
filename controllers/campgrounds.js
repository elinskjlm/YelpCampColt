const Campground =  require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // req.body.image = req.body.campground.image.indexOf("/") >= 0 ? req.body.image : "/"+req.body.image
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    const id = newCamp._id;
    await newCamp.save();
    req.flash('success', 'Succesfully made a new campground 👍🏻');
    res.redirect(`campgrounds/${id}`);
}

module.exports.renderCampground = async (req, res) => {
    const { id } = req.params;
    const regexId = /^[0-9a-f]{24}$/i;
    const idIsValid = regexId.test(id);
    const reviewDraft = req.session.reviewDraft;
    delete req.session.reviewDraft;
    if (idIsValid) {
        const campground = await Campground.findById(id)
        .populate({path: 'reviews', populate: {
            path: 'author'
        }})
        .populate('author');
        if (campground) return res.render('campgrounds/show', { campground, reviewDraft });
    }
    const shortId = id.length <= 24 ? id : (id.slice(0, 10) + '...');
    req.flash('error', `No campground with this id (${shortId})`);
    return res.redirect('/campgrounds');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', `Cannot find that campground 🤷🏻‍♂️`);
        return res.redirect(`/campground/${id}`);
    }
    res.render('campgrounds/edit', { camp });
}

module.exports.editCampground = async (req, res) => {
    // TODO make sure image URL is valid, or at least contains "/" in it 
    const { id } = req.params;
    const camp = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated campground 👍🏻');
    return res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground 👍🏻');
    res.redirect(`/campgrounds`);
}