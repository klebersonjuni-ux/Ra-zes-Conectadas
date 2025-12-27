import React from "react"
import { cn } from "@/utils"

// Versão simplificada usando Select nativo do HTML para facilitar
export const Select = ({ children, value, onValueChange }) => {
  return React.cloneElement(children, { value, onChange: (e) => onValueChange(e.target.value) });
};

export const SelectTrigger = ({ children, className }) => <div className={cn("relative", className)}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span className="p-2">{placeholder}</span>;

export const SelectContent = ({ children }) => { 
  // renderizar como um select nativo escondido por cima
  return (
    <select 
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onChange={(e) => {
         // O evento sobe para o pai
      }}
    >
      {children}
    </select>
  )
};

export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;