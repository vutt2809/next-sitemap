import { api } from '@/utils/api'

const WEBSITE_URL = 'http://localhost/'
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${WEBSITE_URL}</loc></url>
    ${api
        .map(
            ({ type_id, content_id }) => `<url>
      <loc>${WEBSITE_URL}/${content_id}?${type_id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.00</priority>
      <changefreq>monthly</changefreq>
      </url>`,
        )
        .join('\n')}
    </urlset>`

export async function getServerSideProps({ res }) {
    if (res) {
        res.setHeader('Content-Type', 'text/xml')
        res.write(sitemap)
        res.end()
    }

    return { props: {} }
}

const Sitemap = () => {}
export default Sitemap
