const commentsContainer = document.querySelector('div.comments');
const deleteCommentModal = document.querySelector('div.delete-comment-modal');
const cancelDeleteModalBtn = document.querySelector('div.modal-options button.no');
const confirmDeleteModalBtn = document.querySelector('div.modal-options button.yes');

// Being more specific with these query selectors for the typing
const newComment = document.querySelector('#newcomment');
const addNewCommentInput = newComment?.querySelector('textarea');
const addNewCommentBtn1 = newComment?.querySelector('button');
const newCommentMobileFooter = newComment?.querySelector('.mobile-footer');
const addNewCommentBtn2 = newCommentMobileFooter?.querySelector('button');

const nbsp = String.fromCharCode(160); // &nbsp;

// global vars
let commentToDelete = -1;

// bindEditCommentEvent - rerender to update editing property
// bindUpdateCommentEvent - rerender the comments after editing
// bindDeleteCommentEvent - rerender after removing the comment from the list
// initiateReplyEvent - create new reply after previous comment and rerender
type NewCommentBindings = {
    updateCommentEvent?: (commentId: number, reply: string) => void;
    likeCommentEvent?: (commentId: number) => void;
    dislikeCommentEvent?: (commentId: number) => void;
    initiateReplyEvent?: (replyingTo: number) => void;
};

