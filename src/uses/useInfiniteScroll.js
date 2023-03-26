import { useEffect } from 'react'

const defaultOptions = {
    root: null,
    rootMargin: '20px',
    threshold: 1.0
}

const UseInfiniteScroll = ({ ref, haveMoreItems, loadMoreItems, options }) => {

    const handleObserver = (entries) => {
        if (entries[0].isIntersecting && haveMoreItems) {
            loadMoreItems?.()
        }
    }

    const mergedOptions = { ...defaultOptions, ...options }

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, mergedOptions)

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [haveMoreItems])
}

UseInfiniteScroll.defaultProps = {
    ref: null,
    haveMoreItems: true,
    loadMoreItems: null,
    options: null
}

export default UseInfiniteScroll
