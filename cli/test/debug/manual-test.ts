/**
 * Manual Test - Debug Generation
 * 
 * Run this to manually test course generation and see detailed errors.
 */

import { tutorsPublishHtml } from "./utils/tutors-runner.ts";
import { exists } from "jsr:@std/fs";

console.log("🧪 Manual Test: Course Generation");
console.log("=".repeat(50));

try {
  // Test 1: Check paths
  console.log("\n📁 Checking paths...");
  console.log(`  Current directory: ${Deno.cwd()}`);
  
  const fixturePath = "./fixtures/layout-reference-course";
  const fixtureExists = await exists(fixturePath);
  console.log(`  Fixture exists: ${fixtureExists ? "✅" : "❌"} (${fixturePath})`);
  
  const ventoPath = "../tutors-gen-lib/src/templates/vento";
  const ventoExists = await exists(ventoPath);
  console.log(`  Vento templates: ${ventoExists ? "✅" : "❌"} (${ventoPath})`);
  
  if (!fixtureExists || !ventoExists) {
    console.log("\n❌ Required paths not found. Run from cli/test/");
    Deno.exit(1);
  }
  
  // Test 2: Try generation
  console.log("\n⚙️  Attempting generation...");
  console.log("  Course: layout-reference-course");
  
  const result = await tutorsPublishHtml("layout-reference-course");
  
  // Test 3: Check what was created
  console.log("\n📂 Checking generated files...");
  const tempHtmlPath = "./temp/layout-reference-course/html";
  if (await exists(tempHtmlPath)) {
    console.log(`  HTML dir exists: ✅`);
    
    // Check for vento directory
    const ventoInHtml = `${tempHtmlPath}/vento`;
    const ventoExists = await exists(ventoInHtml);
    console.log(`  Vento in HTML: ${ventoExists ? "✅" : "❌"} (${ventoInHtml})`);
    
    if (ventoExists) {
      // List what's in vento directory
      try {
        const files = [];
        for await (const entry of Deno.readDir(ventoInHtml)) {
          files.push(entry.name);
        }
        console.log(`  Vento contents: ${files.slice(0, 5).join(", ")}${files.length > 5 ? "..." : ""}`);
      } catch (e) {
        console.log(`  Error reading vento dir: ${e}`);
      }
    }
  } else {
    console.log(`  HTML dir: ❌ Not created`);
  }
  
  if (result) {
    console.log("\n✅ Generation succeeded!");
    console.log("  Output should be in: ./temp/layout-reference-course/html");
    
    // Check output
    const outputExists = await exists("./temp/layout-reference-course/html");
    console.log(`  Output directory: ${outputExists ? "✅ Found" : "❌ Not found"}`);
    
    if (outputExists) {
      const indexExists = await exists("./temp/layout-reference-course/html/index.html");
      console.log(`  index.html: ${indexExists ? "✅ Found" : "❌ Not found"}`);
    }
  } else {
    console.log("\n❌ Generation failed!");
    console.log("  The tutorsPublishHtml function returned false");
    console.log("  This suggests an error in:");
    console.log("    - parseCourse()");
    console.log("    - generateStaticCourse()");
    console.log("    - copyAssets()");
  }
  
} catch (error) {
  console.log("\n❌ Error during generation:");
  console.log(error);
  
  if (error instanceof Error) {
    console.log("\nStack trace:");
    console.log(error.stack);
  }
}

console.log("\n" + "=".repeat(50));
console.log("Manual test complete");

