import React from 'react';

const ContentEditable = ({ html, onChange, className }) => {
  const handleChange = (e) => {
    const value = e.target.innerText;
    onChange({ target: { value } });
  };

  return (
    <div
      className={className}
      contentEditable
      onBlur={handleChange}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressContentEditableWarning
    />
  );
};

export default ContentEditable; 