// Creates a view for a comment / reply
// comment: information about the new comment
// bindings: the event bindings for each of the buttons
// isCurrentUser: true if the current user is making the comment
// enclosingContainer: container to put the new comment in, defaults to the commentsContainer
// replyingTo: the name of the user they're replying to (if applicable)
function newCommentView(
    comment: iComment,
    bindings: NewCommentBindings,
    isCurrentUser: boolean,
    enclosingContainer: Element,
    replyingTo?: string) {
        
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');

    /* Rating container */
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating-container');
    commentDiv.appendChild(ratingContainer);

    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating');
    ratingContainer.appendChild(ratingDiv);

    const upvoteButton = document.createElement('button');
    upvoteButton.classList.add('upvote');
    ratingDiv.appendChild(upvoteButton);

    const plusIcon = document.createElement('i');
    plusIcon.classList.add('fa-solid', 'fa-plus');
    upvoteButton.appendChild(plusIcon);

    const ratingP = document.createElement('p');
    const ratingPText = document.createTextNode(`${comment.score}`);
    ratingP.appendChild(ratingPText);
    ratingDiv.appendChild(ratingP);

    const downvoteButton = document.createElement('button');
    downvoteButton.classList.add('downvote');
    ratingDiv.appendChild(downvoteButton);

    const minusIcon = document.createElement('i');
    minusIcon.classList.add('fa-solid', 'fa-minus');
    downvoteButton.appendChild(minusIcon);
    
    /* Main content */
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');
    commentDiv.appendChild(mainContent);

    const header = document.createElement('div');
    header.classList.add('header');
    mainContent.appendChild(header);

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');
    header.appendChild(userInfo);

    const userInfoImg = document.createElement('img');
    userInfoImg.src = comment.user.image.png;
    userInfoImg.alt = comment.user.username + 'profile picture';
    userInfo.appendChild(userInfoImg);

    const userInfoH2 = document.createElement('h2');
    const userInfoH2Text = document.createTextNode(comment.user.username);
    userInfoH2.appendChild(userInfoH2Text);
    userInfo.appendChild(userInfoH2);

    const userInfoYouDiv = document.createElement('div');
    userInfoYouDiv.classList.add('you');
    userInfo.appendChild(userInfoYouDiv);

    const userInfoP = document.createElement('p');
    const userInfoPText = document.createTextNode(comment.createdAt);
    userInfoP.appendChild(userInfoPText);
    userInfo.appendChild(userInfoP);

    const mainContentP = document.createElement('p');
    const mainContentPText = document.createTextNode(comment.content);
    mainContentP.appendChild(mainContentPText);
    mainContent.appendChild(mainContentP);

    if(isCurrentUser) {
        commentDiv.classList.add('me');

        /* User info */
        const userInfoYouP = document.createElement('p');
        const userInfoYouPText = document.createTextNode('you');
        userInfoYouP.appendChild(userInfoYouPText);
        userInfoYouDiv.appendChild(userInfoYouP);

        /* Edit / delete options 1 */
        const options1 = document.createElement('div');
        options1.classList.add('options');
        ratingContainer.appendChild(options1);

        const deleteButton1 = document.createElement('button');
        const deleteButton1Text = document.createTextNode(nbsp + nbsp + 'Delete');
        deleteButton1.classList.add('delete');
        options1.appendChild(deleteButton1);
    
        const deleteIcon1 = document.createElement('i');
        deleteIcon1.classList.add('fa-solid', 'fa-trash');
        deleteButton1.appendChild(deleteIcon1);
        deleteButton1.appendChild(deleteButton1Text);

        const editButton1 = document.createElement('button');
        const editButton1Text = document.createTextNode(nbsp + nbsp + 'Edit');
        editButton1.classList.add('edit');
        options1.appendChild(editButton1);
    
        const editIcon1 = document.createElement('i');
        editIcon1.classList.add('fa-solid', 'fa-pencil');
        editButton1.appendChild(editIcon1);
        editButton1.appendChild(editButton1Text);

        /* Edit / delete options 2 */
        const options2 = document.createElement('div');
        options2.classList.add('options');
        header.appendChild(options2);

        const deleteButton2 = document.createElement('button');
        const deleteButton2Text = document.createTextNode(nbsp + nbsp + 'Delete');
        deleteButton2.classList.add('delete');
        options2.appendChild(deleteButton2);
    
        const deleteIcon2 = document.createElement('i');
        deleteIcon2.classList.add('fa-solid', 'fa-trash');
        deleteButton2.appendChild(deleteIcon2);
        deleteButton2.appendChild(deleteButton2Text);

        const editButton2 = document.createElement('button');
        const editButton2Text = document.createTextNode(nbsp + nbsp + 'Edit');
        editButton2.classList.add('edit');
        options2.appendChild(editButton2);
    
        const editIcon2 = document.createElement('i');
        editIcon2.classList.add('fa-solid', 'fa-pencil');
        editButton2.appendChild(editIcon2);
        editButton2.appendChild(editButton2Text);

        /* Items in the main content */
        const textArea = document.createElement('textarea');
        const textAreaText = document.createTextNode('Add comment...');
        textArea.setAttribute('rows', '5');
        textArea.appendChild(textAreaText);
        mainContent.appendChild(textArea);

        const updateButton = document.createElement('button');
        const updateButtonText = document.createTextNode('UPDATE');
        updateButton.classList.add('update');
        updateButton.appendChild(updateButtonText);
        mainContent.appendChild(updateButton);

        // Bind events
        const editButtonEvent = () => {
            textArea.value = mainContentP.childNodes[1].nodeValue 
                ? mainContentP.childNodes[1].nodeValue : '';
            commentDiv.classList.toggle('edit');
        } 
        editButton1.addEventListener('click', editButtonEvent);
        editButton2.addEventListener('click', editButtonEvent);

        const deleteButtonEvent = () => {
            commentToDelete = comment.id;
            deleteCommentModal?.classList.add('visible');
        }
        deleteButton1.addEventListener('click', deleteButtonEvent);
        deleteButton2.addEventListener('click', deleteButtonEvent);

        cancelDeleteModalBtn?.addEventListener('click', () => {
            deleteCommentModal?.classList.remove('visible');
        });

        updateButton.addEventListener('click', () => {
            if(bindings.updateCommentEvent == undefined) {
                throw Error('Undefined updateCommentEvent binding');
            }
            bindings.updateCommentEvent(comment.id, textArea.value);
        });
    } else {
        if(comment.upvoted) {
            commentDiv.classList.add('upvoted');
        } else if(comment.downvoted) {
            commentDiv.classList.add('downvoted');
        }
        
        /* Reply buttons */
        const replyButton1 = document.createElement('button');
        const replyButton1Text = document.createTextNode(nbsp + nbsp + 'Reply');
        replyButton1.classList.add('reply');
        ratingContainer.appendChild(replyButton1);
    
        const replyIcon1 = document.createElement('i');
        replyIcon1.classList.add('fa-solid', 'fa-reply');
        replyButton1.appendChild(replyIcon1);
        replyButton1.appendChild(replyButton1Text);

        const replyButton2 = document.createElement('button');
        const replyButton2Text = document.createTextNode(nbsp + nbsp + 'Reply');
        replyButton2.classList.add('reply');
        header.appendChild(replyButton2);

        const replyIcon2 = document.createElement('i');
        replyIcon2.classList.add('fa-solid', 'fa-reply');
        replyButton2.appendChild(replyIcon2);
        replyButton2.appendChild(replyButton2Text);

        // Bind events
        const replyButtonEvent = () => {
            if(bindings.initiateReplyEvent == undefined) {
                throw Error('Undefined initiateReplyEvent binding');
            }
            bindings.initiateReplyEvent(comment.id);
        }
        replyButton1.addEventListener('click', replyButtonEvent);
        replyButton2.addEventListener('click', replyButtonEvent);

        upvoteButton.addEventListener('click', () => {
            if(bindings.likeCommentEvent == undefined) {
                throw Error('Undefined likeCommentEvent binding');
            }
            bindings.likeCommentEvent(comment.id);
        });

        downvoteButton.addEventListener('click', () => {
            if(bindings.dislikeCommentEvent == undefined) {
                throw Error('Undefined dislikeCommentEvent binding');
            }
            bindings.dislikeCommentEvent(comment.id);
        });
    }

    // If this is a reply, add the @ mention
    if(isInteractiveReply(comment)) {
        const replyToSpan = document.createElement('span');
        const replyToSpanText = document.createTextNode(`@${replyingTo}${nbsp}`);
        replyToSpan.appendChild(replyToSpanText);
        mainContentP.insertBefore(replyToSpan, mainContentPText);    
    }

    // If everything was successful, append the comment div to the enclosing container
    enclosingContainer.appendChild(commentDiv);
}

