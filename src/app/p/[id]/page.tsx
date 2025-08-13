import { notFound } from 'next/navigation'
import { PageRenderer } from '@/components/page-renderer'
import { PageSpec, CopySpec, ThemeTokens, NormalizedPhoto } from '@/lib/schemas'
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

interface PageData {
  pageSpec: PageSpec
  copySpec: CopySpec
  themeTokens: ThemeTokens
}

async function getPageData(id: string): Promise<PageData | null> {
  try {
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', id)
      .eq('published', true)
      .single()

    if (error || !page) {
      return null
    }

    return {
      pageSpec: page.page_spec,
      copySpec: page.copy_spec,
      themeTokens: page.tokens,
    }
  } catch (error) {
    console.error('Get page error:', error)
    return null
  }
}

async function getImages(pageSpec: PageSpec): Promise<Record<string, NormalizedPhoto>> {
  const images: Record<string, NormalizedPhoto> = {}
  
  if (!pageSpec.images) return images

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const imagePromises = Object.entries(pageSpec.images).map(async ([sectionId, imageSpec]: [string, any]) => {
    try {
      const response = await fetch(`${baseUrl}/api/pexels/search?q=${encodeURIComponent(imageSpec.query)}&orientation=${imageSpec.orientation}&perPage=1`)
      const result = await response.json()
      
      if (result.photos && result.photos.length > 0) {
        images[sectionId] = result.photos[0]
      }
    } catch (err) {
      console.error('Failed to fetch image for', sectionId, err)
    }
  })

  await Promise.allSettled(imagePromises)
  return images
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const pageData = await getPageData(id)
  
  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  return {
    title: pageData.pageSpec.meta.title,
    description: pageData.pageSpec.meta.description,
  }
}

export default async function GeneratedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pageData = await getPageData(id)
  
  if (!pageData) {
    notFound()
  }

  const images = await getImages(pageData.pageSpec)

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --font-heading: ${pageData.themeTokens.fonts.heading}, sans-serif;
            --font-body: ${pageData.themeTokens.fonts.body}, sans-serif;
          }
        `
      }} />
      <PageRenderer
        sections={pageData.pageSpec.sections}
        copySpec={pageData.copySpec}
        tokens={pageData.themeTokens}
        images={images}
      />
    </>
  )
}
