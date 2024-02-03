const InputBox = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center h-12">
        <button className="m-2 p-2 border border-primary h-full">
          新しいスレッド
        </button>
      </div>
      <div className="grow m-4 flex border border-primary items-center">
        <textarea className="flex-1 border-r border-gray-300" />
        <button className="h-12 flex-none border border-primary px-4 ml-2">
          送信
        </button>
      </div>
    </div>
  );
};

export default InputBox;
