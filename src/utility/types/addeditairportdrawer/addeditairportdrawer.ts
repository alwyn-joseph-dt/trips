import  type {AirportData}  from "../airporttabledata/airport"

export default interface AddEditAirportDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AirportData) => void;
  initialData?: AirportData;
}
