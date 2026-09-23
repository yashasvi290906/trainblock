from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "RAILBLOCK — AI-Powered Automatic Block Planning Engine"
    PROJECT_NAME: str = "RAILBLOCK — AI-Powered Automatic Block Planning Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    CORRIDOR_CODE: str = "SEC-NDL"
    CORRIDOR_NAME: str = "Secunderabad – Nandyal Mainline"
    DIVISION: str = "Secunderabad Division (SC)"
    ZONE: str = "South Central Railway (SCR)"
    KM_START: float = 40.0
    KM_END: float = 120.0
    TOTAL_KM: float = 80.0
    DATASET_TYPE: str = "SYNTHETIC_PROTOTYPE_DATA"
    SOLVER_TIME_LIMIT_SECONDS: float = 10.0
    DEFAULT_SLOT_GRANULARITY_MINUTES: int = 5
    FLAGSHIP_BLOCK_ID: str = "B-014"
    
    # Physics & Operational Constants
    NOMINAL_ISOLATION_MIN: int = 10
    NOMINAL_EARTHING_MIN: int = 10
    NOMINAL_TRANSIT_MIN: int = 5
    NOMINAL_RESTORATION_MIN: int = 5
    MIN_HEADWAY_BUFFER_MIN: int = 15

settings = Settings()
