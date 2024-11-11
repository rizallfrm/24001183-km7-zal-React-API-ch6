import { useEffect, useState } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavbarWithStyling from "./components/navbar/navbarWithStyling";
import AboutView from "./pages/AboutView";
import HomeView from "./pages/HomeView";
import NotFoundView from "./pages/NotFoundView";
import LoginPage from "./pages/Login"; 
import RegisterPage from "./pages/Register"; 

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "/about",
    element: <AboutView />,
  },
  {
    path: "/not-found",
    element: <NotFoundView />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

function App() {
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Number of items per page
  const [shopsType, setShopsType] = useState(""); // Filter for shops type
  const [priceRange, setPriceRange] = useState([0, 100000]); // Price range
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data using axios
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/shops", {
          params: {
            page,
            limit,
            shopsType, 
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          },
        });

        const data = response.data;
        if (data.isSuccess) {
          setShops(data.data.shops);
        } else {
          setError("Error loading data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [page, limit, shopsType, priceRange]);

  return (
    <>
      {/* Navbar */}
      <header className="flex justify-between p-4 bg-white shadow-md">
        <h1 className="text-lg font-bold text-blue-800">Binar Car Rental</h1>
      </header>

      {/* Filter Section */}
      <div className="p-4">
        <label>
          Shop Type:
          <input
            type="text"
            value={shopsType}
            onChange={(e) => setShopsType(e.target.value)}
            placeholder="Enter shop type"
            className="ml-2 border rounded p-1"
          />
        </label>
        
        <label className="ml-4">
          Price Range:
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            placeholder="Min"
            className="ml-2 border rounded p-1 w-16"
          />
          -
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            placeholder="Max"
            className="ml-2 border rounded p-1 w-16"
          />
        </label>

        <label className="ml-4">
          Limit:
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            placeholder="Items per page"
            className="ml-2 border rounded p-1 w-16"
          />
        </label>
      </div>

      {/* Main Content */}
      <main className="text-center">
        {/* Loading and Error Handling */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {/* Shops List */}
        {!loading && !error && (
          <section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop, index) => (
              <div key={index} className="p-4 border rounded-md bg-white shadow-md">
                <img
                  src={shop.products[0].images[0]}
                  alt={shop.products[0].name}
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="font-semibold">{shop.products[0].name}</h3>
                <p className="text-green-500 font-bold">
                  Rp {shop.products[0].price} / hari
                </p>
                <button className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-md">
                  Pilih Mobil
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      </main>

      {/* Router Provider */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
