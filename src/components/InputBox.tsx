const InputBox = () => {
  return (
    <div className="m-4 flex border border-primary">
      <textarea className="flex-1 border-r border-gray-300" />
      <button className="flex-none border border-primary px-4 ml-2">
        送信
      </button>
    </div>
  );
};

export default InputBox;
