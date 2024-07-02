interface iComment {
    id: number;
    commentType: string;
    content: string;
    createdAt: string;
    score: number;
    user: User;

    // state
    editing: boolean;
    upvoted: boolean;
    downvoted: boolean;
}

interface InteractiveComment extends iComment {
    commentType: 'comment';

    // all replies for this comment
    replies: InteractiveReply[];
}

function isInteractiveComment(comment: iComment): comment is InteractiveComment  {
    return comment.commentType == 'comment';
}

interface InteractiveReply extends iComment {
    commentType: 'reply';

    // id of the comment its replying to
    replyingTo: number;
}

function isInteractiveReply(comment: iComment): comment is InteractiveReply  {
    return comment.commentType == 'reply';
}

type User = {
    image: ImageOptions;
    username: string;
}

type ImageOptions = {
    png: string;
    webp: string;
}