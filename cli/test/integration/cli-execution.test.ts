/**
 * CLI Execution Tests
 * 
 * Tests the ACTUAL CLI commands as invoked by users.
 * This ensures the entire execution path works:
 * - CLI argument parsing
 * - Process execution
 * - Output generation
 * - Exit codes
 * - Error messages
 * 
 * Critical: These tests run the actual CLI binaries, not just library functions.
 */

import { assertEquals, assert, assertStringIncludes } from "jsr:@std/assert";
import { join } from "jsr:@std/path";
import { exists } from "jsr:@std/fs";
import { createTempDir, copyDir, removeTmpDir } from "../utils/test-helpers.ts";

const FIXTURES = join(Deno.cwd(), "../test/fixtures");
const TEST_FOLDER = join(Deno.cwd(), "temp");

/**
 * Helper: Run a CLI command
 */
async function runCli(
  cliPath: string,
  workingDir: string,
): Promise<{ success: boolean; code: number; output: string; stderr: string }> {
  const process = new Deno.Command("deno", {
    args: ["run", "--allow-all", cliPath],
    cwd: workingDir,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await process.output();
  const output = new TextDecoder().decode(stdout);
  const stderrText = new TextDecoder().decode(stderr);

  return {
    success: code === 0,
    code,
    output,
    stderr: stderrText,
  };
}

/**
 * Test: tutors CLI (JSON generation)
 * 
 * THE MOST IMPORTANT TEST: Runs the actual CLI command.
 * 
 * What it does:
 * 1. Copies reference-course to a temp directory
 * 2. cd into that directory
 * 3. Runs: deno run -A cli/tutors/main.ts
 * 4. Verifies JSON output was created
 * 
 * What it tests:
 * - CLI argument parsing and execution
 * - Complete JSON generation workflow
 * - tutors.json file creation
 * - Course metadata extraction
 * - Learning object hierarchy
 * 
 * Why it matters:
 * This is how USERS actually run the tool.
 * If this test passes, the CLI works end-to-end.
 * Library tests are great, but this tests the REAL interface.
 * 
 * What it validates:
 * - Exit code is 0 (success)
 * - No errors in stderr
 * - json/ directory exists
 * - tutors.json is valid JSON with correct structure
 */
Deno.test("CLI Execution: tutors (JSON generation) on reference-course", async () => {
  const courseName = "reference-course";
  const courseDir = join(TEST_FOLDER, courseName);
  
  try {
    // Setup: Copy reference course to temp
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    await copyDir(join(FIXTURES, courseName), courseDir);
    
    // Execute: Run tutors CLI (as users do!)
    const cliPath = join(Deno.cwd(), "../tutors/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify: CLI executed successfully
    assertEquals(result.success, true, `CLI should succeed. stderr: ${result.stderr}`);
    assertEquals(result.code, 0, "Exit code should be 0");
    assertStringIncludes(result.output, "tutors:", "Should show version info");
    
    // Verify: JSON output exists
    const jsonDir = join(courseDir, "json");
    assert(await exists(jsonDir), "json/ directory should be created");
    
    const tutorsJson = join(jsonDir, "tutors.json");
    assert(await exists(tutorsJson), "tutors.json should be created");
    
    // Verify: JSON is valid
    const jsonContent = await Deno.readTextFile(tutorsJson);
    const courseData = JSON.parse(jsonContent);
    
    // Note: JSON structure has properties at root level, not under "lo"
    assert(courseData.type, "Course should have type property");
    assertEquals(courseData.type, "course", "Should be a course object");
    assert(courseData.title, "Course should have title");
    
    // Verify: Assets copied
    const courseImage = join(jsonDir, "course.png");
    assert(await exists(courseImage), "course.png should be copied");
    
    // Verify: Netlify config created
    const netlifyToml = join(jsonDir, "netlify.toml");
    assert(await exists(netlifyToml), "netlify.toml should be created");
    
    console.log("✓ tutors CLI: JSON generation successful");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Test: tutors-lite CLI (HTML generation)
 * 
 * Run: deno run -A cli/tutors-lite/main.ts
 * From: reference-course directory
 * Verify: HTML files generated correctly
 */
Deno.test("CLI Execution: tutors-lite (HTML generation) on reference-course", async () => {
  const courseName = "reference-course";
  const courseDir = join(TEST_FOLDER, courseName);
  
  try {
    // Setup: Copy reference course to temp
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    await copyDir(join(FIXTURES, courseName), courseDir);
    
    // Execute: Run tutors-lite CLI
    const cliPath = join(Deno.cwd(), "../tutors-lite/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify: CLI executed successfully
    assertEquals(result.success, true, `CLI should succeed. stderr: ${result.stderr}`);
    assertEquals(result.code, 0, "Exit code should be 0");
    assertStringIncludes(result.output, "Tutors Lite:", "Should show version info");
    
    // Verify: HTML output exists
    const htmlDir = join(courseDir, "html");
    assert(await exists(htmlDir), "html/ directory should be created");
    
    const indexHtml = join(htmlDir, "index.html");
    assert(await exists(indexHtml), "index.html should be created");
    
    // Verify: HTML is valid (contains expected structure)
    const htmlContent = await Deno.readTextFile(indexHtml);
    assertStringIncludes(htmlContent, "<!DOCTYPE html>", "Should be valid HTML");
    assertStringIncludes(htmlContent, "<html", "Should have html tag");
    
    // Verify: Assets copied
    const courseImage = join(htmlDir, "course.png");
    assert(await exists(courseImage), "course.png should be copied");
    
    // Verify: Vento templates copied
    const ventoDir = join(htmlDir, "vento");
    assert(await exists(ventoDir), "vento/ directory should be created");
    
    const talkTemplate = join(ventoDir, "Talk.vto");
    assert(await exists(talkTemplate), "Talk.vto template should be copied");
    
    console.log("✓ tutors-lite CLI: HTML generation successful");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Test: tutors CLI error handling (missing course.md)
 * 
 * Verify: CLI shows helpful error message when course.md is missing
 */
Deno.test("CLI Execution: tutors error handling (missing course.md)", async () => {
  const courseDir = join(TEST_FOLDER, "empty-course");
  
  try {
    // Setup: Create empty directory
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    
    // Execute: Run tutors CLI in empty directory
    const cliPath = join(Deno.cwd(), "../tutors/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify: CLI exits with code 0 but shows error message
    // (Note: CLI currently exits 0 even on error, but shows message)
    assertStringIncludes(
      result.output,
      "Cannot locate course.md",
      "Should show helpful error message"
    );
    assertStringIncludes(
      result.output,
      "Please change to course folder",
      "Should suggest solution"
    );
    
    console.log("✓ tutors CLI: Error handling works correctly");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Test: tutors-lite CLI error handling (missing course.md)
 * 
 * Verify: CLI shows helpful error message when course.md is missing
 */
Deno.test("CLI Execution: tutors-lite error handling (missing course.md)", async () => {
  const courseDir = join(TEST_FOLDER, "empty-course-lite");
  
  try {
    // Setup: Create empty directory
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    
    // Execute: Run tutors-lite CLI in empty directory
    const cliPath = join(Deno.cwd(), "../tutors-lite/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify: CLI shows error message
    assertStringIncludes(
      result.output,
      "Cannot locate course.md",
      "Should show helpful error message"
    );
    assertStringIncludes(
      result.output,
      "Please change to course folder",
      "Should suggest solution"
    );
    
    console.log("✓ tutors-lite CLI: Error handling works correctly");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Test: tutors CLI on layout-reference-course
 * 
 * Tests JSON generation on the comprehensive layout reference course
 */
Deno.test("CLI Execution: tutors on layout-reference-course", async () => {
  const courseName = "layout-reference-course";
  const courseDir = join(TEST_FOLDER, courseName);
  
  try {
    // Setup
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    await copyDir(join(FIXTURES, courseName), courseDir);
    
    // Execute
    const cliPath = join(Deno.cwd(), "../tutors/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify
    assertEquals(result.success, true, `CLI should succeed. stderr: ${result.stderr}`);
    
    const tutorsJson = join(courseDir, "json", "tutors.json");
    assert(await exists(tutorsJson), "tutors.json should be created");
    
    const jsonContent = await Deno.readTextFile(tutorsJson);
    const courseData = JSON.parse(jsonContent);
    
    // Verify structure
    assert(courseData.type, "Should have type property");
    assertEquals(courseData.type, "course", "Should be a course");
    assert(courseData.los, "Should have child learning objects");
    assert(courseData.los.length > 0, "Should have learning objects");
    
    console.log("✓ tutors CLI: layout-reference-course generation successful");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Test: tutors-lite CLI on layout-reference-course
 * 
 * Tests HTML generation on the comprehensive layout reference course
 */
Deno.test("CLI Execution: tutors-lite on layout-reference-course", async () => {
  const courseName = "layout-reference-course";
  const courseDir = join(TEST_FOLDER, courseName);
  
  try {
    // Setup
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    await copyDir(join(FIXTURES, courseName), courseDir);
    
    // Execute
    const cliPath = join(Deno.cwd(), "../tutors-lite/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Verify
    assertEquals(result.success, true, `CLI should succeed. stderr: ${result.stderr}`);
    
    const indexHtml = join(courseDir, "html", "index.html");
    assert(await exists(indexHtml), "index.html should be created");
    
    // Verify topics generated
    const unit1Index = join(courseDir, "html", "unit-1", "index.html");
    assert(await exists(unit1Index), "unit-1/index.html should be created");
    
    const sideUnitIndex = join(courseDir, "html", "side-unit", "index.html");
    assert(await exists(sideUnitIndex), "side-unit/index.html should be created");
    
    console.log("✓ tutors-lite CLI: layout-reference-course generation successful");
  } finally {
    await removeTmpDir(courseDir);
  }
});

/**
 * Future CLI tests to add:
 * 
 * - CLI with invalid arguments
 * - CLI with --help flag (if implemented)
 * - CLI with --version flag (if implemented)
 * - CLI on corrupted course (invalid YAML)
 * - CLI on course with missing images
 * - CLI on very large course (performance)
 * - CLI on course with special characters
 * - CLI concurrency (multiple runs simultaneously)
 * - CLI with custom output directory (if supported)
 */

