const fs = require('fs')
const { lstatSync, readdirSync } = require('fs')
const path = require('path')
const { parse } = require('vue-docgen-api')

export const srcUrl = path.join(process.cwd(), 'src')
export const slicesUrl = path.join(process.cwd(), 'src/slices')

export const prod = () => process.env.NODE_ENV === 'production'

const isDirectory = source => lstatSync(source).isDirectory()

export const getDirectories = source =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)

export const readCustomTypes = folder => {
  if (folder) {
    const customTypesPath = path.join(folder, 'index.json')
    // test path maybe?
    const customTypes = JSON.parse(fs.readFileSync(customTypesPath, 'utf8'))
    customTypes.forEach(t => {
      const customType = t
      const valuePath = path.join(folder, customType.value)
      customType.value = JSON.parse(fs.readFileSync(valuePath, 'utf8'))
    })
    return customTypes
  }
  return null
}

const hyphenateRE = /\B([A-Z])/g
const hyphenate = str => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * Extracts and returns a slice definition object
 * @param  {String} sliceName name of your slice
 * @return {Object}           An object with snake cased `sliceName`
 */
export const getModelFromSliceName = sliceName => {
  try {
    const component = parse(
      path.join(process.cwd(), `src/slices/${sliceName}/index.vue`)
    )
    const model = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), `src/slices/${sliceName}/model.json`),
        'utf8'
      )
    )
    const key = hyphenate(component.displayName).replace(/-/g, '_')
    return { [key]: model }
  } catch (e) {
    console.error(e) // eslint-disable-line
  }
}

export const zipFile = (zip, pathFrom, pathTo) => {
  try {
    const f = fs.readFileSync(pathFrom, 'utf8')
    zip.file(pathTo, f)
  } catch (e) {
    if (!prod()) {
      console.error('error in api/utils.js[38]: ', e)
    }
  }
}

// Change this when you allow users to select the slices they want
export const getSliceNames = slicesParams => {
  const allSlices = getDirectories(slicesUrl)
  return allSlices.map(path => {
    const spl = path.split('/')
    return spl[spl.length - 1]
  })
}
