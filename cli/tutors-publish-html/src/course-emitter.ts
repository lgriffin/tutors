import * as sh from "shelljs";
import * as fs from "fs";
import { Course, Lo, Topic, Unit, Notebook } from "tutors-gen-lib/src/models/lo-types";
import { writeFile } from "tutors-gen-lib/src/generator/file-utils";
import * as nunjucks from "nunjucks";

const root = __dirname;
nunjucks.configure(root + "/views", { autoescape: false });
nunjucks.installJinjaCompat();

function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, { lo: lo }));
}

function emitNote(lo: Lo, path: string) {
  const notePath = `${path}/${lo.id}`;
  publishTemplate(notePath, "index.html", "Note.njk", lo);
}

function emitLab(lo: Lo, path: string) {
  const labPath = `${path}/${lo.id}`;
  publishTemplate(labPath, "index.html", "Lab.njk", lo);
}

function emitNotebook(lo: Notebook, path: string) {
  const notebookPath = `${path}/${lo.id}`;

  // Read and process the notebook file
  try {
    // Extract the source path from the output path structure
    let sourcePath = "";
    if (path.includes("/html/") || path.includes("\\html\\")) {
      // Extract everything before /html/ as the base
      const basePath = path.split(/[\/\\]html[\/\\]/)[0];
      // Extract everything after /html/ as the relative path
      const relativePath = path.split(/[\/\\]html[\/\\]/)[1];
      // Build the source path
      sourcePath = `${basePath}/${relativePath}/${lo.id}`.replace(/[\/\\]+/g, "/");
    } else {
      // Fallback: use current working directory approach
      const cwd = process.cwd();
      const relativePathFromCwd = cwd.replace(/^.*[\/\\]html[\/\\]/, "");
      sourcePath = cwd.replace(/[\/\\]html[\/\\].*$/, "") + "/" + relativePathFromCwd + "/" + lo.id;
      sourcePath = sourcePath.replace(/[\/\\]+/g, "/");
    }

    let notebookContent = "";

    // First try the expected file
    let notebookFilePath = `${sourcePath}/${lo.notebookFile}`;

    if (fs.existsSync(notebookFilePath)) {
      notebookContent = fs.readFileSync(notebookFilePath, "utf8");
    } else {
      // Try to find any .ipynb file in the notebook directory
      if (fs.existsSync(sourcePath)) {
        const files = fs.readdirSync(sourcePath);
        const ipynbFile = files.find((file) => file.endsWith(".ipynb"));

        if (ipynbFile) {
          notebookFilePath = `${sourcePath}/${ipynbFile}`;
          notebookContent = fs.readFileSync(notebookFilePath, "utf8");
          // Update the lo.notebookFile to the actual file found
          lo.notebookFile = ipynbFile;
          console.log(`Found notebook file: ${notebookFilePath}`);
        } else {
          console.warn(`No .ipynb file found in directory: ${sourcePath}`);
        }
      } else {
        console.warn(`Notebook directory not found: ${sourcePath}`);
      }
    }

    if (notebookContent) {
      // Validate and parse the notebook content
      const parsedContent = JSON.parse(notebookContent);
      lo.notebookContent = JSON.stringify(parsedContent);

      // IMPORTANT: Also copy the notebook file to the output directory
      // This allows JupyterLite to load it directly from the same domain
      const outputNotebookPath = `${notebookPath}/${lo.notebookFile}`;
      writeFile(notebookPath, lo.notebookFile, notebookContent);
      console.log(`Copied notebook file to: ${outputNotebookPath}`);
    } else {
      console.warn(`No notebook content available for: ${lo.id}`);
      lo.notebookContent = JSON.stringify({
        cells: [],
        metadata: {},
        nbformat: 4,
        nbformat_minor: 2,
      });
    }
  } catch (error) {
    console.error(`Error reading notebook file for ${lo.id}:`, error);
    lo.notebookContent = JSON.stringify({
      cells: [],
      metadata: {},
      nbformat: 4,
      nbformat_minor: 2,
    });
  }

  publishTemplate(notebookPath, "index.html", "Jupyter.njk", lo);
}

function emitLoPage(lo: Lo, path: string) {
  if (lo.type == "lab") {
    emitLab(lo as Lo, path);
  }
  if (lo.type == "note" || lo.type == "panelnote") {
    emitNote(lo as Lo, path);
  }
  if (lo.type == "notebook") {
    emitNotebook(lo as Notebook, path);
  }
}

function emitUnit(lo: Unit, path: string) {
  lo.los.forEach((lo) => {
    emitLoPage(lo as Lo, path);
  });
}

function emitLo(lo: Lo, path: string) {
  if (lo.type == "unit" || lo.type == "side") {
    const unitPath = `${path}/${lo.id}`;
    emitUnit(lo as Unit, unitPath);
  } else {
    emitLoPage(lo, path);
  }
}

function emitTopic(lo: Topic, path: string) {
  sh.cd(lo.id);
  const topicPath = `${path}/${lo.id}`;
  lo?.los?.forEach((lo) => {
    emitLo(lo as Lo, topicPath);
  });
  publishTemplate(topicPath, "index.html", "Topic.njk", lo);
  sh.cd("..");
}

export function emitWalls(path: string, lo: Course) {
  lo.walls?.forEach((los) => {
    const type = los[0].type;
    lo.los = los;
    if (lo.properties) {
      lo.properties["credits"] = `All ${type}'s in course`;
    }
    publishTemplate(path, `${type}.html`, "Wall.njk", lo);
  });
}

export function emitCourse(path: string, lo: Course) {
  sh.cd(path);
  lo?.los?.forEach((lo) => {
    emitTopic(lo as Topic, path);
  });
  publishTemplate(path, "index.html", "Course.njk", lo);
  emitWalls(path, lo);
}
