import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

// reviews Collection inside the reviews Database
let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if(reviews) {
            return;
        }
        try {
            reviews = await conn.db("reviews").collection("reviews");
        } catch(e) {
            console.error(`Unable to establish connection handles in userDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review) {
        try {
            // Document aka database entry
            const reviewDoc = {
                movieId: movieId,
                user: user,
                review: review
            };

            return await reviews.insertOne(reviewDoc);
        } catch(e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async getReview(reviewId) {
        try {
            return await reviews.findOne({ _id: new ObjectId(reviewId) }); 
        } catch(e) {
            console.error(`Unable to get review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, user, review) {
        console.log("rev", reviewId);
        try {
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId) },
                { $set: { user: user, review: review } }
            );
        } catch(e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId)
            });

            return deleteResponse;
        } catch(e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }

    static async getReviewsByMovieId(movieId) {
        console.log("mov", movieId);
        try {
            // Finding multiple items returns a cursor
            const cursor = await reviews.find({ movieId: parseInt(movieId) });
            return cursor.toArray();
        } catch(e) {
            console.error(`Unable to get reviews: ${e}`);
            return { error: e };
        }
    }
}