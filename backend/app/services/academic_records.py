import json
import os
from pathlib import Path
from typing import Dict, Any

RECORDS_DIR = Path("data/student_records")
RECORDS_DIR.mkdir(parents=True, exist_ok=True)

def get_record_path(user_id: str) -> Path:
    # Use email or id as the filename
    safe_id = user_id.replace("@", "_at_").replace(".", "_dot_")
    return RECORDS_DIR / f"{safe_id}.json"

def read_academic_record(user_id: str) -> Dict[str, Any]:
    path = get_record_path(user_id)
    if not path.exists():
        # Return default structure
        return {
            "courses": [],
            "exam_marks": [],
            "attendance_history": {"total": 0, "present": 0}
        }
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading academic record for {user_id}: {e}")
        return {"courses": [], "exam_marks": [], "attendance_history": {"total": 0, "present": 0}}

def write_academic_record(user_id: str, data: Dict[str, Any]) -> bool:
    path = get_record_path(user_id)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error writing academic record for {user_id}: {e}")
        return False
