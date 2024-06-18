import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = decodeURIComponent(req.query['path'] as string)
    const url = `${process.env['VITE_FRAME_APP_URL']}/api/${path}`
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    })

    if (response.ok) {
      const html = await response.text()

      const s = new XMLSerializer()
      const doc = new DOMParser().parseFromString(html, 'text/xml')
      if (!doc.getElementsByTagName('head').length) return res.json({ error: 'No head tag found' })

      console.log(s.serializeToString(doc.getElementsByTagName('head')[0]!!))

      return res.json({ metadata: s.serializeToString(doc.getElementsByTagName('head')[0]!!) })
    } else if (response.status) {
      return res.json({ error: `Failed to fetch metadata: ${response.status}` })
    }

    return res.json({ error: 'Failed to fetch metadata' })
  } catch (error) {
    return res.json({ error: `Failed to fetch metadata: ${error}` })
  }
}
