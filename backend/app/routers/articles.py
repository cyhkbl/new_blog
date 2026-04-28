from fastapi import APIRouter

from app.schemas.comment import ArticleDetail, ArticleSummary

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("", response_model=list[ArticleSummary])
def list_articles() -> list[ArticleSummary]:
    return []


@router.get("/{slug}", response_model=ArticleDetail)
def get_article(slug: str) -> ArticleDetail:
    return ArticleDetail(
        slug=slug,
        title="Placeholder article",
        date="1970-01-01",
        excerpt="Article metadata will be connected in Phase 3.",
        tags=[],
        comments_count=0,
    )
