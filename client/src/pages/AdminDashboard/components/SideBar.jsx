import { Link, useLocation } from "react-router-dom";
import pages from "../pages/pages";

const SideBar = () => {
  const location = useLocation()
  return (
    <aside className="bg-primary-3 flex flex-col border-gray-400 border-r pr-2">
      {
        pages.map(page => (
          <Link
          key={page.path}
          data-disabled={location.pathname === `/admin${page.path}`}
          className="my-1 text-left text-xl px-2 py-1 rounded transition duration-200 min-w-max data-[disabled=true]:text-white data-[disabled=true]:bg-primary-2 data-[disabled=false]:hover:opacity-75"
          to={`/admin${page.path}`}
          >
            {page.buttonIcon}
            {page.buttonText}
          </Link>
        ))
      }
    </aside>
  )
}
export default SideBar;