import type { Element } from "hast"
import PQueue from "p-queue"
import probe from "probe-image-size"
import type { Plugin } from "unified"
import visit from "unist-util-visit"
import url from "url"

export type Options = { concurrency?: number; allowedDomains?: string[] }

const addImageDimensions: Plugin<[options?: Options], undefined> = ({
  concurrency = 5,
  allowedDomains,
} = {}) => {
  const queue = new PQueue({ concurrency })

  const isAllowed: (src: string) => boolean = allowedDomains
    ? (src) => allowedDomains.includes(url.parse(src).hostname!)
    : (_) => true

  return async (tree) => {
    const promises: Promise<any>[] = []

    visit(tree, "element", (node: Element) => {
      promises.push(
        queue.add(async () => {
          const props = (node.properties ??= {})
          const src = props.src as string | undefined
          if (
            !src ||
            !isAllowed(src) ||
            (props.width != null && props.height != null)
          )
            return

          const { width, height } = await probe(src)
          props.width = width
          props.height = height
        })
      )
    })

    await Promise.all(promises)
  }
}

export default addImageDimensions
