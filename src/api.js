const { GoogleGenAI } = require('@google/genai')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

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

async function generateImage (prompt, outputPath, options = {}) {
  const ai = getClient()

  // API expects 0.5K, 1K, 2K, 4K for imageSize
  let imageSize = '0.5K'
  if (options.size) {
    imageSize = options.size.toUpperCase()
    if (imageSize === '512') imageSize = '0.5K'
  }

  const imageConfig = {
    imageSize
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
    model: 'gemini-3.1-flash-image-preview',
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
          const extension = mime.getExtension(mimeType) || 'png'

          // Ensure output path has an extension if it was randomly generated without one
          let finalPath = outputPath
          if (!path.extname(finalPath)) {
            finalPath = `${finalPath}.${extension}`
          }

          fs.writeFileSync(finalPath, Buffer.from(base64Image, 'base64'))
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

  let imageSize = '0.5K'
  if (options.size) {
    imageSize = options.size.toUpperCase()
    if (imageSize === '512') imageSize = '0.5K'
  }

  const imageConfig = {
    imageSize
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
    const ext = path.extname(inputPath).toLowerCase()
    const mimeTypeInput = ext === '.png' ? 'image/png' : 'image/jpeg'

    const payload = {
      model: 'gemini-3.1-flash-image-preview',
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
          const extension = mime.getExtension(mimeTypeOut) || 'png'

          let finalPath = outputPath
          if (!path.extname(finalPath)) {
            finalPath = `${finalPath}.${extension}`
          }

          fs.writeFileSync(finalPath, Buffer.from(base64Image, 'base64'))
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

module.exports = {
  generateImage,
  editImage
}
