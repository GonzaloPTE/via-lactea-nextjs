import React from "react";
import CustomBookingWidget from "./CustomBookingWidget";

export default function BookingModal() {
  return (
    <div className="modal fade" id="bookingModal" tabIndex={-1} aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 bg-transparent shadow-none">
          <div className="modal-body p-0 position-relative">
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3 shadow-none border-0"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                padding: "5px",
                backgroundSize: "10px"
              }}
            ></button>

            <CustomBookingWidget />

          </div>
        </div>
      </div>
    </div>
  );
}
