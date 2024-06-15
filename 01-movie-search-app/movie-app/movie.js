const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const APILINK = 'http://localhost:8000/api/v1/reviews/';

const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

const div_new = document.createElement('div');
div_new.innerHTML = `
    <div class="row">
        <div class="column">
            <div class="card">
                New Review
                <p><strong>Review: </strong>
                    <input type="text" id="new_review" value="">
                </p>
                <p><strong>User: </strong>
                    <input type="text" id="new_user" value="">
                </p>
                <p>
                    <a href="#" onclick="saveReview('new_review', 'new_user')">save</a>
                </p>
            </div>
        </div>
    </div>
`
main.appendChild(div_new);

function returnReviews(url) {
    fetch(url + "movie/" + movieId)
        .then(res => res.json() )
        .then(data => {
            console.log(data);
            data.forEach(review => {
                const divCard = document.createElement('div');
                divCard.innerHTML = `
                    <div class="row">
                        <div class="column">
                            <div class="card" id="${review._id}">
                                <p><strong>Review: </strong>${review.review}</p>
                                <p><strong>User: </strong>${review.user}</p>
                                <p><a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">edit</a> <a href="#" onclick="deleteReview('${review._id}')">delete</a></p>
                            </div>
                        </div>
                    </div>
                `
                main.appendChild(divCard);
            });
        });
}

function editReview(id, review, user) {
    // console.log(review);
    const element = document.getElementById(id);
    // console.log(element);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
        <p><strong>Review: </strong>
            <input type="text" id="${reviewInputId}" value="${review}">
        </p>
        <p><strong>User: </strong>
            <input type="text" id="${userInputId}" value="${user}">
        </p>
        <p>
            <a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">save</a>
        </p>
    `
}

function saveReview(reviewInputId, userInputId, id="") {
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    if(id) {
        // Update an existing review
        fetch(APILINK + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review})
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                location.reload();
            });
    } else {
        // Add a new review
        console.log("new rev");
        fetch(APILINK + "new", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                location.reload();
            });
    }
}

function deleteReview(id) {
    fetch(APILINK + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
}

returnReviews(APILINK);