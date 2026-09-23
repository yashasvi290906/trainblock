from typing import List, Dict, Any, Optional
from ..models.schemas import (
    TmsDefect,
    SmmsWork,
    TdmsWork,
    CoaTrain,
    GoodsForecast,
    BlockCorridor,
    NormalizedTask,
    RankingFeatures
)
from ..data.seed_data import (
    SEED_TMS_DEFECTS,
    SEED_SMMS_WORK,
    SEED_TDMS_WORK,
    SEED_COA_TRAINS,
    SEED_GOODS_FORECAST,
    SEED_BLOCK_CORRIDORS,
)
from .location_service import location_service

class TMSAdapter:
    def fetch_records(self) -> List[TmsDefect]:
        return SEED_TMS_DEFECTS

class SMMSAdapter:
    def fetch_records(self) -> List[SmmsWork]:
        return SEED_SMMS_WORK

class TDMSAdapter:
    def fetch_records(self) -> List[TdmsWork]:
        return SEED_TDMS_WORK

class COAAdapter:
    def fetch_records(self) -> List[CoaTrain]:
        return SEED_COA_TRAINS

class GoodsForecastAdapter:
    def fetch_records(self) -> List[GoodsForecast]:
        return SEED_GOODS_FORECAST

class BlockCorridorAdapter:
    def fetch_records(self) -> List[BlockCorridor]:
        return SEED_BLOCK_CORRIDORS

class IngestionService:
    def __init__(self):
        self.tms_adapter = TMSAdapter()
        self.smms_adapter = SMMSAdapter()
        self.tdms_adapter = TDMSAdapter()
        self.coa_adapter = COAAdapter()
        self.goods_adapter = GoodsForecastAdapter()
        self.block_adapter = BlockCorridorAdapter()

    def get_all_raw_inputs(self) -> Dict[str, Any]:
        tms = self.tms_adapter.fetch_records()
        smms = self.smms_adapter.fetch_records()
        tdms = self.tdms_adapter.fetch_records()
        coa = self.coa_adapter.fetch_records()
        goods = self.goods_adapter.fetch_records()
        blocks = self.block_adapter.fetch_records()

        return {
            "tms_defects": tms,
            "smms_work": smms,
            "tdms_work": tdms,
            "coa_timetable": coa,
            "goods_forecast": goods,
            "block_corridors": blocks,
            "summary": {
                "tms_count": len(tms),
                "smms_count": len(smms),
                "tdms_count": len(tdms),
                "coa_train_count": len(coa),
                "goods_count": len(goods),
                "corridors_count": len(blocks),
                "total_maintenance_demands": len(tms) + len(smms) + len(tdms),
                "corridor_coverage": "SEC (KM 40) → NDL (KM 120)",
                "data_status": "SYNTHETIC PROTOTYPE DATA",
            },
        }

    def ingest_all(
        self,
        tms_data: Optional[List[TmsDefect]] = None,
        smms_data: Optional[List[SmmsWork]] = None,
        tdms_data: Optional[List[TdmsWork]] = None,
        corridors: Optional[List[BlockCorridor]] = None,
    ) -> List[NormalizedTask]:
        tms = tms_data or self.tms_adapter.fetch_records()
        smms = smms_data or self.smms_adapter.fetch_records()
        tdms = tdms_data or self.tdms_adapter.fetch_records()

        tasks: List[NormalizedTask] = []

        dummy_features = RankingFeatures(
            defect_severity=3.0,
            overdue_days=0.0,
            asset_criticality=3.0,
            traffic_exposure=4.0,
            availability_impact=2.0
        )

        # 1. Transform TMS Track Defects
        for d in tms:
            sec_id = location_service.resolve_corridor_section(d.km_start, d.km_end)
            machine = "None"
            dur = 60
            if "Weld" in d.defect_type or "Fracture" in d.defect_type:
                machine = "USFD Trolley & Rail Drill"
                dur = 55
            elif "Switch" in d.defect_type:
                machine = "Tamping Machine (Points & Crossing)"
                dur = 65
            elif "Gauge" in d.defect_type or "Sleeper" in d.defect_type:
                machine = "Tamping Express (CSM 09-3X)"
                dur = 75

            tasks.append(NormalizedTask(
                task_id=f"TASK-{d.id}",
                source_system="TMS",
                source_record_id=d.id,
                department="Engineering",
                title=f"{d.defect_type} (KM {d.km_start:.1f}-{d.km_end:.1f})",
                asset_type="Track / Rail",
                asset_id=f"RAIL-{d.line}-{d.km_start:.1f}",
                line=d.line,
                km_start=d.km_start,
                km_end=d.km_end,
                corridor_section_id=sec_id,
                duration_min=dur,
                required_protection="Absolute Traffic Block",
                ohe_required=False,
                machine_required=machine,
                crew_required=12,
                overdue_days=d.overdue_days,
                safety_tier="P3",
                safety_tier_reason="Pending deterministic safety evaluation",
                ml_ranking_score=0.0,
                within_tier_rank=99,
                ranking_features=dummy_features
            ))

        # 2. Transform SMMS Signalling Work
        for s in smms:
            sec_id = location_service.resolve_corridor_section(s.km_location, s.km_location + 0.2)
            tasks.append(NormalizedTask(
                task_id=f"TASK-{s.id}",
                source_system="SMMS",
                source_record_id=s.id,
                department="S&T",
                title=f"{s.maintenance_type} on {s.asset_type} ({s.station_code})",
                asset_type=s.asset_type,
                asset_id=s.asset_id,
                line=s.line,
                km_start=s.km_location,
                km_end=s.km_location + 0.2,
                corridor_section_id=sec_id,
                duration_min=s.duration_min,
                required_protection="Signal Disconnection / Traffic Block",
                ohe_required=s.requires_power_isolation,
                machine_required="S&T Testing Kit",
                crew_required=6,
                overdue_days=s.overdue_days,
                safety_tier="P3",
                safety_tier_reason="Pending deterministic safety evaluation",
                ml_ranking_score=0.0,
                within_tier_rank=99,
                ranking_features=dummy_features
            ))

        # 3. Transform TDMS Traction Work
        for t in tdms:
            sec_id = location_service.resolve_corridor_section(t.km_start, t.km_end)
            tasks.append(NormalizedTask(
                task_id=f"TASK-{t.id}",
                source_system="TDMS",
                source_record_id=t.id,
                department="Traction",
                title=f"{t.work_type} ({t.asset_type})",
                asset_type=t.asset_type,
                asset_id=t.ohe_section_id,
                line=t.line,
                km_start=t.km_start,
                km_end=t.km_end,
                corridor_section_id=sec_id,
                ohe_section_id=t.ohe_section_id,
                duration_min=t.duration_min,
                required_protection="Power Block & Traffic Block",
                ohe_required=t.power_block_required,
                machine_required="8-Wheeler OHE Tower Wagon",
                crew_required=8,
                overdue_days=t.overdue_days,
                safety_tier="P3",
                safety_tier_reason="Pending deterministic safety evaluation",
                ml_ranking_score=0.0,
                within_tier_rank=99,
                ranking_features=dummy_features
            ))

        return tasks

ingestion_service = IngestionService()
