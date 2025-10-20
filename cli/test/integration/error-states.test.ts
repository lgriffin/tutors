/**
 * Error State Tests
 * 
 * Non-functional tests for error handling.
 * Validates that the generator fails gracefully with clear errors.
 * 
 * Tests:
 * - Missing required files (course.md, properties.yaml)
 * - Invalid content (malformed YAML, broken markdown)
 * - Corrupted assets (invalid images, broken PDFs)
 * - Edge cases (empty courses, no topics, etc.)
 */

import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Test: Missing course.md
 * 
 * Generator should fail gracefully with clear error message.
 */
Deno.test("Error State: Missing course.md", async () => {
  const result = await harness.testErrorState("missing-course-md");
  
  assertEquals(result.passed, true, "Should handle missing course.md gracefully");
  console.log(result.message);
});

/**
 * Test: Invalid YAML in properties
 * 
 * Generator should fail gracefully with clear error message.
 */
Deno.test("Error State: Invalid YAML", async () => {
  const result = await harness.testErrorState("invalid-yaml");
  
  assertEquals(result.passed, true, "Should handle invalid YAML gracefully");
  console.log(result.message);
});

/**
 * Test: Corrupted asset (image/PDF)
 * 
 * Generator should handle corrupted assets gracefully.
 * Either skip them or show placeholder.
 */
Deno.test("Error State: Corrupted asset", async () => {
  const result = await harness.testErrorState("corrupted-image");
  
  assertEquals(result.passed, true, "Should handle corrupted assets gracefully");
  console.log(result.message);
});

/**
 * Future error state tests:
 * 
 * - Missing required images (course.png, topic.png)
 * - Broken markdown links
 * - Invalid file names (special characters)
 * - Circular references
 * - Extremely large files
 * - Invalid video IDs
 * - Broken GitHub repo links
 * 
 * Each is just one line:
 *   await harness.testErrorState("error-scenario");
 */

