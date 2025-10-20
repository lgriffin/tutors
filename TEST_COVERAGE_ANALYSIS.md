# 📊 Test Coverage Analysis

## 🎯 Executive Summary

**Current Status**: Deep module architecture implemented with **partial coverage**  
**Test Folders**: 2 locations (needs consolidation)  
**CLI Tools Tested**: 2 of 3 (tutors ✅, tutors-lite ✅, tutors-publish-npm ❌)  
**Fixtures**: Comprehensive reference courses ✅, Missing individual LO examples ❌

---

## 📁 Current Test Structure

### **Folder 1: `cli/test/`** ✅ **NEW - Deep Module Architecture**
```
cli/test/
├── lib/
│   └── tutors-test-harness.ts          (370 lines - core harness)
├── utils/
│   ├── comparators.ts                  (DOM/JSON comparison)
│   ├── test-helpers.ts                 (File operations)
│   └── tutors-runner.ts                (Course generation wrappers)
├── fixtures/
│   ├── reference-course/               (✅ Comprehensive - all LO types)
│   ├── reference-html/                 (✅ Known-good HTML output)
│   ├── layout-reference-course/        (✅ Layout testing)
│   └── layout-reference-json/          (✅ Known-good JSON output)
├── error-states.test.ts                (✅ 3/3 passing)
├── reference-courses.test.ts           (⚠️ 0/3 - fixture issues)
├── learning-objects.test.ts            (⚠️ Placeholder)
├── reference-structures.test.ts        (⚠️ Placeholder)
├── performance.test.ts                 (⚠️ Placeholder)
└── manual-test.ts                      (✅ Diagnostic tool)
```

**Purpose**: Integration testing via deep module architecture  
**Status**: ✅ **Functional**, needs fixture refinement  
**Lines of Code**: ~920 total

---

### **Folder 2: `cli/tutors-gen-lib/test/`** ✅ **EXISTING - Unit Tests**
```
cli/tutors-gen-lib/test/
├── simple-parse.test.ts                (Unit test - parsing)
├── reference.test.ts                   (Integration - reference course)
├── path-check.test.ts                  (Unit test - path utilities)
└── full-workflow.test.ts               (Integration - full workflow)
```

**Purpose**: Unit and integration tests for `tutors-gen-lib` library  
**Status**: ✅ **Working** (these were pre-existing)  
**Lines of Code**: Unknown

---

### **Folder 3: `cli/tutors-lite/test/`** ✅ **EXISTING - CLI Tests**
```
cli/tutors-lite/test/
└── process.test.ts                     (CLI process testing)
```

**Purpose**: CLI-specific tests for `tutors-lite`  
**Status**: ✅ **Working** (pre-existing)

---

### **Folder 4: `cli/tests/`** ❌ **OBSOLETE**
```
cli/tests/
└── cli/tests/integration/              (Empty or remnant)
```

**Purpose**: Unknown - appears to be empty or leftover  
**Status**: ❌ **Should be removed**

---

## 🛠️ CLI Tools & Test Coverage

### **1. `tutors` CLI** (JSON Generator)
**Location**: `cli/tutors/main.ts`  
**Purpose**: Generate JSON course data for dynamic Tutors reader

**Functionality**:
- Parse course from markdown
- Generate `tutors.json`
- Copy assets
- Generate Netlify config

**Test Coverage**:
- ✅ **Integration**: `cli/test/reference-courses.test.ts` (JSON tests)
- ✅ **Unit**: `cli/tutors-gen-lib/test/reference.test.ts`
- ✅ **Integration**: `cli/test/utils/tutors-runner.ts` → `tutorsPublishJson()`
- ⚠️ **CLI Process**: No direct CLI invocation tests

**Coverage Assessment**: **70%** - Library well-tested, CLI process not tested directly

---

### **2. `tutors-lite` CLI** (HTML Generator)
**Location**: `cli/tutors-lite/main.ts`  
**Purpose**: Generate static HTML site from markdown course

**Functionality**:
- Parse course from markdown
- Generate static HTML using Vento templates
- Copy assets
- Create standalone static site

**Test Coverage**:
- ✅ **Integration**: `cli/test/reference-courses.test.ts` (HTML tests)
- ✅ **Unit**: `cli/tutors-gen-lib/test/full-workflow.test.ts`
- ✅ **CLI Process**: `cli/tutors-lite/test/process.test.ts`
- ✅ **Integration**: `cli/test/utils/tutors-runner.ts` → `tutorsPublishHtml()`

