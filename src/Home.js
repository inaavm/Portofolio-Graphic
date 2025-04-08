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
  
  // Background color states
  const backgroundColors = [
    'rgb(45,51,176)',
    'rgb(120, 62, 194)',
    'rgb(120, 62, 194)',
    'rgb(45,51,176)',
    'rgb(255, 85, 53)',
    'rgb(45,51,176)'
  ]

  const [currentSection, setCurrentSection] = useState(0)

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

      // Calculate which background color section we're in based on scroll percentage
      // Divide the scroll range into equal parts based on number of colors
      const sectionSize = 100 / backgroundColors.length
      const sectionIndex = Math.floor(scrollPercentage / sectionSize)
      
      // Limit the index to our available colors
      const limitedIndex = Math.min(sectionIndex, backgroundColors.length - 1)
      
      // Update background color section if changed
      if (limitedIndex !== currentSection) {
        setCurrentSection(limitedIndex)
      }

      lastScrollTop.current = currentScrollTop
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSection])

  // Effect to change the background color
  useEffect(() => {
    // Apply the background color to the body
    document.body.style.backgroundColor = backgroundColors[currentSection]
    
    // Add transition effect for smooth color changes
    document.body.style.transition = 'background-color 0.8s ease-in-out'
  }, [currentSection])

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
    <main className="relative min-h-[300vh] text-white overflow-hidden">

         <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 z-10 ">
        <div className="text-m">
          <div>irina avram</div>
         
        </div>
      </div>
      
      {/* <div className="fixed top-0 left-0 p-4 z-10 bg-black/50 rounded-br-lg">
        <div className="text-sm">
          <div>Scroll Direction: {scrollDirection || "none"}</div>
          <div>Scroll Position: {scrollPosition.toFixed(2)}%</div>
          <div>Background: {backgroundColors[currentSection]}</div>
        </div>
      </div> */}

        <div
          className="h-screen flex items-center justify-center"
          style={{
            opacity: 1 - scrollPosition / 40, // Fades out as you scroll down
            color: `rgb(255, 255, 255, ${1 - scrollPosition / 10})`, // Optional: fades text color
            transition: "opacity 0.3s ease-out, color 0.3s ease-out",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center px-4">
            a selection of works
          </h1>
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
      <a className="text-2xl font-semibold mb-32 block" href="https://irina-avram.carbonmade.com/about">
      about ...

      </a>
      
    </main>
  )
}