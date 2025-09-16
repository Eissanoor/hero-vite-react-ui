import React, { useState, useEffect } from "react";
import { Card, Button } from "../../components/HeroUI";
import API_CONFIG from "../../config/api";
import Spinner from "../../components/ui/Spinner";

const TodaySales = () => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    products: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodaySales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODAY_SALES}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSalesData(data);
      } else {
        setError("Failed to fetch today's sales data");
      }
    } catch (err) {
      setError("Error fetching today's sales data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaySales();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Today's Sales</h1>
        <Button 
          onClick={fetchTodaySales} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card className="bg-red-100 border-red-300 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
              <p className="text-3xl font-bold">{salesData.totalOrders}</p>
            </Card>
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Total Items Sold</h2>
              <p className="text-3xl font-bold">{salesData.totalSales}</p>
            </Card>
          </div>

          <Card className="overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Items Sold Today</h2>
              {salesData.products && salesData.products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity Sold
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesData.products.map((product, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No items sold today.</p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default TodaySales;
