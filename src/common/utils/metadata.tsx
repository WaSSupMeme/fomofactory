import parse from 'html-react-parser'

export async function fetchMetadata(path: string): Promise<string | JSX.Element | JSX.Element[]> {
  try {
    const url = new URL(import.meta.env.VITE_FRAME_APP_PROXY_URL)
    url.searchParams.append('path', encodeURIComponent(path))
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    })

    if (response.ok) {
      const html = (await response.json()) as string
      const frame = parse(html)

      console.log('frame', frame)

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
