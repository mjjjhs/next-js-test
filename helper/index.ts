export const getFileUrl = (fileUrl: string): string => {
    if (!fileUrl) {
        return ''
    }
    if (fileUrl.includes('http')) {
        return fileUrl
    } else {
        return `https://cdn.dev.gep.aipluslab.ai${fileUrl[0] === '/' ? fileUrl : `/${fileUrl}`}`
    }
}
