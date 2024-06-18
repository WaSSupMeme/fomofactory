import { Helmet } from 'react-helmet-async'
import { fetchMetadata, metadataToMetaTags } from 'frames.js/next/pages-router/client'
import { useEffect, useState } from 'react'

interface SEOProps {
  title?: string
  subtitle?: string
  description?: string
  type?: string
  image?: string
  siteName?: string
  frame?: string
}

export default function SEO({
  title,
  subtitle,
  description,
  type = 'website',
  image,
  siteName,
  frame,
}: SEOProps) {
  const [frameMetadata, setFrameMetadata] = useState<JSX.Element>()

  useEffect(() => {
    const getMetadata = async () => {
      if (frame) return
      const metadata = await fetchMetadata(
        new URL(`/api${frame}`, import.meta.env.VITE_FRAME_APP_URL),
      )
      setFrameMetadata(metadataToMetaTags(metadata))
    }
    getMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Helmet>
      {/* Standard metadata tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {/* End standard metadata tags */}
      {/* OG tags */}
      <meta property="og:type" content={type} />
      {title && !frameMetadata && <meta property="og:title" content={subtitle} />}
      {description && <meta property="og:description" content={description} />}
      {image && !frameMetadata && <meta property="og:image" content={image} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {/* End OG tags */}
      {frameMetadata}
    </Helmet>
  )
}
