import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image }) => {
  const defaultTitle = 'Successful Christian Missions International';
  const defaultDescription = 'We are committed to developing spiritual leaders of excellence to bring the gospel of Christ to all mankind.';
  
  // Try to use ImageKit placeholder if none provided
  const globalImage = 'https://ik.imagekit.io/scmchurch/Professor%20R.%20A.%20Adedoyin.jpg'; 

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | SCM Church` : defaultTitle}</title>
      <meta name='description' content={description || defaultDescription} />
      
      <link rel="icon" type="image/png" href="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" />
      <link rel="shortcut icon" href="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || globalImage} />
      <meta property="og:site_name" content={name || 'SCM Church'} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || 'SCM Church'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || globalImage} />
    </Helmet>
  );
};

export default SEO;