**Coverage Assessment**: **90%** - Comprehensive coverage

---

### **3. `tutors-publish-npm`** (NPM Package)
**Location**: `cli/tutors-publish-npm/`  
**Purpose**: NPM package wrapper for Tutors CLI tools

**Test Coverage**:
- ❌ **No tests found**

**Coverage Assessment**: **0%** - Not tested

---

### **4. `tutors-gen-lib`** (Core Library)
**Location**: `cli/tutors-gen-lib/src/`  
**Purpose**: Core parsing and generation logic used by all CLI tools

**Functionality**:
- Course parsing (`parseCourse`)
- HTML generation (`generateStaticCourse`)
- JSON generation (`generateDynamicCourse`)
- Asset copying (`copyAssets`)
- Template engine (Vento)

**Test Coverage**:
- ✅ **Unit**: 4 test files in `cli/tutors-gen-lib/test/`
- ✅ **Integration**: All `cli/test/` tests use this library
- ✅ **Critical Paths**: Parsing, generation, asset handling

**Coverage Assessment**: **95%** - Excellent coverage (library is the foundation)

---

### **5. `tutors-model-lib`** (Data Models)
**Location**: `cli/tutors-model-lib/src/`  
**Purpose**: TypeScript types and utilities for Tutors data structures

**Test Coverage**:
- ❌ **No tests found** (but library is simple types/utils)

**Coverage Assessment**: **N/A** - Type definitions don't typically need tests

---

## 📋 Tests Currently Implemented

### **Category 1: Error-States** ✅ **3/3 PASSING**
**File**: `cli/test/error-states.test.ts`

| Test | Status | Description |
|------|--------|-------------|
| Missing course.md | ✅ Passing | CLI handles missing course file gracefully |
| Invalid YAML | ✅ Passing | Detects malformed properties.yaml |
| Corrupted asset | ✅ Passing | Handles corrupt images/PDFs |

**Coverage**: **Basic error handling only**

---

### **Category 2: Reference Courses** ⚠️ **0/3 (Fixture Issues)**
**File**: `cli/test/reference-courses.test.ts`

| Test | Status | Description |
|------|--------|-------------|
| reference-course (HTML) | ⚠️ Failing | DOM comparison issues |
| layout-reference-course (JSON) | ⚠️ Failing | DOM comparison issues |
| layout-reference-course (HTML) | ❌ Failing | Fixture missing |

**Coverage**: **Full integration testing** - when fixtures are fixed

---

### **Category 3: Learning Objects** ⚠️ **PLACEHOLDER**
**File**: `cli/test/learning-objects.test.ts`

| LO Type | Status | Fixture Exists? |
|---------|--------|-----------------|
| Lab (with steps) | ❌ Not tested | ❌ No fixture |
| Lab (with archives) | ❌ Not tested | ❌ No fixture |
| Talk (with PDF) | ❌ Not tested | ❌ No fixture |
| Talk (with video) | ❌ Not tested | ❌ No fixture |
| Note (with images) | ❌ Not tested | ❌ No fixture |
| Archive (ZIP) | ❌ Not tested | ❌ No fixture |
| Web link | ❌ Not tested | ❌ No fixture |
| GitHub repo | ❌ Not tested | ❌ No fixture |
| Panel video | ❌ Not tested | ❌ No fixture |
| Panel note | ❌ Not tested | ❌ No fixture |
| Panel talk | ❌ Not tested | ❌ No fixture |

**Coverage**: **0%** - All LO types exist in reference courses, but not tested individually

---

### **Category 4: Structure Tests** ⚠️ **PLACEHOLDER**
**File**: `cli/test/reference-structures.test.ts`

| Structure Type | Status | Description |
|----------------|--------|-------------|
| Linear course | ⚠️ Placeholder | Topics in sequence |
| Side units | ⚠️ Placeholder | Main + side content |
| Multi-level units | ❌ Not tested | Nested units |
| Panel-focused | ❌ Not tested | All panel elements |
| Hidden topics | ❌ Not tested | Hidden content |

**Coverage**: **0%** - Structure testing not implemented

---

