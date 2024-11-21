'use client'

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export const config = {
    providers: [],
} satisfies NextAuthOptions

export function auth(
    ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
  ) {
    return getServerSession(...args, config)
  }