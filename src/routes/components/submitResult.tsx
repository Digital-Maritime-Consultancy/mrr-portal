import { IContext } from "../../App";

export interface ISubmitResultProp{
    context: IContext;
    setContext: (context: IContext) => void;
}

export const SubmitResult = ({context}: ISubmitResultProp) => {
    return <div className="p-5"><h3><b>{context.mrn ? context.mrn : context.namespace} {context.version && "(ver. "+context.version + ")" }</b> has successfully registered.</h3></div>
}