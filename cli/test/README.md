# Tutors Test Suite - Deep Module Architecture

**Philosophy**: Simple interface, complex implementation hidden.

Inspired by John Ousterhout's "deep modules" concept - we provide a minimal, powerful interface that conceals significant complexity.

---

## 🎯 **Quick Start**

```bash
# Run all tests
cd cli/tutors-gen-lib
deno task test

# Run specific test category
deno test --allow-all ../../test/reference-courses.test.ts
deno test --allow-all ../../test/reference-structures.test.ts
deno test --allow-all ../../test/learning-objects.test.ts
deno test --allow-all ../../test/error-states.test.ts
deno test --allow-all ../../test/performance.test.ts
```

---

## 📁 **Architecture**

### **Deep Module Pattern**

```
Simple Public Interface (5 methods, ~800 lines of test code)
          │
          ├─ harness.testReferenceCourse(name, type)
          ├─ harness.testStructure(name)
          ├─ harness.testLearningObject(type, name)
          ├─ harness.testErrorState(scenario)
          └─ harness.testPerformance(name)
          
          ↓
          
Complex Hidden Implementation (~1000 lines in harness)
          │
          ├─ DOM comparison & normalization
          ├─ File I/O & structure building
          ├─ Reference loading & caching
          ├─ Error handling & reporting
          └─ Performance measurement & baselines
```

### **Directory Structure**

```
test/
├── lib/
│   └── tutors-test-harness.ts      # Deep module (300 lines)
├── utils/
│   ├── comparators.ts               # DOM comparison (90 lines)
│   ├── test-helpers.ts              # File operations (180 lines)
│   └── tutors-runner.ts             # CLI execution (80 lines)
├── fixtures/
│   ├── layout-reference-course/     # Full course (markdown source)
│   ├── layout-reference-json/       # Expected JSON output
│   ├── reference-course/            # Full course (markdown source)
│   ├── reference-html/              # Expected HTML output
│   ├── reference-structure/         # Future: Shell courses for layouts
│   └── learning-objects/            # Future: Individual LO examples
├── reference-courses.test.ts        # 3 tests, ~80 lines
├── reference-structures.test.ts     # 2 tests, ~60 lines
├── learning-objects.test.ts         # 1 test, ~80 lines (will grow)
├── error-states.test.ts             # 3 tests, ~80 lines
└── performance.test.ts              # 2 tests, ~50 lines

Total: ~11 tests, ~800 lines of test code, ~650 lines of harness/utils
```

---

## 🧪 **Test Categories**

### **1. Reference Courses** (`reference-courses.test.ts`)

**Purpose**: Full DOM comparison against canonical courses.

**Tests**:
- `reference-course` (HTML) - Full course with all LO types
- `layout-reference-course` (JSON) - Dynamic reader output
- `layout-reference-course` (HTML) - Static site output

**How to add**: One line per course
```typescript
await harness.testReferenceCourse("new-course-name", "html");
```

---

### **2. Reference Structures** (`reference-structures.test.ts`)

**Purpose**: Test course superstructure (layout) without full content.

**Tests**:
- Simple linear course
- Course with side units

**How to add**: One line per structure
```typescript
await harness.testStructure("structure-name");
```

---

### **3. Learning Objects** (`learning-objects.test.ts`)

**Purpose**: Test individual LO types in isolation.

**Current**: Tests that reference courses contain all LO types.

**Future**: Once `fixtures/learning-objects/` is created:
```typescript
await harness.testLearningObject("lab", "lab-with-steps");
await harness.testLearningObject("talk", "talk-with-pdf");
await harness.testLearningObject("note", "note-with-images");
// etc.
```

---

### **4. Error States** (`error-states.test.ts`)

**Purpose**: Non-functional tests for error handling.

**Tests**:
- Missing course.md
- Invalid YAML
- Corrupted assets

**How to add**: One line per scenario
```typescript
await harness.testErrorState("new-error-scenario");
```

---

### **5. Performance** (`performance.test.ts`)

**Purpose**: Track generation performance, prevent regressions.

**Tests**:
- layout-reference-course generation time
- reference-course generation time

**How to add**: One line per performance test
```typescript
await harness.testPerformance("course-name");
```

---

