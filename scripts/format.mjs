#!/bin/env node

import glob from 'tiny-glob'
import prettier from 'prettier'
import { promises as fs } from 'fs'

async function format(path) {
  if (path == 'src/Node.svelte') return true // Problem with html entities

  try {
    const contents = await fs.readFile(path, { encoding: 'utf8' })
    const formatted = prettier.format(contents, {
      filepath: path,
      semi: false,
      singleQuote: true,
      pluginSearchDirs: ['.'],
      sortOrder: 'zen'
    })
    if (formatted == contents) {
      console.log(`\x1b[2m${path}\x1b[0m`)
      return true
    }

    console.log(path)
    await fs.writeFile(path, formatted)
    return true
  } catch (err) {
    console.error(`\x1b[31m${path}\x1b[0m`)
    console.error(err.message)
    return false
  }
}

;(async function() {
  const files = await glob('!(node_modules)/**/*.{js,mjs,svelte,html,json}')
  const res = await Promise.all(files.map(format))
  if (res.some(o => !o)) process.exit(1)
})()
