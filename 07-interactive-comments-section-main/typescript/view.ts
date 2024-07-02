const commentsContainer = document.querySelector('div.comments');
const deleteCommentModal = document.querySelector('div.delete-comment-modal');
const nbsp = String.fromCharCode(160); // &nbsp;

// comment: information about the new comment
function newCommentView(
    enclosingContainer: Element, 
    isCurrentUser: boolean,
    comment: iComment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');

    if(enclosingContainer) {
        enclosingContainer.appendChild(commentDiv);
    } else {
        commentsContainer?.appendChild(commentDiv);
    }

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
    const ratingPText = document.createTextNode('2');
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
    } else {
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
    }

    if(isInteractiveReply(comment)) {
        const replyToSpan = document.createElement('span');
        const replyToSpanText = document.createTextNode(`@${comment.replyingTo}${nbsp}`);
        replyToSpan.appendChild(replyToSpanText);
        mainContentP.insertBefore(replyToSpan, mainContentPText);    
    }

    // bindEditCommentEvent - rerender to update editing property
    // bindUpdateCommentEvent - rerender the comments after editing
    // bindDeleteCommentEvent - rerender after removing the comment from the list
}

// enclosingContainer: container to put the new reply in
function newCreateReplyView(enclosingContainer: Element, user: User) {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('create-comment', 'reply');

    if(enclosingContainer) {
        enclosingContainer.appendChild(replyContainer);
    } else {
        commentsContainer?.appendChild(replyContainer);
    }

    const profilePic1 = document.createElement('img');
    profilePic1.src = user.image.png;
    profilePic1.alt = user.username + ' profile picture';
    replyContainer.appendChild(profilePic1);

    const textArea1 = document.createElement('textarea');
    const textAreaText1 = document.createTextNode('Add reply...');
    textArea1.rows = 5;
    textArea1.appendChild(textAreaText1);
    replyContainer.appendChild(textArea1);

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
    profilePic2.src = user.image.png;
    profilePic2.alt = user.username + ' profile picture';
    mobileFooter.appendChild(profilePic2);

    const submitBtn2 = document.createElement('button');
    const submitBtnText2 = document.createTextNode('REPLY');
    submitBtn2.classList.add('submit');
    submitBtn2.appendChild(submitBtnText2);
    mobileFooter.appendChild(submitBtn2);
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

function render(comments: InteractiveComment[], currentUser: User) {
    if(commentsContainer == null) {
        throw new Error('No comments container detected.');
    }

    // Clear the old comment views
    commentsContainer.replaceChildren();

    // Go through each of the comments and create their respective views
    for(const comment of comments) {
        newCommentView(
            commentsContainer,
            comment.user == currentUser,
            comment
        );

        // If there are replies, create a new thread and replies views
        if(comment.replies.length > 0) {
            const thread = newThreadView();
            for(const reply of comment.replies) {
                newCommentView(
                    thread,
                    reply.user == currentUser,
                    reply
                );
            }
        }
    }
}