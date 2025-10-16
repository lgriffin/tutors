# How to Test the New Deep Module Architecture

## 🎉 **Major Fix Completed**

**Fixed**: Critical `copyFolder` bug that was preventing Vento template copying.
- **Issue**: Templates were nested in `html/vento/vento/` instead of `html/vento/`
- **Fix**: `copyFolder` now copies folder CONTENTS, not the folder itself
- **Status**: HTML generation now works! ✅

---

## 🧪 **Quick Start: Run the Tests**

### 1. **Test Error States** (Should Pass)
These tests don't require generation and should pass immediately:

```bash
cd cli/tutors-gen-lib
deno test ../test/error-states.test.ts --allow-all
```

**Expected**: All tests pass ✅

---

### 2. **Test Reference Courses** (May Have DOM Comparison Issues)
These tests generate HTML/JSON and compare with fixtures:

```bash
cd cli/tutors-gen-lib
deno test ../test/reference-courses.test.ts --allow-all
```

**Current Status**: 
- ✅ Generation works!
- ⚠️ DOM comparison may fail (expected - needs tuning)
- ❌ JSON tests fail due to missing fixture assets (known issue)

---

### 3. **Test All New Tests**
Run the entire new test suite:

```bash
cd cli/tutors-gen-lib
deno task test:new
```

Or from the root:
```bash
cd cli
deno test test/*.test.ts --allow-all
```

---

## 🔍 **Debugging with Manual Test**

We created a diagnostic script to verify generation:

```bash
cd cli/tutors-gen-lib
deno run --allow-all ../test/manual-test.ts
```

**What it does**:
1. Checks paths (fixtures, vento templates)
2. Generates HTML for `layout-reference-course`
3. Verifies output structure
4. Lists what's in the vento folder

**Expected output**:
```
✅ Generation succeeded!
  Output directory: ✅ Found
  index.html: ✅ Found
```

---

## 🎯 **Next Steps: Improve Tests**

The generation works, but tests need refinement:

### **Issue 1: DOM Comparison**
The harness currently returns `false` when DOM comparison fails, but doesn't show details.

**Fix**: Add better error messages in `TutorsTestHarness.testReferenceCourse()`

### **Issue 2: Missing Fixture Assets**
JSON tests fail because some image files are missing in fixtures.

**Fix**: Either add missing images to fixtures OR make tests more lenient

### **Issue 3: Reference Output Fixtures**
We need "known-good" reference HTML/JSON outputs to compare against.

**Fix**: Generate reference outputs manually once, verify they're correct, then use them as fixtures

---

## 📊 **Test Status Summary**

| Test Category | Status | Notes |
|---------------|--------|-------|
| Error States | ✅ Should Pass | No generation required |
| Reference Courses (HTML) | ⚠️ Partially Works | Generation ✅, DOM comparison needs work |
| Reference Courses (JSON) | ❌ Fails | Missing fixture assets |
| Structures | ⚠️ Unknown | Not fully tested yet |
| Learning Objects | ⚠️ Unknown | Mostly placeholders |
| Performance | ⚠️ Unknown | Needs baseline setup |

---

## 🛠️ **What We Fixed**

### **The `copyFolder` Bug**
**Before**:
```typescript
fs.cpSync(src, dest, { recursive: true });
// Copied the FOLDER itself: dest/src_folder_name/
```

**After**:
```typescript
// Copies CONTENTS of src to dest
const entries = fs.readdirSync(src, { withFileTypes: true });
for (const entry of entries) {
  const srcPath = path.join(src, entry.name);
  const destPath = path.join(dest, entry.name);
  
  if (entry.isDirectory()) {
    copyFolder(srcPath, destPath); // Recursive
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}
```

**Result**: Templates now correctly land in `html/vento/Talk.vto` instead of `html/vento/vento/Talk.vto`!

---

## 💡 **Tips**

1. **Start with error-states.test.ts** - it's the simplest and should work
2. **Check manual-test.ts output** - if it fails, generation is broken
3. **Look at generated HTML** - it's in `cli/tutors-gen-lib/temp/`
4. **Compare with existing tests** - the old `cli/tutors-gen-lib/test/reference.test.ts` still works

---

## 🚀 **Ready to Continue?**

Once you've verified the tests run (even if some fail), we can:

1. **Add better error reporting** to the harness
2. **Create reference output fixtures** for DOM comparison
3. **Add learning object fixtures** for comprehensive testing
4. **Update CI/CD** to use the new architecture
5. **Remove old test directory** once we're confident

The foundation is solid - now we refine! 🎯

