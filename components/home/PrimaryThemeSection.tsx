import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../../styles/PrimaryThemeSection.module.scss'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import LinearProgress from '@material-ui/core/LinearProgress'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import Slider from 'react-slick'
import { getFileUrl } from '../../helper'
import Image from 'next/image'

let themeSlideStartX = 0,
    themeSlideSwipedDirection = ''

let fadeOutTimeout: ReturnType<typeof setTimeout>
let fadeInTimeout: ReturnType<typeof setTimeout>

function PrimaryThemeSection(props: any): JSX.Element {
    const { themeList } = props
    const [curCarouselIdx, setCurCarouselIdx] = useState<number>(0)
    const themeDescRef = useRef<HTMLParagraphElement>(null)
    const themeAvatarRef = useRef<HTMLDivElement>(null)
    const slider = useRef<Slider>(null)

    useEffect((): void => {
        slider?.current?.slickGoTo(0, true)
        setCurCarouselIdx(0)
    }, [themeList])

    const sliderSettings = useMemo(() => {
        const defaultSettings = {
            dots: false,
            infinite: true,
            speed: 500,
            autoplaySpeed: 5000,
            centerMode: true,
            slidesToShow: 1,
            arrows: false,
            pauseOnFocus: true,
            pauseOnHover: true,
            variableWidth: true,
            slidesToScroll: 1,
            waitForAnimate: true,
            swipe: false,
            touchMove: false,
            autoplay: false,
        }

        if (!themeList?.length || themeList?.length === 1) {
            return defaultSettings
        }

        return {
            ...defaultSettings,
            autoplay: true,
            beforeChange: () => {
                changedCurCarousel('fade-out')
            },
            afterChange: (current: any) => {
                setCurCarouselIdx(current)
            },
        }
    }, [themeList])

    const sliderStyles = useMemo(() => ({ width: '24rem' }), [])

    useEffect((): (() => void) => {
        return (): void => {
            fadeOutTimeout && clearTimeout(fadeOutTimeout)
            fadeInTimeout && clearTimeout(fadeInTimeout)
        }
    }, [])

    const primaryTextStyles = useCallback(
        (theme: any) => ({ color: theme.primaryThemeTextColor || '#999999' }),
        [],
    )

    const changedCurCarousel = useCallback(
        (fadeType: string): void => {
            if (fadeType === 'fade-in' && fadeInTimeout) {
                clearTimeout(fadeInTimeout)
            } else if (fadeType === 'fade-out' && fadeOutTimeout) {
                clearTimeout(fadeOutTimeout)
            }

            themeDescRef?.current?.classList.add(fadeType)
            themeAvatarRef?.current?.classList.add(fadeType)

            const time: number = fadeType === 'fade-in' ? 300 : 600

            function _removeFade(): void {
                themeDescRef?.current?.classList.remove(fadeType)
                themeAvatarRef?.current?.classList.remove(fadeType)
            }

            if (fadeType === 'fade-in') {
                fadeInTimeout = setTimeout(_removeFade, time)
            } else {
                fadeOutTimeout = setTimeout(_removeFade, time)
            }
        },
        [curCarouselIdx, themeList],
    )

    useEffect((): void => changedCurCarousel('fade-in'), [curCarouselIdx])

    const progressVal = useMemo((): number => {
        const max = themeList.length
        const cur = curCarouselIdx + 1

        return (100 * cur) / max
    }, [curCarouselIdx])

    const handleTouchEnd = useCallback((): void => {
        themeSlideStartX = 0
        if (themeSlideSwipedDirection === 'right') {
            slider?.current?.slickPrev()
        } else if (themeSlideSwipedDirection === 'left') {
            slider?.current?.slickNext()
        }
        themeSlideSwipedDirection = ''
        slider?.current?.slickPlay()
    }, [])

    const handleTouchStart = useCallback((screenX: number): void => {
        themeSlideStartX = screenX
        slider?.current?.slickPause()
    }, [])

    const handleTouchMove = useCallback((screenX: number): void => {
        if (screenX > themeSlideStartX + 60) {
            themeSlideSwipedDirection = 'right'
        } else if (screenX < themeSlideStartX - 60) {
            themeSlideSwipedDirection = 'left'
        }
    }, [])

    const swipeAction = useCallback(
        (event: React.TouchEvent<HTMLDivElement>): void => {
            if (!themeList?.length || themeList.length === 1) {
                return
            }
            if (!slider?.current) {
                return
            }
            const { type } = event
            const { screenX } = event.changedTouches[0]

            if (!screenX) {
                return
            }

            switch (type) {
                case 'touchstart':
                    handleTouchStart(screenX)
                    break
                case 'touchmove':
                    handleTouchMove(screenX)
                    break
                case 'touchend':
                    handleTouchEnd()
                    break
            }
        },
        [themeList],
    )

    return (
        <section id='PrimaryThemeSection' onTouchStart={swipeAction} onTouchMove={swipeAction} onTouchEnd={swipeAction}>
            <div className='bg_img'>
                <Image src="/pattern-01.svg" className='bg_img_pp' width={187} height={187} />
                <Image src="/pattern-02.svg" className='bg_img_gr' width={53} height={57} />
            </div>
            {!!themeList?.length && (
                <React.Fragment>
                    <Slider className={themeList.length === 1 ? 'alone-item' : ''} {...sliderSettings} ref={slider}>
                        {themeList?.map(
                            (theme: any): JSX.Element => (
                                <div
                                    key={theme.themeId}
                                    className='themeSlideItem'
                                    onClick={() => {return}}
                                    style={sliderStyles}
                                >
                                    <Image
                                        width={240}
                                        height={240}
                                        className='slideImage'
                                        src={theme?.themeListFilePath ? getFileUrl(theme.themeListFilePath) : ''}
                                    />
                                    {theme.themeMediaType === 'MEDIA' && (
                                        <React.Fragment>
                                            <div className='dim' />
                                            <PlayCircleOutlineIcon className='play-icon' />
                                        </React.Fragment>
                                    )}
                                </div>
                            ),
                        )}
                    </Slider>
                    <p
                        className='theme-desc'
                        ref={themeDescRef}
                        dangerouslySetInnerHTML={{
                            __html: themeList[curCarouselIdx].themeListDisplayDesc,
                        }}
                        onClick={() => {return}}
                    />
                    <div
                        className='avatar-group-wrap'
                        ref={themeAvatarRef}
                        onClick={() => {return}}
                    >
                        <AvatarGroup className='platformColors' max={5} style={primaryTextStyles(themeList[curCarouselIdx])}>
                            {themeList?.[curCarouselIdx]?.platforms?.map(
                                (platform: any): JSX.Element => (
                                    <div className='avatar-wrap' key={platform.platformId}>
                                        <Avatar
                                            key={platform.platformId}
                                            alt={platform.platformName}
                                            src={
                                                platform.imgFilePath
                                                    ? `https://cdn.dev.gep.aipluslab.ai${platform.imgFilePath}`
                                                    : ''
                                            }
                                            style={primaryTextStyles(themeList[curCarouselIdx])}
                                        />
                                        <div className='img-border-box' />
                                    </div>
                                ),
                            )}
                        </AvatarGroup>
                    </div>
                    <div className='progress-wrap'>
                        <LinearProgress variant='determinate' value={progressVal} />
                    </div>
                </React.Fragment>
            )}
        </section>
    )
}
export default PrimaryThemeSection
