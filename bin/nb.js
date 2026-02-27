#!/usr/bin/env node

require('dotenv').config()
const { program } = require('commander')
const { generateCommand, editCommand, iconCommand } = require('../src/commands')

program
  .name('nb')
  .description('Nano Banana (Google Gemini Image) CLI Tool')
  .version('1.0.0')

program
  .command('generate <prompt>')
  .description('Generate an image using Nano Banana model')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .option('-a, --aspect-ratio <ratio>', 'Aspect ratio: 21:9, 16:9, 1:1, etc.')
  .action(generateCommand)

program
  .command('icon <prompt>')
  .description('Generate a 1:1 icon')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .action(iconCommand)

program
  .command('edit <image_path> <prompt>')
  .description('Edit an existing image using Nano Banana model')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .option('-a, --aspect-ratio <ratio>', 'Aspect ratio: 21:9, 16:9, 1:1, etc.')
  .action(editCommand)

program.parse(process.argv)
