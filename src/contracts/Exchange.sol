

pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Exchange {
    using SafeMath for uint;

    address public feeAccount; //receives exchange fees
    uint256 public feePercent; // fee percentage
    address constant ETHER = address(0); //store ETHER in tokens with blank address
    mapping(address => mapping(address => uint256)) public tokens;
    //maps all tokens deployed and all addresses of all token users and value

    //Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositEther() public (
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    )

    function depositToken(address _token, uint _amount)public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

}