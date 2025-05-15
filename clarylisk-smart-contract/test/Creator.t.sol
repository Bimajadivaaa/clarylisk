//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/CreatorHub.sol";
import "../src/CreatorHubFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//Mock IDRX Token for Testing
contract MockIDRXToken is ERC20 {
    constructor() ERC20("Mock IDRX Token", "IDRX") {
        _mint(msg.sender, 100000000000000); // Mint initial supply
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CreatorHubTest is Test {
    CreatorHubFactory public factory;
    MockIDRXToken public idrxToken;

    address public admin = address(1);
    address public creator1 = address(2);
    address public creator2 = address(3);
    address public penyawer1 = address(4);
    address public penyawer2 = address(5);

    uint96 public processingFee = 100; //1 IDRX Token

    function setUp() public{
        vm.startPrank(admin);
        idrxToken = new MockIDRXToken();
        factory = new CreatorHubFactory(processingFee, address(idrxToken));
        vm.stopPrank();

        //Mint tokens to penyawer
        idrxToken.mint(penyawer1, 100 * 10**18);
        idrxToken.mint(penyawer2, 100 * 10**18);
    }

    function testCreatorRegistration() public{
        vm.startPrank(creator1);
        factory.registerCreator();
        vm.stopPrank();

        address hubAddress = factory.getCreatorContract(creator1);
        assertEq(factory.creatorCount(), 1);
        assertTrue(hubAddress != address(0));
    }

    function testSawerGasUsage() public{
        //register creator
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();

        // Prepare for sawer
        vm.startPrank(penyawer1);
        uint96 sawerAmount = 5000;
        uint96 totalApprove = sawerAmount + processingFee;
        idrxToken.approve(hubAddress, totalApprove);

        // Measure gas usage
        uint256 gasStart = gasleft();
        hub.sawer(sawerAmount, "Test saweran");
        uint256 gasUsed = gasStart - gasleft();

        console.log("Gas used for sawer(): ", gasUsed);
        vm.stopPrank();

        // Verify result
        (CreatorHub.Saweran[] memory sawerans, uint256 total) = hub.getSaweransByPenyawer(penyawer1, 0, 10); 
        assertEq(total, 1);
        assertEq(sawerans[0].value, sawerAmount);
    }

    function testApproveSaweranGasUsage() public{
        // Set up register creator
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();

        vm.startPrank(penyawer1);
        uint96 sawerAmount = 5000;
        uint96 totalApprove = sawerAmount + processingFee;
        idrxToken.approve(hubAddress, totalApprove);
        hub.sawer(sawerAmount, "Test saweran");
        vm.stopPrank();

        // Approve saweran and measure gas
        vm.startPrank(creator1);
        uint256 gasStart = gasleft();
        hub.approveSaweran(0);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for approveSaweran(): ", gasUsed);
        vm.stopPrank();

        // Verify
        ( uint256 id,address penyawer, uint96 value, string memory note, uint32 createdAt, bool approved, bool discarded, uint32 approvedAt, uint32 discardedAt) = hub.getSaweran(0);
        assertTrue(approved);
        assertFalse(discarded);
    }

    // function testApproveSaweranBatch() public{
    //     // Set up: register creator and make multiple sawers
    //     vm.startPrank(creator1);
    //     factory.registerCreator();
    //     address hubAddress = factory.getCreatorContract(creator1);
    //     CreatorHub hub = CreatorHub(payable(hubAddress));
    //     vm.stopPrank();
        
    //     // Make 5 sawers
    //     vm.startPrank(penyawer1);
    //     uint96 sawerAmount = 5000;
    //     uint96 totalApprove = sawerAmount + processingFee;
    //     for (uint i = 0; i < 5; i++) {
    //         idrxToken.approve(hubAddress, totalApprove);
    //         hub.sawer(sawerAmount, string(abi.encodePacked("Test saweran ", i+1)));
    //     }
    //     vm.stopPrank();

    //     // Test acceptAllSawerans gas usage
    //     vm.startPrank(creator1);
    //     uint256 gasStart = gasleft();
    //     hub.acceptAllSawerans();
    //     uint256 gasUsed = gasStart - gasleft();

    //     console.log("Gas used for acceptAllSawerans() with 5 sawerans: ", gasUsed);
    //     console.log("Average gas per saweran: ", gasUsed / 5);
    //     vm.stopPrank();

    //     // Verify all are approved
    //     for (uint i = 0; i < 5; i++) {
    //         (,,,, bool approved,) = hub.getSaweran(i);
    //         assertTrue(approved);
    //     }
    // }

    function testGetSaweransByPenyawerGasUsage() public {
        // Set up: register creator and make multiple sawers
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();
        
        // Make 10 sawers
        vm.startPrank(penyawer1);
        uint96 sawerAmount = 5 * 10**18;
        for (uint i = 0; i < 10; i++) {
            idrxToken.approve(hubAddress, sawerAmount);
            hub.sawer(sawerAmount, string(abi.encodePacked("Test saweran ", i+1)));
        }
        vm.stopPrank();
        
        // Test getSaweransByPenyawer gas usage
        uint256 gasStart = gasleft();
        (CreatorHub.Saweran[] memory sawerans, uint256 total) = hub.getSaweransByPenyawer(penyawer1, 0, 10);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for getSaweransByPenyawer() with 10 sawerans: ", gasUsed);
        assertEq(total, 10);
        assertEq(sawerans.length, 10);
    }
    
    function testWithdrawExcessGasUsage() public {
        // Set up: register creator, make sawer, send extra tokens to contract
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();
        
        // Send tokens directly to contract (simulating someone sending by mistake)
        idrxToken.transfer(hubAddress, 10 * 10**18);
        
        // Test withdrawExcess gas usage
        vm.startPrank(admin);
        uint256 gasStart = gasleft();
        factory.withdrawExcess(creator1);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for withdrawExcess(): ", gasUsed);
        vm.stopPrank();
        
        // Verify admin received the tokens
        uint256 adminBalance = idrxToken.balanceOf(admin);
        assertTrue(adminBalance >= 10 * 10**18);
    }
    
    function testUpdateProcessingFeeGasUsage() public {
        // Register multiple creators
        vm.prank(creator1);
        factory.registerCreator();
        
        vm.prank(creator2);
        factory.registerCreator();
        
        // Test updateProcessingFee gas usage
        vm.startPrank(admin);
        uint96 newFee = 500;
        uint256 gasStart = gasleft();
        factory.updateProcessingFeeBatch(newFee);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for updateProcessingFee() with 2 creators: ", gasUsed);
        vm.stopPrank();
        
        // Verify fees updated in both contracts
        address hub1Address = factory.getCreatorContract(creator1);
        address hub2Address = factory.getCreatorContract(creator2);
        
        assertEq(CreatorHub(payable(hub1Address)).processingFee(), newFee);
        assertEq(CreatorHub(payable(hub2Address)).processingFee(), newFee);
    }
    
    // Test gas optimization for the largest function - acceptAllSawerans with many sawerans
    function testAcceptAllSaweransScaling() public {
        // Set up: register creator
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();
        
        // Make different number of sawers and measure gas
        uint96 sawerAmount = 2 * 10**18;
        
        // Test with 5 sawers
        vm.startPrank(penyawer1);
        for (uint i = 0; i < 5; i++) {
            idrxToken.approve(hubAddress, sawerAmount);
            hub.sawer(sawerAmount, string(abi.encodePacked("Test saweran ", i+1)));
        }
        vm.stopPrank();
        
        // vm.startPrank(creator1);
        // uint256 gasStart5 = gasleft();
        // hub.acceptAllSawerans();
        // uint256 gasUsed5 = gasStart5 - gasleft();
        // console.log("Gas for acceptAllSawerans with 5 sawerans: ", gasUsed5);
        // console.log("Gas per saweran (5): ", gasUsed5 / 5);
        // vm.stopPrank();
        
        // Reset for next test
        vm.prank(admin);
        factory.pauseCreator(creator1);
        
        vm.prank(admin);
        factory.unpauseCreator(creator1);
        
        // Test with 20 sawers
        vm.startPrank(penyawer2);
        for (uint i = 0; i < 20; i++) {
            idrxToken.approve(hubAddress, sawerAmount);
            hub.sawer(sawerAmount, string(abi.encodePacked("Test saweran ", i+1)));
        }
        vm.stopPrank();
        
        // vm.startPrank(creator1);
        // uint256 gasStart20 = gasleft();
        // hub.acceptAllSawerans();
        // uint256 gasUsed20 = gasStart20 - gasleft();
        // console.log("Gas for acceptAllSawerans with 20 sawerans: ", gasUsed20);
        // console.log("Gas per saweran (20): ", gasUsed20 / 20);
        // vm.stopPrank();
        
        // // Compare gas efficiency as number of sawerans grows
        // console.log("Gas efficiency ratio (20/5): ", (gasUsed20 / 20) * 100 / (gasUsed5 / 5), "%");
    }
    
    // Test failing cases
    // function testFailWhenSawerIsInsufficient() public {
    //     // Set up
    //     vm.startPrank(creator1);
    //     factory.registerCreator();
    //     address hubAddress = factory.getCreatorContract(creator1);
    //     CreatorHub hub = CreatorHub(payable(hubAddress));
    //     vm.stopPrank();
        
    //     // Try to sawer with amount less than processing fee
    //     vm.startPrank(penyawer1);
    //     uint96 sawerAmount = processingFee - 1; // Less than processing fee
    //     idrxToken.approve(hubAddress, sawerAmount);
        
    //     // This should fail
    //     hub.sawer(sawerAmount, "Insufficient saweran");
    //     vm.stopPrank();
    // }
    
    // function testFailWithdrawWithNoBalance() public {
    //     // Set up
    //     vm.startPrank(creator1);
    //     factory.registerCreator();
    //     address hubAddress = factory.getCreatorContract(creator1);
    //     CreatorHub hub = CreatorHub(payable(hubAddress));
        
    //     // Try to withdraw with no balance
    //     hub.withdraw();
    //     vm.stopPrank();
    // }
    
    function testPauseAndUnpause() public {
        // Set up
        vm.startPrank(creator1);
        factory.registerCreator();
        address hubAddress = factory.getCreatorContract(creator1);
        CreatorHub hub = CreatorHub(payable(hubAddress));
        vm.stopPrank();
        
        // Admin pauses the creator hub
        vm.prank(admin);
        factory.pauseCreator(creator1);
        
        // Try to sawer while paused (should fail)
        vm.startPrank(penyawer1);
        uint96 sawerAmount = 5 * 10**18;
        idrxToken.approve(hubAddress, sawerAmount);
        
        vm.expectRevert("Pausable: paused");
        hub.sawer(sawerAmount, "Test while paused");
        vm.stopPrank();
        
        // Unpause and try again
        vm.prank(admin);
        factory.unpauseCreator(creator1);
        
        vm.startPrank(penyawer1);
        hub.sawer(sawerAmount, "Test after unpause");
        vm.stopPrank();
        
        // Verify saweran was received
        (CreatorHub.Saweran[] memory sawerans, uint256 total) = hub.getSaweransByPenyawer(penyawer1, 0, 10);
        assertEq(total, 1);
    }
}