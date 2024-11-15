import { Link } from "react-router-dom";
import '../css/Navbar.css';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const Navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("username");
    Navigate("/");
  };

  const handleLogo = () => {
    // Navigate to dashboard if logged in, else go to home page
    cookies.access_token ? Navigate("/dashboard") : Navigate("/");
  };

  return (
    <div className="nav">
      <div className="nav-items">
        <div className="logo">
          <span
            className="nav-logo"
            onClick={handleLogo}
            style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer" }}
          >
            CMA'S
          </span>
        </div>

        <div className="nav-item">
          <div className="auth">
            {!cookies.access_token ? (
              <div></div>
            ) : (
              <button className="logout-btn" onClick={logout}>
                <h1 className="text-btn">Logout</h1>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
