import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const AdminLayout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur">
        <div className="h-16 flex items-center px-6 font-semibold tracking-wide border-b border-gray-200 dark:border-gray-800">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Main Home
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="/admin/community"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Farmer Community
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block rounded px-3 py-2 transition hover:bg-primary-50 dark:hover:bg-gray-800 ${
                isActive ? "bg-primary-100 text-primary-800 dark:bg-gray-800" : ""
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                const el = document.getElementById("admin-drawer");
                el?.classList.toggle("hidden");
              }}
            >
              <span className="sr-only">Toggle Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm.75 4.5a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {/* Same icon for both modes */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3A.75.75 0 0112 2.25zm6.364 3.136a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061zM21.75 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5H21a.75.75 0 01.75.75zm-3.136 6.364a.75.75 0 10-1.06-1.061l-1.061 1.06a.75.75 0 001.06 1.061l1.061-1.06zM12 21.75a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0V21a.75.75 0 01-.75.75zm-6.364-3.136a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.061 1.06l1.06 1.061zM2.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H3A.75.75 0 012.25 12zm3.136-6.364a.75.75 0 001.06 1.06l1.061-1.06a.75.75 0 10-1.061-1.061l-1.06 1.06z" clipRule="evenodd" />
                <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
              </svg>
            </button>
          </div>
        </header>

        <div id="admin-drawer" className="md:hidden hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <nav className="p-2 space-y-1">
            <NavLink to="/admin" end className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</NavLink>
            <NavLink to="/" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Main Home</NavLink>
            <NavLink to="/admin/users" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Users</NavLink>
            <NavLink to="/admin/products" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Marketplace</NavLink>
            <NavLink to="/admin/services" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Services</NavLink>
            <NavLink to="/admin/gallery" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Gallery</NavLink>
            <NavLink to="/admin/community" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Farmer Community</NavLink>
            <NavLink to="/admin/settings" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Settings</NavLink>
          </nav>
        </div>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
