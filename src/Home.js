import { useEffect, useRef, useState } from "react"
import TimelineItem from "./components/Timeline"
import ImageModal from "./components/Modal"
import { timelineData } from "./data/project-data"

export default function Home() {
  const [scrollDirection, setScrollDirection] = useState(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const lastScrollTop = useRef(0)
  const scrollPositionBeforeModal = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop

      //  scroll direction
      if (currentScrollTop > lastScrollTop.current) {
        setScrollDirection("down")
      } else {
        setScrollDirection("up")
      }

      // Update scroll position (as percentage)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (currentScrollTop / scrollHeight) * 100
      setScrollPosition(scrollPercentage)

      lastScrollTop.current = currentScrollTop
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleImageClick = (item) => {
    // Store current scroll position before opening modal
    scrollPositionBeforeModal.current = window.pageYOffset || document.documentElement.scrollTop
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
    // Restore scroll position after modal closes
    setTimeout(() => {
      window.scrollTo({
        top: scrollPositionBeforeModal.current,
        behavior: "auto",
      })
    }, 50)
  }

  return (
    <main className="relative min-h-[300vh] bg-black text-white overflow-hidden">
      <div className="fixed top-0 left-0 p-4 z-10 bg-black/50 rounded-br-lg">
        <div className="text-sm">
          <div>Scroll Direction: {scrollDirection || "none"}</div>
          <div>Scroll Position: {scrollPosition.toFixed(2)}%</div>
        </div>
      </div>

      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center px-4">Scroll Down to Explore the Timeline</h1>
      </div>

      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            scrollPosition={scrollPosition}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      <ImageModal item={selectedItem} onClose={handleCloseModal} />
    </main>
  )
}

