import fs from 'fs'
export const addLinkToSitemap = (WEBSITE_URL, url) => {
    return `<url><loc>${WEBSITE_URL}${url}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>1.00</priority><changefreq>daily</changefreq></url>`
}

export const generateFile = (fileDir, fileName) => {
    fs.writeFile(fileDir, fileName, (err) => {
        if (err) throw err
    })
}

export const getListTypeSitemap = (apiData) => {
    let slug = ''
    const slugs = []
    apiData.map((item) => {
        switch (item.type_id) {
            case '2':
            case '20':
            case '21': {
                slug = 'phim-truyen'
                break
            }
            case '1': {
                slug = 'truyen-hinh'
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
                slug = 'vod'
                break
            }
            default: {
                break
            }
        }

        if (!slugs.includes(slug)) {
            slugs.push(slug)
            slug = ''
        }
    })

    return slugs
}
