import React, { useState, useEffect, useRef } from 'react';
import { TiChevronLeftOutline, TiChevronRightOutline } from 'react-icons/ti';
import styles from './Testimonials.module.css';
import { FaStar } from 'react-icons/fa'; // Importing FontAwesome star icon for rating display
import { Section } from 'components/Section';

const MAX_VISIBILITY = 3; // Maximum number of testimonials visible at once

/**
 * Card component representing a single testimonial
 * @param {Object} props - Contains company, name, review, and image for the testimonial
 */
export const Card = ({ company, name, review, image }) => (
  <div className={styles.card}>
    {/* Profile image */}
    <img src={image} alt={`${name}'s profile`} className={styles.profileImage} />
    {/* User's name */}
    <h3 className={styles.profileName}>{name}</h3>
    {/* Company name */}
    <h4 className={styles.companyName}>{company}</h4>
    {/* 5-star rating display */}
    <div className={styles.starRating}>
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
    </div>
    {/* User's review */}
    <p className={styles.review}>{review}</p>
  </div>
);

/**
 * Testimonials component that displays and controls the testimonial cards
 * @param {Object} props - Contains children components and sectionRef for referencing
 */
export const Testimonials = ({ children, sectionRef }) => {
  const [active, setActive] = useState(1); // State to track the active testimonial
  const count = React.Children.count(children); // Total number of testimonial children
  const cardRefs = useRef([]); // Refs for each testimonial card for animation and interaction

  // Effect hook to add or remove event listeners based on the active card
  useEffect(() => {
    // Reset styles and remove listeners from all cards
    cardRefs.current.forEach((card, index) => {
      card.style.transform = ''; // Reset transform
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    });

    // Add event listeners to the active card for interactive animation
    const activeCard = cardRefs.current[active];
    if (activeCard) {
      activeCard.addEventListener('mousemove', handleMouseMove);
      activeCard.addEventListener('mouseleave', handleMouseLeave);
    }
  }, [active]); // Dependency array to run effect when 'active' state changes

  /**
   * Handles mouse move over a card, creating a 3D effect
   * @param {Object} e - Mouse event
   */
  const handleMouseMove = e => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      // Calculate the center of the card
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Calculate position of the mouse relative to the center of the card
      const x = e.clientX - centerX; // X position from the center
      const y = e.clientY - centerY; // Y position from the center
      // Calculate rotation angles, ensuring that the rotation is more subtle
      const rotationRatio = 20; // Increase or decrease for more/less "tilt"
      const rotateY = (x / rect.width) * rotationRatio;
      const rotateX = -(y / rect.height) * rotationRatio;
      // Apply 3D rotation with smoother transition and perspective
      card.style.transition = 'transform 0.1s'; // Smooth transition for rotation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };


  /**
   * Resets card style on mouse leave
   * @param {Object} e - Mouse event
   */
  const handleMouseLeave = e => {
    const card = e.currentTarget;
    // Reset transform with transition for smooth effect
    card.style.transition = 'transform 0.5s'; // Smooth transition back to initial state
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  /**
   * Navigates to the next testimonial
   */
  const goToNext = () => {
    setActive(currentActive => (currentActive + 1) % count);
  };

  /**
   * Navigates to the previous testimonial
   */
  const goToPrevious = () => {
    setActive(currentActive => (currentActive - 1 + count) % count);
  };

  return (
    <Section
      as="section"
      ref={sectionRef}
      id={'testimonials'}
      aria-labelledby={'testimonials'}
      tabIndex={-1}
    >
      <div className={styles.wrapper}>
        <div className={styles.carousel}>
          {/* Navigation button for previous testimonial */}
          <button className={`${styles.nav} ${styles.navLeft}`} onClick={goToPrevious}>
            <TiChevronLeftOutline />
          </button>
          {/* Mapping through each child (testimonial) and applying styles */}
          {React.Children.map(children, (child, i) => (
            <div
              ref={el => (cardRefs.current[i] = el)}
              className={`${styles.cardContainer} ${i === active ? styles.active : ''}`}
              style={{
                '--offset': (active - i) / 3,
                '--direction': Math.sign(active - i),
                '--abs-offset': Math.abs(active - i) / 3,
                'pointer-events': active === i ? 'auto' : 'none',
                opacity: Math.abs(active - i) < MAX_VISIBILITY ? '1' : '0',
                display: Math.abs(active - i) < MAX_VISIBILITY ? 'block' : 'none',
              }}
            >
              {child}
            </div>
          ))}
          {/* Navigation button for next testimonial */}
          <button className={`${styles.nav} ${styles.navRight}`} onClick={goToNext}>
            <TiChevronRightOutline />
          </button>
        </div>
      </div>
    </Section>
  );
};
