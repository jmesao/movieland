import { useEffect } from 'react'

const options = {
    root: null,
    rootMargin: '20px',
    threshold: 1.0
}

const UseInfiniteScroll = ({ ref, haveMoreItems, loadMoreItems }) => {

    const handleObserver = (entries) => {
        if (entries[0].isIntersecting && haveMoreItems) {
            loadMoreItems()
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, options)

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

export default UseInfiniteScroll
