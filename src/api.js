import fs from 'node:fs'
import path from 'node:path'
import { GoogleGenAI } from '@google/genai'
import mime from 'mime'

const DEFAULT_MODEL = 'gemini-3.1-flash-image-preview'
const LITE_MODEL = 'gemini-3.1-flash-lite-image'

const MODEL_ALIASES = new Map([
  ['default', DEFAULT_MODEL],
  ['flash', DEFAULT_MODEL],
  ['nano-banana', DEFAULT_MODEL],
  ['nano-banana-2', DEFAULT_MODEL],
  ['lite', LITE_MODEL],
  ['flash-lite', LITE_MODEL],
  ['nano-banana-lite', LITE_MODEL]
])

function detectImageExtension (buffer) {
  if (buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A) {
    return 'png'
  }

  if (buffer.length >= 3 &&
    buffer[0] === 0xFF &&
    buffer[1] === 0xD8 &&
    buffer[2] === 0xFF) {
    return 'jpg'
  }

  if (buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'webp'
  }

  if (buffer.length >= 6) {
    const header = buffer.subarray(0, 6).toString('ascii')
    if (header === 'GIF87a' || header === 'GIF89a') {
      return 'gif'
    }
  }

  return null
}

function normalizeExtension (extension) {
  const normalized = extension.replace(/^\./, '').toLowerCase()
  if (normalized === 'jpeg') return 'jpg'
  return normalized
}

function getInputMimeType (inputPath) {
  const mimeType = mime.getType(inputPath)
  if (mimeType && mimeType.startsWith('image/')) {
    return mimeType
  }

  throw new Error(`Unsupported input image format for ${inputPath}`)
}

function resolveOutputPath (outputPath, mimeType, buffer) {
  const detectedExtension = detectImageExtension(buffer)
  const mimeExtension = mimeType ? mime.getExtension(mimeType) : null
  const actualExtension = detectedExtension || mimeExtension || 'png'
  const normalizedExtension = normalizeExtension(actualExtension)
  const existingExtension = path.extname(outputPath)

  if (!existingExtension) {
    return `${outputPath}.${normalizedExtension}`
  }

  const requestedExtension = normalizeExtension(existingExtension)
  if (requestedExtension !== normalizedExtension) {
    throw new Error(`Requested .${requestedExtension} output, but Nano Banana returned .${normalizedExtension}. Use a .jpg filename, or omit the extension to save the model's native format automatically.`)
  }

  return outputPath
}

function getClient () {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY environment variable is missing.')
    console.error('Please obtain an API key from: https://aistudio.google.com/app/apikey')
    console.error('Then set it in your environment:')
    console.error('  export GEMINI_API_KEY=your_api_key_here')
    process.exit(1)
  }
  return new GoogleGenAI({ apiKey })
}

function normalizeImageSize (size, model = DEFAULT_MODEL) {
  let imageSize = '0.5K'
  if (model === LITE_MODEL) {
    imageSize = '1K'
  }

  if (size) {
    imageSize = size.toUpperCase()
    if (imageSize === '512') imageSize = '0.5K'
    if (imageSize === '1024') imageSize = '1K'
  }

  if (model === LITE_MODEL && imageSize !== '1K') {
    throw new Error(`${LITE_MODEL} only supports 1K image output. Use --size 1k or omit --size.`)
  }

  return imageSize
}

function resolveModel (model) {
  if (!model) return DEFAULT_MODEL
  return MODEL_ALIASES.get(model.toLowerCase()) || model
}

function resolveImageOptions (options = {}) {
  const model = resolveModel(options.model)
  return {
    model,
    imageSize: normalizeImageSize(options.size, model)
  }
}

async function generateImage (prompt, outputPath, options = {}) {
  const ai = getClient()
  const resolvedOptions = resolveImageOptions(options)

  const imageConfig = {
    imageSize: resolvedOptions.imageSize
  }

  if (options.aspectRatio) {
    imageConfig.aspectRatio = options.aspectRatio
  }

  const config = {
    thinkingConfig: {
      thinkingLevel: 'MINIMAL'
    },
    imageConfig,
    responseModalities: ['IMAGE']
  }

  const payload = {
    model: resolvedOptions.model,
    config,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  }

  try {
    const response = await ai.models.generateContent(payload)

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts
      for (const part of parts) {
        if (part.inlineData) {
          const base64Image = part.inlineData.data
          const mimeType = part.inlineData.mimeType || 'image/png'
          const imageBuffer = Buffer.from(base64Image, 'base64')
          const finalPath = resolveOutputPath(outputPath, mimeType, imageBuffer)
          fs.writeFileSync(finalPath, imageBuffer)
          return finalPath
        }
      }
      throw new Error('No image part found in the API response.')
    } else {
      throw new Error('No candidates returned by the API.')
    }
  } catch (err) {
    throw new Error(`API Request Failed: ${err.message}`)
  }
}

async function editImage (inputPath, prompt, outputPath, options = {}) {
  const ai = getClient()
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input image not found at ${inputPath}`)
  }

  const resolvedOptions = resolveImageOptions(options)

  const imageConfig = {
    imageSize: resolvedOptions.imageSize
  }

  if (options.aspectRatio) {
    imageConfig.aspectRatio = options.aspectRatio
  }

  const config = {
    thinkingConfig: {
      thinkingLevel: 'MINIMAL'
    },
    imageConfig,
    responseModalities: ['IMAGE']
  }

  try {
    const base64Input = fs.readFileSync(inputPath, { encoding: 'base64' })
    const mimeTypeInput = getInputMimeType(inputPath)

    const payload = {
      model: resolvedOptions.model,
      config,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Input,
                mimeType: mimeTypeInput
              }
            }
          ]
        }
      ]
    }

    const response = await ai.models.generateContent(payload)

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts
      for (const part of parts) {
        if (part.inlineData) {
          const base64Image = part.inlineData.data
          const mimeTypeOut = part.inlineData.mimeType || 'image/png'
          const imageBuffer = Buffer.from(base64Image, 'base64')
          const finalPath = resolveOutputPath(outputPath, mimeTypeOut, imageBuffer)
          fs.writeFileSync(finalPath, imageBuffer)
          return finalPath
        }
      }
      throw new Error('Model did not return an image format we could parse.')
    } else {
      throw new Error('No candidates returned by the API.')
    }
  } catch (err) {
    throw new Error(`API Request Failed: ${err.message}`)
  }
}

export {
  DEFAULT_MODEL,
  LITE_MODEL,
  detectImageExtension,
  getInputMimeType,
  normalizeImageSize,
  resolveOutputPath,
  resolveImageOptions,
  resolveModel,
  generateImage,
  editImage
}
