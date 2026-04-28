from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserRead


class CommentCreate(BaseModel):
    content: str
    parent_id: int | None = None


class CommentUpdate(BaseModel):
    content: str


class CommentAuthor(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    display_name: str | None = None
    avatar_url: str | None = None


class CommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    article_slug: str
    content: str
    parent_id: int | None
    created_at: datetime
    updated_at: datetime
    user: CommentAuthor
    replies: list["CommentRead"] = []


class ArticleSummary(BaseModel):
    slug: str
    title: str
    date: str
    excerpt: str
    tags: list[str]
    comments_count: int


class ArticleDetail(ArticleSummary):
    pass


CommentRead.model_rebuild()
