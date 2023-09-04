"use client"

import React from "react";
import Link from 'next/link';
import {Navbar, NavbarBrand, NavbarContent, User, Button } from "@nextui-org/react";
import favicon from "@/app/favicon.ico";

export function Header() {
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand>
        <Button href="/" as={Link} variant="light">
          <p className="font-bold text-inherit">ポートフォリオ</p>
        </Button>
      </NavbarBrand>
      <NavbarContent justify="end">
      <User   
        name="サンプル"
        description="ログイン中"
        avatarProps={{
          src: favicon.src
        }}
      />
      </NavbarContent>
    </Navbar>
  );
}
