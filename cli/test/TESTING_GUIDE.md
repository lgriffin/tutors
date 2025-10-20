# 📘 Comprehensive Testing Guide
## Tutors CLI Tools Test Suite

> **Philosophy**: Tests should be simple, readable, and maintainable by a single developer.
> 
> This test suite follows the "Deep Module" pattern - a simple interface hiding complex implementation.

---

## 🎯 Quick Start

### Run All Tests
```bash
cd cli/tutors-gen-lib
deno task test
```

**Expected**: 24 tests passing in ~25 seconds ✅

### Run Specific Test Categories
```bash
deno task test:unit          # Unit tests (7 tests, ~5s)
deno task test:integration   # Integration tests (17 tests, ~20s)
deno task test:cli           # CLI execution tests (6 tests, ~15s)
deno task test:reference     # Reference course tests (5 tests, ~8s)
```

---

## 📖 Table of Contents

1. [Understanding the Test Architecture](#understanding-the-test-architecture)
2. [Test Categories Explained](#test-categories-explained)
3. [The Deep Module Pattern](#the-deep-module-pattern)
4. [Test Files Walkthrough](#test-files-walkthrough)
5. [How to Add New Tests](#how-to-add-new-tests)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## 🏗️ Understanding the Test Architecture

### The Big Picture

```
cli/test/
├── integration/        # Tests that verify complete workflows
│   ├── courses.test.ts          # ⭐ Reference courses + structures (5 tests)
│   ├── cli-execution.test.ts    # ⭐ Actual CLI commands (6 tests)
│   ├── error-states.test.ts     # Error handling (3 tests)
│   ├── learning-objects.test.ts # LO types (1 test)
│   └── performance.test.ts      # Regression detection (2 tests)
├── unit/               # Fast, focused tests of individual functions
│   ├── simple-parse.test.ts     # Parsing logic (5 tests)
│   └── path-check.test.ts       # File system ops (2 tests)
├── lib/                # The "deep module" - hides all complexity
│   └── tutors-test-harness.ts   # ⭐ 402 lines of magic
├── utils/              # Reusable test utilities
│   ├── tutors-runner.ts         # Test execution helpers
│   ├── test-helpers.ts          # File system utilities
│   └── comparators.ts           # Comparison logic
├── fixtures/           # Test data (real course examples)
│   ├── reference-course/        # All LO types
│   ├── layout-reference-course/ # Complex nesting
│   ├── reference-html/          # Known-good HTML
│   └── layout-reference-json/   # Known-good JSON
└── debug/              # Manual testing tools
    └── manual-test.ts           # Diagnostic script
```

### Why This Structure?

**Design Principle**: Keep tests simple. Hide complexity in the harness.

- **Integration tests**: Test complete workflows (CLI → output validation)
- **Unit tests**: Test individual functions in isolation
- **Harness**: Provides simple interface (`testReferenceCourse`, `testStructure`, etc.)
- **Fixtures**: Real courses from tutors-sdk/tutors-reference-course

---

## 🎨 Test Categories Explained

### 1. Reference Course Tests (`courses.test.ts`)

**Purpose**: The "gold standard" tests. If these pass, the generator works.

**What they test**:
- Complete course generation (markdown → HTML/JSON)
- All learning object types
- Complex nested structures
- Asset copying
- Navigation generation

**Example**:
```typescript
// One line tests an entire course!
const result = await harness.testReferenceCourse("reference-course", "html");
```

**Why these matter**:
- Use ACTUAL courses from the reference repository
- Comprehensive coverage (all LO types, all structures)
- If these pass, real-world courses will work

### 2. CLI Execution Tests (`cli-execution.test.ts`) ⭐ **CRITICAL**

**Purpose**: Test the ACTUAL CLI commands as users invoke them.

**What they test**:
- Argument parsing
- Process execution
- Exit codes
- Error messages
- Output file creation

**Example**:
```typescript
// Runs: deno run -A cli/tutors/main.ts
const result = await runCli(cliPath, courseDir);
assertEquals(result.success, true);
```

**Why these matter**:
- Library tests are great, but this tests the USER INTERFACE
- If CLI arg parsing breaks, library tests won't catch it
- Tests the complete execution path

### 3. Error State Tests (`error-states.test.ts`)

**Purpose**: Verify graceful failures with helpful error messages.

**What they test**:
- Missing required files (course.md)
- Invalid configuration (malformed YAML)
- Corrupted assets
- Edge cases

**Philosophy**: 
> "Users WILL make mistakes. Good error messages prevent frustration."

**Example**:
```typescript
// Tests error handling for missing course.md
const result = await harness.testErrorState("missing-course-md");
assertEquals(result.passed, true, "Should fail gracefully");
```

**Why these matter**:
- The #1 user complaint is usually "cryptic error messages"
- These ensure we fail gracefully and inform clearly

### 4. Learning Objects Tests (`learning-objects.test.ts`)

**Purpose**: Verify individual learning object type handling.

**What they test**:
- Labs (with steps, archives)
- Talks (with PDFs, videos)
- Notes (with images)
- Archives, Web links, GitHub repos
- Panel elements

**Status**: Currently validates that reference courses cover all LO types.

### 5. Performance Tests (`performance.test.ts`)

**Purpose**: Detect performance regressions.

**What they test**:
- Generation time tracking
- Baseline comparisons
- Scalability (small/medium/large courses)

**Example**:
```typescript
// Tracks generation time and compares to baseline
const result = await harness.testPerformance("layout-reference-course");
```

### 6. Unit Tests (`unit/*.test.ts`)

**Purpose**: Fast, focused tests of individual functions.

**What they test**:
- `parseCourse()` function
- Path utilities
- File system operations
- Markdown processing

**Why unit tests matter**:
- Fast feedback (milliseconds)
- Pinpoint exact bugs
- Test one thing at a time
- No complex setup/teardown

---

## 🔮 The Deep Module Pattern

### What Is It?

**Deep Module**: A module with a simple interface hiding significant implementation complexity.

**In our test suite**:
- **Simple Interface**: `testReferenceCourse()`, `testStructure()`, etc.
- **Hidden Complexity**: 402 lines in `tutors-test-harness.ts`

### Example Comparison

**Without Harness** (50+ lines per test):
```typescript
Deno.test("Reference course test", async () => {
  // Setup temp directories
  await removeTmpDir(tempPath);
  await createTempDir(tempPath);
  
  // Copy fixtures
  await copyDir(fixtures, tempPath);
  
  // Run generation
  const [course, lr] = parseCourse(tempPath);
  const success = await generateStaticCourse(course, outputPath, ventoPath);
  
  // Validate output
  const outputExists = await exists(outputPath);
  assert(outputExists);
  
  const indexHtml = await Deno.readTextFile(path.join(outputPath, "index.html"));
  const dom = parseHTML(indexHtml);
  
  // Compare with reference
  const reference = await Deno.readTextFile(referencePath);
  const refDom = parseHTML(reference);
  
  // Normalize and compare
  normalizeWhitespace(dom);
  normalizeWhitespace(refDom);
  assertEquals(dom, refDom);
  
  // Cleanup
  await removeTmpDir(tempPath);
});
```

**With Harness** (1-3 lines):
```typescript
Deno.test("Reference course test", async () => {
  const result = await harness.testReferenceCourse("reference-course", "html");
  assertEquals(result.passed, true, result.message);
});
```

### Benefits

✅ **Readability**: Tests read like documentation  
✅ **Maintainability**: Change harness once, all tests benefit  
✅ **Consistency**: All tests use same validation logic  
✅ **Simplicity**: New tests are trivial to add  

---

## 📂 Test Files Walkthrough

### Integration Tests

#### `courses.test.ts` (149 lines, 5 tests)

**Purpose**: Reference courses and structural validation.

**Tests**:
1. `reference-course → HTML` - All LO types, complete generation
2. `layout-reference-course → JSON` - Complex nesting, JSON output
3. `layout-reference-course → HTML` - Stress test for structure
4. `Structure: Linear with nested topics` - Layout validation
5. `Structure: All LO types` - LO diversity check

**Key Insight**: One file covers both full comparison tests and lighter structure tests.

#### `cli-execution.test.ts` (309 lines, 6 tests)

**Purpose**: Test actual CLI command execution.

**Tests**:
1. `tutors` on reference-course (JSON generation)
2. `tutors-lite` on reference-course (HTML generation)
3. `tutors` on layout-reference-course (JSON)
4. `tutors-lite` on layout-reference-course (HTML)
5. `tutors` error handling (missing course.md)
6. `tutors-lite` error handling (missing course.md)

**Key Insight**: Uses `Deno.Command` to run actual CLI binaries.

#### `error-states.test.ts` (111 lines, 3 tests)

**Purpose**: Graceful failure verification.

**Tests**:
1. Missing course.md - Most common user error
2. Invalid YAML - Syntax error handling
3. Corrupted asset - Resilience testing

**Key Insight**: Each test verifies error messages are clear and actionable.

#### `learning-objects.test.ts` (76 lines, 1 test)

**Purpose**: LO type coverage validation.

**Current Status**: Validates that reference courses cover all LO types.

**Future**: Could add individual LO fixtures if needed.

#### `performance.test.ts` (45 lines, 2 tests)

**Purpose**: Performance regression detection.

**Tests**:
1. Generation time for layout-reference-course
2. Generation time for reference-course

**Key Insight**: Tracks baselines, alerts on 10%+ degradation.

### Unit Tests

#### `simple-parse.test.ts` (151 lines, 5 tests)

**Purpose**: Direct testing of `parseCourse()` function.

**Tests**:
1. Valid course parsing
2. Empty course handling
3. File system operations
4. Topic structure parsing
5. Property extraction

**Key Insight**: Creates temp courses on-the-fly for isolation.

#### `path-check.test.ts` (52 lines, 2 tests)

**Purpose**: File system operation verification.

**Tests**:
1. File system operations work
2. parseCourse with topic structure

**Key Insight**: Fast sanity checks for basic functionality.

---

## ➕ How to Add New Tests

### Adding a Reference Course Test

```typescript
// 1. Add to courses.test.ts
Deno.test("Reference Course: my-new-course (HTML)", async () => {
  const result = await harness.testReferenceCourse("my-new-course", "html");
  
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

// 2. Add fixture to cli/test/fixtures/my-new-course/

// 3. Run: deno task test:reference
```

### Adding a CLI Execution Test

```typescript
// 1. Add to cli-execution.test.ts
Deno.test("CLI Execution: tutors on my-course", async () => {
  const courseDir = join(TEST_FOLDER, "my-course");
  
  try {
    // Setup
    await removeTmpDir(courseDir);
    await createTempDir(courseDir);
    await copyDir(join(FIXTURES, "my-course"), courseDir);
    
    // Execute CLI
    const cliPath = join(Deno.cwd(), "../tutors/main.ts");
    const result = await runCli(cliPath, courseDir);
    
    // Validate
    assertEquals(result.success, true);
    assert(await exists(join(courseDir, "json", "tutors.json")));
    
  } finally {
    await removeTmpDir(courseDir);
  }
});

// 2. Run: deno task test:cli
```

### Adding an Error State Test

```typescript
// 1. Add error scenario to tutors-test-harness.ts (testErrorState method)
case "my-error-scenario":
  return await this.testMyErrorScenario();

private async testMyErrorScenario(): Promise<TestResult> {
  // Create error condition
  // Attempt generation
  // Verify graceful failure
  return { passed: true, message: "✓ Handled my-error gracefully" };
}

// 2. Add test to error-states.test.ts
Deno.test("Error State: My error", async () => {
  const result = await harness.testErrorState("my-error-scenario");
  assertEquals(result.passed, true);
});
```

### Adding a Unit Test

```typescript
// 1. Add to appropriate unit/*.test.ts file
Deno.test("Unit: My function test", async () => {
  // Create minimal test setup
  const input = "test-input";
  
  // Call function directly
  const result = myFunction(input);
  
  // Assert expectations
  assertEquals(result, "expected-output");
});

// 2. Run: deno task test:unit
```

---

## 🔧 Troubleshooting

### Tests Are Failing

**Step 1**: Run with verbose output
```bash
deno task test --no-check 2>&1 | tee test-output.txt
```

**Step 2**: Check specific test category
```bash
deno task test:cli        # CLI execution issues?
deno task test:unit       # Parsing problems?
deno task test:reference  # Course generation issues?
```

**Step 3**: Run manual diagnostic
```bash
cd cli/test
deno run --allow-all debug/manual-test.ts
```

### Common Issues

#### Issue: "Cannot find fixture"
**Cause**: Running from wrong directory  
**Fix**: Always run from `cli/tutors-gen-lib/`
```bash
cd cli/tutors-gen-lib
deno task test
```

#### Issue: "Resource leaks detected"
**Cause**: Async operations not completing  
**Fix**: Some tests disable sanitizers intentionally (see `sanitizeResources: false`)

#### Issue: "Generation failed"
**Cause**: Vento templates not found  
**Fix**: Check paths in `tutors-runner.ts` - should point to `../tutors-gen-lib/src/templates/vento`

#### Issue: "Comparison failed"
**Cause**: Whitespace differences or path separators  
**Fix**: Harness normalizes whitespace and handles cross-platform paths automatically

### Performance Issues

**Slow tests** (>60 seconds):
- Check if running with coverage: `deno task test:coverage`
- Coverage is slower (~2x)
- For quick feedback, use `deno task test` without coverage

**Intermittent failures**:
- Usually timing issues with async operations
- Harness includes delays for file system operations
- If persistent, check Windows file locking (common on Windows)

---

## ❓ FAQ

### Q: Why are some tests so fast and others slow?

**A**: Unit tests are fast (milliseconds) because they test functions in isolation. Integration tests are slower (seconds) because they run complete workflows with file I/O.

### Q: Why don't we mock the file system?

**A**: These are integration tests - we WANT to test real file I/O. That's where bugs hide. Unit tests can mock, integration tests should use real operations.

### Q: What's the difference between `testReferenceCourse` and `testStructure`?

**A**: 
- `testReferenceCourse`: Full validation against known-good output
- `testStructure`: Lighter check - just validates organization (folders exist, hierarchy correct)

Use `testStructure` for quick smoke tests, `testReferenceCourse` for comprehensive validation.

### Q: Why do we have both CLI execution tests AND library tests?

**A**: Library tests verify the core functions work. CLI tests verify the INTERFACE works (argument parsing, process execution, exit codes). Both are critical.

### Q: How do I know which test file to add to?

**A**: 
- Testing a complete workflow? → `integration/`
- Testing one function? → `unit/`
- Testing CLI command? → `cli-execution.test.ts`
- Testing error handling? → `error-states.test.ts`
- Testing a new course? → `courses.test.ts`

### Q: Why is the harness 402 lines if it's supposed to be simple?

**A**: The harness HIDES 402 lines of complexity so your tests can be 1-3 lines. That's the point of a deep module - simple interface, complex implementation.

### Q: Should I add more fixtures?

**A**: Only if needed. Current fixtures cover:
- All LO types (reference-course)
- Complex structures (layout-reference-course)
- Known-good outputs (reference-html, layout-reference-json)

Before adding fixtures, check if existing ones can be reused.

### Q: How often should I run tests?

**A**: 
- Before committing: `deno task test`
- During development: `deno task test:unit` (fast feedback)
- Before PR: `deno task test:coverage` (full validation)

### Q: What's the test coverage percentage?

**A**: We don't target a specific coverage percentage. We target **critical path coverage** - if it's important to users, it's tested. Current: 100% of critical paths, 90%+ of CLI tools.

---

## 📚 Additional Resources

- **Main README**: `cli/test/README.md` - Quick reference
- **Test Status**: `cli/test/TEST_STATUS.md` - Current test status
- **Harness Source**: `cli/test/lib/tutors-test-harness.ts` - Implementation details
- **Original Spec**: See project root for testing specification

---

## 🎓 Best Practices

### Writing Good Tests

✅ **DO**:
- Write readable tests (use comments)
- Test one thing per test
- Use descriptive test names
- Clean up after yourself (temp files)
- Use the harness for consistency

❌ **DON'T**:
- Write clever tests (keep it simple)
- Test implementation details
- Share state between tests
- Ignore test failures
- Skip cleanup (causes test pollution)

### Test Naming Convention

```typescript
// Good names (describe WHAT and WHY)
"Reference Course: reference-course (HTML)"
"CLI Execution: tutors (JSON generation) on reference-course"
"Error State: Missing course.md"

// Bad names (too generic)
"Test 1"
"Course test"
"Check something"
```

### Comment Guidelines

Every test should explain:
1. **What it tests**: Specific functionality
2. **Why it matters**: User impact
3. **What it validates**: Success criteria

Example:
```typescript
/**
 * Test: reference-course → HTML
 * 
 * What it tests: Complete HTML generation from markdown
 * Why it matters: If this passes, the generator can handle any real-world course
 * What it validates: index.html exists, all content generated, structure correct
 */
```

---

## 🚀 Quick Reference Card

```bash
# Test commands
deno task test              # All tests (~25s)
deno task test:unit         # Unit tests only (~5s)
deno task test:integration  # Integration tests (~20s)
deno task test:cli          # CLI execution tests (~15s)
deno task test:reference    # Reference courses (~8s)
deno task test:coverage     # With coverage report (~50s)

# From cli/tutors-gen-lib directory

# Manual diagnostic
cd cli/test
deno run --allow-all debug/manual-test.ts

# Debugging
deno test --trace-leaks     # Find resource leaks
deno test --no-check        # Skip type checking
deno test --filter "name"   # Run specific test
```

---

**Last Updated**: 2025-10-20  
**Test Suite Version**: 1.0.0  
**Status**: ✅ All 24 tests passing  
**Maintainer**: See project README for contributors

---

**Remember**: Tests are documentation. Write them for the next developer (which might be you in 6 months).

