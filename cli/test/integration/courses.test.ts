/**
 * Course & Structure Tests
 * 
 * Tests both reference courses (with known-good output) and course structures.
 * 
 * Reference Courses:
 * - Full generation + validation against authoritative reference output
 * - Tests HTML and JSON generation
 * - Uses actual courses from tutors-sdk/tutors-reference-course
 * 
 * Structure Tests:
 * - Focus on course layout (topics, units, side units)
 * - Validates organization without pixel-perfect comparison
 * - Tests "shell courses" for layout patterns
 * 
 * Uses the deep module harness - each test is just one line!
 */

import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

// ============================================================================
// REFERENCE COURSES - Full validation against known-good output
// ============================================================================

/**
 * Test: reference-course → HTML
 * 
 * The primary reference course with all LO types and structures.
 * Validates against pre-generated reference HTML.
 */
Deno.test("Reference Course: reference-course (HTML)", async () => {
  const result = await harness.testReferenceCourse("reference-course", "html");
  
  if (!result.passed) {
    console.error("❌ Test failed:");
    console.error("  Message:", result.message);
    if (result.details) {
      console.error("  Details:", result.details);
    }
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
Deno.test({
  name: "Reference Course: layout-reference-course (JSON)",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const result = await harness.testReferenceCourse("layout-reference-course", "json");
    
    if (!result.passed) {
      console.error("❌ Test failed:");
      console.error("  Message:", result.message);
      if (result.details) {
        console.error("  Details:", result.details);
      }
    }
    
    assertEquals(result.passed, true, result.message);
    console.log(result.message);
  }
});

/**
 * Test: layout-reference-course → HTML
 * 
 * Same course as above, but HTML output.
 * Tests static site generation with complex nested structure.
 */
Deno.test({
  name: "Reference Course: layout-reference-course (HTML)",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const result = await harness.testReferenceCourse("layout-reference-course", "html");
    
    if (!result.passed) {
      console.error("❌ Test failed:");
      console.error("  Message:", result.message);
      if (result.details) {
        console.error("  Details:", result.details);
      }
    }
    
    assertEquals(result.passed, true, result.message);
    console.log(result.message);
  }
});

// ============================================================================
// STRUCTURE TESTS - Validate course organization patterns
// ============================================================================

/**
 * Test: Simple linear course structure
 * 
 * Course with:
 * - Multiple topics in linear order
 * - Units and side units
 * - Nested topics
 */
Deno.test("Structure: Linear with nested topics (layout-reference-course)", async () => {
  const result = await harness.testStructure("layout-reference-course");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Test: Course with diverse LO types
 * 
 * Course with:
 * - All learning object types (labs, talks, notes, etc.)
 * - Panel elements
 * - Side units for resources
 */
Deno.test("Structure: All LO types (reference-course)", async () => {
  const result = await harness.testStructure("reference-course");
  
  if (!result.passed) {
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});

/**
 * Future: Add more courses and structures
 * 
 * Reference Courses:
 * - tutors-starter-course
 * - wit-hdip-comp-sci-2024-full-stack-1
 * - Any course from tutors.dev
 * 
 * Structure Patterns:
 * - Panel-focused course (all panel elements)
 * - Hidden topics
 * - Ordering variations
 * - Multi-level nesting
 * 
 * Each is just one line:
 *   await harness.testReferenceCourse("course-name", "html");
 *   await harness.testStructure("structure-name");
 */

