// BackgroundColorScroll.jsx
import React, { useEffect, useState } from 'react';

const BackgroundColorScroll = () => {
  // Array of background colors to cycle through
  const backgroundColors = [
    'rgb(0, 0, 0)',
    'rgb(255, 255, 255)',
    'rgb(254, 95, 85)',
    'rgb(67, 124, 144)',
    'rgb(255, 211, 0)'
  ];

  // State to track current section index
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      // Calculate which section we're in based on scroll position
      // Each section is 100vh tall
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.floor(scrollPosition / windowHeight);
      
      // Limit the index to our available colors
      const limitedIndex = Math.min(sectionIndex, backgroundColors.length - 1);
      
      // Update state if section changed
      if (limitedIndex !== currentSection) {
        setCurrentSection(limitedIndex);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for page load
    handleScroll();

    // Cleanup event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  useEffect(() => {
    // Apply the background color to the body
    document.body.style.backgroundColor = backgroundColors[currentSection];
    
    // Optional: add transition effect
    document.body.style.transition = 'background-color 0.8s ease-in-out';
  }, [currentSection]);

  return (
    <div>
      {/* Content sections - each 100vh tall */}
      {backgroundColors.map((_, index) => (
        <section 
          key={index}
          className="h-screen w-full flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold">Section {index + 1}</h2>
        </section>
      ))}
    </div>
  );
};

export default BackgroundColorScroll;