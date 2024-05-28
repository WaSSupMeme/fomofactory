import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  type?: string
  image?: string
  siteName?: string
}

export default function SEO({ title, description, type = 'website', image, siteName }: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {/* End standard metadata tags */}
      {/* OG tags */}
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {/* End OG tags */}
    </Helmet>
  )
}
