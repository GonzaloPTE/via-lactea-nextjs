import React from 'react';

// Updated Props for the simplified version
export interface SocialShareButtonsProps {
  url: string;  // The canonical URL of the blog post to share on Facebook
  title: string; // The title of the blog post (for Facebook sharing)
  instagramProfileUrl: string; // URL to the Instagram profile
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, instagramProfileUrl }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Basic link styling, can be enhanced with Tailwind or CSS modules
  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem', // For spacing between icon and text
    textDecoration: 'none',
    color: 'var(--bs-link-color)', // Use theme link color if possible, or a default
    marginRight: '1rem', // Space between links
    marginBottom: '0.5rem'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem' // Adjust icon size if needed
  };

  return (
    <div className="social-share-links my-6">
      <h5 className="mb-3">Compartir en Redes:</h5>
      <div>
        <a 
          href={facebookShareUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={linkStyle} 
          aria-label="Compartir en Facebook"
          className="hover-underline"
        >
          <i className="uil uil-facebook-f" style={iconStyle}></i>
          <span>Facebook</span>
        </a>
        <a 
          href={instagramProfileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={linkStyle} 
          aria-label="Visitar Instagram"
          className="hover-underline"
        >
          <i className="uil uil-instagram" style={iconStyle}></i>
          <span>Instagram</span>
        </a>
      </div>
    </div>
  );
};

export default SocialShareButtons; 