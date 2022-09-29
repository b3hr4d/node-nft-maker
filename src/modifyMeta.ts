import { writeFile } from "fs/promises"
import allMeta from "../dist/allData.json"
import { getPath } from "./files"

// covert each tilemap inside allMeta from object to array
const main = async () => {
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

main()
