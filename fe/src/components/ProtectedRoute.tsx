import { useAuth } from "../store/AuthContext";
import { Navigate } from "@solidjs/router";
import type { JSX } from "solid-js/jsx-runtime";

export default function ProtectedRoute(props: { children: JSX.Element }): JSX.Element {
  const { user } = useAuth();

  if (!user()) {
    return <Navigate href="/login" />;
  }

  return props.children;
}
