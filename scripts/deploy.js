const hre = require("hardhat");

async function main() {
    // Lấy Contract Factory
    const CarMarketplace = await hre.ethers.getContractFactory("CarMarketplace");

    // Triển khai hợp đồng
    const contract = await CarMarketplace.deploy();

    // Đợi hợp đồng triển khai xong
    console.log("Deploying contract...");
    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

// Gọi hàm main và xử lý lỗi
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
