import path from 'node:path'
import { nanoid } from 'nanoid'
import { editImage, generateImage } from './api.js'

async function generateCommand (prompt, options) {
  const output = options.output || `${nanoid(6)}.jpg`
  const outputPath = path.resolve(output)
  console.log(`Generating image for prompt: "${prompt}"...`)
  try {
    const finalPath = await generateImage(prompt, outputPath, options)
    console.log(`✅ Image successfully generated and saved to ${finalPath}`)
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

async function iconCommand (prompt, options) {
  const output = options.output || `${nanoid(6)}.jpg`
  const outputPath = path.resolve(output)
  const iconPrompt = `High-quality minimalist icon for: ${prompt}`
  console.log(`Generating icon for: "${prompt}"...`)
  try {
    const finalPath = await generateImage(iconPrompt, outputPath, { ...options, aspectRatio: '1:1' })
    console.log(`✅ Icon successfully generated and saved to ${finalPath}`)
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

async function editCommand (imagePath, prompt, options) {
  const inputPath = path.resolve(imagePath)
  const output = options.output || `${nanoid(6)}.jpg`
  const outputPath = path.resolve(output)
  console.log(`Editing image at ${inputPath} with prompt: "${prompt}"...`)
  try {
    const finalPath = await editImage(inputPath, prompt, outputPath, options)
    console.log(`✅ Image successfully edited and saved to ${finalPath}`)
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

export {
  generateCommand,
  iconCommand,
  editCommand
}
