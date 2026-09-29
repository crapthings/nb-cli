import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { expect } from 'chai'
import { DEFAULT_MODEL, LITE_MODEL, generateImage, editImage } from '../src/api.js'

describe('Google SDK compatibility', () => {
  let directory
  let originalFetch
  let originalApiKey
  let request
  const image = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0])

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nb-sdk-'))
    originalFetch = globalThis.fetch
    originalApiKey = process.env.GEMINI_API_KEY
    process.env.GEMINI_API_KEY = 'test-key'
    globalThis.fetch = async (url, init) => {
      request = { url: String(url), body: JSON.parse(init.body) }
      return new Response(JSON.stringify({
        candidates: [{
          content: {
            role: 'model',
            parts: [{ inlineData: { mimeType: 'image/jpeg', data: image.toString('base64') } }]
          }
        }]
      }), { headers: { 'content-type': 'application/json' } })
    }
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('serializes image generation options and saves the SDK response', async () => {
    const output = await generateImage('A banana', path.join(directory, 'generated'), { aspectRatio: '16:9' })
    expect(request.url).to.include(`${DEFAULT_MODEL}:generateContent`)
    expect(request.body.contents).to.deep.equal([{ role: 'user', parts: [{ text: 'A banana' }] }])
    expect(request.body.generationConfig).to.deep.equal({
      thinkingConfig: { thinkingLevel: 'MINIMAL' },
      imageConfig: { imageSize: '0.5K', aspectRatio: '16:9' },
      responseModalities: ['IMAGE']
    })
    expect(output).to.equal(path.join(directory, 'generated.jpg'))
    expect(fs.readFileSync(output)).to.deep.equal(image)
  })

  it('serializes an edit image and resolves the lite model configuration', async () => {
    const input = path.join(directory, 'input.jpg')
    fs.writeFileSync(input, image)
    const output = await editImage(input, 'Make it blue', path.join(directory, 'edited.jpg'), { model: 'lite' })
    expect(request.url).to.include(`${LITE_MODEL}:generateContent`)
    expect(request.body.contents[0].parts).to.deep.equal([
      { text: 'Make it blue' },
      { inlineData: { data: image.toString('base64'), mimeType: 'image/jpeg' } }
    ])
    expect(request.body.generationConfig.imageConfig).to.deep.equal({ imageSize: '1K' })
    expect(fs.readFileSync(output)).to.deep.equal(image)
  })
})
