from typing import Tuple, List, Optional
from ..models.schemas import BlockCorridor
from ..data.seed_data import SEED_BLOCK_CORRIDORS

class UnifiedLocationService:
    """
    Unified Spatial Location Model for Railway Corridors.
    Implements 1D linear referencing and spatial topology across block sections and OHE sub-sectors.
    """
    def __init__(self, corridors: Optional[List[BlockCorridor]] = None):
        self.corridors = corridors or SEED_BLOCK_CORRIDORS

    def resolve_corridor_section(self, km_start: float, km_end: float, line: str = "DOWN") -> str:
        corr = self.find_corridor_section_for_km(km_start, km_end, line)
        return corr.section_id if corr else "SEC-NDL-BLK-03"

    def find_corridor_section_for_km(self, km_start: float, km_end: float, line: str = "DOWN") -> Optional[BlockCorridor]:
        for c in self.corridors:
            if km_start >= c.km_start and km_end <= c.km_end and (line in c.lines or line == "BOTH"):
                return c
        # Fallback to nearest overlap
        for c in self.corridors:
            if max(km_start, c.km_start) < min(km_end, c.km_end):
                return c
        return self.corridors[2] if len(self.corridors) > 2 else self.corridors[0]

    def check_spatial_overlap(
        self,
        km1_start: float,
        km1_end: float,
        km2_start: float,
        km2_end: float,
        buffer_km: float = 0.0
    ) -> bool:
        start_a = km1_start - buffer_km
        end_a = km1_end + buffer_km
        start_b = km2_start - buffer_km
        end_b = km2_end + buffer_km
        return max(start_a, start_b) <= min(end_a, end_b)

    def calculate_distance_km(self, km1: float, km2: float) -> float:
        return abs(km1 - km2)

location_service = UnifiedLocationService()
