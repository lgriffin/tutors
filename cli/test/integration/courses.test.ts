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
 * THE GOLD STANDARD: This is our most comprehensive course test.
 * 
 * What it tests:
 * - Complete HTML generation from markdown source
 * - All learning object types (labs, talks, notes, archives, web, GitHub)
 * - Panel elements (panel-video, panel-note, panel-talk)
 * - Topic organization and navigation
 * - Asset copying (images, PDFs, archives)
 * - Side units and hidden topics
 * 
 * Why it matters:
 * If this test passes, the generator can handle any real-world course.
 * This course is from tutors-sdk/tutors-reference-course - the authoritative example.
 * 
 * What it validates:
 * - index.html exists and is well-formed
 * - All course content is generated
 * - Directory structure is correct
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
 * Tests JSON generation for the dynamic Tutors reader.
 * 
 * What it tests:
 * - Complete JSON generation from markdown
 * - Complex nested structure (topics within topics)
 * - Unit hierarchy (units, side units)
 * - Metadata extraction (properties.yaml)
 * - Learning object serialization
 * 
 * Why it matters:
 * The dynamic Tutors reader (web app) consumes this JSON.
 * If this fails, online courses won't load correctly.
 * 
 * What it validates:
 * - tutors.json exists and is valid JSON
 * - Course structure is properly nested
 * - All LOs are included with correct types
 * 
 * Note: Sanitizers disabled due to async file operations in generator
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
 * Tests HTML generation with the most complex structure.
 * 
 * What it tests:
 * - Deeply nested topics (topics within units within topics)
 * - Multi-level units (unit-1, unit-2, side-unit)
 * - Complex navigation generation
 * - Vento template rendering
 * - Asset copying at all levels
 * 
 * Why it matters:
 * This tests the MOST complex course structure we support.
 * If this passes, simpler courses will definitely work.
 * 
 * What it validates:
 * - All nested index.html files are created
 * - Navigation links are correct
 * - Vento templates are applied properly
 * - Assets are copied to all subdirectories
 * 
 * Note: This is the stress test for the generator's structure handling
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
 * Test: Linear course structure with nesting
 * 
 * Tests course ORGANIZATION, not full content.
 * 
 * What it tests:
 * - Basic structure generation (folders, index files)
 * - Topic organization in linear sequence
 * - Unit hierarchy (main units, side units)
 * - Nested topic support (topics within units)
 * 
 * Why it matters:
 * Structure tests are faster than full comparison tests.
 * They verify organization without pixel-perfect HTML matching.
 * This is useful for quick validation during development.
 * 
 * What it validates:
 * - Course directory exists with index.html
 * - All topics have their folders
 * - Hierarchy is maintained (no orphaned content)
 * 
 * Note: This is a "smoke test" for structure - fast and reliable
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
 * Test: Course with all LO types
 * 
 * Structure test focused on learning object diversity.
 * 
 * What it tests:
 * - Support for ALL learning object types:
 *   * Labs (with steps, archives)
 *   * Talks (with PDFs, videos)
 *   * Notes (with images, markdown)
 *   * Archives (ZIP files)
 *   * Web links (external resources)
 *   * GitHub repos (code examples)
 *   * Panel elements (featured content)
 * - Mixed content organization
 * - Side units for supplementary materials
 * 
 * Why it matters:
 * Different LO types have different file requirements.
 * This ensures the generator handles all variations.
 * 
 * What it validates:
 * - All LO types generate correct folders
 * - Each type's specific files are present
 * - No LO type is missed or broken
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

