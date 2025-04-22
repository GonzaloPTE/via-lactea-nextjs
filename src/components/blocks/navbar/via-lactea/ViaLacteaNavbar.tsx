"use client";

import { Fragment, ReactElement, useRef } from "react";
import clsx from "clsx";
// -------- CUSTOM HOOKS -------- //
import useSticky from "hooks/useSticky";
import useNestedDropdown from "hooks/useNestedDropdown";
// -------- CUSTOM COMPONENTS -------- //
import NextLink from "components/reuseable/links/NextLink";
// LOCAL CUSTOM COMPONENTS
import Info from "../components/Info";
import Search from "../components/search";
// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavItem from "../components/via-lactea-nav-item";
import ViaLacteaHeaderRight from "../components/via-lactea-header-right";

// ===================================================================
interface ViaLacteaNavbarProps {
  info?: boolean;
  fancy?: boolean;
  logoAlt?: string;
  search?: boolean;
  social?: boolean;
  stickyBox?: boolean;
  navClassName?: string;
  button?: ReactElement;
  navOtherClass?: string;
  whiteBackground?: boolean;
}
// ===================================================================

export default function ViaLacteaNavbar({
  fancy,
  button,
  logoAlt,
  info = false,
  social = false,
  search = false,
  stickyBox = true,
  whiteBackground = false,
  navOtherClass = "navbar-other d-flex",
  navClassName = "navbar navbar-expand-lg center-nav transparent navbar-light"
}: ViaLacteaNavbarProps) {
  useNestedDropdown();
  const sticky = useSticky(350);
  const navbarRef = useRef<HTMLElement | null>(null);

  // dynamically render the logo
  const logo = sticky ? "via-lactea-logo" : logoAlt ?? "via-lactea-logo";

  // generate navbar class based on white background prop
  const finalNavClassName = whiteBackground 
    ? "navbar navbar-expand-lg center-nav navbar-light bg-white" 
    : navClassName;

  // all main header contents
  const headerContent = (
    <Fragment>
      <div className="navbar-brand flex-grow-1 mb-2 d-flex justify-content-center justify-content-lg-start">
        <NextLink
          href="/"
          title={
            <img
                alt="logo Vía Láctea" 
                src={`/img/via-lactea/svg/${logo}.svg`}
                srcSet={`/img/via-lactea/svg/${logo}.svg 2x`}
                width={sticky ? 100 : 60}
                height={sticky ? 100 : 60}
                className={sticky ? "d-none d-lg-block" : ""}
                style={{ transform: 'scale(2.5)' }}
            />
          }
        />
      </div>

      <div id="offcanvas-nav" data-bs-scroll="true" className="navbar-collapse offcanvas offcanvas-nav offcanvas-start">
        <div className="offcanvas-header d-lg-none">
          <h3 className="text-white fs-30 mb-0">Vía Láctea</h3>
          <button
            type="button"
            aria-label="Close"
            data-bs-dismiss="offcanvas"
            className="btn-close btn-close-white ms-auto"
          />
        </div>
        <div className="offcanvas-header d-lg-none">
          <h2 className="text-white fs-20 mb-0 mt-n12">Sueño y Lactancia</h2>
        </div>

        <div className="offcanvas-body mx-lg-auto d-flex flex-column h-100">
          <ul className="navbar-nav">
            {/* ===================== via-lactea navigation ===================== */}
            <ViaLacteaNavItem />
          </ul>
        </div>
      </div>

      {/* ============= right side header content ============= */}
      <ViaLacteaHeaderRight
        info={info}
        button={button}
        search={search}
        social={social}
        navOtherClass={navOtherClass}
      />
    </Fragment>
  );

  return (
    <Fragment>
      {stickyBox ? <div className="d-sm-none" style={{ paddingTop: sticky ? navbarRef.current?.clientHeight : 0 }} /> : null}

      <nav 
        ref={navbarRef} 
        className={clsx(
          finalNavClassName, 
          sticky ? "navbar-clone fixed navbar-stick d-sm-none" : "",
          "my-lg-8 mx-auto"
        )}
        style={sticky ? { backgroundColor: whiteBackground ? 'white' : 'rgba(255, 255, 255, 0.2)' } : {}}
      >
        <div className="container flex-lg-row flex-nowrap align-items-start mt-8">{headerContent}</div>
      </nav>

      {/* ============= info sidebar ============= */}
      {info ? <Info /> : null}

      {/* ============= show search box ============= */}
      {search ? <Search /> : null}
    </Fragment>
  );
} 