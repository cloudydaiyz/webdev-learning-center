interface iComment {
    id: number;
    commentType: string;
    content: string;
    createdAt: string;
    score: number;
    user: User;

    // state
    upvoted: boolean;
    downvoted: boolean;
}

type User = {
    image: ImageOptions;
    username: string;
}

type ImageOptions = {
    png: string;
    webp: string;
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
    editing: boolean;
}

function isInteractiveReply(comment: iComment): comment is InteractiveReply  {
    return comment.commentType == 'reply';
}