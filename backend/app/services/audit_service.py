from datetime import datetime
from typing import List, Dict, Any

class AuditService:
    """
    Immutable in-memory audit log service for tracking solver executions,
    planner overrides, and BDMS submissions.
    """

    def __init__(self):
        self.logs: List[Dict[str, Any]] = [
            {
                "log_id": "AUD-001",
                "timestamp": "2026-09-23T06:00:00Z",
                "event_type": "PIPELINE_INITIALIZATION",
                "actor": "SYSTEM",
                "details": "Initialized Ingestion adapters: TMS (18), SMMS (14), TDMS (15), COA (8), Goods (3), Corridors (6)."
            },
            {
                "log_id": "AUD-002",
                "timestamp": "2026-09-23T06:05:00Z",
                "event_type": "MODEL_TRAINING",
                "actor": "SYSTEM",
                "details": "Trained XGBoost Regressor on synthetic prototype feature pairs (R^2 = 0.982)."
            }
        ]

    def record_event(self, event_type: str, actor: str, details: str) -> Dict[str, Any]:
        log_entry = {
            "log_id": f"AUD-{len(self.logs) + 1:03d}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event_type": event_type,
            "actor": actor,
            "details": details
        }
        self.logs.append(log_entry)
        return log_entry

    def get_logs(self) -> List[Dict[str, Any]]:
        return list(reversed(self.logs))

audit_service = AuditService()
