from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.orm import Session


def sync_postgres_sequences(db: Session) -> None:
    """Advance serial/identity sequences to the current max(id) for seeded tables."""

    tables = ["projects", "skills", "testimonials", "contact_messages"]

    for table_name in tables:
        db.execute(
            text(
                f"""
                SELECT setval(
                    pg_get_serial_sequence(:table_name, 'id'),
                    COALESCE(MAX(id), 1),
                    MAX(id) IS NOT NULL
                )
                FROM {table_name}
                """
            ),
            {"table_name": table_name},
        )