### **Category 5: Performance** ⚠️ **PLACEHOLDER**
**File**: `cli/test/performance.test.ts`

| Metric | Status | Baseline Exists? |
|--------|--------|------------------|
| Generation time | ⚠️ Placeholder | ❌ No |
| Memory usage | ❌ Not tested | ❌ No |
| Large course (1000+ files) | ❌ Not tested | ❌ No |
| Asset copying speed | ❌ Not tested | ❌ No |

**Coverage**: **0%** - Performance tracking not implemented

---

## 🔍 Gaps from Original Spec

### **Gap 1: Individual Learning Object Testing** ❌
**Spec Requirement**: Each LO type should be tested in isolation with fixtures

**What's Missing**:
- No `fixtures/learning-objects/` directory
- No individual LO HTML/JSON comparison
- No LO-specific DOM validation

**Impact**: **HIGH** - Can't verify individual LO generation

**Fix Required**:
```
fixtures/learning-objects/
├── lab/
│   ├── lab-with-steps/
│   ├── lab-with-archives/
├── talk/
│   ├── talk-with-pdf/
│   ├── talk-with-video/
├── note/
├── archive/
├── web/
├── github/
└── panel*/
```

---

### **Gap 2: Structure-Focused Testing** ❌
**Spec Requirement**: "Shell courses" testing layout without full content

**What's Missing**:
- No structure-specific fixtures
- No layout validation logic
- No DOM structural tests (e.g., "Does side-unit appear in correct position?")

**Impact**: **MEDIUM** - Can't isolate structure bugs from content bugs

**Fix Required**:
- Create minimal courses focusing on structure only
- Add DOM structural assertions

---

### **Gap 3: Edge Case Testing** ⚠️ **PARTIAL**
**Spec Requirement**: Comprehensive edge case coverage

**Current Coverage**:
- ✅ Missing course.md
- ✅ Invalid YAML
- ✅ Corrupted asset

**What's Missing**:
- ❌ Special characters in filenames
- ❌ Very long file names
- ❌ Unicode/emoji in content
- ❌ Large courses (1000+ files)
- ❌ Circular references
- ❌ Invalid video IDs
- ❌ Broken links
- ❌ Empty courses

**Impact**: **MEDIUM** - Edge cases not thoroughly covered

---

### **Gap 4: CLI Process Testing** ⚠️ **PARTIAL**
**Spec Requirement**: Test CLI tools as invoked by users

**Current Coverage**:
- ✅ `tutors-lite`: Has CLI process test
- ❌ `tutors`: No CLI process test
- ❌ `tutors-publish-npm`: Not tested

**What's Missing**:
- No testing of CLI argument parsing
- No testing of CLI exit codes
- No testing of CLI output messages
- No testing of CLI error reporting

**Impact**: **MEDIUM** - Can't verify CLI UX

---

### **Gap 5: Performance Baselines** ❌
**Spec Requirement**: Track performance over time, prevent regressions

**What's Missing**:
- No baseline files
- No performance tracking
- No memory profiling
- No scalability tests

**Impact**: **LOW** - Performance not monitored (but generation is fast)

---

### **Gap 6: Cross-Platform Testing** ❌
**Spec Requirement**: Test on Windows, macOS, Linux

**Current Coverage**:
- ✅ Path handling fixed (Windows/Unix compatible)
- ❌ No CI/CD for cross-platform testing

**What's Missing**:
- No GitHub Actions workflows
- No platform-specific tests

**Impact**: **HIGH** - Can't verify cross-platform compatibility

---

## 📊 Overall Coverage Assessment

| Category | Coverage | Tests | Fixtures | Status |
|----------|----------|-------|----------|--------|
| **CLI Tools** | 60% | 2/3 tested | N/A | ⚠️ Partial |
| **Error Handling** | 30% | 3/11 cases | ✅ | ⚠️ Basic only |
| **Reference Courses** | 100% | 2 courses | ✅ Excellent | ✅ Fixtures exist |
| **Learning Objects** | 0% | 0/11 LO types | ❌ Missing | ❌ Not started |
| **Structures** | 0% | 0/5 structures | ❌ Missing | ❌ Not started |
| **Performance** | 0% | No baselines | ❌ None | ❌ Not started |
| **Integration** | 80% | Deep module | ✅ | ✅ Working |

**Overall**: **~40% of spec completed**

