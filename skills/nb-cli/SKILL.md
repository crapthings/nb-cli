---
name: nb-cli
description: Generate and edit still images using the Nano Banana (Gemini) CLI tool. Use when Codex needs to create, edit, or create icons with `nb generate`, `nb edit`, or `nb icon`, especially for prompt-driven visual assets, marketing images, mockups, illustrations, and simple image revisions from the terminal.
---

# nb-cli

Nano Banana CLI Tool — Generate and edit images with the power of Google Gemini models directly from your terminal.

Example trigger requests:
- `Use $nb-cli to generate a 16:9 SaaS hero image with soft daylight and editorial composition`
- `Use $nb-cli to create a minimalist coffee cup icon for my app`
- `Use $nb-cli to edit hero.jpg and change only the background to a warm sunset gradient`
- `Use $nb-cli to generate a product mockup for a matte black bottle, centered three-quarter angle, soft studio light`

## Core Workflows

### 1. Image Generation
Turn prompts into visuals using `nb generate <prompt>`.
- Use `-o, --output <path>` for a specific path (otherwise generates a random 6-char `.jpg` filename).
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

## Prompt Construction

- Treat this skill as a still-image skill. Use visual language that can be expressed in one image.
- Ignore film/video techniques that depend on motion, multi-shot sequencing, editing rhythm, sound, or camera movement.
- Prefer concise prompts with a clear subject, scene, composition, lighting, and constraints.
- For edits, state invariants explicitly: `change only X; keep Y unchanged`.
- If the task is an icon, keep prompts simple, silhouette-friendly, and background-light unless the user asks otherwise.

## Detailed Reference
- **Aspect Ratios**: See [ratios.md](references/ratios.md) for all supported formats.
- **Example Prompts**: See [examples.md](references/examples.md) for common use cases.
- **Still Camera / Framing**: See [still-camera-framing.md](references/still-camera-framing.md) for single-image shot and angle vocabulary.
- **Still Lighting**: See [still-lighting.md](references/still-lighting.md) for lighting setups and mood cues.
- **Still Composition**: See [still-composition.md](references/still-composition.md) for layout, depth, and hierarchy language.
- **Still Look / Style**: See [still-look-and-style.md](references/still-look-and-style.md) for optical finish, grade, and single-frame visual styles.

## Usage Guide
When a user asks to generate or edit an image, follow these steps:
1. Identify the command (`generate`, `icon`, or `edit`).
2. Extract parameters (prompt, output path, size, aspect ratio).
3. Build or refine the prompt using only still-image vocabulary that materially helps.
4. If no output path is given, note that the tool will generate a random `.jpg` filename.
5. Execute the command in the repo shell.

## Prompt Shape

Use compact prompt structure when the request is underspecified:
- Subject: what should be visible
- Scene/background: where it is
- Composition/framing: shot size, viewpoint, layout
- Lighting/mood: quality of light and atmosphere
- Style/finish: illustration, photo, render, noir, CRT, etc.
- Constraints: what to avoid or preserve

Only add the lines that help. If the user already gave a precise prompt, normalize it instead of expanding it.

### Example
User: "Generate a wide cinematic 2k image of a futuristic city"
Action: `nb generate "A futuristic city" -a 21:9 -s 2k`
