import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type Tab = 'dados' | 'senha' | 'pedidos' | 'endereco' | 'preferencias' | 'seguranca';

interface Endereco {
  rua: string; numero: string; complemento: string;
  bairro: string; cidade: string; uf: string; cep: string;
}

const INPUT = 'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors';
const BTN   = 'rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 active:scale-95 transition-all';
const BTN_OUT = 'rounded-lg border border-emerald-600 px-6 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all';

/* ── mini badge de status de pedido ── */
const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, string> = {
    Entregue:    'bg-emerald-100 text-emerald-700',
    'Em trânsito': 'bg-blue-100 text-blue-700',
    Cancelado:   'bg-red-100 text-red-600',
    Processando: 'bg-yellow-100 text-yellow-700',
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? 'bg-gray-100 text-gray-600'}`}>{s}</span>;
};

/* ── pedidos mock ── */
const MOCK_ORDERS = [
  { id: '#2024-001', data: '10/02/2025', total: 'R$ 45,00', status: 'Entregue',    itens: ['Dom Casmurro', 'O Cortiço'] },
  { id: '#2024-002', data: '22/03/2025', total: 'R$ 28,00', status: 'Em trânsito', itens: ['Memórias Póstumas'] },
  { id: '#2024-003', data: '01/05/2025', total: 'R$ 62,00', status: 'Processando', itens: ['Vidas Secas', 'Grande Sertão: Veredas'] },
  { id: '#2024-004', data: '14/06/2025', total: 'R$ 19,00', status: 'Cancelado',   itens: ['Capitães da Areia'] },
];

export default function Profile() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('dados');

  /* dados pessoais */
  const [nome,     setNome]     = useState(user?.name  ?? '');
  const [email,    setEmail]    = useState(user?.email ?? '');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [cpf,      setCpf]      = useState('');
  const [msgDados, setMsgDados] = useState('');

  /* senha */
  const [senhaAtual,    setSenhaAtual]    = useState('');
  const [novaSenha,     setNovaSenha]     = useState('');
  const [confirmar,     setConfirmar]     = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [msgSenha,      setMsgSenha]      = useState('');

  /* endereço */
  const [end, setEnd] = useState<Endereco>({ rua:'', numero:'', complemento:'', bairro:'', cidade:'', uf:'', cep:'' });
  const [msgEnd, setMsgEnd] = useState('');

  /* preferências */
  const [notifEmail,  setNotifEmail]  = useState(true);
  const [notifWhats,  setNotifWhats]  = useState(false);
  const [newsletter,  setNewsletter]  = useState(true);
  const [generos,     setGeneros]     = useState<string[]>([]);
  const [msgPref,     setMsgPref]     = useState('');

  /* segurança */
  const [doiSFator, setDoiSFator] = useState(false);

  /* filtro pedidos */
  const [filtro, setFiltro] = useState('Todos');

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dados',        label: 'Meus Dados',    icon: '👤' },
    { id: 'senha',        label: 'Senha',         icon: '🔑' },
    { id: 'pedidos',      label: 'Pedidos',       icon: '📦' },
    { id: 'endereco',     label: 'Endereço',      icon: '📍' },
    { id: 'preferencias', label: 'Preferências',  icon: '⚙️' },
    { id: 'seguranca',    label: 'Segurança',     icon: '🛡️' },
  ];

  const GENEROS = ['Romance', 'Ficção', 'História', 'Filosofia', 'Autoajuda', 'Didático', 'Terror', 'Poesia'];

  const toggleGenero = (g: string) =>
    setGeneros(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const forcaSenha = (s: string) => {
    if (!s) return { label: '', cor: '' };
    if (s.length < 6)  return { label: 'Fraca',  cor: 'bg-red-400' };
    if (s.length < 10) return { label: 'Média',  cor: 'bg-yellow-400' };
    return              { label: 'Forte', cor: 'bg-emerald-500' };
  };
  const forca = forcaSenha(novaSenha);

  const salvarSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmar) { setMsgSenha('❌ Preencha todos os campos.'); return; }
    if (novaSenha !== confirmar) { setMsgSenha('❌ As senhas não coincidem.'); return; }
    if (novaSenha.length < 6)   { setMsgSenha('❌ Mínimo de 6 caracteres.'); return; }
    setMsgSenha('✅ Senha alterada com sucesso!');
    setSenhaAtual(''); setNovaSenha(''); setConfirmar('');
  };

  const pedidosFiltrados = filtro === 'Todos' ? MOCK_ORDERS : MOCK_ORDERS.filter(p => p.status === filtro);

  const avatar = (user?.name ?? 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-5xl px-4">

        {/* ── Hero do perfil ── */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-md">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/25 text-3xl font-extrabold shadow-inner">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{user?.name ?? 'Usuário'}</h1>
              <p className="text-sm text-emerald-100">{user?.email}</p>
              <p className="mt-1 text-xs text-emerald-200">
                Membro desde Janeiro/2024 &nbsp;·&nbsp; {MOCK_ORDERS.length} pedidos realizados
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xl font-bold">{MOCK_ORDERS.filter(p=>p.status==='Entregue').length}</p>
                <p className="text-xs text-emerald-100">Entregues</p>
              </div>
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xl font-bold">{MOCK_ORDERS.reduce((a,p)=>a + p.itens.length,0)}</p>
                <p className="text-xs text-emerald-100">Livros</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ── Sidebar de abas ── */}
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                    tab === t.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Painel principal ── */}
          <main className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

            {/* DADOS PESSOAIS */}
            {tab === 'dados' && (
              <section className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">👤 Informações Pessoais</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome completo</label>
                    <input className={INPUT} value={nome} onChange={e=>{setNome(e.target.value);setMsgDados('');}} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">E-mail</label>
                    <input className={INPUT} type="email" value={email} onChange={e=>{setEmail(e.target.value);setMsgDados('');}} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefone / WhatsApp</label>
                    <input className={INPUT} placeholder="(00) 90000-0000" value={telefone} onChange={e=>setTelefone(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Data de nascimento</label>
                    <input className={INPUT} type="date" value={nascimento} onChange={e=>setNascimento(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">CPF</label>
                    <input className={INPUT} placeholder="000.000.000-00" value={cpf} onChange={e=>setCpf(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button className={BTN} onClick={()=>setMsgDados('✅ Dados salvos com sucesso!')}>Salvar alterações</button>
                  {msgDados && <p className={`text-sm ${msgDados.startsWith('✅')?'text-emerald-600':'text-red-500'}`}>{msgDados}</p>}
                </div>
              </section>
            )}

            {/* SENHA */}
            {tab === 'senha' && (
              <section className="space-y-5 max-w-md">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">🔑 Alterar Senha</h2>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Senha atual</label>
                  <input className={INPUT} type={mostrarSenhas?'text':'password'} value={senhaAtual} onChange={e=>setSenhaAtual(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nova senha</label>
                  <input className={INPUT} type={mostrarSenhas?'text':'password'} value={novaSenha} onChange={e=>{setNovaSenha(e.target.value);setMsgSenha('');}} />
                  {novaSenha && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                        <div className={`h-full rounded-full transition-all ${forca.cor}`}
                          style={{ width: forca.label==='Fraca'?'33%': forca.label==='Média'?'66%':'100%' }} />
                      </div>
                      <span className="text-xs text-gray-500">{forca.label}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirmar nova senha</label>
                  <input className={INPUT} type={mostrarSenhas?'text':'password'} value={confirmar} onChange={e=>setConfirmar(e.target.value)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" checked={mostrarSenhas} onChange={e=>setMostrarSenhas(e.target.checked)} className="accent-emerald-600" />
                  Mostrar senhas
                </label>
                <div className="flex items-center gap-4">
                  <button className={BTN} onClick={salvarSenha}>Alterar senha</button>
                  {msgSenha && <p className={`text-sm ${msgSenha.startsWith('✅')?'text-emerald-600':'text-red-500'}`}>{msgSenha}</p>}
                </div>
              </section>
            )}

            {/* PEDIDOS */}
            {tab === 'pedidos' && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
                  <h2 className="text-lg font-semibold text-gray-800">📦 Histórico de Pedidos</h2>
                  <Link to="/pedidos" className={BTN_OUT}>Ver página de pedidos →</Link>
                </div>
                {/* filtros */}
                <div className="flex flex-wrap gap-2">
                  {['Todos','Entregue','Em trânsito','Processando','Cancelado'].map(f=>(
                    <button key={f} onClick={()=>setFiltro(f)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        filtro===f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>{f}
                    </button>
                  ))}
                </div>
                {pedidosFiltrados.length === 0
                  ? <p className="py-8 text-center text-sm text-gray-400">Nenhum pedido encontrado.</p>
                  : pedidosFiltrados.map(p => (
                    <div key={p.id} className="rounded-xl border border-gray-100 p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-700">{p.id}</p>
                          <p className="text-xs text-gray-400">{p.data}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <StatusBadge s={p.status} />
                          <p className="text-sm font-bold text-gray-700">{p.total}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        📚 {p.itens.join(' · ')}
                      </p>
                    </div>
                  ))
                }
              </section>
            )}

            {/* ENDEREÇO */}
            {tab === 'endereco' && (
              <section className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">📍 Endereço de Entrega</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Rua / Avenida</label>
                    <input className={INPUT} placeholder="Ex: Rua dos Livros" value={end.rua}
                      onChange={e=>{setEnd(p=>({...p,rua:e.target.value}));setMsgEnd('');}} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Número</label>
                    <input className={INPUT} placeholder="123" value={end.numero}
                      onChange={e=>{setEnd(p=>({...p,numero:e.target.value}));setMsgEnd('');}} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Complemento</label>
                    <input className={INPUT} placeholder="Apto, bloco, sala..." value={end.complemento}
                      onChange={e=>setEnd(p=>({...p,complemento:e.target.value}))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Bairro</label>
                    <input className={INPUT} placeholder="Centro" value={end.bairro}
                      onChange={e=>{setEnd(p=>({...p,bairro:e.target.value}));setMsgEnd('');}} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Cidade</label>
                    <input className={INPUT} placeholder="Montes Claros" value={end.cidade}
                      onChange={e=>{setEnd(p=>({...p,cidade:e.target.value}));setMsgEnd('');}} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">UF</label>
                      <input className={INPUT} placeholder="MG" maxLength={2} value={end.uf}
                        onChange={e=>{setEnd(p=>({...p,uf:e.target.value.toUpperCase()}));setMsgEnd('');}} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">CEP</label>
                      <input className={INPUT} placeholder="00000-000" value={end.cep}
                        onChange={e=>{setEnd(p=>({...p,cep:e.target.value}));setMsgEnd('');}} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button className={BTN} onClick={()=>setMsgEnd('✅ Endereço salvo com sucesso!')}>Salvar endereço</button>
                  {msgEnd && <p className={`text-sm ${msgEnd.startsWith('✅')?'text-emerald-600':'text-red-500'}`}>{msgEnd}</p>}
                </div>
              </section>
            )}

            {/* PREFERÊNCIAS */}
            {tab === 'preferencias' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">⚙️ Preferências</h2>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Notificações</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Receber atualizações de pedidos por e-mail', val: notifEmail, set: setNotifEmail },
                      { label: 'Notificações via WhatsApp',                  val: notifWhats, set: setNotifWhats },
                      { label: 'Newsletter com novidades e promoções',       val: newsletter, set: setNewsletter },
                    ].map(({ label, val, set }) => (
                      <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                          onClick={()=>set(!val)}
                          className={`relative h-5 w-9 rounded-full transition-colors ${val?'bg-emerald-500':'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${val?'translate-x-4':'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Gêneros literários favoritos</h3>
                  <div className="flex flex-wrap gap-2">
                    {GENEROS.map(g => (
                      <button key={g} onClick={()=>toggleGenero(g)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                          generos.includes(g)
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-emerald-400'
                        }`}>{g}
                      </button>
                    ))}
                  </div>
                  {generos.length > 0 && (
                    <p className="mt-2 text-xs text-gray-400">Selecionados: {generos.join(', ')}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button className={BTN} onClick={()=>setMsgPref('✅ Preferências salvas!')}>Salvar preferências</button>
                  {msgPref && <p className="text-sm text-emerald-600">{msgPref}</p>}
                </div>
              </section>
            )}

            {/* SEGURANÇA */}
            {tab === 'seguranca' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">🛡️ Segurança da Conta</h2>

                <div className="rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">Autenticação em dois fatores (2FA)</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Adicione uma camada extra de segurança à sua conta. Você precisará confirmar o login via e-mail ou aplicativo autenticador.
                    </p>
                  </div>
                  <div
                    onClick={()=>setDoiSFator(!doiSFator)}
                    className={`relative flex-shrink-0 h-5 w-9 rounded-full cursor-pointer transition-colors ${doiSFator?'bg-emerald-500':'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${doiSFator?'translate-x-4':'translate-x-0.5'}`} />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="font-medium text-gray-700 text-sm mb-1">Sessões ativas</p>
                  <p className="text-xs text-gray-400 mb-3">Dispositivos onde sua conta está conectada.</p>
                  {[
                    { device: 'Chrome — Windows', local: 'Montes Claros, MG', atual: true },
                    { device: 'Safari — iPhone',  local: 'Montes Claros, MG', atual: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-t border-gray-50 first:border-0">
                      <div>
                        <p className="text-sm text-gray-700">{s.device}
                          {s.atual && <span className="ml-2 rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">Este dispositivo</span>}
                        </p>
                        <p className="text-xs text-gray-400">{s.local}</p>
                      </div>
                      {!s.atual && (
                        <button className="text-xs text-red-500 hover:underline">Encerrar</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="font-medium text-red-600 text-sm mb-1">Zona de perigo</p>
                  <p className="text-xs text-gray-500 mb-3">Estas ações são irreversíveis. Proceda com cautela.</p>
                  <button className="rounded-lg border border-red-400 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors">
                    Excluir minha conta
                  </button>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}