import React from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import "./Layout.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
}
