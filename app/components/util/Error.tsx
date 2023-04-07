import { FaExclamationCircle } from "react-icons/fa";

export interface ErrorType {
  title?: string;
  children: React.ReactNode;
}

function Error({ title, children }: ErrorType) {
  return (
    <div className="error">
      <div className="icon">
        <FaExclamationCircle />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Error;
