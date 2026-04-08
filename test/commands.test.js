import 'dotenv/config'
import { expect } from 'chai'
import { editCommand, generateCommand } from '../src/commands.js'

describe('CLI Commands', () => {
  it('should have generateCommand', () => {
    expect(generateCommand).to.be.a('function')
  })
  it('should have editCommand', () => {
    expect(editCommand).to.be.a('function')
  })
})
