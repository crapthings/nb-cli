#!/usr/bin/env node

import fs from 'node:fs'
import { program } from 'commander'
import { editCommand, generateCommand, iconCommand } from '../src/commands.js'

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

program
  .name('nb')
  .description('Nano Banana (Google Gemini Image) CLI Tool')
  .version(packageJson.version)

program
  .command('generate <prompt>')
  .description('Generate an image using Nano Banana model')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .option('-a, --aspect-ratio <ratio>', 'Aspect ratio: 21:9, 16:9, 1:1, etc.')
  .option('-m, --model <model>', 'Model alias or ID: default, lite, gemini-3.1-flash-lite-image')
  .action(generateCommand)

program
  .command('icon <prompt>')
  .description('Generate a 1:1 icon')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .option('-m, --model <model>', 'Model alias or ID: default, lite, gemini-3.1-flash-lite-image')
  .action(iconCommand)

program
  .command('edit <image_path> <prompt>')
  .description('Edit an existing image using Nano Banana model')
  .option('-o, --output <path>', 'Output file path')
  .option('-s, --size <size>', 'Image resolution: 512, 1k, 2k, 4k')
  .option('-a, --aspect-ratio <ratio>', 'Aspect ratio: 21:9, 16:9, 1:1, etc.')
  .option('-m, --model <model>', 'Model alias or ID: default, lite, gemini-3.1-flash-lite-image')
  .action(editCommand)

program.parse(process.argv)
