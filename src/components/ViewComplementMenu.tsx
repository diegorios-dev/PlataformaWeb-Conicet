


const ViewComplementMenu = ({ complements }) => {
  return (
    <div className="flex flex-col gap-4 p-6 border-t border-gray-400 mt-6 pt-6">
      {complements.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full py-3 px-5 rounded-full font-semibold transition duration-200 shadow-sm border
            bg-gray-200 hover:bg-gray-300 text-gray-800 hover:border-blue-400"
        >
          <span className="text-lg">{item.option}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewComplementMenu;
