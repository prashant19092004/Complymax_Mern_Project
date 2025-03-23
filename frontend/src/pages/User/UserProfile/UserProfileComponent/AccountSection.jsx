import React from 'react';
import { MdDeleteOutline } from "react-icons/md";

const AccountSection = ({ 
  user, 
  addAccount,
  account_image_input_ref,
  handleDeleteAccountImage,
  setPreviewUrl,
  setCrop,
  setShowCropModal,
  setIsAccountImage
}) => {
  return (
    <div className="id_sec">
      <div className="pan_heading">
        <h1>Account</h1>
        <button onClick={addAccount}>
          {user.account_added ? "Change" : "Add"}
        </button>
      </div>
      <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
        <div className="flex flex-col profile-content-box">
          <dt>Account No.</dt>
          <dd>{user.account_number}</dd>
        </div>
        <div className="flex flex-col profile-content-box">
          <dt>Name</dt>
          <dd>{user.account_name}</dd>
        </div>
        <div className="flex flex-col profile-content-box">
          <dt>IFSC code</dt>
          <dd>{user.account_ifsc}</dd>
        </div>
        <div className="flex flex-col profile-content-box position-relative">
          <dt>Account Image</dt>
          <dd className="d-flex align-items-center gap-2">
            {user.account_image ? (
              <>
                <span className="text-success">
                  <i className="fas fa-check-circle"></i> Uploaded
                </span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_BACKEND_URL}${user.account_image}`,
                        "_blank"
                      )
                    }
                  >
                    View Image
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => account_image_input_ref.current.click()}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDeleteAccountImage}
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-warning">
                  <i className="fas fa-exclamation-circle"></i> Not uploaded
                </span>
                <button
                  onClick={() => account_image_input_ref.current.click()}
                  className="btn btn-primary btn-sm"
                >
                  Upload Now
                </button>
              </>
            )}
            <input
              ref={account_image_input_ref}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const reader = new FileReader();

                  reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                    setCrop(null);
                    setShowCropModal(true);
                    setIsAccountImage(true);
                  };

                  reader.readAsDataURL(file);
                }
              }}
              accept="image/*"
              className="d-none"
            />
          </dd>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;