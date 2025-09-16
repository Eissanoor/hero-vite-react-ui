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
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

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

  // Handle update order button click
  const handleUpdateOrder = (orderId) => {
    navigate(`/dashboard/new-order/${orderId}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmation(true);
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted order from the state
        setHistoryData(prevOrders => prevOrders.filter(order => order._id !== orderToDelete));
      } else {
        setError("Failed to delete order");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteConfirmation(false);
      setOrderToDelete(null);
    }
  };

  return (
    <div>
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slideIn">
              <div className="bg-white dark:bg-gray-800 px-6 py-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Order
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this order? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row-reverse sm:justify-end gap-3">
                <Button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto"
                  onClick={handleDeleteOrder}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hero-primary sm:mt-0 sm:w-auto dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setDeleteConfirmation(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    variant="outline"
                    onClick={() => handleUpdateOrder(order._id)}
                    className="text-sm px-2 py-1 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                  >
                    <svg className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteConfirmation(order._id)}
                    className="text-sm px-2 py-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  >
                    <svg className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
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
