import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            {/* ✅ Logo formatada corretamente */}
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="Logo Sebo" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-600">
              Universo da Páginas. Sua livraria de usados favorita. Dando uma nova vida aos livros e conectando leitores apaixonados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-emerald-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><WhatsAppIcon /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Institucional</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/sobre" className="hover:text-emerald-600">Sobre Nós</Link></li>
              <li><Link to="/venda" className="hover:text-emerald-600">Como Vender</Link></li>
              <li><Link to="/politica" className="hover:text-emerald-600">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-emerald-600">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Atendimento</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/ajuda" className="hover:text-emerald-600">Central de Ajuda</Link></li>
              <li><Link to="/pedidos" className="hover:text-emerald-600">Acompanhar Pedido</Link></li>
              <li><Link to="/trocas" className="hover:text-emerald-600">Trocas e Devoluções</Link></li>
              <li><Link to="/contato" className="hover:text-emerald-600">Fale Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Contato</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span>Rua dos Livros, 123 - Centro<br /> Montes Claros, MG - 01234-567</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-600" />
                <span>(38) 98765-4321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span>contato@seboup.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sebo Universo da Páginas Livraria de Usados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}