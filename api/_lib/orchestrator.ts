import { createOrchestratorFromEnv } from '../../packages/orchestrator/src/index';

// Singleton orchestrator instance for all functions in this region/runtime
let orchestratorSingleton: ReturnType<typeof createOrchestratorFromEnv> | null = null;

export function getOrchestrator() {
  if (!orchestratorSingleton) {
    orchestratorSingleton = createOrchestratorFromEnv();
  }
  return orchestratorSingleton;
}
