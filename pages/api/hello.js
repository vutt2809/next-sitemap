// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { api } from '@/utils/api'
import { addLinkToSitemap, generateFile, getListTypeSitemap } from '@/utils/helpers'
import fs from 'fs'
import path from 'path'

const fileDir = path.join(process.cwd(), 'public/sitemap')
const WEBSITE_URL = 'http://localhost/'

const slugs = getListTypeSitemap(api)

const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

const robotsContent = `# *
User-agent: *
Disallow: /404

# *
User-agent: *
Allow: /

# Host
Host: http://localhost:3000/

# Sitemaps
Sitemap: http://localhost:3000/sitemap.xml`

const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map((item) => `<sitemap><loc>http://localhost:3000/sitemap/${item}.xml</loc></sitemap>`).join('\n')}
</sitemapindex>
`

export default function handler(req, res) {
    console.log(req.query)
    if (!fs.existsSync(fileDir))
        fs.mkdir(fileDir, null, (err) => {
            if (err) throw err
        })

    generateFile(fileDir + '/robots.txt', robotsContent)
    generateFile(fileDir + '/index.xml', indexContent)

    let phimtruyenSitemap = sitemapTemplate
    let truyenhinhSitemap = sitemapTemplate
    let vodSitemap = sitemapTemplate

    api.map((item) => {
        let url = ''

        switch (item.type_id) {
            case '2':
            case '20':
            case '21': {
                url = `phim-truyen/${item.content_id}?type_id=${item.type_id}&amp;p=1`
                phimtruyenSitemap += addLinkToSitemap(WEBSITE_URL, url)
                break
            }
            case '1': {
                url = `truyen-hinh/${item.content_id}?type=1`
                truyenhinhSitemap += addLinkToSitemap(WEBSITE_URL, url)
                break
            }
            case '3':
            case '6':
            case '7':
            case '8':
            case '9':
            case '10':
            case '11':
            case '12': {
                url = `vod/${item.content_id}?type_id=${item.type_id}&amp;p=1`
                vodSitemap += addLinkToSitemap(WEBSITE_URL, url)
                break
            }
            default: {
                break
            }
        }
    })

    phimtruyenSitemap += '</urlset>'
    truyenhinhSitemap += '</urlset>'
    vodSitemap += '</urlset>'

    const fileNamePhimTruyen = fileDir + '/' + 'phim-truyen' + '.xml'
    const fileNameTruyenHinh = fileDir + '/' + 'truyen-hinh' + '.xml'
    const fileNameVod = fileDir + '/' + 'vod' + '.xml'

    generateFile(fileNamePhimTruyen, phimtruyenSitemap)
    generateFile(fileNameTruyenHinh, truyenhinhSitemap)
    generateFile(fileNameVod, vodSitemap)
    res.status(200).json({ name: 'Sitemap was created successfully' })
}
