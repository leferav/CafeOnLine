import { useParams } from "react-router-dom";
import LoteForm from "../components/LoteForm/LoteForm";

export default function EditarLote() {
  const { id } = useParams();
  return <LoteForm mode="edit" lotId={id} />;
}
