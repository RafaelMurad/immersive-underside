import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './ProjectCard.css';

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  link?: string;
  githubLink?: string;
  featured?: boolean;
}

/**
 * Project card with neon border and hover effects
 */
export function ProjectCard({
  title,
  description,
  image,
  tags = [],
  link,
  githubLink,
  featured = false,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className={`project-card ${featured ? 'project-card--featured' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {image && (
        <div className="project-card__image">
          <img src={image} alt={title} loading="lazy" />
          <div className="project-card__overlay" />
        </div>
      )}

      <div className="project-card__content">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>

        {tags.length > 0 && (
          <div className="project-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="project-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="project-card__links">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
            >
              View Project
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link project-card__link--github"
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Neon border glow on hover */}
      <motion.div
        className="project-card__glow"
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? '0 0 20px var(--st-red), inset 0 0 20px rgba(255, 30, 30, 0.1)'
            : '0 0 0 var(--st-red)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}

interface ProjectGridProps {
  children: ReactNode;
}

/**
 * Responsive grid for project cards
 */
export function ProjectGrid({ children }: ProjectGridProps) {
  return <div className="project-grid">{children}</div>;
}
