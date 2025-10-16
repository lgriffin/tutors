/**
 * Performance Tests
 * 
 * Tracks generation performance over time.
 * Prevents performance regressions.
 * 
 * Baselines are established on first run, then compared on subsequent runs.
 */

import { harness } from "./lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Test: layout-reference-course performance
 * 
 * Measures generation time for a standard reference course.
 * Should complete in reasonable time (< 5 seconds).
 */
Deno.test("Performance: layout-reference-course generation time", async () => {
  const result = await harness.testPerformance("layout-reference-course");
  
  assertEquals(result.passed, true, "Performance test should pass");
  console.log(result.message);
});

/**
 * Test: reference-course performance
 * 
 * Larger course with more content - should still be fast.
 */
Deno.test("Performance: reference-course generation time", async () => {
  const result = await harness.testPerformance("reference-course");
  
  assertEquals(result.passed, true, "Performance test should pass");
  console.log(result.message);
});

/**
 * Future performance tests:
 * 
 * - Large course (1000+ files) - should complete in < 30 seconds
 * - Many small courses - batch performance
 * - Memory usage tracking
 * - Asset copying performance
 * - JSON vs HTML generation speed comparison
 * 
 * Each is just one line:
 *   await harness.testPerformance("course-name");
 */