// submitReplyEvent - move new reply to the end of the thread (or sort the replies by date) and rerender
type NewCreateReplyBindings = {
    submitReplyEvent: (replyId: number, reply: string) => void;
}

// Makes a new "create reply" prompt
// reply: the information for the reply
// bindings: the event bindings for each of the buttons
// enclosingContainer: container to put the new reply in, defaults to the commentsContainer
function newCreateReplyView(
    reply: InteractiveReply,
    bindings: NewCreateReplyBindings,
    enclosingContainer: Element) {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('create-comment', 'reply');

    const profilePic1 = document.createElement('img');
    profilePic1.src = reply.user.image.png;
    profilePic1.alt = reply.user.username + ' profile picture';
    replyContainer.appendChild(profilePic1);

    const textArea = document.createElement('textarea');
    textArea.value = reply.content;
    textArea.rows = 5;
    replyContainer.appendChild(textArea);

    const submitBtn1 = document.createElement('button');
    const submitBtnText1 = document.createTextNode('REPLY');
    submitBtn1.classList.add('submit');
    submitBtn1.appendChild(submitBtnText1);
    replyContainer.appendChild(submitBtn1);

    /* Mobile footer */
    const mobileFooter = document.createElement('div');
    mobileFooter.classList.add('mobile-footer');
    replyContainer.appendChild(mobileFooter);

    const profilePic2 = document.createElement('img');
    profilePic2.src = reply.user.image.png;
    profilePic2.alt = reply.user.username + ' profile picture';
    mobileFooter.appendChild(profilePic2);

    const submitBtn2 = document.createElement('button');
    const submitBtnText2 = document.createTextNode('REPLY');
    submitBtn2.classList.add('submit');
    submitBtn2.appendChild(submitBtnText2);
    mobileFooter.appendChild(submitBtn2);

    // Bind events
    const submitButtonEvent = () => {
        bindings.submitReplyEvent(reply.id, textArea.value);
    }
    submitBtn1.addEventListener('click', submitButtonEvent);
    submitBtn2.addEventListener('click', submitButtonEvent);

    // If everything was successful, append the reply to the enclosing container
    enclosingContainer.appendChild(replyContainer);
}

