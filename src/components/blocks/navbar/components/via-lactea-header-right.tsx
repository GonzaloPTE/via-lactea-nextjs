import { ReactNode } from "react";
// -------- PARTIAL LOCAL COMPONENTS -------- //
import Social from "./social";

// ===================================================================
interface HeaderRightProps {
  info?: boolean;
  social?: boolean;
  search?: boolean;
  button?: ReactNode;
  navOtherClass?: string;
}
// ===================================================================

export default function ViaLacteaHeaderRight({ 
  info, 
  button, 
  social, 
  search, 
  navOtherClass 
}: HeaderRightProps) {
  return (
    <div className={navOtherClass}>
      <ul className="navbar-nav flex-row align-items-center ms-auto">
        {/* ============= info button ============= */}
        {info ? (
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-info">
              <i className="uil uil-info-circle" />
            </a>
          </li>
        ) : null}

        {/* ============= search icon button ============= */}
        {search ? (
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-search">
              <i className="uil uil-search" />
            </a>
          </li>
        ) : null}

        {/* ============= contact button ============= */}
        {button ? <li className="nav-item d-none d-md-block">{button}</li> : null}

        {/* ============= social icons link ============= */}
        {social ? <Social /> : null}

        {/* ============= hamburger button for small device ============= */}
        <li className="nav-item d-lg-none">
          <button data-bs-toggle="offcanvas" data-bs-target="#offcanvas-nav" className="hamburger offcanvas-nav-btn">
            <span />
          </button>
        </li>
      </ul>
    </div>
  );
} 