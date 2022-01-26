import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

export async function fetchThemes() {
    // Get file names under /posts
    const opt: any = {
        method: 'GET',
        url: 'https://dev.gep.aipluslab.ai/gig/v1/theme/list',
        header: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': uuidv4() + '_' + Date.now(),
        }
    }
    try {
        const themes: any = await axios(opt)
        if(themes?.data?.successOrNot !== 'Y') {
            return []
        }
        return themes?.data?.data
    } catch(e: any) {
        return []
    }
}
