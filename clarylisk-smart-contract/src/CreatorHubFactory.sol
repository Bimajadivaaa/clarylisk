// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CreatorHub.sol";

contract CreatorHubFactory is Ownable, Pausable {
    uint96 public processingFee;
    uint32 public creatorCount;
    mapping(address => address) public creatorContracts;
    address[] private creators;
    address public idrxTokenAddress;
    IERC20 public idrxToken;

    event CreatorRegistered(address indexed creatorAddress, address contractAddress);
    event FeeUpdated(uint96 newFee);
    event FeesWithdrawn(uint96 value);
    event CreatorExcessWithdrawn(address indexed creatorContract, uint96 value);

    error CreatorExists();
    error CreatorNotFound();
    error NoFeesToWithdraw();
    error TransferFailed();

    constructor(uint96 _processingFee, address _idrxTokenAddress) Ownable(msg.sender) {
        processingFee = _processingFee;
        idrxTokenAddress = _idrxTokenAddress;
        idrxToken = IERC20(_idrxTokenAddress);
    }

    function registerCreator() external whenNotPaused {
        if (creatorContracts[msg.sender] != address(0)) revert CreatorExists();

        CreatorHub newCreator = new CreatorHub(msg.sender, processingFee, address(this), idrxTokenAddress);

        creatorContracts[msg.sender] = address(newCreator);
        creators.push(address(newCreator));
        unchecked {
            ++creatorCount;
        }

        emit CreatorRegistered(msg.sender, address(newCreator));
    }

    function updateProcessingFeeBatch(uint96 _processingFee, uint256 startIdx, uint256 batchSize) external onlyOwner {
        processingFee = _processingFee;
        emit FeeUpdated(_processingFee);

        uint256 length = creators.length;
        uint256 endIdx = startIdx + batchSize;
        if (endIdx > length) {
            endIdx = length;
        }
        
        for (uint256 i = startIdx; i < endIdx;) {
            CreatorHub(payable(creators[i])).updateProcessingFee(_processingFee);
            unchecked { ++i; }
        }
    }

    function withdrawExcess(address creatorAddress) external onlyOwner {
        address creatorContract = creatorContracts[creatorAddress];
        if (creatorContract == address(0)) revert CreatorNotFound();

        CreatorHub(payable(creatorContract)).withdrawExcess();
        
        // Ambil token IDRX yang sudah ditransfer ke factory
        uint256 factoryBalance = idrxToken.balanceOf(address(this));
        if (factoryBalance > 0) {
            require(idrxToken.transfer(owner(), factoryBalance), "Factory balance transfer failed");
            emit CreatorExcessWithdrawn(creatorContract, uint96(factoryBalance));
        }
    }

    function withdrawAllCreatorsExcess() external onlyOwner {
        uint256 length = creators.length;
        for (uint256 i = 0; i < length;) {
            CreatorHub(payable(creators[i])).withdrawExcess();
            unchecked {
                ++i;
            }
        }
        
        // Ambil token IDRX yang sudah ditransfer ke factory
        uint256 factoryBalance = idrxToken.balanceOf(address(this));
        if (factoryBalance > 0) {
            require(idrxToken.transfer(owner(), factoryBalance), "Factory balance transfer failed");
        }
    }

    function getFactoryBalances() external view returns (uint256) {
        return idrxToken.balanceOf(address(this));
    }

    function getCreatorContract(address creatorAddress) external view returns (address) {
        return creatorContracts[creatorAddress];
    }

    function getAllCreators() external view returns (address[] memory) {
        return creators;
    }

    function getCreatorBalance(address creatorAddress) external view returns (uint96 approvebalance, uint96 pendingvalue, uint96 discardedvalue) {
        address creatorContract = creatorContracts[creatorAddress];
        if (creatorContract == address(0)) revert CreatorNotFound();
        return CreatorHub(payable(creatorContract)).getContractBalances();
    }

    function getCreatorHistorySaweran(address creatorAddress) external view returns (CreatorHub.Saweran[] memory result) {
        address creatorContract = creatorContracts[creatorAddress];
        if (creatorContract == address(0)) revert CreatorNotFound();
        return CreatorHub(payable(creatorContract)).getHistorySaweran();
    }

    function pauseCreator(address creatorAddress) external onlyOwner {
        address creatorContract = creatorContracts[creatorAddress];
        if (creatorContract == address(0)) revert CreatorNotFound();
        CreatorHub(payable(creatorContract)).pauseHub();
    }

    function unpauseCreator(address creatorAddress) external onlyOwner {
        address creatorContract = creatorContracts[creatorAddress];
        if (creatorContract == address(0)) revert CreatorNotFound();
        CreatorHub(payable(creatorContract)).unpauseHub();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawFees() external onlyOwner {
        uint96 balance = uint96(idrxToken.balanceOf(address(this)));
        if (balance == 0) revert NoFeesToWithdraw();

        require(idrxToken.transfer(owner(), balance), "Fee transfer failed");
        emit FeesWithdrawn(balance);
    }

    function getCreators(uint256 offset, uint256 limit) external view returns (address[] memory, uint256) {
        uint256 total = creators.length;
        if (offset >= total) {
            return (new address[](0), total);
        }

        uint256 size = total - offset;
        if (size > limit) {
            size = limit;
        }

        address[] memory result = new address[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = creators[offset + i];
        }

        return (result, total);
    }

    // Fungsi untuk mendapatkan saweran dari semua creator untuk satu penyawer
    function getSaweransByPenyawer(address penyawer, uint256 offset, uint256 limit)
        external
        view
        returns (CreatorHub.SaweranWithCreator[] memory result, uint256 total)
    {
        // Hitung total saweran
        total = 0;
        for (uint256 i = 0; i < creators.length; i++) {
            uint256 creatorTotal = CreatorHub(payable(creators[i])).getSaweranCountByPenyawer(penyawer);
            total += creatorTotal;
        }

        if (total == 0 || offset >= total) {
            return (new CreatorHub.SaweranWithCreator[](0), total);
        }

        // Hitung ukuran array hasil
        uint256 size = total - offset;
        if (size > limit) {
            size = limit;
        }

        result = new CreatorHub.SaweranWithCreator[](size);
        uint256 resultIndex = 0;
        uint256 skipped = 0;
        
        // Pendekatan efisien: hanya ambil data yang benar-benar diperlukan
        for (uint256 i = 0; i < creators.length && resultIndex < size; i++) {
            CreatorHub creator = CreatorHub(payable(creators[i]));
            uint256 creatorTotal = creator.getSaweranCountByPenyawer(penyawer);
            
            if (skipped + creatorTotal <= offset) {
                // Lewati creator ini jika semua sawerannya berada sebelum offset
                skipped += creatorTotal;
                continue;
            }
            
            // Hitung offset lokal untuk creator ini
            uint256 localOffset = 0;
            if (offset > skipped) {
                localOffset = offset - skipped;
            }
            
            // Hitung limit lokal
            uint256 localLimit = size - resultIndex;
            
            // Ambil saweran dari creator ini dengan Creator info
            (CreatorHub.SaweranWithCreator[] memory creatorSawerans, ) = 
                creator.getSaweransWithCreator(penyawer, localOffset, localLimit);
            
            // Tambahkan ke hasil
            for (uint256 j = 0; j < creatorSawerans.length && resultIndex < size; j++) {
                result[resultIndex] = creatorSawerans[j];
                resultIndex++;
            }
            
            skipped += creatorTotal;
        }

        return (result, total);
    }

    receive() external payable {}
}