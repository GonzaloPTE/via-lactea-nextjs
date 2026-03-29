"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localeData from "dayjs/plugin/localeData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);
dayjs.locale("es");

export interface CalendarSelectorProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function CalendarSelector({ selectedDate, onSelectDate }: CalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  // Generar la matriz de días del mes
  const generateCalendar = useMemo(() => {
    const startDay = currentMonth.startOf("month").day(); // 0 (Sun) - 6 (Sat)
    // Ajustar para que la semana empiece en Lunes (1)
    const firstDayIndex = startDay === 0 ? 6 : startDay - 1; 

    const daysInMonth = currentMonth.daysInMonth();
    const today = dayjs().startOf("day");

    let days = [];
    
    // Fill empty spaces for first week
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Fill actual days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateObj = currentMonth.date(i);
        // Deshabilitar días pasados o domingos (ejemplo: domingos = 0)
        const isPast = dateObj.isBefore(today);
        const isSunday = dateObj.day() === 0;
        const disabled = isPast || isSunday;
        
        days.push({
            date: dateObj.toDate(),
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

  const monthYearLabel = currentMonth.format("MMMM YYYY");
  const isCurrentMonthPrevDisabled = currentMonth.isSameOrBefore(dayjs(), "month");

  return (
    <div className="calendar-selector">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <button 
            className="btn btn-circle btn-soft-primary btn-sm border-0" 
            onClick={currentMonth.isSameOrBefore(dayjs(), "month") ? undefined : handlePrevMonth} 
            style={{ opacity: currentMonth.isSameOrBefore(dayjs(), "month") ? 0 : 1, visibility: currentMonth.isSameOrBefore(dayjs(), "month") ? 'hidden' : 'visible' }}
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
                  const isSelected = selectedDate && dayjs(selectedDate).isSame(dayjs(dayObj.date), "day");
                  
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
