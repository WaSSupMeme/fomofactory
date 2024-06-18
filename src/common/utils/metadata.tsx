import parse from 'html-react-parser'

export async function fetchMetadata(path: string): Promise<JSX.Element | JSX.Element[]> {
  try {
    const url = new URL(import.meta.env.VITE_FRAME_APP_PROXY_URL)
    url.searchParams.append('path', encodeURIComponent(path))
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
      cache: 'no-cache',
    })

    if (response.ok) {
      const metadata = (await response.json()) as { metadata: string[] }
      const frame = metadata.metadata.map((tag) => parse(tag) as JSX.Element)
      return frame
    } else if (response.status) {
      console.warn(
        `Failed to fetch frame metadata from ${url.toString()}. Status code: ${response.status}`,
      )
    }
  } catch (error) {
    console.warn(`Failed to fetch frame metadata for ${path}.`, error)
  }

  return <></>
}
