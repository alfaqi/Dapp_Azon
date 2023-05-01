// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public immutable i_owner;
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(msg.sender == i_owner);
        _;
    }

    constructor() {
        i_owner = msg.sender;
    }

    // list products
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        //Create item struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        // Save Item struct to blockchain
        items[_id] = item;

        //Emit event
        emit List(_name, _cost, _stock);
    }

    // buy products
    function buy(uint _id) public payable {
        // Recive Crypto
        // --> Make the function payable

        // Fetch item
        Item memory item = items[_id];

        // Create an order
        Order memory order = Order(block.timestamp, item);

        // Add order to user
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Substrack stock
        items[_id].stock = item.stock - 1;

        // Emit event
    }

    // withdraw funds
}
