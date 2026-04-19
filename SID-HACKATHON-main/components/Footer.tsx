import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-8 px-4 md:px-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} SID - Sistema de Investimento em Descarbonização. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-xs font-medium hover:text-primary transition-colors text-muted-foreground">
            Termos de Uso
          </Link>
          <Link href="#" className="text-xs font-medium hover:text-primary transition-colors text-muted-foreground">
            Privacidade
          </Link>
          <Link href="#" className="text-xs font-medium hover:text-primary transition-colors text-muted-foreground">
            Suporte
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