// Creates a new thread and returns the new comments container
function newThreadView() {
    const commentReplies = document.createElement('div');
    commentReplies.classList.add('comment-replies');
    commentsContainer?.appendChild(commentReplies);

    const sidebarDiv = document.createElement('div');
    sidebarDiv.classList.add('sidebar');
    commentReplies.appendChild(sidebarDiv);

    const replyLine = document.createElement('div');
    replyLine.classList.add('reply-line');
    sidebarDiv.appendChild(replyLine);

    const comments = document.createElement('div');
    comments.classList.add('comments');
    commentReplies.appendChild(comments);

    return comments;
}

type BootstrapBindings = {
    deleteCommentEvent?: (commentId: number) => void;
    addCommentEvent?: (comment: string) => void;
}

function bootstrap(bindings: BootstrapBindings) {
    // Add event listeners for elements that don't get created by render
    confirmDeleteModalBtn?.addEventListener('click', () => {
        if(bindings.deleteCommentEvent == undefined) {
            throw Error('Undefined deleteCommentEvent binding');
        }
        if(commentToDelete == -1) {
            console.log('Invalid state, no comment to delete');
        }

        deleteCommentModal?.classList.remove('visible');
        bindings.deleteCommentEvent(commentToDelete);
        commentToDelete = -1;
    });

    const addCommentEvent = () => {
        if(bindings.addCommentEvent == undefined) {
            throw Error('Undefined addCommentEvent binding');
        }
        if(addNewCommentInput == undefined) {
            throw Error("Can't find the add new comment input");
        }

        bindings.addCommentEvent(addNewCommentInput.value);
    }
    addNewCommentBtn1?.addEventListener('click', addCommentEvent);
    addNewCommentBtn2?.addEventListener('click', addCommentEvent);
}

// Re-renders the entire comments container
// comments: the list of all comments and their replies
// currentUser: self-explanatory
function render(
    comments: InteractiveComment[], 
    currentUser: User, 
    commentBindings: NewCommentBindings, 
    createReplyBindings: NewCreateReplyBindings) {
    if(commentsContainer == null) {
        throw new Error('No comments container detected.');
    }

    // Clear the old comment views
    commentsContainer.replaceChildren();

    // Go through each of the comments and create their respective views
    for(const comment of comments) {
        newCommentView(
            comment,
            commentBindings,
            comment.user.username == currentUser.username,
            commentsContainer
        );

        // If there are replies, create a new thread and replies views
        if(comment.replies.length > 0) {
            const thread = newThreadView();
            const threadAuthor = comment.user.username;
            for(const reply of comment.replies) {
                if (reply.editing) {
                    newCreateReplyView(
                        reply,
                        createReplyBindings,
                        thread
                    );
                } else {
                    const replyingTo = findComment(reply.replyingTo);
                    if(replyingTo == undefined) {
                        throw new Error('Invalid reply, no replying to');
                    }

                    newCommentView(
                        reply,
                        commentBindings,
                        reply.user.username == currentUser.username,
                        thread,
                        replyingTo[0].user.username
                    );
                }
            }
        }
    }
}