import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button, FormControl } from "react-bootstrap";
import data from "../json/data.json"; // Assuming you have a data.json file with the college data

const tableData = data;
const itemsPerPage = 10; // Number of items to show per page

const CollegeTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [endIndex, setEndIndex] = useState(itemsPerPage);
  const [sortedData, setSortedData] = useState(tableData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const tableRef = useRef(null);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortBy(null); // Toggle sorting order
      setSortedData(
        [...tableData].sort((a, b) => a[column].localeCompare(b[column]))
      );
    } else {
      setSortBy(column);
      setSortedData(
        [...tableData].sort((a, b) => a[column].localeCompare(b[column]))
      );
    }
  };

  // Function to filter data based on search query
  const filteredData = sortedData.filter((row) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      row["Colleges"].toLowerCase().includes(searchTerm) ||
      row["Course Fees"].toString().includes(searchTerm) ||
      row["Placement"].toString().includes(searchTerm) ||
      row["User Reviews"].includes(searchTerm) ||
      row["Ranking"].includes(searchTerm)
    );
  });

  useEffect(() => {
    // Set up IntersectionObserver to trigger loading more data
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
          setEndIndex((prevIndex) => prevIndex + itemsPerPage);
        }
      },
      { threshold: 1 } // Trigger when the element is 100% visible
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (tableRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Function to handle scrolling and load more data (optional)
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      setCurrentPage((prevPage) => prevPage + 1);
      setEndIndex((prevIndex) => prevIndex + itemsPerPage);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={tableRef}>
      <Form inline className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by college name, fees, etc."
          className="mr-sm-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("CD Rank")}>
              CD Rank
              {sortBy === "CD Rank" && (
                <span>{sortBy === "CD Rank" ? " ↓" : " ↑"}</span>
              )}
            </th>
            <th onClick={() => handleSort("Colleges")}>
              Colleges
              {sortBy === "Colleges" && (
                <span>{sortBy === "Colleges" ? " ↓" : " ↑"}</span>
              )}
            </th>
            <th onClick={() => handleSort("Course Fees")}>
              Course Fees
              {sortBy === "Course Fees" && (
                <span>{sortBy === "Course Fees" ? " ↓" : " ↑"}</span>
              )}
            </th>
            <th onClick={() => handleSort("Placement")}>
              Placement
              {sortBy === "Placement" && (
                <span>{sortBy === "Placement" ? " ↓" : " ↑"}</span>
              )}
            </th>
            <th onClick={() => handleSort("User Reviews")}>
              User Reviews
              {sortBy === "User Reviews" && (
                <span>{sortBy === "User Reviews" ? " ↓" : " ↑"}</span>
              )}
            </th>
            <th onClick={() => handleSort("Ranking")}>
              Ranking
              {sortBy === "Ranking" && (
                <span>{sortBy === "Ranking" ? " ↓" : " ↑"}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render the table rows with the current data slice */}
          {filteredData.slice(0, endIndex).map((row, index) => (
            <tr key={index}>
              <td>{row["CD Rank"]}</td>
              <td>{row["Colleges"]}</td>
              <td>{row["Course Fees"]}</td>
              <td>{row["Placement"]}</td>
              <td>{row["User Reviews"]}</td>
              <td>{row["Ranking"]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Add a loading indicator or a "Load More" button if needed */}
      {/* You can show a loader if endIndex is less than the total data length */}
      {endIndex < filteredData.length && (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeTable;
