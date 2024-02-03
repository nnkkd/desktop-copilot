import Recent from "./Recent";
import Chat from "./Chat";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <Chat />
      </div>
      <div className="flex justify-end">
        <div className="md:block hidden mt-16">
          <Recent />
        </div>
      </div>
    </div>
  );
};

export default Home;
