// scripts/deploy.js

const hre = require("hardhat");

async function main() {
    // Compile hợp đồng (tự động nếu chưa compile)
    await hre.run('compile');

    // Lấy contract factory
    const CarMarketplace = await hre.ethers.getContractFactory("CarMarketplace");

    // Deploy hợp đồng
    const marketplace = await CarMarketplace.deploy();

    // Chờ hoàn thành triển khai
    await marketplace.deployed();

    // In ra địa chỉ hợp đồng
    console.log("CarMarketplace deployed to:", marketplace.address);
}

// Xử lý lỗi nếu xảy ra
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});