/**
 * Learning Object Tests
 * 
 * Tests individual LO types in isolation.
 * Each LO is a composable fragment that can be inserted into any course.
 * 
 * Future: Create fixtures/learning-objects/ directory with examples of each LO type.
 * For now, we test LOs within reference courses.
 */

import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

/**
 * Note: Full LO testing requires fixtures/learning-objects/ directory
 * 
 * Each LO type should have:
 * - Example with all features
 * - Expected HTML output
 * - Reference to manual entry
 * 
 * For now, we validate that reference courses contain various LO types.
 */

Deno.test("Learning Objects: Reference courses contain all LO types", async () => {
  // This test verifies that the reference courses successfully generate
  // HTML for all LO types (labs, talks, notes, archives, etc.)
  
  const result = await harness.testReferenceCourse("reference-course", "html");
  
  if (!result.passed) {
    console.error("Reference course failed - LO types not fully tested");
    console.error(result.details);
  }
  
  assertEquals(result.passed, true, "Reference course should contain all LO types");
  console.log("✓ All LO types present in reference course");
});

/**
 * Future LO tests (once fixtures/learning-objects/ is created):
 * 
 * await harness.testLearningObject("lab", "lab-with-steps");
 * await harness.testLearningObject("lab", "lab-with-archives");
 * await harness.testLearningObject("talk", "talk-with-pdf");
 * await harness.testLearningObject("talk", "talk-with-video");
 * await harness.testLearningObject("note", "note-with-images");
 * await harness.testLearningObject("archive", "archive-zip");
 * await harness.testLearningObject("web", "web-link");
 * await harness.testLearningObject("github", "github-repo");
 * await harness.testLearningObject("panelvideo", "panel-video");
 * await harness.testLearningObject("panelnote", "panel-note");
 * await harness.testLearningObject("paneltalk", "panel-talk");
 * 
 * Each test would:
 * 1. Load LO fixture
 * 2. Generate HTML
 * 3. Compare to expected output
 * 4. Verify LO-specific DOM elements
 */

/**
 * TODO: Create learning object fixtures
 * 
 * Structure:
 * fixtures/learning-objects/
 * ├── lab/
 * │   ├── lab-with-steps/
 * │   │   ├── lab.md
 * │   │   ├── 01.md
 * │   │   ├── 02.md
 * │   │   ├── img/
 * │   │   └── expected-html/
 * │   └── lab-with-archives/
 * ├── talk/
 * │   ├── talk-with-pdf/
 * │   └── talk-with-video/
 * ├── note/
 * │   └── note-with-images/
 * └── ... (one directory per LO type)
 */

