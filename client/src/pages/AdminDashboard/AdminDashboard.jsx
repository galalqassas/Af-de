import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";
import './tailwind.css';


const AdminDashboard = () => {
  return (
    <div className="grid grid-rows-[max-content,auto,max-content] grid-cols-[max-content,auto] h-screen overflow-clip">
      <header className="bg-primary-1 px-5 py-3 col-span-2 flex justify-between items-center text-white">
        <h1>SCHOLAR</h1>
      </header>
        <SideBar />
        <main className="w-full min-h-full p-5 overflow-auto">
          <Outlet />
        </main>
      <footer className="flex items-center col-span-2 px-5 py-2 bg-primary-2 text-white">
        © SCHOLAR - All rights reserved.
      </footer>
    </div>
  );
}
 
export default AdminDashboard;