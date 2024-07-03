let currentUser: User;
let comments: InteractiveComment[];
let numComments = 0;

// Top level functions
function createId() {
    return Math.round(Date.now() / (1000));
}

async function importComments(origin: string) {
    const data = await fetch(origin).then(res => res.json());

    const newComments: InteractiveComment[] = [];
    const allCommentData = data.comments;
    let numNewComments = 0;
    try {
        for(const commentData of allCommentData) {
            const newComment: InteractiveComment = {
                id: numNewComments,
                commentType: 'comment',
                content: commentData.content,
                createdAt: commentData.createdAt,
                score: commentData.score,
                user: {
                    image: {
                        png: commentData.user.image.png,
                        webp: commentData.user.image.webp
                    },
                    username: commentData.user.username
                },
                replies: [],
                upvoted: false,
                downvoted: false
            }
            numNewComments++;
            newComments.push(newComment);

            // Add the replies to the comment as well
            for(const replyData of commentData.replies) {
                const newReply: InteractiveReply = {
                    id: numNewComments,
                    commentType: 'reply',
                    content: replyData.content,
                    createdAt: replyData.createdAt,
                    score: replyData.score,
                    user: {
                        image: {
                            png: replyData.user.image.png,
                            webp: replyData.user.image.webp
                        },
                        username: replyData.user.username
                    },
                    upvoted: false,
                    downvoted: false,

                    replyingTo: replyData.replyingTo,
                    editing: false
                }
                numNewComments++;
                newComment.replies.push(newReply);
            }
        }
    } catch(error) {
        console.log(error);
    }

    comments = newComments;
    numComments = numNewComments;
}

// Returns information about where the comment's at 
// [comment container index]
function findComment(id: number): [iComment, iComment[], number] | undefined {
    for(let i = 0; i < comments.length; i++) {
        const icomment = comments[i];
        if(icomment.id == id) return [icomment, comments, i];

        for(let j = 0; j < icomment.replies.length; j++) {
            const reply = icomment.replies[j];
            if(reply.id == id) return [reply, icomment.replies, j];
        }
    }
}

async function populateTestData() {
    await importComments('data.json');

    currentUser = {
        image: {
            png: './images/avatars/image-juliusomo.png',
            webp: './images/avatars/image-juliusomo.webp'
        },
        username: 'juliusomo'
    }
}

function rerender() {
    console.log(comments);
    render(
        comments,
        currentUser,
        commentBindings,
        createReplyBindings
    );
}

// Event Bindings
const commentBindings: NewCommentBindings = {
    updateCommentEvent: function (commentId: number, reply: string) {
        const commentInfo = findComment(commentId);
        if(commentInfo == undefined) {
            throw new Error("Can't find comment");
        }
        commentInfo[0].content = reply;

        rerender();
    },

    likeCommentEvent: function (commentId: number) {
        const commentInfo = findComment(commentId);
        if(commentInfo == undefined) {
            throw new Error("Can't find comment");
        }

        // Disable its downvoted state
        if(commentInfo[0].downvoted) {
            commentInfo[0].score++;
        }
        commentInfo[0].downvoted = false;

        // Toggle its upvoted state
        if (commentInfo[0].upvoted) {
            commentInfo[0].upvoted = false;
            commentInfo[0].score--;
        } else {
            commentInfo[0].upvoted = true;
            commentInfo[0].score++;
        }

        rerender();
    },

    dislikeCommentEvent: function (commentId: number) {
        const commentInfo = findComment(commentId);
        if(commentInfo == undefined) {
            throw new Error("Can't find comment");
        }

        // Disable its upvoted state
        if(commentInfo[0].upvoted) {
            commentInfo[0].score--;
        }
        commentInfo[0].upvoted = false;

        // Toggle its downvoted state
        if(commentInfo[0].downvoted) {
            commentInfo[0].downvoted = false;
            commentInfo[0].score++;
        } else {
            commentInfo[0].downvoted = true;
            commentInfo[0].score--;
        }

        rerender();
    },

    initiateReplyEvent: function (replyingTo: number) {
        const commentInfo = findComment(replyingTo);
        if(commentInfo == undefined) {
            throw new Error("Can't find comment to reply to");
        }
        const [replyTo, replyToContainer] = commentInfo;

        const reply: InteractiveReply = {
            id: -1,
            commentType: 'reply',
            content: `Add reply to ${replyTo.user.username}...`,
            createdAt: 'Now',
            score: 0,
            user: currentUser,
            upvoted: false,
            downvoted: false,

            replyingTo: replyingTo,
            editing: true
        };

        // Remove any existing initated reply that hasn't been submitted and
        // add the new reply
        if(isInteractiveComment(replyTo)) {
            const replyIndex = replyTo.replies.findIndex(
                (element) => element.editing == true);
            
            if(replyIndex != -1) replyTo.replies.splice(replyIndex, 1);
            replyTo.replies.push(reply);
        } else {
            const replyIndex = replyToContainer.findIndex(
                (element) => (element as InteractiveReply).editing == true);

            if(replyIndex != -1) replyToContainer.splice(replyIndex, 1);
            replyToContainer.push(reply);
        }

        rerender();
    }
}

const createReplyBindings: NewCreateReplyBindings = {
    submitReplyEvent: function (replyId: number, replyContent: string) {
        const replyInfo = findComment(replyId);
        if(replyInfo == undefined) {
            throw new Error("Can't find reply");
        }
        const reply = replyInfo[0] as InteractiveReply;

        // Finalize the ID and the rest of the reply properties
        reply.id = createId();
        reply.content = replyContent;
        reply.editing = false;

        numComments++;
        rerender();
    }
};

const bootstrapBindings: BootstrapBindings = {
    deleteCommentEvent: function (commentId: number) {
        const commentInfo = findComment(commentId);
        if(commentInfo == undefined) {
            throw new Error("Can't find comment");
        }
        let [comment, container, index] = commentInfo;
        container.splice(index, 1);
        numComments--;

        rerender();
    },

    addCommentEvent(comment) {
        const newComment: InteractiveComment = {
            id: -1,
            commentType: 'comment',
            content: comment,
            createdAt: 'Now',
            score: 0,
            user: currentUser,
            upvoted: false,
            downvoted: false,
            replies: []
        };
        comments.push(newComment);

        rerender();
    },
};

(async() => {
    await populateTestData();
    bootstrap(bootstrapBindings);
    rerender();
})();