import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto'
      }}>
        <h3>Crop {imageType === 'pan' ? 'Pan Card' : 'Aadhar Card'} Image</h3>

        <div style={{
          maxWidth: '500px',
          maxHeight: '50vh',
          overflow: 'auto',
          margin: '0 auto'
        }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCrop(c)}
            minWidth={20}
            minHeight={20}
            keepSelection
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageUrl}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save & Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;