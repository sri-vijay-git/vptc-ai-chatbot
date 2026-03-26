"""
Git Auto-Sync Service
======================
Automatically commits and pushes new PDFs + ChromaDB data to the GitHub repo
after a document is uploaded via the Admin panel.

Requires in .env:
    GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx   (Personal Access Token, repo scope)
    GITHUB_REPO=username/repo-name          (e.g. yourname/vptc-ai-chatbot)
    GIT_USER_NAME=Admin Bot                 (commit author name)
    GIT_USER_EMAIL=admin@vptc.edu           (commit author email)
"""

import os
import subprocess
import logging

logger = logging.getLogger(__name__)


def _run(cmd: list[str], cwd: str) -> tuple[bool, str]:
    """Run a shell command, return (success, output)."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=30
        )
        output = result.stdout + result.stderr
        if result.returncode != 0:
            logger.warning(f"Git command failed: {' '.join(cmd)}\n{output}")
            return False, output
        return True, output
    except subprocess.TimeoutExpired:
        return False, "Git command timed out"
    except Exception as e:
        return False, str(e)


def auto_git_push(filename: str) -> dict:
    """
    Commit and push the newly uploaded PDF + updated ChromaDB data to GitHub.

    Returns:
        { "success": bool, "message": str }
    """
    token = os.getenv("GITHUB_TOKEN", "").strip()
    repo = os.getenv("GITHUB_REPO", "").strip()       # e.g. "yourname/vptc-ai-chatbot"
    user_name = os.getenv("GIT_USER_NAME", "VPTC Admin Bot").strip()
    user_email = os.getenv("GIT_USER_EMAIL", "admin@vptc.edu").strip()

    if not token:
        return {"success": False, "message": "GITHUB_TOKEN not set in .env — skipping auto push"}
    if not repo:
        return {"success": False, "message": "GITHUB_REPO not set in .env — skipping auto push"}

    # Repo root is 2 levels above this file (backend/app/services/ → root)
    repo_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")
    )

    # Authenticated remote URL
    remote_url = f"https://{token}@github.com/{repo}.git"

    steps = [
        (["git", "config", "user.name", user_name], "Set git user name"),
        (["git", "config", "user.email", user_email], "Set git user email"),
        (["git", "remote", "set-url", "origin", remote_url], "Set authenticated remote"),
        (["git", "add",
           "backend/data/documents/",
           "backend/data/chromadb/",
           "backend/data/documents_registry.json"
          ], "Stage files"),
        (["git", "commit", "-m", f"📚 Auto-ingest: Added knowledge base file '{filename}'"], "Commit"),
        (["git", "push", "origin", "HEAD"], "Push to GitHub"),
    ]

    for cmd, label in steps:
        ok, output = _run(cmd, cwd=repo_root)
        if not ok:
            # "nothing to commit" is not a real error
            if "nothing to commit" in output or "nothing added to commit" in output:
                return {"success": True, "message": "Nothing new to commit — data already up to date"}
            logger.error(f"Auto git push failed at step '{label}': {output}")
            return {"success": False, "message": f"Git push failed at '{label}': {output[:200]}"}

    logger.info(f"✅ Auto git push success for: {filename}")
    return {"success": True, "message": f"PDF and ChromaDB data pushed to GitHub successfully!"}
