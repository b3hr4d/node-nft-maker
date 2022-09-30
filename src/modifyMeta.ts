import { writeFile } from "fs/promises"
import allMeta from "../dist/allMetaArray.json"
import { getPath } from "./files"

// covert each tilemap inside allMeta from object to array
const convert = async () => {
  const allMetaArray = allMeta.map((meta) => {
    return {
      ...meta,
      tileMap: Object.values(meta.tileMap),
    }
  })

  // save allMetaArray to file

  await writeFile(
    getPath(`../dist/allMetaArray.json`),
    JSON.stringify(allMetaArray, null, 2)
  )
}

// recalculate all base types "Grass" "Snow" "Water" "Sand" from attributes allMetaArray
const recalculateBaseTypes = async () => {
  const allBaseTypes = {
    Grass: 0,
    Snow: 0,
    Water: 0,
    Sand: 0,
  }

  allMeta.forEach(({ attributes }: any) => {
    const baseType = attributes[0].value as keyof typeof allBaseTypes
    allBaseTypes[baseType]++
  })

  await writeFile(
    getPath(`../dist/allBaseTypes.json`),
    JSON.stringify(allBaseTypes, null, 2)
  )
}

recalculateBaseTypes()
