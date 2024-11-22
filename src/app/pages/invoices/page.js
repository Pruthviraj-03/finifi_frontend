"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import axios from "axios";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchOption, setSearchOption] = useState("vendor");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    vendorName: "",
    invoiceNumber: "",
    status: "Open",
    netAmount: "",
    invoiceDate: "",
    dueDate: "",
    department: "",
    poNumber: "",
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/getinvoices");

        const shuffledInvoices = shuffleArray(res.data.data.invoices);

        setInvoices(shuffledInvoices);
        setFilteredInvoices(shuffledInvoices);
      } catch (err) {
        console.log("err:", err);
      }
    };

    fetchInvoices();
  }, []);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    let filtered = invoices;
    if (selectedStatus !== "All") {
      filtered = invoices.filter(
        (invoice) => invoice.status === selectedStatus
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((invoice) => {
        if (searchOption === "vendor") {
          return invoice.vendorName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        } else if (searchOption === "number") {
          return invoice.invoiceNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    setFilteredInvoices(filtered);
  }, [selectedStatus, invoices, searchQuery, searchOption]);

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
    setInvoiceToDelete(null);
  };

  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/createInvoice",
        {
          ...invoiceData,
          createdTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          createdDate: new Date().toLocaleDateString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setInvoices((prevInvoices) => {
        const newInvoices = [...prevInvoices, res.data.data.invoice];
        const shuffledInvoices = shuffleArray(newInvoices);
        return shuffledInvoices;
      });

      setFilteredInvoices((prevFilteredInvoices) => {
        const newFilteredInvoices = [
          ...prevFilteredInvoices,
          res.data.data.invoice,
        ];
        return newFilteredInvoices;
      });

      setInvoiceData({
        status: "Open",
        invoiceDate: "",
        dueDate: "",
        vendorName: "",
        invoiceNumber: "",
        netAmount: "",
        department: "",
        poNumber: "",
      });

      toggleModal();
      alert("Invoice created successfully!");
    } catch (err) {
      console.log("Error creating invoice:", err);
    }
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInvoice = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/deleteInvoice/${invoiceToDelete._id}`
      );
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceToDelete._id)
      );
      setIsDeleteModalOpen(false);
      toggleDeleteModal();
      alert("Invoice deleted successfully!");
    } catch (err) {
      console.log("Error deleting invoice:", err);
    }
  };

  const handleEditClick = (invoice) => {
    setInvoiceData(invoice);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedInvoiceResponse = await axios.put(
        `http://localhost:8000/api/updateInvoice/${invoiceData._id}`,
        invoiceData
      );

      const updatedInvoice = updatedInvoiceResponse.data.data.invoice;

      if (!updatedInvoice || !updatedInvoice._id) {
        console.error("Updated invoice response is invalid");
        return;
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === updatedInvoice._id
            ? { ...invoice, ...updatedInvoice }
            : invoice
        )
      );

      setIsUpdateModalOpen(false);
      toggleUpdateModal();
      alert("Invoice updated successfully!");
    } catch (err) {
      console.error("Error updating invoice:", err);
    }
  };

  return (
    <div className="bg-dark-white h-screen w-screen flex flex-row overflow-hidden laptop:overflow-y-scroll tablet:flex-col tablet:overflow-y-scroll mobile:flex-col mobile:overflow-y-scroll">
      <Sidebar />
      <div className="bg-dark-white w-10/12 flex flex-col tablet:w-screen mobile:w-screen">
        <Navbar />

        <div className="flex flex-col w-full h-auto justify-center items-center gap-1">
          <div className="tablet:pl-56 mobile:pl-96 flex flex-row w-full h-auto justify-center items-center gap-24 p-3 border border-b-light-grey laptop:p-2 laptop:gap-12 tablet:w-full tablet:overflow-x-auto tablet:gap-8 tablet:whitespace-nowrap mobile:w-full mobile:overflow-x-auto mobile:gap-4 mobile:whitespace-nowrap">
            {[
              "All",
              "Open",
              "Awaiting Approval",
              "Approved",
              "Processing",
              "Paid",
              "Rejected",
              "Vendor Not Found",
              "Duplicate",
              "Void",
            ].map((status) => (
              <span
                key={status}
                className={`font-poppins text-md laptop:text-sm mobile:text-sm cursor-pointer hover:border-b-2 hover:border-sky-900 ${
                  selectedStatus === status
                    ? "text-black border-b-2 border-sky-900 border-h-2"
                    : "text-main-color"
                }`}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center w-11/12 h-auto p-5 laptop:p-4 laptop:w-full tablet:flex-col tablet:gap-5 mobile:flex-col mobile:gap-5 mobile:p-1 mobile:pt-4">
            <div className="border border-dark-grey h-10 w-4/12 rounded-lg flex flex-row gap-2 justify-center items-center p-3 laptop:w-5/12 tablet:w-full tablet:h-12  mobile:w-full mobile:h-10">
              <FaSearch className="font-poppins text-2xl text-main-color" />
              <select
                value={searchOption}
                onChange={handleSearchOptionChange}
                className="border-none outline-none rounded-md text-main-color cursor-pointer font-bold"
              >
                <option value="vendor">by Vendor Name</option>
                <option value="number">by Invoice Number</option>
              </select>
              <div className="h-full w-[3px] bg-dark-grey"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="search..."
                className="w-full h-full border-none outline-none text-md text-main-color font-poppins laptop:text-sm"
              />
            </div>

            <div
              className="flex items-center justify-center bg-sky-900 w-40 laptop:w-36 h-10 rounded-lg cursor-pointer hover:bg-dark-white hover:border hover:border-sky-900 group tablet:ml-auto mobile:ml-auto"
              onClick={toggleModal}
            >
              <span className="text-dark-white text-sm font-semibold font-poppins group-hover:text-sky-900">
                Create Invoice +
              </span>
            </div>
          </div>

          <div className="overflow-x-auto w-full ml-5 mobile:mt-2 mobile:ml-1">
            <table className="w-max table-auto border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-sky-50 z-10 py-4 px-16 border-r border-b text-main-color font-poppins text-md font-semibold laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Vendor Name
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Invoice Number
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Status
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Net Amount
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Invoice Date
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Due Date
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Department
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    PO Number
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Created Time
                  </th>
                  <th className="py-4 px-16 border-b text-main-color font-poppins text-md font-semibold bg-sky-50 laptop:py-3 laptop:px-12 laptop:text-sm tablet:px-8 mobile:py-2 mobile:px-8 mobile:text-sm">
                    Created Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentInvoices.slice(0, 7).map((item, index) => (
                  <tr key={index}>
                    <td className="sticky left-0 bg-white py-5 px-16 border-b font-poppins text-main-color border-r flex items-center gap-5 laptop:py-4 laptop:px-8 tablet:px-4 mobile:px-2">
                      <div className="flex gap-3 laptop:gap-0 tablet:gap-1 mobile:gap-1">
                        <button
                          title="Edit"
                          className="text-blue-500 hover:text-blue-700 transition duration-200 laptop:px-2 tablet:px-1 mobile:px-1"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          title="Delete"
                          className="text-red-500 hover:text-red-700 transition duration-200 laptop:px-2 tablet:px-1 mobile:px-1"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                      <span className="ml-3 capitalize laptop:text-sm laptop:ml-1 mobile:text-sm mobile:ml-0">
                        {item.vendorName}
                      </span>
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {item.invoiceNumber.startsWith("No.")
                        ? item.invoiceNumber
                        : `No. ${item.invoiceNumber}`}
                    </td>
                    <td
                      className={`w-36 h-10 border rounded-full flex items-center justify-center ml-4 laptop:py-2 laptop:px-8 ${
                        item.status === "Open" ||
                        item.status === "Void" ||
                        item.status === "Processing"
                          ? "bg-sky-50 border-sky-900 text-sky-900"
                          : item.status === "Vendor Not Found" ||
                            item.status === "Rejected"
                          ? "bg-red-50 border-red-900 text-red-900"
                          : item.status === "Paid" || item.status === "Approved"
                          ? "bg-green-50 border-green-900 text-green-900"
                          : item.status === "Duplicate" ||
                            item.status === "Awaiting Approval"
                          ? "bg-violet-50 border-violet-900 text-violet-900"
                          : ""
                      }`}
                    >
                      <span className="font-poppins text-sm laptop:text-[9.6px]">
                        {item.status}
                      </span>
                    </td>

                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {item.netAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {new Date(item.invoiceDate)
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {new Date(item.dueDate)
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm capitalize">
                      {item.department}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {item.poNumber.startsWith("PO")
                        ? item.poNumber
                        : `PO${item.poNumber}`}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {item.createdTime}
                    </td>
                    <td className="py-5 px-16 border-b font-poppins text-main-color laptop:py-2 laptop:text-sm">
                      {new Date(item.createdDate)
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="font-poppins text-xl font-semibold mb-5">
                    Create Invoice
                  </h2>
                  <form>
                    <div className="form-group">
                      <label>Vendor Name</label>
                      <input
                        type="text"
                        name="vendorName"
                        value={invoiceData.vendorName}
                        onChange={handleInputChange}
                        placeholder="Vendor name"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        placeholder="Invoice number"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label className="mt-2">Status</label>
                      <select
                        name="status"
                        value={invoiceData.status}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-transparent"
                      >
                        <option value="Open">Open</option>
                        <option value="Awaiting Approval">
                          Awaiting Approval
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Net Amount</label>
                      <input
                        type="number"
                        name="netAmount"
                        value={invoiceData.netAmount}
                        onChange={handleInputChange}
                        placeholder="Net amount"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                        type="date"
                        name="invoiceDate"
                        value={invoiceData.invoiceDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={invoiceData.department}
                        onChange={handleInputChange}
                        placeholder="Department"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>PO Number</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={invoiceData.poNumber}
                        onChange={handleInputChange}
                        placeholder="PO number"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="bg-red-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-red-500 hover:border hover:border-red-500"
                        onClick={toggleModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-green-500 hover:border hover:border-green-500"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isDeleteModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="font-poppins text-xl font-semibold mb-5">
                    Are you sure you want to delete this invoice?
                  </h2>
                  <p>Vendor Name: {invoiceToDelete.vendorName}</p>
                  <p>Invoice Number: {invoiceToDelete.invoiceNumber}</p>
                  <div className="form-actions mt-5">
                    <button
                      type="button"
                      className="bg-red-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-red-500 hover:border hover:border-red-500"
                      onClick={toggleDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-green-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-green-500 hover:border hover:border-green-500"
                      onClick={handleDeleteInvoice}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isUpdateModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="font-poppins text-xl font-semibold mb-5">
                    Update Invoice
                  </h2>
                  <form>
                    <div className="form-group">
                      <label>Vendor Name</label>
                      <input
                        type="text"
                        name="vendorName"
                        value={invoiceData.vendorName}
                        onChange={handleInputChange}
                        placeholder="Vendor name"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        placeholder="Invoice number"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label className="mt-2">Status</label>
                      <select
                        name="status"
                        value={invoiceData.status}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-transparent"
                      >
                        <option value="Open">Open</option>
                        <option value="Awaiting Approval">
                          Awaiting Approval
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Net Amount</label>
                      <input
                        type="number"
                        name="netAmount"
                        value={invoiceData.netAmount}
                        onChange={handleInputChange}
                        placeholder="Net amount"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                        type="date"
                        name="invoiceDate"
                        value={invoiceData.invoiceDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={invoiceData.department}
                        onChange={handleInputChange}
                        placeholder="Department"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-group">
                      <label>PO Number</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={invoiceData.poNumber}
                        onChange={handleInputChange}
                        placeholder="PO number"
                        className="border-b-2 border-b-main-color outline-none"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="bg-red-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-red-500 hover:border hover:border-red-500"
                        onClick={toggleUpdateModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 text-dark-white rounded-xl cursor-pointer hover:bg-dark-white hover:text-blue-500 hover:border hover:border-blue-500"
                        onClick={handleUpdateSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-3 items-center justify-center w-auto h-auto mt-5 laptop:my-5 tablet:my-7 mobile:my-5">
            <FaAngleLeft
              className="font-poppins text-lg text-sky-900 hover:text-dark-grey font-semibold cursor-pointer laptop:text-md"
              onClick={() => handlePageChange("prev")}
            />
            <span className="font-poppins text-lg text-sky-900 font-semibold laptop:text-md">
              {currentPage} of
            </span>
            <span className="font-poppins text-lg text-dark-grey font-semibold laptop:text-md">
              {totalPages}
            </span>
            <FaAngleRight
              className="font-poppins text-lg text-sky-900 hover:text-dark-grey font-semibold cursor-pointer laptop:text-md"
              onClick={() => handlePageChange("next")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
