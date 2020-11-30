declare module "probe-image-size" {
  import needle from "needle"

  namespace probe {
    interface _BaseResult {
      width: number
      height: number
      length: number
      type: string
      mime: string
      wUnits: string
      hUnits: string
      variants?: { width: number; height: number }[]
    }

    interface HTTPResult extends _BaseResult {
      url: string
    }

    interface StreamResult extends _BaseResult {}
    interface SyncResult extends _BaseResult {}

    type Result = HTTPResult | StreamResult

    function sync(
      src: number[] | Buffer | ArrayBufferView
    ): probe.SyncResult | null
  }

  function probe(
    src: string,
    options?: needle.NeedleOptions
  ): Promise<probe.HTTPResult>

  function probe(
    src: NodeJS.ReadableStream,
    keepOpen?: boolean
  ): Promise<probe.StreamResult>

  export = probe
}
