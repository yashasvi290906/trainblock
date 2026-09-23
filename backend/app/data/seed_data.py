from ..models.schemas import (
    TmsDefect,
    SmmsWork,
    TdmsWork,
    CoaTrain,
    TimetableStop,
    GoodsForecast,
    BlockCorridor,
)

# -------------------------------------------------------------
# SOURCE 1: TMS (Track Management System) — 18 Track Defects
# -------------------------------------------------------------
SEED_TMS_DEFECTS = [
    TmsDefect(id="TMS-1081", defect_type="Rail Joint Fracture", line="DOWN", km_start=72.4, km_end=72.9, depth_mm=6.2, severity=5, overdue_days=14, speed_restriction_kmph=30, detection_method="USFD Trolley", ingested_at="2026-09-18T01:15:00Z"),
    TmsDefect(id="TMS-1082", defect_type="Thermite Weld Crack", line="DOWN", km_start=73.1, km_end=73.6, depth_mm=4.8, severity=5, overdue_days=12, speed_restriction_kmph=45, detection_method="USFD Trolley", ingested_at="2026-09-18T01:20:00Z"),
    TmsDefect(id="TMS-1083", defect_type="Switch Blade Wear", line="DOWN", km_start=75.8, km_end=76.4, depth_mm=3.5, severity=4, overdue_days=7, detection_method="Keyman Inspection", ingested_at="2026-09-18T02:00:00Z"),
    TmsDefect(id="TMS-1084", defect_type="Gauge Spread", line="DOWN", km_start=78.0, km_end=79.2, severity=4, overdue_days=6, detection_method="Track Recording Car", ingested_at="2026-09-18T02:10:00Z"),
    TmsDefect(id="TMS-1085", defect_type="Sleeper Spalling", line="DOWN", km_start=81.5, km_end=82.8, severity=3, overdue_days=3, detection_method="OMS-2000", ingested_at="2026-09-18T02:30:00Z"),
    TmsDefect(id="TMS-1086", defect_type="USFD Flaw", line="DOWN", km_start=84.1, km_end=84.6, depth_mm=5.1, severity=5, overdue_days=11, speed_restriction_kmph=30, detection_method="USFD Trolley", ingested_at="2026-09-18T02:45:00Z"),
    TmsDefect(id="TMS-1087", defect_type="Thermite Weld Crack", line="DOWN", km_start=88.0, km_end=88.5, severity=3, overdue_days=2, detection_method="USFD Trolley", ingested_at="2026-09-18T03:00:00Z"),
    TmsDefect(id="TMS-1088", defect_type="Gauge Spread", line="DOWN", km_start=91.2, km_end=92.4, severity=3, overdue_days=1, detection_method="Track Recording Car", ingested_at="2026-09-18T03:15:00Z"),
    TmsDefect(id="TMS-1089", defect_type="Rail Joint Fracture", line="UP", km_start=18.2, km_end=18.6, severity=4, overdue_days=8, detection_method="USFD Trolley", ingested_at="2026-09-18T03:30:00Z"),
    TmsDefect(id="TMS-1090", defect_type="Sleeper Spalling", line="UP", km_start=21.0, km_end=22.5, severity=2, overdue_days=0, detection_method="OMS-2000", ingested_at="2026-09-18T03:40:00Z"),
    TmsDefect(id="TMS-1091", defect_type="Switch Blade Wear", line="BOTH", km_start=42.1, km_end=42.6, severity=4, overdue_days=9, detection_method="Keyman Inspection", ingested_at="2026-09-18T04:00:00Z"),
    TmsDefect(id="TMS-1092", defect_type="USFD Flaw", line="DOWN", km_start=46.0, km_end=46.4, severity=3, overdue_days=2, detection_method="USFD Trolley", ingested_at="2026-09-18T04:15:00Z"),
    TmsDefect(id="TMS-1093", defect_type="Thermite Weld Crack", line="DOWN", km_start=70.2, km_end=70.8, severity=4, overdue_days=5, detection_method="USFD Trolley", ingested_at="2026-09-18T04:30:00Z"),
    TmsDefect(id="TMS-1094", defect_type="Gauge Spread", line="DOWN", km_start=74.0, km_end=75.0, severity=3, overdue_days=2, detection_method="Track Recording Car", ingested_at="2026-09-18T04:45:00Z"),
    TmsDefect(id="TMS-1095", defect_type="Sleeper Spalling", line="DOWN", km_start=77.2, km_end=78.4, severity=2, overdue_days=0, detection_method="OMS-2000", ingested_at="2026-09-18T05:00:00Z"),
    TmsDefect(id="TMS-1096", defect_type="Rail Joint Fracture", line="DOWN", km_start=80.1, km_end=80.5, severity=4, overdue_days=7, detection_method="USFD Trolley", ingested_at="2026-09-18T05:10:00Z"),
    TmsDefect(id="TMS-1097", defect_type="Switch Blade Wear", line="DOWN", km_start=86.3, km_end=86.9, severity=3, overdue_days=1, detection_method="Keyman Inspection", ingested_at="2026-09-18T05:20:00Z"),
    TmsDefect(id="TMS-1098", defect_type="Thermite Weld Crack", line="DOWN", km_start=93.0, km_end=93.5, severity=3, overdue_days=2, detection_method="USFD Trolley", ingested_at="2026-09-18T05:30:00Z"),
]