## 🚀 **Adding New Tests**

### **New Reference Course**

1. Add course to `fixtures/`
2. Generate reference output manually
3. Add one line to `reference-courses.test.ts`:

```typescript
Deno.test("Reference Course: my-new-course (HTML)", async () => {
  const result = await harness.testReferenceCourse("my-new-course", "html");
  assertEquals(result.passed, true, result.message);
  console.log(result.message);
});
```

**That's it!** The harness handles:
- Generation
- DOM comparison
- Normalization
- Error reporting
- Cleanup

---

### **New Structure**

1. Create shell course in `fixtures/reference-structure/`
2. Add one line to `reference-structures.test.ts`:

```typescript
Deno.test("Structure: Multi-level units", async () => {
  const result = await harness.testStructure("multi-level-units");
  assertEquals(result.passed, true, result.message);
});
```

---

### **New Learning Object**

1. Create LO example in `fixtures/learning-objects/{type}/{name}/`
2. Add one line to `learning-objects.test.ts`:

```typescript
Deno.test("LO: Lab with archives", async () => {
  const result = await harness.testLearningObject("lab", "lab-with-archives");
  assertEquals(result.passed, true, result.message);
});
```

---

## 📊 **Benefits vs Previous Architecture**

| Aspect | Previous (AI-Generated) | Current (Deep Module) |
|--------|-------------------------|----------------------|
| **Test Code** | 4,300 lines | ~800 lines |
| **Harness Code** | 0 (embedded) | ~650 lines (hidden) |
| **Comprehensibility** | Low (all exposed) | High (simple interface) |
| **Add New Course** | 20-30 lines | 1 line |
| **Add New LO** | 10-15 lines | 1 line |
| **Add New Structure** | 15-20 lines | 1 line |
| **Maintainability** | Hard | Easy (one developer) |
| **Evolvability** | Requires infrastructure changes | Just add fixtures |

---

## 🔧 **Extending the Harness**

The harness is designed to be extended, not the tests.

**Example: Add DOM caching**

```typescript
// In tutors-test-harness.ts
private domCache = new Map<string, FileStructure>();

async testReferenceCourse(name: string, type: string) {
  const cacheKey = `${name}-${type}`;
  
  if (this.domCache.has(cacheKey)) {
    // Use cached DOM
  } else {
    // Generate and cache
  }
}
```

**Tests don't change** - just the harness implementation.

---

## 📚 **Reference Materials**

- **Tutors Manual**: https://tutors.dev/course/tutors-reference-manual
- **Reference Courses**:
  - https://tutors.dev/course/layout-reference-course
  - https://tutors.dev/course/reference-course
  - https://tutors.dev/course/tutors-starter-course
- **LLM-Friendly Reference**: https://tutors-reference-manual.netlify.app/llms/tutors-reference-manual-complete-llms.txt

---

## 🎓 **Design Philosophy**

> "The best modules are those whose interfaces are much simpler than their implementations."
> — John Ousterhout, *A Philosophy of Software Design*

We apply this to testing:

- **Simple Interface**: 5 methods, clear parameters
- **Complex Implementation**: DOM comparison, normalization, caching, error handling
- **Easy Evolution**: Add features by extending harness, not tests
- **Maintainable**: One developer can comprehend entire suite

---

## 🔍 **Troubleshooting**

### **Test Fails**

1. Check error details: `console.error(result.details)`
2. Look at generated output: `cli/tutors-gen-lib/temp/`
3. Compare to reference: `cli/test/fixtures/`
4. Debug harness if needed (it's well-documented)

### **Add Debug Output**

```typescript
const result = await harness.testReferenceCourse("course-name", "html");
if (!result.passed) {
  console.error("Details:", result.details);
  // Harness leaves temp files for debugging
}
```

---

## ✅ **Success Metrics**

- **Concise**: ~800 lines of test code (vs 4,300 before)
- **Comprehensive**: Same coverage, better structure
- **Maintainable**: One developer can understand entire suite
- **Evolvable**: Add new course/LO/structure = 1 line
- **Deep Module**: Simple interface, complex implementation hidden

---

**Status**: ✅ Deep Module Architecture Complete  
**Next**: Add more reference courses, structures, and LOs as fixtures

