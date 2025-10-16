/**
 * Reference Structure Tests
 * 
 * Tests course superstructure (layout) without full content comparison.
 * Focuses on:
 * - Topic organization
 * - Unit structure
 * - Side units
 * - Panel elements
 * - Ordering
 * 
 * These are "shell courses" - testing structure, not content.
 */

import { harness } from "./lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Test: Simple linear course structure
 * 
 * Course with:
 * - Multiple topics in linear order
 * - No side units
 * - Standard LOs (labs, talks, notes)
 */
Deno.test("Structure: Simple linear course (layout-reference-course)", async () => {
  const result = await harness.testStructure("layout-reference-course");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Test: Course with side units
 * 
 * Course with:
 * - Main topic flow
 * - Side units for additional resources
 * - Panel elements
 */
Deno.test("Structure: Course with side units (reference-course topic-02-side)", async () => {
  const result = await harness.testStructure("reference-course");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Future: Add more structure tests
 * 
 * Examples:
 * - Multi-level units (unit > sub-unit > content)
 * - Panel-focused course (all panel elements)
 * - Hidden topics
 * - Ordering variations
 * 
 * Each is just one line:
 *   await harness.testStructure("structure-name");
 */

