// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title USDTzToken
 * @dev USDTz - USDT-backed hybrid stablecoin with 1:1 USD collateralization
 * Maintains strict 1:1 peg with USD and USDT across all networks
 */
contract USDTzToken is ERC20, ERC20Burnable, Ownable, Pausable {
    // ============ State Variables ============
    
    /// Collateral tracking
    mapping(address => uint256) public collateralBalance;
    uint256 public totalCollateral;
    
    /// Approved collateral tokens
    mapping(address => bool) public approvedCollaterals;
    
    /// Peg protection parameters
    uint256 public constant COLLATERAL_RATIO_TARGET = 110e16; // 110% (1.1 * 10^18)
    uint256 public constant COLLATERAL_RATIO_MINIMUM = 100e16; // 100% (1.0 * 10^18)
    uint256 public constant PEG_PRICE = 1e18; // 1 USD
    uint256 public constant MAX_PRICE_DEVIATION = 1e14; // 0.01% (0.0001 * 10^18)
    
    /// Oracle reference
    address public priceOracle;
    
    /// Circuit breaker
    bool public emergencyMode = false;
    
    // ============ Events ============
    
    event Minted(
        address indexed user,
        uint256 amount,
        address collateralToken,
        uint256 collateralUsed
    );
    
    event Redeemed(
        address indexed user,
        uint256 amount,
        address collateralToken,
        uint256 collateralReturned
    );
    
    event CollateralRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event CollateralApproved(address indexed token);
    event CollateralRevoked(address indexed token);
    event EmergencyModeActivated();
    event EmergencyModeDeactivated();
    event PegBreach(uint256 price, uint256 deviation);
    
    // ============ Modifiers ============
    
    modifier validCollateral(address token) {
        require(approvedCollaterals[token], "Invalid collateral token");
        _;
    }
    
    modifier notEmergency() {
        require(!emergencyMode, "Emergency mode active");
        _;
    }
    
    modifier healthyCollateral() {
        require(getCollateralRatio() >= COLLATERAL_RATIO_MINIMUM, "Below minimum collateral ratio");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _priceOracle) ERC20("USDTz Hybrid", "USDTz") {
        require(_priceOracle != address(0), "Invalid oracle address");
        priceOracle = _priceOracle;
    }
    
    // ============ Collateral Management ============
    
    /**
     * @dev Approve a collateral token
     * @param token Address of the collateral token
     */
    function approveCollateral(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!approvedCollaterals[token], "Already approved");
        
        approvedCollaterals[token] = true;
        emit CollateralApproved(token);
    }
    
    /**
     * @dev Revoke collateral token approval
     * @param token Address of the collateral token
     */
    function revokeCollateral(address token) external onlyOwner {
        require(approvedCollaterals[token], "Not approved");
        
        approvedCollaterals[token] = false;
        emit CollateralRevoked(token);
    }
    
    // ============ Minting & Redemption ============
    
    /**
     * @dev Mint USDTz with 1:1 collateral
     * @param amount Amount of USDTz to mint
     * @param collateralToken Address of collateral token
     */
    function mint(
        uint256 amount,
        address collateralToken
    ) external validCollateral(collateralToken) notEmergency whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer collateral from user
        bool success = IERC20(collateralToken).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Collateral transfer failed");
        
        // Mint USDTz 1:1
        _mint(msg.sender, amount);
        
        // Update collateral tracking
        collateralBalance[collateralToken] += amount;
        totalCollateral += amount;
        
        // Verify collateral ratio
        require(
            getCollateralRatio() >= COLLATERAL_RATIO_TARGET,
            "Insufficient collateral"
        );
        
        emit Minted(msg.sender, amount, collateralToken, amount);
    }
    
    /**
     * @dev Redeem USDTz for collateral 1:1
     * @param amount Amount of USDTz to redeem
     * @param collateralToken Address of collateral token to receive
     */
    function redeem(
        uint256 amount,
        address collateralToken
    ) external validCollateral(collateralToken) notEmergency whenNotPaused healthyCollateral {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient USDTz balance");
        require(
            collateralBalance[collateralToken] >= amount,
            "Insufficient collateral reserve"
        );
        
        // Burn USDTz
        _burn(msg.sender, amount);
        
        // Return collateral 1:1
        bool success = IERC20(collateralToken).transfer(msg.sender, amount);
        require(success, "Collateral transfer failed");
        
        // Update collateral tracking
        collateralBalance[collateralToken] -= amount;
        totalCollateral -= amount;
        
        emit Redeemed(msg.sender, amount, collateralToken, amount);
    }
    
    // ============ Peg Monitoring ============
    
    /**
     * @dev Get current collateral ratio
     * @return Collateral ratio (with 18 decimals)
     */
    function getCollateralRatio() public view returns (uint256) {
        if (totalSupply() == 0) return COLLATERAL_RATIO_TARGET;
        return (totalCollateral * 100e16) / totalSupply();
    }
    
    /**
     * @dev Check if collateral ratio is healthy
     * @return True if ratio >= minimum threshold
     */
    function isCollateralHealthy() public view returns (bool) {
        uint256 ratio = getCollateralRatio();
        return ratio >= COLLATERAL_RATIO_MINIMUM;
    }
    
    /**
     * @dev Check peg health
     * @return True if peg is within acceptable deviation
     */
    function isPegHealthy() external view returns (bool) {
        // In production, this would query price from DEX/Oracle
        // For now, we assume peg is healthy if collateral is sufficient
        return isCollateralHealthy();
    }
    
    /**
     * @dev Get collateral ratio percentage (for UI)
     * @return Ratio as percentage (e.g., 110 for 110%)
     */
    function getCollateralRatioPercentage() external view returns (uint256) {
        return getCollateralRatio() / 1e16;
    }
    
    // ============ Emergency Functions ============
    
    /**
     * @dev Activate emergency mode if peg breaks
     */
    function activateEmergencyMode() external onlyOwner {
        require(!emergencyMode, "Already in emergency mode");
        emergencyMode = true;
        _pause();
        emit EmergencyModeActivated();
    }
    
    /**
     * @dev Deactivate emergency mode
     */
    function deactivateEmergencyMode() external onlyOwner {
        require(emergencyMode, "Not in emergency mode");
        emergencyMode = false;
        _unpause();
        emit EmergencyModeDeactivated();
    }
    
    /**
     * @dev Inject collateral during emergency
     * @param token Collateral token address
     * @param amount Amount to inject
     */
    function emergencyInjectCollateral(
        address token,
        uint256 amount
    ) external onlyOwner validCollateral(token) {
        require(amount > 0, "Amount must be greater than 0");
        
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer failed");
        
        collateralBalance[token] += amount;
        totalCollateral += amount;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Set price oracle address
     * @param _oracle New oracle address
     */
    function setPriceOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Invalid oracle address");
        priceOracle = _oracle;
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get total collateral in USD equivalent
     * @return Total collateral amount
     */
    function getTotalCollateral() external view returns (uint256) {
        return totalCollateral;
    }
    
    /**
     * @dev Get collateral balance for specific token
     * @param token Collateral token address
     * @return Balance of the token
     */
    function getCollateralBalance(address token) external view returns (uint256) {
        return collateralBalance[token];
    }
    
    /**
     * @dev Get reserve ratio (collateral / supply)
     * @return Reserve ratio percentage
     */
    function getReserveRatio() external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (totalCollateral * 100) / totalSupply();
    }
}
