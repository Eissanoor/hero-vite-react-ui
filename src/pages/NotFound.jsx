
import React from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/HeroUI";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-hero-primary/5 text-hero-primary">
            <ExclamationTriangleIcon className="h-12 w-12" />
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">404</h1>
          <p className="mt-2 text-xl text-gray-600 mb-8">Oops! Page not found</p>
          <Button variant="default" onClick={() => window.location.href = "/"}>
            Return to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
