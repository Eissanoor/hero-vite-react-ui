import React, { useEffect, useState } from "react";
import { Card, Button } from "../../components/HeroUI";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../../config/api";
import Spinner from "../../components/ui/Spinner";
import Receipt from "../../components/Receipt";
import ReactDOMServer from "react-dom/server";

const Orders = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let url = `${API_CONFIG.BASE_URL}/api/orders/history?period=day`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setHistoryData(data?.data || []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setHistoryData((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handlePrintReceipt = (order) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="receipt">
            ${ReactDOMServer.renderToString(
              <Receipt
                orderData={{
                  orderid: order._id,
                  createdAt: order.createdAt,
                  status: order.status,
                  totalAmount: order.totalAmount,
                  products: order.products,
                }}
                items={order.products.map((p) => ({
                  ...p.product,
                  quantity: p.quantity,
                }))}
              />
            )}
          </div>
          <script>
            window.onload = function() {
              window.print();
              if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups to print the receipt");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Ready":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-[#DCFCE7] text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate total amount from all orders
  const totalAmount = historyData.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // Get current orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = historyData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Active Orders</h1>
          <div className="flex items-center space-x-3">
            <span className="text-md font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {historyData.length} orders
            </span>
            <span className="text-md font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              Total: Rs {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchOrders}
            isLoading={loading}
            className="flex items-center space-x-2"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </Button>
          <Button
            onClick={() => navigate("/dashboard/new-order")}
            className="bg-hero-primary text-white hover:bg-hero-primary-dark flex items-center space-x-2"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={32} />
        </div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-600">{error}</div>
      ) : historyData.length === 0 ? (
        <div className="flex justify-center py-8 text-gray-600">
          No orders found
        </div>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between border-b bg-gray-50 dark:bg-gray-700 p-4 sm:flex-nowrap">
                <div className="mb-2 flex items-center space-x-4 sm:mb-0">
                  <span className="font-bold text-hero-primary">
                    Order ID :{order.orderid}
                  </span>
                  <span className="text-gray-500 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.status === "Pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order._id, "Processing")}
                    >
                      Start Processing
                    </Button>
                  )}

                  {order.status === "Processing" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order._id, "Ready")}
                    >
                      Mark as Ready
                    </Button>
                  )}

                  {order.status === "Ready" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order._id, "Completed")}
                    >
                      Complete Order
                    </Button>
                  )}

                  {order.status !== "Completed" &&
                    order.status !== "Cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() =>
                          updateOrderStatus(order._id, "Cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrintReceipt(order)}
                    className="text-sm px-2 py-1"
                  >
                    Print Receipt
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrderId === order._id
                      ? "Hide Details"
                      : "View Details"}
                  </Button>
                </div>
              </div>

              <Card.Content
                className={`p-0 ${
                  expandedOrderId === order._id ? "block" : "hidden"
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-medium">Order Details</h6>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium">Quantity</th>
                        <th className="pb-2 font-medium">Price</th>
                        <th className="pb-2 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{item?.product?.name || ""}</td>
                          <td className="py-2">{item?.quantity || 0}</td>
                          <td className="py-2">
                            Rs {item?.product?.price?.toFixed(2) || ""}
                          </td>
                          <td className="py-2">
                            Rs{" "}
                            {(
                              item?.quantity * item?.product?.price || ""
                            ).toFixed(2) || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="py-2 text-right font-medium">
                          Total:
                        </td>
                        <td className="py-2 font-bold">
                          Rs{" "}
                          {order.products
                            .reduce(
                              (sum, item) =>
                                sum +
                                (item.quantity * item?.product?.price || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Content>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between w-full  px-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, historyData.length)} of{" "}
              {historyData.length} orders
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-hero-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>items per page</span>
            </div>
          </div>
          {historyData.length > itemsPerPage && (
            <div className="mt-6 flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="flex items-center space-x-1 px-3 py-2 text-sm disabled:opacity-50 border border-restaurant-primary text-restaurant-primary"
                >
                  <svg
                    className="h-4 w-4 "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-1">
                  {currentPage > 2 && (
                    <>
                      <Button
                        onClick={() => paginate(1)}
                        variant="outline"
                        className="h-8 w-8 p-0 text-sm"
                      >
                        1
                      </Button>
                      {currentPage > 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {[...Array(Math.ceil(historyData.length / itemsPerPage))].map(
                    (_, index) => {
                      // Show current page and one page before and after
                      if (
                        index + 1 === currentPage ||
                        index + 1 === currentPage - 1 ||
                        index + 1 === currentPage + 1
                      ) {
                        return (
                          <Button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            variant={
                              currentPage === index + 1 ? "default" : "outline"
                            }
                            className={`h-8 w-8 p-0 text-sm ${
                              currentPage === index + 1
                                ? "bg-restaurant-primary text-white hover:bg-hero-primary-dark"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-restaurant-primary text-restaurant-primary"
                            }`}
                          >
                            {index + 1}
                          </Button>
                        );
                      }
                      return null;
                    }
                  )}

                  {currentPage <
                    Math.ceil(historyData.length / itemsPerPage) - 1 && (
                    <>
                      {currentPage <
                        Math.ceil(historyData.length / itemsPerPage) - 2 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <Button
                        onClick={() =>
                          paginate(Math.ceil(historyData.length / itemsPerPage))
                        }
                        variant="outline"
                        className="h-8 w-8 p-0 text-sm border border-restaurant-primary text-restaurant-primary"
                      >
                        {Math.ceil(historyData.length / itemsPerPage)}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(historyData.length / itemsPerPage)
                  }
                  variant="outline"
                  className="flex items-center space-x-1 px-3 py-2 text-sm disabled:opacity-50 border border-restaurant-primary text-restaurant-primary"
                >
                  <span>Next</span>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
