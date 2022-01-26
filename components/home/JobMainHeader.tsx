import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/JobMainHeader.module.scss'
import Image from 'next/image'

function JobMainHeader(props: any): JSX.Element {
    const { jobMainRef } = props
    const [isShowLogo, setIsShowLogo] = useState<boolean>(true)
    const isShowJobMainLogo = useRef<boolean>(false)

    useEffect((): (() => void) => {
        const onScroll = () => {
            if (!isShowJobMainLogo?.current && window.scrollY < 15) {
                const isShowModal: boolean = jobMainRef?.current?.style?.getPropertyValue('margin-top')?.includes('rem')
                if (isShowModal) {
                    return
                }
                isShowJobMainLogo.current = true
                setIsShowLogo(isShowJobMainLogo?.current)
                return
            }
            if (isShowJobMainLogo?.current && window.scrollY >= 15) {
                isShowJobMainLogo.current = false
                setIsShowLogo(isShowJobMainLogo?.current)
            }
        }

        window.addEventListener('scroll', onScroll)

        return (): void => {
            isShowJobMainLogo.current = true
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <header className={styles.jobMainHeader}>
            <div className={styles.logo}>
                {isShowLogo && <Image className={styles.logoImg} src="/logo.svg" alt='' width={50} height={44} />}
                {!isShowLogo && <p className={styles.title}>{'일거리 찾기'}</p>}
            </div>
        </header>
    )
}

export default JobMainHeader
