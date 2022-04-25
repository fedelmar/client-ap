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
          onDayChange={day => setStartDate(day)}
      />
      </div>
      <div className="m-1">
      <DayPickerInput
          value=" Hasta... "
          onDayChange={day => setEndDate(day)}
      />
      </div>
    </>
  );
}

export default FechaSelect;