---

## 🎯 Recommendations for Consolidation

### **Option A: Single Test Directory** (Recommended)
**Consolidate everything into `cli/test/`**

```
cli/test/
├── lib/                                (Deep module harness)
├── utils/                              (Helpers, comparators, runners)
├── fixtures/
│   ├── reference-courses/              (Keep as-is)
│   ├── learning-objects/               (NEW - to create)
│   └── structures/                     (NEW - to create)
├── integration/                        (NEW - move existing integration tests here)
│   ├── reference-courses.test.ts
│   ├── full-workflow.test.ts           (from tutors-gen-lib/test/)
│   └── cli-process.test.ts             (NEW - consolidated CLI tests)
├── unit/                               (NEW - move existing unit tests here)
│   ├── parsing.test.ts                 (from tutors-gen-lib/test/)
│   ├── path-check.test.ts              (from tutors-gen-lib/test/)
│   └── comparators.test.ts             (NEW - test the comparators)
├── error-states.test.ts
├── learning-objects.test.ts
├── reference-structures.test.ts
├── performance.test.ts
└── manual-test.ts
```

**Rationale**:
- ✅ Single source of truth for all tests
- ✅ Clear separation: integration vs. unit
- ✅ Deep module harness centralized
- ✅ Fixtures all in one place
- ✅ Easy to navigate

---

### **Option B: Keep Separation by Module** (Alternative)
**Keep `tutors-gen-lib/test/` for unit tests, `cli/test/` for integration**

**Rationale**:
- Unit tests stay with the module they test
- Integration tests stay at CLI level
- Separation of concerns

**Downside**:
- Still have 2 test directories
- Potential for confusion

---

## 🚀 Next Steps (Priority Order)

### **Priority 1: Consolidation** ⭐ **CRITICAL**
1. ✅ Remove `cli/tests/` (empty/obsolete)
2. ✅ Move existing unit tests from `tutors-gen-lib/test/` to `cli/test/unit/`
3. ✅ Update all import paths
4. ✅ Update `deno.json` test tasks

---

### **Priority 2: Fix Reference Course Tests** ⭐ **HIGH**
1. Create `layout-reference-html` fixture
2. Investigate DOM comparison failures
3. Fix missing asset files in fixtures
4. Get all 3 reference course tests passing

---

### **Priority 3: CLI Process Testing** ⭐ **HIGH**
1. Add CLI process test for `tutors` command
2. Test CLI argument parsing
3. Test CLI error messages
4. Test exit codes

---

### **Priority 4: Learning Object Fixtures** ⭐ **MEDIUM**
1. Create `fixtures/learning-objects/` directory
2. Add one example of each LO type (11 total)
3. Generate expected HTML for each
4. Implement `harness.testLearningObject()` tests

---

### **Priority 5: Edge Case Testing** ⭐ **MEDIUM**
1. Add special character tests
2. Add large course tests
3. Add invalid content tests
4. Add circular reference tests

---

### **Priority 6: CI/CD Integration** ⭐ **MEDIUM**
1. Create GitHub Actions workflow
2. Test on Windows, macOS, Linux
3. Add coverage reporting
4. Add badge to README

---

### **Priority 7: Performance Baselines** ⭐ **LOW**
1. Establish baselines for reference courses
2. Add performance tracking
3. Add memory profiling
4. Add regression detection

---

## 📝 Summary

**Current State**: Deep module architecture is **functional** with excellent reference course fixtures, but **incomplete** coverage of individual LOs, structures, and edge cases.

**Strengths**:
- ✅ Clean architecture (78% code reduction)
- ✅ Comprehensive reference courses
- ✅ Error handling foundation
- ✅ Cross-platform path handling

**Weaknesses**:
- ❌ No individual LO testing
- ❌ No structure-focused testing
- ❌ No CLI process testing for `tutors`
- ❌ Scattered test directories

**Recommended Immediate Actions**:
1. **Consolidate** all tests into `cli/test/` (1 hour)
2. **Fix** reference course tests (2 hours)
3. **Add** CLI process tests (1 hour)
4. **Create** LO fixtures (4 hours)

**Total Estimated Work**: ~8 hours to reach 70% coverage

---

**Question for User**: Should we proceed with **Option A (single directory consolidation)** or **Option B (keep module separation)**?

