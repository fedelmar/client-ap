import React from 'react';
import 'jspdf-autotable';
import DayPickerInput from 'react-day-picker/DayPickerInput';

const FechaSelect = ({ setStartDate, setEndDate }) => {
  return (
    <>
      <p className="block text-gray-70 font-bold mr-1 mt-1">Seleccione el periodo a exportar: </p>
      <div className="m-1">
      <DayPickerInput
          value=" Desde... "
          onDayChange={date => {
            date.setHours(0);
            setStartDate(date);
          }}
      />
      </div>
      <div className="m-1">
      <DayPickerInput
          value=" Hasta... "
          onDayChange={date => {
            date.setHours(23);
            date.setMinutes(59);
            setEndDate(date);
          }}
      />
      </div>
    </>
  );
}

export default FechaSelect;