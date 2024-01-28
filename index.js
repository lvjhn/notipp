import { dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Export base path for use in other scripts.
 */
export const BASE_PATH = 
    dirname(fileURLToPath(import.meta.url))


export default {
    randomGen
}
    