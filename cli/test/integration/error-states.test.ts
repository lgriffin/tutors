/**
 * Error State Tests
 * 
 * Philosophy: Software should fail gracefully and help users fix problems.
 * 
 * What we test here:
 * - Missing required files (course.md, properties.yaml)
 * - Invalid content (malformed YAML, broken markdown)
 * - Corrupted assets (invalid images, broken PDFs)
 * - Edge cases (empty courses, no topics, etc.)
 * 
 * Why this matters:
 * Users WILL make mistakes. Good error messages prevent frustration.
 * These tests ensure we don't crash silently or show cryptic errors.
 * 
 * Success criteria:
 * - No crashes or unhandled exceptions
 * - Clear error messages that explain what's wrong
 * - Actionable guidance on how to fix issues
 * 
 * Design pattern:
 * Each test uses the harness's testErrorState() which:
 * 1. Creates a specific error condition
 * 2. Runs the generator
 * 3. Verifies the error is handled gracefully
 * 4. Checks that the error message is helpful
 */

import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Test: Missing course.md
 * 
 * Most common user error: forgetting to create course.md.
 * 
 * What it tests:
 * - CLI detects missing course.md before trying to parse
 * - Error message clearly states what's wrong
 * - No crash, no stack trace, just a helpful message
 * 
 * Expected behavior:
 * "Cannot locate course.md. Please change to course folder and try again."
 * 
 * Why it matters:
 * This is probably the #1 error new users encounter.
 * A good message here saves hours of confusion.
 */
Deno.test("Error State: Missing course.md", async () => {
  const result = await harness.testErrorState("missing-course-md");
  
  assertEquals(result.passed, true, "Should handle missing course.md gracefully");
  console.log(result.message);
});

/**
 * Test: Invalid YAML in properties
 * 
 * Second common error: typo in properties.yaml.
 * 
 * What it tests:
 * - Parser doesn't crash on malformed YAML
 * - Error message points to the problematic file
 * - Line number or context is provided (if possible)
 * 
 * Example errors caught:
 * - Indentation errors
 * - Missing colons
 * - Unclosed quotes
 * - Invalid characters
 * 
 * Why it matters:
 * YAML is finicky. Users need clear guidance on syntax errors.
 */
Deno.test("Error State: Invalid YAML", async () => {
  const result = await harness.testErrorState("invalid-yaml");
  
  assertEquals(result.passed, true, "Should handle invalid YAML gracefully");
  console.log(result.message);
});

/**
 * Test: Corrupted asset (image/PDF)
 * 
 * Edge case: What if an image or PDF is corrupted?
 * 
 * What it tests:
 * - Generator doesn't crash on bad files
 * - Either skips corrupted assets or shows placeholder
 * - Warning is logged (not an error)
 * - Generation continues for valid content
 * 
 * Why it matters:
 * Files get corrupted. The generator should be resilient.
 * Don't let one bad image prevent the entire course from building.
 * 
 * Acceptable behaviors:
 * - Skip the corrupted file and warn
 * - Use a placeholder/fallback
 * - Include in output but mark as broken
 * 
 * NOT acceptable:
 * - Crash the entire generation
 * - Silent failure (no warning)
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

