# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-04-08

### Changed
- **Migrated to ESM**: Converted the CLI entrypoint, source files, and tests from CommonJS to ECMAScript modules for compatibility with current `nanoid` and `mime` releases.
- **Updated Dependencies**: Bumped `@google/genai`, `dotenv`, `mime`, and `nanoid` to their current versions used by the project.
- **JPEG-First Output Guidance**: The CLI now defaults generated filenames to `.jpg`, and the documentation consistently instructs users to pass `.jpg` filenames when using `-o`.

### Fixed
- **Real Format Validation**: The CLI now validates that a user-supplied output extension matches the image bytes actually returned by Nano Banana instead of silently saving mismatched files.
- **Automatic Extension Handling**: When no output extension is provided, the CLI appends the model's actual output format automatically.
- **Edit Input MIME Detection**: `nb edit` now derives the input image MIME type from the source file path instead of treating nearly all inputs as JPEG.
- **Documentation Accuracy**: Removed outdated `.env` runtime guidance and clarified current output-format behavior for the Nano Banana flow.

## [1.0.2] - 2026-02-27

### Changed
- **Removed Automatic `.env` Loading**: For production usage, `nb-cli` no longer automatically loads `.env` files. Users are encouraged to set `GEMINI_API_KEY` in their environment or use it during local testing.
- **Improved Error Guidance**: The CLI now provides a direct link to Google AI Studio and instructions for setting the API key when it's missing.

## [1.0.1] - 2026-02-27

### Added
- **Icon Command**: New `nb icon <prompt>` command for square, minimalist icons.
- **Enhanced Aspect Ratios**: Expanded support for wide and tall ratios (21:9, 16:9, 1:1, 9:16, 1:8, etc.).
- **Random Filenames**: Integration with `nanoid` for 6-character random filenames when no output path is provided.
- **MIME Type Handling**: Improved detection for `.png` and `.jpg` during image editing.

## [1.0.0] - 2026-02-27

### Added
- **Initial Release**: Core functionality for generating and editing images using Google Gemini 3.1 Flash (Nano Banana).
- **Commands**:
    - `nb generate <prompt>`: Create images from text.
    - `nb edit <image_path> <prompt>`: Modify existing images with natural language.
- **Features**:
    - **Resolution Settings**: Choose between `512` (default), `1k`, `2k`, and `4k`.
- **Developer Experience**:
    - Project follows **StandardJS** coding style.
    - Licensed under **MIT**.
