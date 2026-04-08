import { expect } from 'chai'
import { detectImageExtension, getInputMimeType, resolveOutputPath } from '../src/api.js'

describe('API helpers', () => {
  it('detects JPEG bytes even when the claimed MIME type is PNG', () => {
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46])
    expect(detectImageExtension(jpegBuffer)).to.equal('jpg')
  })

  it('throws when the requested extension does not match the actual image bytes', () => {
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46])
    expect(() => resolveOutputPath('/tmp/cyber-cat.png', 'image/png', jpegBuffer)).to.throw('Requested .png output, but Nano Banana returned .jpg.')
  })

  it('adds an extension when the output path has none', () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    expect(resolveOutputPath('/tmp/cyber-cat', 'image/png', pngBuffer)).to.equal('/tmp/cyber-cat.png')
  })

  it('keeps the requested extension when it matches the actual image bytes', () => {
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46])
    expect(resolveOutputPath('/tmp/cyber-cat.jpg', 'image/jpeg', jpegBuffer)).to.equal('/tmp/cyber-cat.jpg')
  })

  it('infers input MIME types from the input path', () => {
    expect(getInputMimeType('/tmp/source.png')).to.equal('image/png')
    expect(getInputMimeType('/tmp/source.webp')).to.equal('image/webp')
    expect(getInputMimeType('/tmp/source.JPG')).to.equal('image/jpeg')
  })

  it('rejects unsupported edit input formats', () => {
    expect(() => getInputMimeType('/tmp/source.txt')).to.throw('Unsupported input image format')
  })
})
