import React, { useEffect, useRef } from 'react';

const EditableField = ({ 
  content, 
  onChange, 
  className = '', 
  dataField,
  style = {},
  isInline = false 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      // Clean the content before setting it
      const cleanContent = content?.replace(/\n/g, '') || '';
      elementRef.current.innerHTML = cleanContent;
    }
  }, [content]);

  const handleInput = (e) => {
    // For offer details, we want to preserve the HTML structure
    if (dataField === 'offerDetails') {
      const html = e.target.innerHTML;
      // Remove any duplicate content
      const cleanHtml = html.replace(/(<strong>.*?<\/strong>.*?){2,}/g, '$1');
      onChange(cleanHtml);
      return;
    }

    // For other fields, clean the content
    const cleanContent = e.target.innerHTML
      .replace(/\n/g, '') // Remove line breaks
      .replace(/<br>/g, '') // Remove <br> tags
      .replace(/<div>/g, '') // Remove <div> tags
      .replace(/<\/div>/g, '') // Remove closing </div> tags
      .trim(); // Remove extra whitespace

    onChange(cleanContent);
  };

  const handleKeyDown = (e) => {
    // Prevent line breaks on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain')
      .replace(/\n/g, '') // Remove line breaks
      .trim(); // Remove extra whitespace
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={elementRef}
      contentEditable={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={`editable-field ${className} ${isInline ? 'inline' : ''}`}
      data-field={dataField}
      style={{
        display: isInline ? 'inline-block' : 'block',
        minWidth: '20px',
        minHeight: '1.2em',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        ...style
      }}
      suppressContentEditableWarning={true}
    />
  );
};

export default EditableField; 