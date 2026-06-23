from pathlib import Path


def read_text_file(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8").strip()


def list_knowledge_files(root: Path) -> list[str]:
    if not root.exists():
        return []
    return [str(path.relative_to(root)).replace("\\", "/") for path in root.rglob("*.md") if path.is_file()]
