import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MdClose } from "react-icons/md";

const CropModal = ({ 
  showModal, 
  imageUrl, 
  onClose, 
  onSave,
  imageType = 'pan' // 'pan' or 'aadhar'
}) => {
  const [crop, setCrop] = useState({
    unit: 'px',
    x: 0,
    y: 0,
    width: 300,
    height: 225
  });
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.target;
    const maxWidth = 250;
    const cropWidth = Math.min(width * 0.6, maxWidth);
    const cropHeight = cropWidth * 0.75; // Default starting height, but user can adjust freely

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    setCrop({
      unit: 'px',
      x,
      y,
      width: cropWidth,
      height: cropHeight
    });
  };

  const handleSave = () => {
    if (!crop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      onSave(blob);
    }, 'image/jpeg', 1);
  };

  if (!showModal) return null;

  const getTitle = () => {
    switch(imageType) {
      case 'pan': return 'Crop Pan Card Image';
      case 'aadhar': return 'Crop Aadhar Card Image';
      case 'certificate': return 'Crop Certificate Image';
      default: return 'Crop Image';
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {getTitle()}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <MdClose size={24} color="#666" />
          </button>
        </div>

        {/* Crop Area */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCrop(c)}
            minWidth={20}
            minHeight={20}
            keepSelection
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageUrl}
              style={{
                maxWidth: '100%',
                maxHeight: '50vh',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          backgroundColor: 'white'
        }}>
          <button 
            className="btn btn-light" 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            style={{
              padding: '8px 24px',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Save & Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;