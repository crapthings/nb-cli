# nb-cli 🍌

<p align="center">
  <img src="static/repo.png" alt="nb-cli" width="600">
</p>

**Nano Banana CLI Tool** — Generate and edit images with the power of Google Gemini models directly from your terminal.

---

## 🌟 Overview

`nb-cli` is a lightweight command-line interface for the **Nano Banana** (Gemini 3.1 Flash Image Preview) model. It allows you to create high-quality images from text prompts and perform sophisticated image editing by providing natural language instructions alongside an existing image.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 2. Installation

**Using NPM (Global):**
```bash
npm install -g @crapthings/nb-cli
```

**Using NPX (No installation):**
```bash
npx @crapthings/nb-cli generate "A futuristic banana"
```

**From Source:**
```bash
git clone https://github.com/crapthings/nb-cli.git
cd nb-cli
npm install
npm link # To use 'nb' command locally
```

### 3. Configuration
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_api_key_here
```

---

## 🎨 Usage

### Generate an Image
Create a brand new image from a text prompt.

```bash
nb generate "A cyberpunk cat sitting on a neon-lit skyscraper" -o cyber-cat.jpg -s 1k -a 16:9
```

### Generate an Icon
Generate a 1:1 minimalist icon for a given prompt. This command automatically adds icon-specific keywords to your prompt.

```bash
nb icon "a playful banana" -o banana-icon.png
```

### Edit an Image
Modify an existing image by describing the changes you want.

```bash
nb edit cyber-cat.jpg "Make the cat wearing sunglasses and drinking a soda" -o edit.jpg -a 1:1
```

### Options
| Option | Short | Description | Default |
| --- | --- | --- | --- |
| `--output` | `-o` | Path to save the resulting image | `6-char-nanoid.png` |
| `--size` | `-s` | Image resolution (512, 1k, 2k, 4k) | 512 |
| `--aspect-ratio`| `-a` | Image aspect ratio (21:9, 16:9, 1:1, etc.) | 1:1 |

#### Supported Aspect Ratios
Ordered by the leading dimension (width) from largest to smallest:

- **Horizontal**: `21:9`, `16:9`, `8:1`, `5:4`, `4:3`, `4:1`, `3:2`
- **Square**: `1:1`
- **Vertical**: `9:16`, `4:5`, `3:4`, `2:3`, `1:4`, `1:8`

---

## 🏗️ Project Structure

- `bin/nb.js`: Entry point for the CLI tool.
- `src/api.js`: Interactions with the Google Gemini (Nano Banana) API.
- `src/commands.js`: Command handlers for `generate` and `edit`.
- `test/`: Unit tests using `mocha` and `chai`.
- `AGENTS.md`: Technical overview and project requirements.

## 💅 Coding Style

This project follows the **[StandardJS](https://standardjs.com/)** coding style.
- No semicolons.
- 2-space indentation.
- High-quality, idiomatic JavaScript.

---

## 🧪 Development

### Run Tests
The project uses `mocha` and `chai` for unit testing.
```bash
npm test
```

### Linting
```bash
npm run lint
```

---

## 📜 License
Licensed under the [MIT License](LICENSE).
