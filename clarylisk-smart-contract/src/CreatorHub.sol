// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CreatorHub is Ownable, ReentrancyGuard, Pausable {
    struct Saweran {
        uint256 id;
        address penyawer;
        uint96 value;
        uint32 createdAt;
        bool approved;
        bool discarded;
        uint32 approvedAt;
        uint32 discardedAt;
        string note;
    }

    // Struktur untuk menggabungkan saweran dengan informasi creator
    struct SaweranWithCreator {
        address creator;
        address penyawer;
        uint96 value;
        string note;
        uint32 createdAt;
        bool approved;
        bool discarded;
    }

    IERC20 public immutable idrxToken;
    address public immutable hubFactory;    
    uint96 public processingFee;
    string public creatorId;
    Saweran[] public sawerans;
    uint96 private pendingBalance;
    uint96 private approvedBalance;
    uint96 private discardBalance;
    mapping(address => uint256[]) private penyawerToSaweranIds;

    event SaweranReceived(address indexed penyawer, uint96 value, string note, uint32 createdAt);
    event SaweranApproved(uint256 indexed SaweranId);
    event SaweranDiscarded(uint256 indexed SaweranId);
    event Withdraw(address indexed to, uint96 amount);
    event WithdrawExcess(address indexed to, uint96 amount);
    event ExcessFundsWithdrawn(uint96 value);
    event Paused();
    event Unpaused();

    error UnauthorizedAccess();

    modifier onlyHubFactory() {
        if (msg.sender != hubFactory) revert("Unauthorized: Only hub factory");
        _;
    }

    modifier onlyFactoryAdmin() {
        if (msg.sender != Ownable(hubFactory).owner()) revert UnauthorizedAccess();
        _;
    }

    constructor(
        address _owner,
        uint96 _processingFee,
        address _hubFactory,
        address _idrxTokenAddress
    ) Ownable(_owner) {
        processingFee = _processingFee;
        hubFactory = _hubFactory;   
        idrxToken = IERC20(_idrxTokenAddress);
    }

    function sawer(uint96 amount, string calldata note) external nonReentrant whenNotPaused {
        require(amount > processingFee, "Insufficient saweran amount, more than 100 IDRX");
        require(idrxToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        unchecked {
            pendingBalance += amount;
            uint256 saweranId = sawerans.length;
            sawerans.push(Saweran({
                id: saweranId,
                penyawer: msg.sender,
                value: amount,
                note: note,
                createdAt: uint32(block.timestamp),
                approved: false,
                discarded: false,
                approvedAt: 0,
                discardedAt: 0
            }));
            penyawerToSaweranIds[msg.sender].push(saweranId);
        }
        emit SaweranReceived(msg.sender, amount, note, uint32(block.timestamp));
    }

    function approveSaweran(uint256 SaweranId) external onlyOwner nonReentrant whenNotPaused {
        require(SaweranId < sawerans.length, "Invalid ID, out of range");

        Saweran storage saweran = sawerans[SaweranId];
        require(!saweran.approved && !saweran.discarded, "Already handled");

        saweran.approved = true;
        saweran.approvedAt = uint32(block.timestamp);

        uint96 fee = processingFee;
        uint96 totalAmount = saweran.value;
        uint96 payout = totalAmount - fee;
        unchecked {
            pendingBalance -= totalAmount;
            approvedBalance += payout;
        }

        require(idrxToken.transfer(hubFactory, fee), "Fee transfer failed");
        require(idrxToken.transfer(owner(), payout), "Payout transfer failed");

        emit SaweranApproved(SaweranId);
    }

    function discardSaweran(uint256 SaweranId) external onlyOwner nonReentrant whenNotPaused {
        require(SaweranId < sawerans.length, "Invalid ID");

        Saweran storage saweran = sawerans[SaweranId];
        require(!saweran.approved && !saweran.discarded, "Already processed");

        saweran.discarded = true;
        saweran.discardedAt = uint32(block.timestamp);

        uint96 amount = saweran.value;
        unchecked {
            pendingBalance -= amount;
            discardBalance += amount;
        }

        require(idrxToken.transfer(saweran.penyawer, amount), "Refund failed");

        emit SaweranDiscarded(SaweranId);
    }

    function getHistorySaweran() external view returns (Saweran[] memory result) {
        uint256 total = sawerans.length;
        result = new Saweran[](total);

        for (uint256 i = 0; i < total; i++) {
            Saweran storage s = sawerans[i];
            result[i] = Saweran({
                id: s.id,
                penyawer: s.penyawer,
                value: s.value,
                note: s.note,
                createdAt: s.createdAt,
                approvedAt: s.approvedAt,
                discardedAt: s.discardedAt,
                approved: s.approved,
                discarded: s.discarded
            });
        }

        return result;
    }

    function acceptAllSaweransBatched(uint256 startIdx, uint256 batchSize) external onlyOwner nonReentrant whenNotPaused {
        uint256 endIdx = startIdx + batchSize;
        if (endIdx > sawerans.length) {
            endIdx = sawerans.length;
        }
        
        for (uint256 i = startIdx; i < endIdx;) {
            Saweran storage saweran = sawerans[i];
            
            if (!saweran.approved && !saweran.discarded) {
                saweran.approved = true;
                
                uint96 fee = processingFee;
                uint96 totalAmount = saweran.value;
                uint96 payout = totalAmount - fee;
                unchecked {
                    pendingBalance -= totalAmount;
                    approvedBalance += payout;
                    ++i; // Move increment inside unchecked block
                }

                bool feeTransferred = idrxToken.transfer(hubFactory, fee);
                bool payoutTransferred = idrxToken.transfer(owner(), payout);
                
                require(feeTransferred && payoutTransferred, "Transfer failed");
                
                emit SaweranApproved(i);
            } else {
                unchecked { ++i; }
            }
        }
    }

    function withdrawExcess() external onlyHubFactory nonReentrant {
        uint96 totalHeld = uint96(idrxToken.balanceOf(address(this)));
        uint96 reserved = pendingBalance + approvedBalance;
        require(totalHeld > reserved, "No excess");

        uint96 excess = totalHeld - reserved;
        require(idrxToken.transfer(hubFactory, excess), "Withdraw excess failed");

        emit WithdrawExcess(hubFactory, excess);
    }

    function updateProcessingFee(uint96 _processingFee) external onlyHubFactory {
        processingFee = _processingFee;
    }

    function pauseHub() external onlyHubFactory {
        _pause();
        emit Paused();
    }

    function unpauseHub() external onlyHubFactory {
        _unpause();
        emit Unpaused();
    }

    function getTotalSawerans() external view returns (uint256) {
        return sawerans.length;
    }

    function getContractBalances() external view returns (uint96 approved, uint96 pending, uint96 discard) {
        return (approvedBalance, pendingBalance, discardBalance);
    }

    function getSaweran(uint256 id)
        external
        view
        returns (
            uint256 saweranId,
            address penyawer,
            uint96 value,
            string memory note,
            uint32 createdAt,
            bool approved,
            bool discarded,
            uint32 approvedAt,
            uint32 discardedAt
        )
    {
        require(id < sawerans.length, "Invalid ID");
        Saweran storage saweran = sawerans[id];
        return (
            saweran.id,
            saweran.penyawer,
            saweran.value,
            saweran.note,
            saweran.createdAt,
            saweran.approved,
            saweran.discarded,
            saweran.approvedAt,
            saweran.discardedAt
        );
    }


    function getSaweransByPenyawer(address penyawer, uint256 offset, uint256 limit)
        external
        view
        returns (Saweran[] memory result, uint256 total)
    {
        // First count total donations by this donator
        uint256[] storage ids = penyawerToSaweranIds[penyawer];
        total = ids.length;

        if (total == 0 || offset >= total) {
            return (new Saweran[](0), total);
        }
        
        // for (uint256 i = 0; i < sawerans.length; i++) {
        //     if (sawerans[i].penyawer == penyawer) {
        //         count++;
        //     }
        // }

        // if (count == 0 || offset >= count) {
        //     return (new Saweran[](0), count);
        // }

        // Calculate size of return array
        uint256 size = total - offset;
        if (size > limit) {
            size = limit;
        }

        // Create result array
        result = new Saweran[](size);

        // Fill result array
        for (uint256 i = 0; i < size;) {
            result[i] = sawerans[ids[offset + i]];
            unchecked { ++i; }
        }

        return (result, total);
    }

    // Function to get Saweran with creator info - digunakan oleh factory
    function getSaweransWithCreator(address penyawer, uint256 offset, uint256 limit) 
        external 
        view 
        returns (SaweranWithCreator[] memory result, uint256 count) 
    {
        (Saweran[] memory sawerans_, uint256 total) = this.getSaweransByPenyawer(penyawer, offset, limit);
        
        result = new SaweranWithCreator[](sawerans_.length);
        for (uint256 i = 0; i < sawerans_.length; i++) {
            result[i] = SaweranWithCreator({
                creator: address(this),
                penyawer: sawerans_[i].penyawer,
                value: sawerans_[i].value,
                note: sawerans_[i].note,
                createdAt: sawerans_[i].createdAt,
                approved: sawerans_[i].approved,
                discarded: sawerans_[i].discarded
            });
        }
        
        return (result, total);
    }

    // Function to get count of Sawerans for a specific penyawer
    function getSaweranCountByPenyawer(address penyawer) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < sawerans.length; i++) {
            if (sawerans[i].penyawer == penyawer) {
                count++;
            }
        }
        return count;
    }

    receive() external payable {}
}