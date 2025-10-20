/**
 * Reference Course Tests
 * 
 * Full DOM comparison tests against canonical reference courses.
 * These are the "gold standard" - if these pass, the generator works correctly.
 * 
 * Uses the deep module harness - each test is just one line!
 */

import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Test: reference-course → HTML
 * 
 * The primary reference course with all LO types and structures.
 * Validates against pre-generated reference HTML.
 */
Deno.test("Reference Course: reference-course (HTML)", async () => {
  const result = await harness.testReferenceCourse("reference-course", "html");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Test: layout-reference-course → JSON
 * 
 * Tests JSON generation (for dynamic Tutors reader).
 * Validates course structure, metadata, LO hierarchy.
 */
Deno.test("Reference Course: layout-reference-course (JSON)", async () => {
  const result = await harness.testReferenceCourse("layout-reference-course", "json");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Test: layout-reference-course → HTML
 * 
 * Same course as above, but HTML output.
 * Tests static site generation.
 */
Deno.test("Reference Course: layout-reference-course (HTML)", async () => {
  const result = await harness.testReferenceCourse("layout-reference-course", "html");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Future: Add more reference courses as they're created
 * 
 * Examples:
 * - tutors-starter-course
 * - wit-hdip-comp-sci-2024-full-stack-1
 * - Any course from tutors.dev
 * 
 * Each is just one line:
 *   await harness.testReferenceCourse("course-name", "html");
 */

