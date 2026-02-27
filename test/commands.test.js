const { expect } = require('chai')
const { generateCommand, editCommand } = require('../src/commands')

describe('CLI Commands', () => {
  it('should have generateCommand', () => {
    expect(generateCommand).to.be.a('function')
  })
  it('should have editCommand', () => {
    expect(editCommand).to.be.a('function')
  })
})
