---
name: nb-cli
description: Generate and edit images using the Nano Banana (Gemini) CLI tool. Use when asked to generate, edit, or create icons.
---

# nb-cli 🍌

Nano Banana CLI Tool — Generate and edit images with the power of Google Gemini models directly from your terminal.

## Core Workflows

### 1. Image Generation
Turn prompts into visuals using `nb generate <prompt>`.
- Use `-o, --output <path>` for a specific path (otherwise generates a random 6-char `.png`).
- Use `-s, --size <size>` to set resolution (`512` (default), `1k`, `2k`, `4k`).
- Use `-a, --aspect-ratio <ratio>` for your desired format (e.g., `16:9`, `21:9`).

### 2. Icon Generation
Create 1:1 square icons using `nb icon <prompt>`.
- Automatically prepends "High-quality minimalist icon for: " to your prompt.
- Defaults to `1:1` aspect ratio.

### 3. Image Editing
Modify existing images using `nb edit <image_path> <prompt>`.
- Describe the changes you want in the prompt.
- Optionally change the output size or aspect ratio.

## Detailed Reference
- **Aspect Ratios**: See [ratios.md](references/ratios.md) for all supported formats.
- **Example Prompts**: See [examples.md](references/examples.md) for common use cases.

## Usage Guide
When a user asks to generate or edit an image, follow these steps:
1. Identify the command (`generate`, `icon`, or `edit`).
2. Extract parameters (prompt, output path, size, aspect ratio).
3. If no output path is given, note that the tool will generate a random name.
4. Execute the command using `run_shell_command`.

### Example
User: "Generate a wide cinematic 2k image of a futuristic city"
Action: `nb generate "A futuristic city" -a 21:9 -s 2k`
