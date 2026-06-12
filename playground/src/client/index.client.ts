import { runUnannotatedBenchmark } from "@shared/benchmark-no-transformer";
import { runAnnotatedBenchmark } from "@shared/benchmark-transformer";

print("=== BENCHMARK ===");
runUnannotatedBenchmark();
print("---");
runAnnotatedBenchmark();
print("=== END ===");
