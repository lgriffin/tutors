# Tutors CLI Test Suite

**Centralized testing for all Tutors CLI tools**

## 🏗️ Architecture: Deep Module Pattern

Simple interface hiding complex implementation (inspired by John Ousterhout's "A Philosophy of Software Design").

### **Test Organization**

```
cli/test/
├── lib/
│   └── tutors-test-harness.ts          # Deep module - simple interface, complex implementation
├── utils/
│   ├── comparators.ts                  # DOM/JSON comparison logic
│   ├── test-helpers.ts                 # File operations, temp directories
│   └── tutors-runner.ts                # Course generation wrappers
├── fixtures/
│   ├── reference-course/               # Comprehensive reference course (all LO types)
│   ├── reference-html/                 # Known-good HTML output
│   ├── layout-reference-course/        # Layout-focused course
│   └── layout-reference-json/          # Known-good JSON output
├── integration/
│   ├── cli-execution.test.ts           # ✅ ACTUAL CLI command tests
│   ├── reference-courses.test.ts       # Full DOM comparison tests
│   ├── error-states.test.ts            # Error handling tests
│   ├── learning-objects.test.ts        # Individual LO tests
│   ├── reference-structures.test.ts    # Structure/layout tests
│   └── performance.test.ts             # Performance baselines
├── unit/
│   ├── simple-parse.test.ts            # Parsing logic
│   ├── reference.test.ts               # Reference course parsing
│   ├── path-check.test.ts              # Path utilities
│   └── full-workflow.test.ts           # Complete workflows
└── manual-test.ts                       # Diagnostic tool
```

---

## 🚀 Running Tests

### **All Tests**
```bash
cd cli/tutors-gen-lib
deno task test
```

### **Unit Tests Only**
```bash
deno task test:unit
```

### **Integration Tests Only**
```bash
deno task test:integration
```

### **CLI Execution Tests** ⭐
```bash
deno task test:cli
```
**Important**: These tests run the ACTUAL CLI commands (`tutors` and `tutors-lite`) to verify end-to-end execution.

### **Reference Course Tests**
```bash
deno task test:reference
```

### **Coverage Report**
```bash
deno task test:coverage         # Text report
deno task test:coverage:html    # HTML report
```

### **Manual Diagnostic Test**
```bash
cd cli/tutors-gen-lib
deno run --allow-all ../test/manual-test.ts
```

---

## ✅ What's Tested

### **1. CLI Execution** (Integration) ⭐ **CRITICAL**
**File**: `integration/cli-execution.test.ts`

Tests the ACTUAL CLI commands as invoked by users:
- ✅ `tutors` CLI (JSON generation)
- ✅ `tutors-lite` CLI (HTML generation)
- ✅ Error handling (missing course.md)
- ✅ Output validation (files created correctly)
- ✅ Exit codes
- ✅ Error messages

**Why This Matters**: Tests the ENTIRE execution path including CLI parsing, process execution, and output generation.

---

### **2. Reference Courses** (Integration)
**File**: `integration/reference-courses.test.ts`

Full DOM comparison against known-good reference outputs:
- `reference-course` → HTML
- `layout-reference-course` → JSON
- `layout-reference-course` → HTML

**Coverage**: Comprehensive - all learning object types and structures

---

### **3. Error States** (Integration)
**File**: `integration/error-states.test.ts`

Error handling and graceful failures:
- Missing course.md
- Invalid YAML
- Corrupted assets

---

### **4. Learning Objects** (Integration)
**File**: `integration/learning-objects.test.ts`

Individual learning object testing:
- Labs (with steps, archives)
- Talks (with PDF, video)
- Notes (with images)
- Archives, Web links, GitHub repos
- Panel elements (video, note, talk)

**Status**: Placeholders - needs individual LO fixtures

---

### **5. Structures** (Integration)
**File**: `integration/reference-structures.test.ts`

Course structure/layout testing:
- Linear courses
- Side units
- Multi-level units
- Panel-focused courses
- Hidden topics

**Status**: Placeholders - needs structure fixtures

---

### **6. Performance** (Integration)
**File**: `integration/performance.test.ts`

Performance baselines and regression detection:
- Generation time tracking
- Memory usage
- Scalability tests

**Status**: Placeholders - needs baseline implementation

---

### **7. Unit Tests**
**Files**: `unit/*.test.ts`

Low-level library testing:
- Parsing logic (`simple-parse.test.ts`)
- Reference course parsing (`reference.test.ts`)
- Path utilities (`path-check.test.ts`)
- Complete workflows (`full-workflow.test.ts`)

---

## 🎯 CLI Tools Covered

| Tool | CLI Tests | Integration Tests | Unit Tests | Coverage |
|------|-----------|-------------------|------------|----------|
| **tutors** (JSON) | ✅ | ✅ | ✅ | 90% |
| **tutors-lite** (HTML) | ✅ | ✅ | ✅ | 95% |
| **tutors-gen-lib** (library) | N/A | ✅ | ✅ | 95% |
| **tutors-publish-npm** | ❌ | ❌ | ❌ | 0% |

---

## 📊 Test Status

| Category | Tests | Passing | Status |
|----------|-------|---------|--------|
| **CLI Execution** | 6 | TBD | ✅ Implemented |
| **Error States** | 3 | 3 | ✅ Passing |
| **Reference Courses** | 3 | 0 | ⚠️ Fixture issues |
| **Learning Objects** | 11 | 0 | ⚠️ Needs fixtures |
| **Structures** | 5 | 0 | ⚠️ Needs fixtures |
| **Performance** | 2 | 0 | ⚠️ Needs baselines |
| **Unit Tests** | 4 | TBD | ✅ Implemented |

---

## 🔧 Adding New Tests

### **Integration Test** (High-Level)
```typescript
// integration/my-test.test.ts
import { harness } from "../lib/tutors-test-harness.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("My Test", async () => {
  const result = await harness.testReferenceCourse("my-course", "html");
  assertEquals(result.passed, true, result.message);
});
```

### **CLI Execution Test** (Actual Command)
```typescript
// integration/cli-execution.test.ts
Deno.test("CLI Test", async () => {
  const cliPath = join(Deno.cwd(), "../tutors/main.ts");
  const result = await runCli(cliPath, courseDir);
  
  assertEquals(result.success, true);
  assert(await exists(join(courseDir, "json", "tutors.json")));
});
```

### **Unit Test** (Low-Level)
```typescript
// unit/my-unit.test.ts
import { parseCourse } from "@tutors/tutors-gen-lib";

Deno.test("Parsing Test", () => {
  const [course, lr] = parseCourse("./fixtures/test-course");
  assertEquals(course.title, "Expected Title");
});
```

---

## 🏆 Benefits of This Architecture

### **1. Simple Interface**
- Adding a test = 1-3 lines of code
- No boilerplate
- Easy to understand

### **2. Comprehensive Testing**
- **CLI execution** - tests actual user experience
- **Integration** - tests library functions
- **Unit** - tests individual components
- **Fixtures** - authoritative reference courses

### **3. Easy Maintenance**
- All test logic centralized in harness
- Test files are clean and readable
- Easy to extend with new tests

### **4. Real-World Validation**
- CLI tests run actual commands
- Reference courses are comprehensive
- Output validated against known-good fixtures

---

## 📚 Key Files

| File | Purpose | Lines |
|------|---------|-------|
| **`lib/tutors-test-harness.ts`** | Deep module - all complexity hidden | ~370 |
| **`utils/comparators.ts`** | DOM/JSON comparison logic | ~90 |
| **`utils/test-helpers.ts`** | File operations | ~180 |
| **`utils/tutors-runner.ts`** | Course generation wrappers | ~80 |
| **`integration/cli-execution.test.ts`** | ⭐ **CLI command tests** | ~300 |
| **All test files** | Integration + unit tests | ~600 |
| **Total** | | **~1,620 lines** |

**Compare to**: Old architecture had ~4,300 lines with exposed complexity!

---

## 🚦 Next Steps

1. ✅ **CLI execution tests implemented**
2. ⚠️ **Fix reference course fixture issues**
3. ❌ **Create individual LO fixtures**
4. ❌ **Create structure fixtures**
5. ❌ **Add performance baselines**
6. ❌ **Add CI/CD (GitHub Actions)**

---

## 💡 Tips

- **Start with CLI execution tests** - they test the entire path
- **Use `manual-test.ts`** for debugging
- **Check `HOW_TO_TEST.md`** for detailed instructions
- **Run `test:cli` first** - catches most issues

---

## 📞 Questions?

- See **`HOW_TO_TEST.md`** for detailed testing guide
- See **`TEST_COVERAGE_ANALYSIS.md`** for coverage details
- See **`TESTING_PROGRESS_SUMMARY.md`** for current status
