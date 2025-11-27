// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title CollateralOracle
 * @dev Oracle for verifying collateral prices and maintaining peg
 */
contract CollateralOracle is Ownable {
    // ============ State Variables ============
    
    /// Price feeds mapping (token -> Chainlink feed)
    mapping(address => address) public priceFeeds;
    
    /// Fallback prices if oracle fails
    mapping(address => uint256) public fallbackPrices;
    
    /// Price deviation thresholds
    uint256 public constant MAX_PRICE_DEVIATION = 100; // 0.01% (100 basis points)
    uint256 public constant PRICE_PRECISION = 1e8; // Chainlink precision
    
    /// Stale price threshold
    uint256 public constant STALE_PRICE_THRESHOLD = 1 hours;
    
    // ============ Events ============
    
    event PriceFeedSet(address indexed token, address indexed feed);
    event FallbackPriceSet(address indexed token, uint256 price);
    event PriceUpdated(address indexed token, uint256 price);
    event PriceDeviation(address indexed token, uint256 deviation);
    
    // ============ Constructor ============
    
    constructor() {}
    
    // ============ Price Feed Management ============
    
    /**
     * @dev Set price feed for a token
     * @param token Token address
     * @param feed Chainlink price feed address
     */
    function setPriceFeed(address token, address feed) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(feed != address(0), "Invalid feed address");
        
        priceFeeds[token] = feed;
        emit PriceFeedSet(token, feed);
    }
    
    /**
     * @dev Set fallback price for a token
     * @param token Token address
     * @param price Fallback price (in USD, with 8 decimals)
     */
    function setFallbackPrice(address token, uint256 price) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(price > 0, "Invalid price");
        
        fallbackPrices[token] = price;
        emit FallbackPriceSet(token, price);
    }
    
    // ============ Price Queries ============
    
    /**
     * @dev Get token price in USD
     * @param token Token address
     * @return Price in USD (with 8 decimals)
     */
    function getPrice(address token) external view returns (uint256) {
        address feed = priceFeeds[token];
        require(feed != address(0), "Price feed not set");
        
        try AggregatorV3Interface(feed).latestRoundData() returns (
            uint80,
            int256 price,
            uint256,
            uint256 updatedAt,
            uint80
        ) {
            require(price > 0, "Invalid price from feed");
            require(
                block.timestamp - updatedAt <= STALE_PRICE_THRESHOLD,
                "Price feed stale"
            );
            
            return uint256(price);
        } catch {
            // Fall back to stored fallback price
            require(fallbackPrices[token] > 0, "No fallback price available");
            return fallbackPrices[token];
        }
    }
    
    /**
     * @dev Get multiple prices
     * @param tokens Array of token addresses
     * @return prices Array of prices
     */
    function getPrices(address[] calldata tokens) external view returns (uint256[] memory) {
        uint256[] memory prices = new uint256[](tokens.length);
        
        for (uint256 i = 0; i < tokens.length; i++) {
            prices[i] = this.getPrice(tokens[i]);
        }
        
        return prices;
    }
    
    // ============ Price Verification ============
    
    /**
     * @dev Verify price is within acceptable range
     * @param token Token address
     * @param expectedPrice Expected price (in USD, with 8 decimals)
     * @return True if price is within deviation threshold
     */
    function verifyPrice(address token, uint256 expectedPrice) external view returns (bool) {
        uint256 actualPrice = this.getPrice(token);
        
        // Calculate deviation in basis points
        uint256 deviation = calculateDeviation(actualPrice, expectedPrice);
        
        return deviation <= MAX_PRICE_DEVIATION;
    }
    
    /**
     * @dev Calculate price deviation
     * @param actualPrice Actual price
     * @param expectedPrice Expected price
     * @return Deviation in basis points (1 basis point = 0.01%)
     */
    function calculateDeviation(
        uint256 actualPrice,
        uint256 expectedPrice
    ) public pure returns (uint256) {
        if (actualPrice == expectedPrice) return 0;
        
        uint256 difference = actualPrice > expectedPrice
            ? actualPrice - expectedPrice
            : expectedPrice - actualPrice;
        
        // Deviation = (difference / expectedPrice) * 10000
        return (difference * 10000) / expectedPrice;
    }
    
    /**
     * @dev Check if price is within peg range
     * @param token Token address
     * @return True if price is within ±0.01% of 1 USD
     */
    function isPegHealthy(address token) external view returns (bool) {
        uint256 price = this.getPrice(token);
        uint256 pegPrice = 1e8; // 1 USD with 8 decimals
        
        uint256 deviation = calculateDeviation(price, pegPrice);
        return deviation <= MAX_PRICE_DEVIATION;
    }
    
    // ============ Collateral Verification ============
    
    /**
     * @dev Verify collateral value
     * @param collateralTokens Array of collateral token addresses
     * @param amounts Array of collateral amounts
     * @return totalValue Total collateral value in USD
     */
    function verifyCollateral(
        address[] calldata collateralTokens,
        uint256[] calldata amounts
    ) external view returns (uint256 totalValue) {
        require(collateralTokens.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < collateralTokens.length; i++) {
            uint256 price = this.getPrice(collateralTokens[i]);
            totalValue += (amounts[i] * price) / PRICE_PRECISION;
        }
        
        return totalValue;
    }
    
    /**
     * @dev Check if collateral ratio is healthy
     * @param collateralValue Total collateral value in USD
     * @param usdtzSupply Total USDTz supply
     * @param minimumRatio Minimum required ratio (e.g., 100 for 100%)
     * @return True if ratio is healthy
     */
    function isCollateralRatioHealthy(
        uint256 collateralValue,
        uint256 usdtzSupply,
        uint256 minimumRatio
    ) external pure returns (bool) {
        if (usdtzSupply == 0) return true;
        
        uint256 ratio = (collateralValue * 100) / usdtzSupply;
        return ratio >= minimumRatio;
    }
    
    // ============ Utility Functions ============
    
    /**
     * @dev Convert price to different precision
     * @param price Price with 8 decimals
     * @param targetDecimals Target decimal precision
     * @return Converted price
     */
    function convertPrice(uint256 price, uint256 targetDecimals) external pure returns (uint256) {
        if (targetDecimals == 8) return price;
        
        if (targetDecimals > 8) {
            return price * (10 ** (targetDecimals - 8));
        } else {
            return price / (10 ** (8 - targetDecimals));
        }
    }
    
    /**
     * @dev Check if price feed is available
     * @param token Token address
     * @return True if price feed is set
     */
    function hasPriceFeed(address token) external view returns (bool) {
        return priceFeeds[token] != address(0);
    }
}
