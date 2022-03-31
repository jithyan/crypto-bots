import React, { useState } from "react";
import ReactModal from "react-modal";
import { usePasswordContext } from "./PasswordContext";

export function PasswordModal() {
  const [modalPassword, setModalPassword] = useState("");
  const { setPassword, setShowPasswordModal, showPasswordModal } =
    usePasswordContext();

  return (
    <ReactModal
      isOpen={showPasswordModal}
      portalClassName="modal-sm modal-dialog modal-dialog-centered"
      parentSelector={() => document.querySelector("#container") as HTMLElement}
      style={{
        content: {
          margin: "auto",
          height: "300px",
          width: "500px",
        },
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Sir, please provide a password</h5>
        </div>
        <form>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="modal-body">
                <label>
                  Password
                  <input
                    className="form-control"
                    type="password"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setPassword(modalPassword);
              setShowPasswordModal(false);
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
            onClick={() => {
              setShowPasswordModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
