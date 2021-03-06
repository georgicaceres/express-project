const dogService = require('../services/dogService');
const self = {};
const imagesPerPage = 3;

// Pagination function.
function pagination(data, currentPage) {
    let page = parseInt(currentPage) || 1;
    let numPages = Math.ceil(data.length / imagesPerPage);
    let dogs = data.slice((page - 1) * imagesPerPage, (page * imagesPerPage));
    return {page, numPages, dogs};
}

// Use filter from dogService, do pagination and render results
self.filter = function(req, res, next) {
    let breeds = dogService.getBreeds();
    let dogs = dogService.getFilterDogs(req.query.breed, req.query.size, req.query.age, req.query.favorite === 'true');
    let result = pagination(dogs, req.query.page);
    if (result.dogs.length > 0) {
        res.render('filter', { active: 'filter', breeds, ...result });
    } else {
        res.render('empty', {
            active: 'filter',
            message: "Sorry, there is no match. Try again!",
            image: "dog-empty.jpg"
        })
    }
};

// Get all dogs from dogService, do pagination and render results
self.all = function(req, res, next) {
    let dogs = dogService.getAllDogs();
    let result = pagination(dogs, req.query.page);
    res.render('index', {active: 'homepage', ...result});
}

// Get favorites from dogService, do pagination and render results
self.favorites = function(req, res, next) {
    let dogs = dogService.getFavorites();
    let result = pagination(dogs, req.query.page);
    if (result.dogs.length > 0) {
        res.render('index', {active: 'favorites', ...result });
    } else {
        res.render('empty', {
            active: 'favorites',
            message: "Sorry, there is no favorites yet. Try choosing yours from the list!",
            image: "dog-like.jpg"
        })
    }
};

// Get the specific objetct-dog from dogService and render the result
self.getDetailOf = function(req, res, next) {
    let dog = dogService.getDetailOf(req.params.dog);
    res.render('detail', { dog })
}

module.exports = self;
