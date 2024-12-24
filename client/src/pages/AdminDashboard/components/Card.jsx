const Card = ({ children, className }) => {
  return (
    <div className={`bg-gray-50 border border-gray-300 shadow-md p-3 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
 
export default Card;