import { NextRequest, NextResponse } from 'next/server'
import { NormalizedPhoto } from '@/lib/schemas'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const orientation = searchParams.get('orientation') || 'landscape'
    const perPage = parseInt(searchParams.get('perPage') || '20')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY!,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Pexels API request failed')
    }

    const data = await response.json()

    // Normalize Pexels response to our format
    const normalizedPhotos: NormalizedPhoto[] = data.photos.map((photo: any) => ({
      id: photo.id,
      alt: photo.alt || 'Stock photo',
      width: photo.width,
      height: photo.height,
      src: {
        tiny: photo.src.tiny,
        small: photo.src.small,
        medium: photo.src.medium,
        large: photo.src.large,
        original: photo.src.original,
      },
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      pexels_url: photo.url,
    }))

    // Score and sort images (prefer landscape for Hero, higher resolution)
    const scoredPhotos = normalizedPhotos.map((photo) => {
      let score = 0
      
      // Prefer landscape orientation for most use cases
      if (photo.width > photo.height) score += 10
      
      // Prefer higher resolution
      score += Math.min(photo.width / 100, 20)
      
      // Prefer "studio" or "minimal" in query
      if (query.toLowerCase().includes('studio') || query.toLowerCase().includes('minimal')) {
        score += 5
      }

      return { ...photo, score }
    })

    const sortedPhotos = scoredPhotos
      .sort((a, b) => b.score - a.score)
      .slice(0, perPage)

    return NextResponse.json({ photos: sortedPhotos })

  } catch (error) {
    console.error('Pexels API error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
