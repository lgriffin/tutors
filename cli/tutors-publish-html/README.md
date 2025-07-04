# Tutors Publish HTML - Enhanced with JupyterLite Support

This module generates static HTML sites from Tutors learning content, now with **JupyterLite integration** for interactive Jupyter notebooks that run entirely in the browser.

## Features

- **Static HTML Generation**: Convert Tutors learning objects into responsive HTML sites
- **JupyterLite Integration**: Run Jupyter notebooks directly in the browser without a server
- **Interactive Learning**: Students can execute Python code, modify cells, and see results immediately
- **Persistent Storage**: Notebook changes are saved in the browser's local storage
- **Modern UI**: Clean, responsive design with Tailwind CSS

## New: Jupyter Notebook Support

The module now supports `.ipynb` files as a new learning object type called `notebook`. When a directory contains a `.ipynb` file, it will be automatically detected and rendered using JupyterLite.

### How it Works

1. **Detection**: The system scans for `.ipynb` files in course directories
2. **Processing**: Notebook content is read and prepared for JupyterLite
3. **Rendering**: A specialized template embeds JupyterLite with the notebook content
4. **Execution**: Students can run Python code using Pyodide (Python in WebAssembly)

### Supported Features

- **Python Kernel**: Full Python 3.9 support via Pyodide
- **Popular Libraries**: NumPy, Pandas, Matplotlib, Seaborn, SciPy
- **Interactive Controls**: Run cells, restart kernel, run all cells
- **Persistent State**: Work is saved between sessions
- **Modern Interface**: Jupyter Lab-style interface

## Usage

### Basic Usage

```bash
# Navigate to your course directory
cd /path/to/your/course

# Generate HTML site with JupyterLite support
tutors-html
```

### Directory Structure for Notebooks

```
your-course/
├── course.md
├── topic-01/
│   ├── topic.md
│   └── notebook-example/
│       ├── notebook.md          # Description of the notebook
│       └── data-analysis.ipynb  # The Jupyter notebook
└── ...
```

### Creating Notebook Learning Objects

1. **Create a directory** with your desired notebook name (e.g., `python-intro`)
2. **Add a markdown file** (`notebook.md`) with description and learning objectives
3. **Add your notebook file** (e.g., `analysis.ipynb`) containing the interactive content
4. **Run the HTML generator** - the system will automatically detect and process the notebook

### Example Notebook Structure

```markdown
# Python Data Analysis

This interactive notebook teaches data analysis concepts using Python.

## Learning Objectives

- Understand pandas DataFrames
- Create visualizations with matplotlib
- Perform statistical analysis

## Instructions

Click "Run All" to execute all cells, or run individual cells with Shift+Enter.
```

## Template System

The module uses Nunjucks templates for rendering:

- `Jupyter.njk` - New template for notebook learning objects
- `Lab.njk` - Existing template for lab exercises
- `Note.njk` - Existing template for notes
- `Topic.njk` - Existing template for topics

## Technical Details

### JupyterLite Integration

The integration uses:

- **JupyterLite**: Browser-based Jupyter environment
- **Pyodide**: Python interpreter in WebAssembly
- **CDN Delivery**: JupyterLite assets loaded from CDN
- **Local Storage**: Persistent notebook state

### Learning Object Types

The system now supports these learning object types:

- `notebook` - Interactive Jupyter notebooks _(NEW)_
- `lab` - Step-by-step lab exercises
- `note` - Text-based notes
- `talk` - Presentations with slides
- `web` - External web resources
- `archive` - Downloadable resources

### File Processing

1. **Resource Detection**: Scans directories for `.ipynb` files
2. **Content Reading**: Reads notebook JSON content
3. **Template Rendering**: Uses Jupyter.njk template with JupyterLite
4. **Asset Copying**: Copies notebook files to output directory

## Dependencies

### Runtime Dependencies

- `nunjucks` - Template engine
- `shelljs` - Shell command execution
- `tutors-gen-lib` - Core Tutors functionality

### Browser Dependencies (CDN)

- `@jupyterlite/app` - JupyterLite application
- `@jupyterlite/pyodide-kernel` - Python kernel
- `@jupyterlite/javascript-kernel` - JavaScript kernel

## Browser Support

JupyterLite requires modern browsers with:

- WebAssembly support
- ES6 modules
- Service Workers
- Local Storage

Supported browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

See the `test-example/` directory for a complete example including:

- Course structure
- Notebook learning object
- Sample data analysis notebook

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Create test content
mkdir -p test-course/topic-01/notebook-example
# Add notebook.md and analysis.ipynb
# Run the generator
cd test-course && tutors-html
```

## Troubleshooting

### Common Issues

1. **JupyterLite not loading**: Check internet connection and browser compatibility
2. **Python libraries missing**: Some libraries may not be available in Pyodide
3. **Large notebooks**: Very large notebooks may take time to load

### Browser Console

Check browser console for errors. Common messages:

- `JupyterLite failed to load` - Network or compatibility issue
- `Failed to initialize kernel` - Pyodide loading issue
- `Module not found` - Python library not available in Pyodide

## Contributing

This module is part of the Tutors SDK project. Contributions are welcome!

## License

MIT License - see LICENSE file for details.
