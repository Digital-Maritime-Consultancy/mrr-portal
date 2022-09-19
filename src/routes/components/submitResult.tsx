import { useParams } from "react-router-dom"

export const SubmitResult = () => {
    const {name} = useParams();
    return <div className="p-5"><h3><b>{name}</b> has successfully registered.</h3></div>
}