# -------------------------------------------------------------
# SOURCE 2: SMMS (Signal Maintenance Management System) — 14 Records
# -------------------------------------------------------------
SEED_SMMS_WORK = [
    SmmsWork(id="SMMS-421", asset_type="Point Machine", asset_id="PM-72.8-DN", station_code="WL", km_location=72.8, line="DOWN", maintenance_type="Periodic Overhaul", duration_min=35, overdue_days=8, criticality="Critical", requires_power_isolation=False, ingested_at="2026-09-18T01:30:00Z"),
    SmmsWork(id="SMMS-422", asset_type="Track Circuit", asset_id="TC-74.2-DN", station_code="WL", km_location=74.2, line="DOWN", maintenance_type="Insulation Resistance Test", duration_min=25, overdue_days=4, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T01:45:00Z"),
    SmmsWork(id="SMMS-423", asset_type="Multi-Aspect Signal", asset_id="SIG-76.0-DN", station_code="KCG", km_location=76.0, line="DOWN", maintenance_type="Contact Cleaning", duration_min=20, overdue_days=3, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T02:15:00Z"),
    SmmsWork(id="SMMS-424", asset_type="Axle Counter", asset_id="AC-78.5-DN", station_code="KCG", km_location=78.5, line="DOWN", maintenance_type="Cable Meggering", duration_min=30, overdue_days=1, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T02:40:00Z"),
    SmmsWork(id="SMMS-425", asset_type="Point Machine", asset_id="PM-83.1-DN", station_code="KCG", km_location=83.1, line="DOWN", maintenance_type="Obstruction Test", duration_min=25, overdue_days=5, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T03:00:00Z"),
    SmmsWork(id="SMMS-426", asset_type="Track Circuit", asset_id="TC-86.4-DN", station_code="NDKD", km_location=86.4, line="DOWN", maintenance_type="Periodic Overhaul", duration_min=35, overdue_days=2, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T03:20:00Z"),
    SmmsWork(id="SMMS-427", asset_type="Multi-Aspect Signal", asset_id="SIG-90.2-DN", station_code="NDKD", km_location=90.2, line="DOWN", maintenance_type="Contact Cleaning", duration_min=20, overdue_days=0, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T03:45:00Z"),
    SmmsWork(id="SMMS-428", asset_type="Point Machine", asset_id="PM-19.4-UP", station_code="SEC", km_location=19.4, line="UP", maintenance_type="Periodic Overhaul", duration_min=40, overdue_days=6, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T04:00:00Z"),
    SmmsWork(id="SMMS-429", asset_type="Axle Counter", asset_id="AC-22.1-UP", station_code="SEC", km_location=22.1, line="UP", maintenance_type="Cable Meggering", duration_min=25, overdue_days=1, criticality="Low", requires_power_isolation=False, ingested_at="2026-09-18T04:15:00Z"),
    SmmsWork(id="SMMS-430", asset_type="Multi-Aspect Signal", asset_id="SIG-43.0-BOTH", station_code="KZJ", km_location=43.0, line="BOTH", maintenance_type="Periodic Overhaul", duration_min=30, overdue_days=7, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T04:30:00Z"),
    SmmsWork(id="SMMS-431", asset_type="Track Circuit", asset_id="TC-71.5-DN", station_code="WL", km_location=71.5, line="DOWN", maintenance_type="Insulation Resistance Test", duration_min=20, overdue_days=3, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T04:45:00Z"),
    SmmsWork(id="SMMS-432", asset_type="Point Machine", asset_id="PM-77.0-DN", station_code="KCG", km_location=77.0, line="DOWN", maintenance_type="Obstruction Test", duration_min=25, overdue_days=4, criticality="High", requires_power_isolation=False, ingested_at="2026-09-18T05:00:00Z"),
    SmmsWork(id="SMMS-433", asset_type="Multi-Aspect Signal", asset_id="SIG-82.0-DN", station_code="KCG", km_location=82.0, line="DOWN", maintenance_type="Contact Cleaning", duration_min=20, overdue_days=1, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T05:15:00Z"),
    SmmsWork(id="SMMS-434", asset_type="Axle Counter", asset_id="AC-89.5-DN", station_code="NDKD", km_location=89.5, line="DOWN", maintenance_type="Cable Meggering", duration_min=30, overdue_days=2, criticality="Medium", requires_power_isolation=False, ingested_at="2026-09-18T05:30:00Z"),
]

# -------------------------------------------------------------
# SOURCE 3: TDMS (Traction Distribution Management System) — 15 Records
# -------------------------------------------------------------
SEED_TDMS_WORK = [
    TdmsWork(id="TDMS-881", asset_type="Cantilever Assembly", substation_code="TSS-WL-01", ohe_section_id="OHE-SEC-WL-DN", km_start=73.0, km_end=73.5, line="DOWN", work_type="Height & Stagger Adjustment", duration_min=30, power_block_required=True, overdue_days=9, criticality="Critical", ingested_at="2026-09-18T01:10:00Z"),
    TdmsWork(id="TDMS-882", asset_type="Contact Wire", substation_code="TSS-WL-01", ohe_section_id="OHE-SEC-WL-DN", km_start=74.5, km_end=75.8, line="DOWN", work_type="Contact Wire Dropper Renewal", duration_min=45, power_block_required=True, overdue_days=11, criticality="Critical", ingested_at="2026-09-18T01:30:00Z"),
    TdmsWork(id="TDMS-883", asset_type="Section Insulator", substation_code="TSS-KCG-02", ohe_section_id="OHE-WL-KCG-DN", km_start=77.4, km_end=77.8, line="DOWN", work_type="Insulator De-greasing", duration_min=25, power_block_required=True, overdue_days=5, criticality="High", ingested_at="2026-09-18T02:00:00Z"),
    TdmsWork(id="TDMS-884", asset_type="Auto Tensioning Device (ATD)", substation_code="TSS-KCG-02", ohe_section_id="OHE-WL-KCG-DN", km_start=80.2, km_end=80.8, line="DOWN", work_type="Current Collection Test", duration_min=35, power_block_required=True, overdue_days=4, criticality="High", ingested_at="2026-09-18T02:20:00Z"),
    TdmsWork(id="TDMS-885", asset_type="Catenary Wire", substation_code="TSS-NDKD-03", ohe_section_id="OHE-KCG-NDKD-DN", km_start=85.0, km_end=86.2, line="DOWN", work_type="Thermal Imaging Audit", duration_min=40, power_block_required=True, overdue_days=2, criticality="Medium", ingested_at="2026-09-18T02:50:00Z"),
    TdmsWork(id="TDMS-886", asset_type="Cantilever Assembly", substation_code="TSS-NDKD-03", ohe_section_id="OHE-KCG-NDKD-DN", km_start=88.5, km_end=89.0, line="DOWN", work_type="Height & Stagger Adjustment", duration_min=25, power_block_required=True, overdue_days=1, criticality="Medium", ingested_at="2026-09-18T03:15:00Z"),
    TdmsWork(id="TDMS-887", asset_type="Section Insulator", substation_code="TSS-NDKD-03", ohe_section_id="OHE-KCG-NDKD-DN", km_start=92.1, km_end=92.6, line="DOWN", work_type="Insulator De-greasing", duration_min=20, power_block_required=True, overdue_days=0, criticality="Low", ingested_at="2026-09-18T03:30:00Z"),
    TdmsWork(id="TDMS-888", asset_type="Contact Wire", substation_code="TSS-SEC-01", ohe_section_id="OHE-SEC-KZJ-UP", km_start=17.5, km_end=18.8, line="UP", work_type="Contact Wire Dropper Renewal", duration_min=45, power_block_required=True, overdue_days=7, criticality="High", ingested_at="2026-09-18T03:50:00Z"),
    TdmsWork(id="TDMS-889", asset_type="Auto Tensioning Device (ATD)", substation_code="TSS-SEC-01", ohe_section_id="OHE-SEC-KZJ-UP", km_start=20.4, km_end=21.0, line="UP", work_type="Current Collection Test", duration_min=30, power_block_required=True, overdue_days=3, criticality="Medium", ingested_at="2026-09-18T04:10:00Z"),
    TdmsWork(id="TDMS-890", asset_type="Feeding Post", substation_code="TSS-KZJ-01", ohe_section_id="OHE-KZJ-WL-BOTH", km_start=41.5, km_end=42.0, line="BOTH", work_type="Height & Stagger Adjustment", duration_min=35, power_block_required=True, overdue_days=8, criticality="High", ingested_at="2026-09-18T04:30:00Z"),
    TdmsWork(id="TDMS-891", asset_type="Cantilever Assembly", substation_code="TSS-WL-01", ohe_section_id="OHE-SEC-WL-DN", km_start=71.0, km_end=71.6, line="DOWN", work_type="Height & Stagger Adjustment", duration_min=25, power_block_required=True, overdue_days=4, criticality="Medium", ingested_at="2026-09-18T04:50:00Z"),
    TdmsWork(id="TDMS-892", asset_type="Section Insulator", substation_code="TSS-WL-01", ohe_section_id="OHE-SEC-WL-DN", km_start=75.0, km_end=75.4, line="DOWN", work_type="Insulator De-greasing", duration_min=20, power_block_required=True, overdue_days=3, criticality="Medium", ingested_at="2026-09-18T05:05:00Z"),
    TdmsWork(id="TDMS-893", asset_type="Contact Wire", substation_code="TSS-KCG-02", ohe_section_id="OHE-WL-KCG-DN", km_start=79.0, km_end=80.0, line="DOWN", work_type="Contact Wire Dropper Renewal", duration_min=35, power_block_required=True, overdue_days=2, criticality="Medium", ingested_at="2026-09-18T05:20:00Z"),
    TdmsWork(id="TDMS-894", asset_type="Catenary Wire", substation_code="TSS-KCG-02", ohe_section_id="OHE-WL-KCG-DN", km_start=82.5, km_end=83.2, line="DOWN", work_type="Thermal Imaging Audit", duration_min=30, power_block_required=True, overdue_days=1, criticality="Low", ingested_at="2026-09-18T05:35:00Z"),
    TdmsWork(id="TDMS-895", asset_type="Cantilever Assembly", substation_code="TSS-NDKD-03", ohe_section_id="OHE-KCG-NDKD-DN", km_start=87.0, km_end=87.6, line="DOWN", work_type="Height & Stagger Adjustment", duration_min=25, power_block_required=True, overdue_days=2, criticality="Medium", ingested_at="2026-09-18T05:50:00Z"),
]

# -------------------------------------------------------------
# SOURCE 4: COA (Control Office Application) Timetable — 8 Trains
# -------------------------------------------------------------
SEED_COA_TRAINS = [
    CoaTrain(train_id="VB-20612", service_number="20612", train_name="Vande Bharat Express", train_type="Vande Bharat", priority_class=1, direction="DOWN", stops=[
        TimetableStop(station_code="SEC", km=40, arrival_mins=140, departure_mins=140, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=164, departure_mins=164, dwell_min=0),
        TimetableStop(station_code="WL", km=68, arrival_mins=176, departure_mins=176, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=188, departure_mins=191, dwell_min=3),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=209, departure_mins=209, dwell_min=0),
        TimetableStop(station_code="NDL", km=120, arrival_mins=235, departure_mins=235, dwell_min=0),
    ]),
    CoaTrain(train_id="R-12434", service_number="12434", train_name="Rajdhani Express", train_type="Rajdhani", priority_class=1, direction="DOWN", stops=[
        TimetableStop(station_code="SEC", km=40, arrival_mins=165, departure_mins=165, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=188, departure_mins=188, dwell_min=0),
        TimetableStop(station_code="WL", km=68, arrival_mins=198, departure_mins=198, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=210, departure_mins=212, dwell_min=2),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=232, departure_mins=232, dwell_min=0),
        TimetableStop(station_code="NDL", km=120, arrival_mins=258, departure_mins=258, dwell_min=0),
    ]),
    CoaTrain(train_id="AB-12076", service_number="12076", train_name="Amrit Bharat Express", train_type="Amrit Bharat", priority_class=2, direction="DOWN", stops=[
        TimetableStop(station_code="SEC", km=40, arrival_mins=195, departure_mins=195, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=222, departure_mins=222, dwell_min=0),
        TimetableStop(station_code="WL", km=68, arrival_mins=235, departure_mins=235, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=248, departure_mins=252, dwell_min=4),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=276, departure_mins=276, dwell_min=0),
        TimetableStop(station_code="NDL", km=120, arrival_mins=306, departure_mins=306, dwell_min=0),
    ]),
    CoaTrain(train_id="S-12009", service_number="12009", train_name="Shatabdi Express", train_type="Shatabdi", priority_class=1, direction="UP", stops=[
        TimetableStop(station_code="NDL", km=120, arrival_mins=210, departure_mins=210, dwell_min=0),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=232, departure_mins=232, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=246, departure_mins=248, dwell_min=2),
        TimetableStop(station_code="WL", km=68, arrival_mins=258, departure_mins=258, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=270, departure_mins=270, dwell_min=0),
        TimetableStop(station_code="SEC", km=40, arrival_mins=292, departure_mins=292, dwell_min=0),
    ]),
    CoaTrain(train_id="SF-12724", service_number="12724", train_name="Telangana Superfast", train_type="Superfast Express", priority_class=2, direction="UP", stops=[
        TimetableStop(station_code="NDL", km=120, arrival_mins=280, departure_mins=280, dwell_min=0),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=308, departure_mins=308, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=326, departure_mins=330, dwell_min=4),
        TimetableStop(station_code="WL", km=68, arrival_mins=342, departure_mins=342, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=358, departure_mins=358, dwell_min=0),
        TimetableStop(station_code="SEC", km=40, arrival_mins=384, departure_mins=384, dwell_min=0),
    ]),
    CoaTrain(train_id="EXP-17015", service_number="17015", train_name="Visakha Express", train_type="Express Passenger", priority_class=3, direction="DOWN", stops=[
        TimetableStop(station_code="SEC", km=40, arrival_mins=310, departure_mins=310, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=340, departure_mins=342, dwell_min=2),
        TimetableStop(station_code="WL", km=68, arrival_mins=358, departure_mins=362, dwell_min=4),
        TimetableStop(station_code="KCG", km=76, arrival_mins=378, departure_mins=382, dwell_min=4),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=410, departure_mins=412, dwell_min=2),
        TimetableStop(station_code="NDL", km=120, arrival_mins=445, departure_mins=445, dwell_min=0),
    ]),
    CoaTrain(train_id="EXP-12760", service_number="12760", train_name="Charminar Express", train_type="Superfast Express", priority_class=2, direction="UP", stops=[
        TimetableStop(station_code="NDL", km=120, arrival_mins=370, departure_mins=370, dwell_min=0),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=398, departure_mins=400, dwell_min=2),
        TimetableStop(station_code="KCG", km=76, arrival_mins=418, departure_mins=422, dwell_min=4),
        TimetableStop(station_code="WL", km=68, arrival_mins=434, departure_mins=436, dwell_min=2),
        TimetableStop(station_code="LBN", km=58, arrival_mins=452, departure_mins=452, dwell_min=0),
        TimetableStop(station_code="SEC", km=40, arrival_mins=478, departure_mins=478, dwell_min=0),
    ]),
    CoaTrain(train_id="VB-20834", service_number="20834", train_name="Vande Bharat Return", train_type="Vande Bharat", priority_class=1, direction="UP", stops=[
        TimetableStop(station_code="NDL", km=120, arrival_mins=420, departure_mins=420, dwell_min=0),
        TimetableStop(station_code="NDKD", km=94, arrival_mins=442, departure_mins=442, dwell_min=0),
        TimetableStop(station_code="KCG", km=76, arrival_mins=456, departure_mins=458, dwell_min=2),
        TimetableStop(station_code="WL", km=68, arrival_mins=468, departure_mins=468, dwell_min=0),
        TimetableStop(station_code="LBN", km=58, arrival_mins=480, departure_mins=480, dwell_min=0),
        TimetableStop(station_code="SEC", km=40, arrival_mins=502, departure_mins=502, dwell_min=0),
    ]),
]

# -------------------------------------------------------------
# SOURCE 5: GOODS FORECAST (FOIS) — 3 Freight Forecasts
# -------------------------------------------------------------
SEED_GOODS_FORECAST = [
    GoodsForecast(rake_id="FRT-G4217", cargo_type="Container (CONCOR)", origin_station="SEC (Container Depot)", destination_station="NDL Yard", direction="DOWN", target_window_start_mins=280, target_window_end_mins=410, speed_kmph=55, loop_line_stabling_allowed=True, source_system="FOIS (Freight Operations Information System)"),
    GoodsForecast(rake_id="FRT-CL8902", cargo_type="Coal (NTPC)", origin_station="WL Siding", destination_station="SEC Thermal", direction="UP", target_window_start_mins=110, target_window_end_mins=220, speed_kmph=45, loop_line_stabling_allowed=True, source_system="FOIS (Freight Operations Information System)"),
    GoodsForecast(rake_id="FRT-ST5511", cargo_type="Steel (SAIL)", origin_station="NDKD Yard", destination_station="NDL Main", direction="DOWN", target_window_start_mins=360, target_window_end_mins=450, speed_kmph=50, loop_line_stabling_allowed=False, source_system="FOIS (Freight Operations Information System)"),
]

# -------------------------------------------------------------
# SOURCE 6: BLOCK CORRIDORS (BDMS Sections) — 6 Available Sections
# -------------------------------------------------------------
SEED_BLOCK_CORRIDORS = [
    BlockCorridor(section_id="SEC-NDL-BLK-01", name="SEC - KZJ Section", km_start=0, km_end=32, lines=["UP", "DOWN"], crossover_km=[12, 24], traction_feeder_post="FP-SEC-01", station_interlockings=["SEC", "CHZ", "BG"], max_daily_block_window_min=120, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
    BlockCorridor(section_id="SEC-NDL-BLK-02", name="KZJ - WL Section", km_start=32, km_end=68, lines=["UP", "DOWN"], crossover_km=[42, 58], traction_feeder_post="FP-KZJ-02", station_interlockings=["KZJ", "LBN", "WL"], max_daily_block_window_min=140, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
    BlockCorridor(section_id="SEC-NDL-BLK-03", name="WL - NDKD Section (Flagship Corridor)", km_start=68, km_end=94, lines=["UP", "DOWN"], crossover_km=[76, 86], traction_feeder_post="FP-WL-03", station_interlockings=["WL", "KCG", "NDKD"], max_daily_block_window_min=180, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
    BlockCorridor(section_id="SEC-NDL-BLK-04", name="NDKD - NDL Section", km_start=94, km_end=128, lines=["UP", "DOWN"], crossover_km=[108, 120], traction_feeder_post="FP-NDL-04", station_interlockings=["NDKD", "GID", "NDL"], max_daily_block_window_min=150, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
    BlockCorridor(section_id="SEC-NDL-BLK-05", name="KCG Crossover Interlocking Area", km_start=74, km_end=78, lines=["UP", "DOWN"], crossover_km=[75.8, 76.4], traction_feeder_post="FP-WL-03", station_interlockings=["KCG"], max_daily_block_window_min=90, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
    BlockCorridor(section_id="SEC-NDL-BLK-06", name="WL Yard & Goods Loop Section", km_start=66, km_end=70, lines=["UP", "DOWN"], crossover_km=[68.2], traction_feeder_post="FP-KZJ-02", station_interlockings=["WL"], max_daily_block_window_min=110, nominal_isolation_min=10, nominal_earthing_min=10, nominal_transit_min=5, nominal_restoration_min=5),
]

# -------------------------------------------------------------
# ALIASES FOR COMPATIBILITY
# -------------------------------------------------------------
TMS_DEFECTS_SEED = SEED_TMS_DEFECTS
SMMS_WORK_SEED = SEED_SMMS_WORK
TDMS_WORK_SEED = SEED_TDMS_WORK
COA_TIMETABLE_SEED = SEED_COA_TRAINS
GOODS_FORECASTS_SEED = SEED_GOODS_FORECAST
BLOCK_CORRIDORS_SEED = SEED_BLOCK_CORRIDORS


