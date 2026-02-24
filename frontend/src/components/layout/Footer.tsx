import { Link } from 'react-router-dom';
import { BookOpen, Github, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-700">
              <BookOpen className="h-8 w-8" />
              <span>Sebo</span>
            </Link>
            <p className="text-sm text-gray-600">
              Sua livraria de usados favorita. Dando uma nova vida aos livros e conectando leitores apaixonados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-emerald-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><Github className="h-5 w-5" /></a>
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
                <span>Rua dos Livros, 123 - Centro<br />São Paulo, SP - 01234-567</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-600" />
                <span>(11) 98765-4321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span>contato@sebo.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sebo Livraria de Usados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
