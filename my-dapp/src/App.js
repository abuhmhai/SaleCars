import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Thay bằng địa chỉ hợp đồng của bạn

const LockABI = [
  {
    "inputs": [],
    "name": "carCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      }
    ],
    "name": "getCarDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "make",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "model",
            "type": "string"
          },
          {
            "internalType": "uint16",
            "name": "year",
            "type": "uint16"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isForSale",
            "type": "bool"
          }
        ],
        "internalType": "struct CarMarketplace.Car",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [carCount, setCarCount] = useState(0);
  const [carDetails, setCarDetails] = useState(null);
  const [carId, setCarId] = useState("");

  useEffect(() => {
    const init = async () => {
      // Kiểm tra MetaMask
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Kết nối với Ethereum provider
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(signer);

      // Tạo kết nối hợp đồng
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LockABI, signer);
      setContract(contract);

      // Lấy số lượng xe đã đăng ký
      const count = await contract.carCount();
      setCarCount(count.toNumber());
    };

    init();
  }, []);

  // Hàm lấy chi tiết xe
  const fetchCarDetails = async () => {
    if (!carId) {
      alert("Please enter a valid Car ID.");
      return;
    }

    try {
      const details = await contract.getCarDetails(carId);
      setCarDetails({
        id: details.id.toString(),
        make: details.make,
        model: details.model,
        year: details.year,
        owner: details.owner,
        price: ethers.utils.formatEther(details.price), // Sửa cách sử dụng formatEther
        isForSale: details.isForSale
      });
    } catch (error) {
      console.error("Error fetching car details:", error);
      alert("Could not fetch car details. Please try again.");
    }
  };

  return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Welcome to Car Marketplace DApp</h1>
        <p>Contract Address: {CONTRACT_ADDRESS}</p>
        <p>Total Cars Registered: {carCount}</p>

        <div style={{ margin: "20px" }}>
          <h3>Get Car Details</h3>
          <input
              type="number"
              placeholder="Enter Car ID"
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              style={{ padding: "10px", width: "200px", marginRight: "10px" }}
          />
          <button onClick={fetchCarDetails} style={{ padding: "10px" }}>
            Fetch Details
          </button>
        </div>

        {carDetails && (
            <div style={{ marginTop: "20px" }}>
              <h3>Car Details</h3>
              <p><strong>Make:</strong> {carDetails.make}</p>
              <p><strong>Model:</strong> {carDetails.model}</p>
              <p><strong>Year:</strong> {carDetails.year}</p>
              <p><strong>Owner:</strong> {carDetails.owner}</p>
              <p><strong>Price:</strong> {carDetails.price} ETH</p>
              <p><strong>For Sale:</strong> {carDetails.isForSale ? "Yes" : "No"}</p>
            </div>
        )}
      </div>
  );
}

export default App;
