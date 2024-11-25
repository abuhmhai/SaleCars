import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LockABI from "./contracts/Lock.json";
import { CONTRACT_ADDRESS } from "./contracts/config";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [unlockTime, setUnlockTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      // Kiểm tra nếu MetaMask được cài đặt
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Kết nối tới provider và signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(signer);

      // Kết nối hợp đồng
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LockABI.abi, signer);
      setContract(contract);

      // Lấy dữ liệu unlockTime
      const unlockTime = await contract.unlockTime();
      setUnlockTime(new Date(unlockTime * 1000).toLocaleString());
    };

    init();
  }, []);

  const handleSetMessage = async () => {
    try {
      const tx = await contract.setMessage(message); // Ví dụ hàm setMessage
      await tx.wait();
      alert("Message updated successfully!");
    } catch (error) {
      console.error("Error setting message:", error);
    }
  };

  return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Welcome to Lock DApp</h1>
        <p>Contract Address: {CONTRACT_ADDRESS}</p>
        <p>Unlock Time: {unlockTime}</p>

        <div>
          <input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSetMessage}>Set Message</button>
        </div>
      </div>
  );
}

export default App;
