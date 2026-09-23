import { Corridor, Train, TimetableMovement } from "@/types/railway";
import { MaintenanceTask } from "@/types/maintenance";
import { Block, CorridorAvailabilityWindow, PlanMetrics } from "@/types/planning";
import { PlanningScenario } from "@/types/scenario";
import { MOCK_CORRIDOR } from "@/data/mock/corridor";
import { MOCK_TRAINS } from "@/data/mock/trains";
import { MOCK_MAINTENANCE_TASKS } from "@/data/mock/tasks";
import { MOCK_BLOCKS, SILOED_BASELINE_BLOCKS, MOCK_CORRIDOR_WINDOWS } from "@/data/mock/blocks";
import { MOCK_TIMETABLE_MOVEMENTS } from "@/data/mock/timetable";
import { MOCK_INTEGRATED_METRICS, MOCK_SILOED_METRICS, MOCK_BENCHMARK_METRICS } from "@/data/mock/metrics";
import { MOCK_SCENARIOS } from "@/data/mock/scenarios";

class RailwayMockService {
  private tasks: MaintenanceTask[] = [...MOCK_MAINTENANCE_TASKS];
  private blocks: Block[] = [...MOCK_BLOCKS];
  private trains: Train[] = [...MOCK_TRAINS];
  private scenarios: PlanningScenario[] = [...MOCK_SCENARIOS];

  async getCorridor(): Promise<Corridor> {
    return Promise.resolve(MOCK_CORRIDOR);
  }

  async getTrains(): Promise<Train[]> {
    return Promise.resolve(this.trains);
  }

  async getMaintenanceTasks(filters?: {
    department?: string;
    criticality?: string;
    status?: string;
  }): Promise<MaintenanceTask[]> {
    let result = [...this.tasks];
    if (filters?.department && filters.department !== "All") {
      result = result.filter((t) => t.department === filters.department);
    }
    if (filters?.criticality && filters.criticality !== "All") {
      result = result.filter((t) => t.criticality === filters.criticality);
    }
    if (filters?.status && filters.status !== "All") {
      result = result.filter((t) => t.status === filters.status);
    }
    return Promise.resolve(result);
  }

  async getTaskById(taskId: string): Promise<MaintenanceTask | undefined> {
    return Promise.resolve(this.tasks.find((t) => t.taskId === taskId));
  }

  async addTask(task: Omit<MaintenanceTask, "taskId" | "mlRank" | "priorityScore" | "reasonCodes">): Promise<MaintenanceTask> {
    const newTask: MaintenanceTask = {
      ...task,
      taskId: `${task.department === "Engineering" ? "ENG" : task.department === "S&T" ? "ST" : "TR"}-${Math.floor(200 + Math.random() * 800)}`,
      priorityScore: 91,
      mlRank: 1,
      reasonCodes: {
        assetCriticality: "High",
        overdueDays: task.overdueDays,
        availabilityImpact: "High",
        operationalConsequence: "High",
        clusterCompatibility: "Can be clustered with Block B-014",
      },
    };
    this.tasks.unshift(newTask);
    return Promise.resolve(newTask);
  }

  async getBlocks(): Promise<Block[]> {
    return Promise.resolve(this.blocks);
  }

  async getBlockById(blockId: string): Promise<Block | undefined> {
    const block = this.blocks.find((b) => b.blockId === blockId) || SILOED_BASELINE_BLOCKS.find((b) => b.blockId === blockId);
    if (!block) return undefined;
    // Enrich with tasks
    const enrichedTasks = this.tasks.filter((t) => block.taskIds.includes(t.taskId));
    return Promise.resolve({
      ...block,
      tasks: enrichedTasks,
    });
  }

  async getSiloedBlocks(): Promise<Block[]> {
    return Promise.resolve(SILOED_BASELINE_BLOCKS);
  }

  async getCorridorWindows(): Promise<CorridorAvailabilityWindow[]> {
    return Promise.resolve(MOCK_CORRIDOR_WINDOWS);
  }

  async getTimetable(): Promise<TimetableMovement[]> {
    return Promise.resolve(MOCK_TIMETABLE_MOVEMENTS);
  }

  async getMetrics(planType: "integrated" | "siloed" | "benchmark" = "integrated"): Promise<PlanMetrics> {
    if (planType === "siloed") return Promise.resolve(MOCK_SILOED_METRICS);
    if (planType === "benchmark") return Promise.resolve(MOCK_BENCHMARK_METRICS);
    return Promise.resolve(MOCK_INTEGRATED_METRICS);
  }

  async getScenarios(): Promise<PlanningScenario[]> {
    return Promise.resolve(this.scenarios);
  }

  async runScenario(scenarioId: string): Promise<PlanningScenario | undefined> {
    const scenario = this.scenarios.find((s) => s.scenarioId === scenarioId);
    return Promise.resolve(scenario);
  }
}

export const mockRailwayService = new RailwayMockService();
