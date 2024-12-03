import React, { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Card, Container, Alert } from "react-bootstrap";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Địa chỉ hợp đồng
const LockABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "CarListedForSale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "make",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "model",
        "type": "string"
      }
    ],
    "name": "CarRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "CarSold",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      }
    ],
    "name": "buyCar",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "cars",
    "outputs": [
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "carId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "listCarForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
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
      }
    ],
    "name": "registerCar",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [contract, setContract] = useState(null);
  const [carCount, setCarCount] = useState(0);
  const [carDetails, setCarDetails] = useState(null);
  const [carId, setCarId] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);
  const signer = useMemo(() => provider.getSigner(), [provider]);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setMessage("Please install MetaMask!");
        setMessageType("danger");
        return;
      }

      try {
        await provider.send("eth_requestAccounts", []);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, LockABI, signer);
        setContract(contractInstance);
        const count = await contractInstance.carCount();
        setCarCount(count.toNumber());
      } catch (error) {
        console.error("Error initializing:", error);
        setMessage("Error initializing the contract.");
        setMessageType("danger");
      }
    };
    init();
  }, [provider, signer]);

  const updateCarCount = async () => {
    if (!contract) return;
    try {
      const count = await contract.carCount();
      setCarCount(count.toNumber());
    } catch (error) {
      console.error("Error fetching car count:", error);
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRegisterCar = async () => {
    if (!contract) return;
    try {
      await contract.registerCar(carMake, carModel, parseInt(carYear));
      showMessage("Car registered successfully!", "success");
      updateCarCount();
    } catch (error) {
      console.error("Error registering car:", error);
      showMessage("Error registering car.", "danger");
    }
  };

  const handleListForSale = async () => {
    if (!contract) return;

    try {
      await contract.listCarForSale(carId, ethers.utils.parseEther(carPrice));
      showMessage("Car listed for sale successfully!", "success");
    } catch (error) {
      console.error("Error listing car for sale:", error);
      showMessage("Error listing car for sale.", "danger");
    }
  };

  const handleBuyCar = async () => {
    if (!contract) return;

    try {
      const price = ethers.utils.parseEther(carPrice);
      await contract.buyCar(carId, { value: price });
      showMessage("Car bought successfully!", "success");
      updateCarCount();
    } catch (error) {
      console.error("Error buying car:", error);
      showMessage("Error buying car.", "danger");
    }
  };

  const fetchCarDetails = async () => {
    if (!carId || !contract) {
      showMessage("Please enter a valid Car ID.", "warning");
      return;
    }

    try {
      const details = await contract.getCarDetails(carId);
      setCarDetails({
        make: details.make,
        model: details.model,
        year: details.year,
        owner: details.owner,
        price: ethers.utils.formatEther(details.price),
        isForSale: details.isForSale,
      });
      showMessage("Car details fetched successfully!", "success");
    } catch (error) {
      console.error("Error fetching car details:", error);
      showMessage("Could not fetch car details.", "danger");
    }
  };

  return (

      <Container className="my-4">
        <h1 className="text-center">Car Marketplace DApp</h1>
        <p className="text-center">Total Cars Registered: {carCount}</p>
        {message && <Alert variant={messageType}>{message}</Alert>}
        {/* Register Car Form */}
        <Card className="mb-4">
          <Card.Header as="h5">Register Car</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Car Make</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter car make"
                    value={carMake}
                    onChange={(e) => setCarMake(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Car Model</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter car model"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Car Year</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter car year"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleRegisterCar}>
                Register Car
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* List Car for Sale */}
        <Card className="mb-4">
          <Card.Header as="h5">List Car for Sale</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Car ID</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter car ID"
                    value={carId}
                    onChange={(e) => setCarId(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price (ETH)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter price in ETH"
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" onClick={handleListForSale}>
                List Car for Sale
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Buy Car */}
        <Card className="mb-4">
          <Card.Header as="h5">Buy Car</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Car ID</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter car ID to buy"
                    value={carId}
                    onChange={(e) => setCarId(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price (ETH)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter price in ETH"
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                />
              </Form.Group>
              <Button variant="warning" onClick={handleBuyCar}>
                Buy Car
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Car Details */}
        <Card className="mb-4">
          <Card.Header as="h5">Car Details</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Car ID</Form.Label>
              <Form.Control
                  type="number"
                  placeholder="Enter car ID to view details"
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
              />
            </Form.Group>
            <Button variant="info" onClick={fetchCarDetails}>
              Fetch Car Details
            </Button>
            {carDetails && (
                <div className="mt-4">
                  <p><strong>Make:</strong> {carDetails.make}</p>
                  <p><strong>Model:</strong> {carDetails.model}</p>
                  <p><strong>Year:</strong> {carDetails.year}</p>
                  <p><strong>Owner:</strong> {carDetails.owner}</p>
                  <p><strong>Price:</strong> {carDetails.price} ETH</p>
                  <p><strong>For Sale:</strong> {carDetails.isForSale ? "Yes" : "No"}</p>
                </div>
            )}
          </Card.Body>
        </Card>
      </Container>
  );
}

export default App;
