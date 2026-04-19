import React from "react";
import Head from "next/head";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Head>
        <title>sid. | Configurações</title>
      </Head>
      <h1 className="text-3xl font-serif font-bold">Configurações</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Gerencie suas preferências de workspace e conta. Esta funcionalidade está sendo desenvolvida.
      </p>
      <div className="w-16 h-1 bg-sid-green rounded-full opacity-20" />
    </div>
  );
}
