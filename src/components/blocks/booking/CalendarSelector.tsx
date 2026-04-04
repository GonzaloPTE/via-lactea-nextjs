"use client";

import React, { useState, useMemo } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfToday, 
  getDay, 
  getDaysInMonth, 
  setDate, 
  isBefore, 
  isSameDay, 
  addMonths, 
  subMonths, 
  format,
  isSameMonth,
  startOfDay
} from "date-fns";
import { es } from "date-fns/locale";

export interface CalendarSelectorProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function CalendarSelector({ selectedDate, onSelectDate }: CalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generar la matriz de días del mes
  const generateCalendar = useMemo(() => {
    const startDay = getDay(startOfMonth(currentMonth)); // 0 (Sun) - 6 (Sat)
    // Ajustar para que la semana empiece en Lunes (1)
    const firstDayIndex = startDay === 0 ? 6 : startDay - 1; 

    const daysInMonthCount = getDaysInMonth(currentMonth);
    const today = startOfToday();

    let days = [];
    
    // Fill empty spaces for first week
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Fill actual days
    for (let i = 1; i <= daysInMonthCount; i++) {
        const dateObj = setDate(currentMonth, i);
        // Deshabilitar días pasados o domingos (ejemplo: domingos = 0)
        const isPast = isBefore(startOfDay(dateObj), today);
        const isSunday = getDay(dateObj) === 0;
        const disabled = isPast || isSunday;
        
        days.push({
            date: dateObj,
            day: i,
            disabled: disabled
        });
    }

    // Dividir en semanas
    const weeks = [];
    let currentWeek = [];
    for (let i = 0; i < days.length; i++) {
        currentWeek.push(days[i]);
        if (currentWeek.length === 7 || i === days.length - 1) {
            // Fill rest of the last week with nulls
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    return weeks;
  }, [currentMonth]);

  const monthYearLabel = format(currentMonth, "MMMM yyyy", { locale: es });
  const isCurrentMonthPrevDisabled = isSameMonth(currentMonth, new Date());

  return (
    <div className="calendar-selector">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <button 
            className="btn btn-circle btn-soft-primary btn-sm border-0" 
            onClick={isCurrentMonthPrevDisabled ? undefined : handlePrevMonth} 
            style={{ opacity: isCurrentMonthPrevDisabled ? 0 : 1, visibility: isCurrentMonthPrevDisabled ? 'hidden' : 'visible' }}
            type="button"
        >
            <i className="uil uil-angle-left"></i>
        </button>
        <h5 className="mb-0 text-capitalize">{monthYearLabel}</h5>
        <button 
            className="btn btn-circle btn-soft-primary btn-sm" 
            onClick={handleNextMonth}
            type="button"
        >
            <i className="uil uil-angle-right"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table bg-transparent text-center border-0 mb-0">
          <thead>
            <tr>
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
                <th key={day} className="border-0 p-1 fs-13 text-muted fw-bold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {generateCalendar.map((week, idx) => (
              <tr key={idx}>
                {week.map((dayObj, dIdx) => {
                  if (!dayObj) return <td key={dIdx} className="border-0 p-1"></td>;
                  const isSelected = selectedDate && isSameDay(selectedDate, dayObj.date);
                  
                  return (
                    <td key={dIdx} className="border-0 p-1">
                      <button
                        type="button"
                        disabled={dayObj.disabled}
                        onClick={() => !dayObj.disabled && onSelectDate(dayObj.date)}
                        className={`btn btn-circle btn-sm ${isSelected ? 'btn-primary text-white' : dayObj.disabled ? 'btn-link text-muted disabled border-0' : 'btn-soft-primary'} fs-15 fw-medium d-flex justify-content-center align-items-center mx-auto`}
                        style={{ width: "40px", height: "40px", padding: 0, textDecoration: 'none' }}
                      >
                        {dayObj.day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
