"use client";

import NextLink from "components/reuseable/links/NextLink";
import ListItemLink from "components/reuseable/links/ListItemLink";
import DropdownToggleLink from "components/reuseable/links/DropdownToggleLink";
import ViaLacteaNavServicesItem from "./via-lactea-nav-services-item";
import { mainNavigation } from "../../../../data/via-lactea-navigation";

// Definir interfaces para los tipos
interface NavChild {
  id: number;
  title: string;
  url: string;
}

interface NavItem {
  id: number;
  title: string;
  url: string;
  children?: NavChild[];
}

export default function ViaLacteaNavItem() {
  return (
    <>
      {mainNavigation.map((item: NavItem) => {
        // Usar mega menú de Servicios para el ítem con id=3
        if (item.id === 3) {
          return <ViaLacteaNavServicesItem key={item.id} />;
        }
        // Si el ítem tiene hijos (dropdown normal)
        if (item.children) {
          return (
            <li className="nav-item dropdown" key={item.id}>
              <DropdownToggleLink title={item.title} className="nav-link dropdown-toggle" />
              <ul className="dropdown-menu">
                {item.children.map((child: NavChild) => (
                  <li key={child.id}>
                    <NextLink 
                      href={child.url} 
                      title={child.title} 
                      className="dropdown-item" 
                    />
                  </li>
                ))}
              </ul>
            </li>
          );
        }
        // Enlace simple
        return (
          <ListItemLink 
            key={item.id} 
            href={item.url} 
            title={item.title} 
            linkClassName="nav-link" 
          />
        );
      })}
    </>
  );
} 