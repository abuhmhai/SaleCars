// Sử dụng Hardhat Ignition để quản lý triển khai hợp đồng.
// Tìm hiểu thêm tại https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SaleCarModule", (m) => {
  // Không cần tham số truyền vào cho "CarMarketplace"

  // Triển khai hợp đồng CarMarketplace
  const carMarketplace = m.contract("CarMarketplace");

  // Trả về hợp đồng đã triển khai
  return { carMarketplace };
});