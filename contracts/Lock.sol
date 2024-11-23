// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CarMarketplace {
    struct Car{
        uint256 id;
        string make;
        string model;
        uint16 year;
        address owner;
        uint256 price;
        bool isForSale;
    }
    uint256 public carCount=0;
    mapping (uint256=>Car) public cars;

    //Car storage car = cars[carId];
    //        require(msg.sender == car.owner, "Not the car owner");
    //        require(!car.isForSale, "Car already listed");
    //        car.price = price;
    //        car.isForSale = true;
    //        emit CarListedForSale(carId, price);
    event CarRegistered(uint256 indexed carId, address indexed owner, string make, string model);
    event CarListedForSale

    function registerCar(string memory make, string memory model, uint16 year) public{
        carCount++;
        cars[carCount]=Car(carCount, make, model, year, msg.sender,0,false );
        emit CarRegistered(carCount, msg.sender, make, model);
    }
    function listCarForSale(uint256 carId, uint256 price) public{
        Car storage car= cars[carId];
        require(msg.sender==car.owner,"Not the car owner" );
        require(!car.isForSale,"Car already listed");
        car.price=price;
        car.isForSale=true;


    }

}