import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    // endpoint: /new | body: movieId, review, user
    // curl -X POST http://localhost:8000/api/v1/reviews/new -H "Content-Type: application/json" -d '{"movieId": 13, "user": "kylan", "review": "bad"}'
    // curl -X POST http://localhost:8000/api/v1/reviews/new -H "Content-Type: application/json" -d '{"movieId": 1022789, "user": "kylan", "review": "bad"}'
    static async apiPostReview(req, res, next) {
        try {
            const movieId = parseInt(req.body.movieId);
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await ReviewsDAO.addReview(movieId, user, review);
            // console.log(reviewResponse);
            res.json({ status: "success" });
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    // endpoint: /movie/:id | params: id
    // curl -X GET http://localhost:8000/api/v1/reviews/666d8c7c30ef5b835459fb3f
    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id || {};
            let review = await ReviewsDAO.getReview(id);
            if(!review) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(review);
        } catch(e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    // endpoint: /:id | params: id | body: review, user
    // curl -X PUT http://localhost:8000/api/v1/reviews/666d8c7c30ef5b835459fb3f -H "Content-Type: application/json" -d '{"movieId": 12, "user": "kylan", "review": "horrible"}'
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id; // create the review ID
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = ReviewsDAO.updateReview(reviewId, user, review);

            // Error: trouble updating the value
            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            // Error: nothing was modified
            if (reviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review");
            }

            res.json({ status: "success" });
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    // endpoint: /:id | params: id
    // curl -X DELETE http://localhost:8000/api/v1/reviews/666d8c7c30ef5b835459fb3f
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id; // review ID
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
            res.json({ status: "success" });
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    // endpoint: /:id | params: id
    // curl -X GET http://localhost:8000/api/v1/reviews/movie/12
    static async apiGetReviews(req, res, next) {
        try {
            let id = req.params.id || {}; // movie ID
            let reviews = await ReviewsDAO.getReviewsByMovieId(id);
            if(!reviews) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(reviews);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}