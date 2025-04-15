"use client";

import { Fragment, ReactElement, useRef } from "react";
import clsx from "clsx";
// -------- CUSTOM HOOKS -------- //
import useSticky from "hooks/useSticky";
import useNestedDropdown from "hooks/useNestedDropdown";
// -------- CUSTOM COMPONENTS -------- //
import NextLink from "components/reuseable/links/NextLink";
import SocialLinks from "components/reuseable/SocialLinks";
// LOCAL CUSTOM COMPONENTS
import Info from "../components/Info";
import Search from "../components/search";
// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavItem from "../components/via-lactea-nav-item";
import ViaLacteaHeaderRight from "../components/via-lactea-header-right";
import { contactInfo } from "../../../../data/via-lactea-navigation";

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
  navOtherClass = "navbar-other d-flex",
  navClassName = "navbar navbar-expand-lg center-nav transparent navbar-light"
}: ViaLacteaNavbarProps) {
  useNestedDropdown();
  const sticky = useSticky(350);
  const navbarRef = useRef<HTMLElement | null>(null);

  // dynamically render the logo
  const logo = sticky ? "via-lactea-logo" : logoAlt ?? "via-lactea-logo";

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
                width={sticky ? 100 : 200}
                height={sticky ? 100 : 200}
                className={sticky ? "d-none d-lg-block" : ""}
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

        <div className="offcanvas-body ms-lg-auto d-flex flex-column h-100">
          <ul className="navbar-nav">
            {/* ===================== via-lactea navigation ===================== */}
            <ViaLacteaNavItem />
          </ul>

          {/* ============= show contact info in the small device sidebar ============= */}
          <div className="offcanvas-footer d-lg-none">
            <div>
              <NextLink 
                title={contactInfo.email} 
                className="link-inverse" 
                href={`mailto:${contactInfo.email}`} 
              />
              <br />
              <NextLink 
                href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} 
                title={contactInfo.phone} 
              />
              <br />
              <SocialLinks />
            </div>
          </div>
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
      {stickyBox ? <div style={{ paddingTop: sticky ? navbarRef.current?.clientHeight : 0 }} /> : null}

      <nav 
        ref={navbarRef} 
        className={clsx(navClassName, { "navbar-clone fixed navbar-stick": sticky })}
        style={sticky ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : {}}
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