import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface TimeSlotSelectorProps {
  selectedDate: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  onConfirm: () => void;
}

export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  onSelectTime,
  onConfirm
}: TimeSlotSelectorProps) {

  const formattedDate = format(selectedDate, "eeee, d MMMM", { locale: es });
  const timeSlots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

  return (
    <div className="time-slot-selector ps-lg-4">
      <h5 className="mb-4 text-capitalize">{formattedDate}</h5>
      
      <div className="d-flex flex-column gap-2 mb-4">
        {timeSlots.map(time => {
          const isSelected = selectedTime === time;
          return (
            <div key={time} className="d-flex gap-2">
              <button
                type="button"
                className={`btn flex-grow-1 ${isSelected ? 'btn-grape text-white' : 'btn-outline-primary'} rounded py-2 px-3 fw-bold`}
                onClick={() => onSelectTime(time)}
              >
                {time}
              </button>
              
              {isSelected && (
                <button 
                  type="button"
                  className="btn btn-grape text-white rounded px-4 fw-bold animate__animated animate__fadeIn"
                  onClick={onConfirm}
                >
                  Siguiente
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
