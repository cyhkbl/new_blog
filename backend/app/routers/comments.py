from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.dependencies import get_current_user, get_db
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentRead, CommentUpdate

router = APIRouter(tags=["comments"])


def _comment_to_read(comment: Comment) -> CommentRead:
    return CommentRead.model_validate(comment)


def _build_comment_tree(comments: list[Comment]) -> list[CommentRead]:
    children_by_parent: dict[int | None, list[CommentRead]] = defaultdict(list)
    comment_map: dict[int, CommentRead] = {}

    for comment in comments:
        node = _comment_to_read(comment)
        node.replies = []
        comment_map[node.id] = node
        children_by_parent[node.parent_id].append(node)

    for parent_id, nodes in children_by_parent.items():
        if parent_id is None:
            continue
        parent = comment_map.get(parent_id)
        if parent:
            parent.replies = nodes

    return children_by_parent[None]


@router.get("/articles/{slug}/comments", response_model=list[CommentRead])
def list_comments(slug: str, db: Session = Depends(get_db)) -> list[CommentRead]:
    comments = list(
        db.scalars(
            select(Comment)
            .where(Comment.article_slug == slug)
            .options(selectinload(Comment.user), selectinload(Comment.replies))
            .order_by(Comment.created_at.asc(), Comment.id.asc())
        )
    )
    return _build_comment_tree(comments)


@router.post("/articles/{slug}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(
    slug: str,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CommentRead:
    if payload.parent_id is not None:
        parent_comment = db.scalar(select(Comment).where(Comment.id == payload.parent_id))
        if not parent_comment or parent_comment.article_slug != slug:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent comment not found")

    comment = Comment(
        article_slug=slug,
        user_id=current_user.id,
        content=payload.content,
        parent_id=payload.parent_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    comment = db.scalar(select(Comment).options(selectinload(Comment.user)).where(Comment.id == comment.id))
    return CommentRead.model_validate(comment)


@router.put("/comments/{comment_id}", response_model=CommentRead)
def update_comment(
    comment_id: int,
    payload: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CommentRead:
    comment = db.scalar(select(Comment).options(selectinload(Comment.user)).where(Comment.id == comment_id))
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    comment.content = payload.content
    db.commit()
    db.refresh(comment)
    return CommentRead.model_validate(comment)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    comment = db.scalar(select(Comment).where(Comment.id == comment_id))
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    db.delete(comment)
    db.commit()
