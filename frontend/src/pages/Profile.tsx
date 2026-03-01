import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore, UserProfile } from '../store/authStore';
import Orders from './Orders';

type Tab = 'dados' | 'senha' | 'pedidos' | 'endereco' | 'preferencias' | 'seguranca';

const INPUT   = 'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors';
const BTN     = 'rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60';
const BTN_OUT = 'rounded-lg border border-emerald-600 px-6 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all';

const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, string> = {
    ENTREGUE:   'bg-emerald-100 text-emerald-700',
    ENVIADO:    'bg-blue-100 text-blue-700',
    CANCELADO:  'bg-red-100 text-red-600',
    PENDENTE:   'bg-yellow-100 text-yellow-700',
    PAGO:       'bg-purple-100 text-purple-700',
  };
  const label: Record<string, string> = {
    ENTREGUE: 'Entregue', ENVIADO: 'Em trânsito',
    CANCELADO: 'Cancelado', PENDENTE: 'Pendente', PAGO: 'Pago',
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? 'bg-gray-100 text-gray-600'}`}>{label[s] ?? s}</span>;
};

const Msg = ({ text }: { text: string }) =>
  !text ? null : (
    <p className={`text-sm ${text.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{text}</p>
  );

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dados');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // ── dados pessoais ─────────────────────────────────────────
  const [nome,       setNome]       = useState('');
  const [email,      setEmail]      = useState('');
  const [telefone,   setTelefone]   = useState('');
  const [nascimento, setNascimento] = useState('');
  const [cpf,        setCpf]        = useState('');
  const [msgDados,   setMsgDados]   = useState('');
  const [savingDados, setSavingDados] = useState(false);

  // ── senha ──────────────────────────────────────────────────
  const [senhaAtual,    setSenhaAtual]    = useState('');
  const [novaSenha,     setNovaSenha]     = useState('');
  const [confirmar,     setConfirmar]     = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [msgSenha,      setMsgSenha]      = useState('');
  const [savingSenha,   setSavingSenha]   = useState(false);

  // ── endereço ───────────────────────────────────────────────
  const [rua,          setRua]          = useState('');
  const [numero,       setNumero]       = useState('');
  const [complemento,  setComplemento]  = useState('');
  const [bairro,       setBairro]       = useState('');
  const [cidade,       setCidade]       = useState('');
  const [uf,           setUf]           = useState('');
  const [cep,          setCep]          = useState('');
  const [msgEnd,       setMsgEnd]       = useState('');
  const [savingEnd,    setSavingEnd]    = useState(false);

  // ── preferências ───────────────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWhats, setNotifWhats] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [generos,    setGeneros]    = useState<string[]>([]);
  const [msgPref,    setMsgPref]    = useState('');
  const [savingPref, setSavingPref] = useState(false);

  // pedidos: apenas para contadores no hero
  const [orders, setOrders] = useState<any[]>([]);

  const GENEROS = ['Romance', 'Ficção', 'História', 'Filosofia', 'Autoajuda', 'Didático', 'Terror', 'Poesia'];
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dados',        label: 'Meus Dados',   icon: '👤' },
    { id: 'senha',        label: 'Senha',        icon: '🔑' },
    { id: 'pedidos',      label: 'Pedidos',      icon: '📦' },
    { id: 'endereco',     label: 'Endereço',     icon: '📍' },
    { id: 'preferencias', label: 'Preferências', icon: '⚙️' },
    { id: 'seguranca',    label: 'Segurança',    icon: '🛡️' },
  ];

  // ── carrega perfil do backend ──────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<UserProfile>('/api/users/me');
        setProfile(data);
        setNome(data.name ?? '');
        setEmail(data.email ?? '');
        setTelefone(data.phone ?? '');
        setNascimento(data.birthdate ? data.birthdate.slice(0, 10) : '');
        setCpf(data.cpf ?? '');
        setRua(data.addressStreet ?? '');
        setNumero(data.addressNumber ?? '');
        setComplemento(data.addressComplement ?? '');
        setBairro(data.addressNeighborhood ?? '');
        setCidade(data.addressCity ?? '');
        setUf(data.addressState ?? '');
        setCep(data.addressZip ?? '');
        if (data.preferences) {
          setNotifEmail(data.preferences.notifEmail ?? true);
          setNotifWhats(data.preferences.notifWhats ?? false);
          setNewsletter(data.preferences.newsletter ?? true);
          setGeneros(data.preferences.genres ?? []);
        }
      } catch {
        setMsgDados('❌ Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── carrega pedidos quando aba for aberta ──────────────────
  useEffect(() => {
    if (tab !== 'pedidos' || orders.length > 0) return;
    api.get('/api/orders').then(({ data }) => setOrders(data)).catch(() => {});
  }, [tab]);



  // ── salvar dados pessoais ──────────────────────────────────
  const salvarDados = async () => {
    setSavingDados(true); setMsgDados('');
    try {
      const { data } = await api.patch('/api/users/me', {
        name: nome, email, phone: telefone,
        cpf, birthdate: nascimento || null,
      });
      updateUser(data);
      setMsgDados('✅ Dados salvos com sucesso!');
    } catch (e: any) {
      setMsgDados(`❌ ${e.response?.data?.message ?? 'Erro ao salvar.'}`);
    } finally { setSavingDados(false); }
  };

  // ── alterar senha ──────────────────────────────────────────
  const salvarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmar) { setMsgSenha('❌ Preencha todos os campos.'); return; }
    if (novaSenha !== confirmar)  { setMsgSenha('❌ As senhas não coincidem.'); return; }
    if (novaSenha.length < 6)    { setMsgSenha('❌ Mínimo de 6 caracteres.'); return; }
    setSavingSenha(true); setMsgSenha('');
    try {
      const { data } = await api.patch('/api/users/me/password', {
        currentPassword: senhaAtual, newPassword: novaSenha,
      });
      setMsgSenha(`✅ ${data.message}`);
      setSenhaAtual(''); setNovaSenha(''); setConfirmar('');
    } catch (e: any) {
      setMsgSenha(`❌ ${e.response?.data?.message ?? 'Erro ao alterar senha.'}`);
    } finally { setSavingSenha(false); }
  };

  // ── salvar endereço ────────────────────────────────────────
  const salvarEnd = async () => {
    setSavingEnd(true); setMsgEnd('');
    try {
      await api.patch('/api/users/me/address', {
        street: rua, number: numero, complement: complemento,
        neighborhood: bairro, city: cidade, state: uf, zip: cep,
      });
      updateUser({
        addressStreet: rua, addressNumber: numero, addressComplement: complemento,
        addressNeighborhood: bairro, addressCity: cidade, addressState: uf, addressZip: cep,
      });
      setMsgEnd('✅ Endereço salvo com sucesso!');
    } catch (e: any) {
      setMsgEnd(`❌ ${e.response?.data?.message ?? 'Erro ao salvar endereço.'}`);
    } finally { setSavingEnd(false); }
  };

  // ── salvar preferências ────────────────────────────────────
  const salvarPref = async () => {
    setSavingPref(true); setMsgPref('');
    try {
      await api.patch('/api/users/me/preferences', {
        notifEmail, notifWhats, newsletter, genres: generos,
      });
      updateUser({ preferences: { notifEmail, notifWhats, newsletter, genres: generos } });
      setMsgPref('✅ Preferências salvas!');
    } catch {
      setMsgPref('❌ Erro ao salvar preferências.');
    } finally { setSavingPref(false); }
  };

  // ── excluir conta ──────────────────────────────────────────
  const excluirConta = async () => {
    if (!confirm('Tem certeza? Esta ação é irreversível.')) return;
    try {
      await api.delete('/api/users/me');
      logout();
      navigate('/');
    } catch {
      alert('Erro ao excluir conta.');
    }
  };

  const forca = (s: string) => {
    if (!s) return { label: '', cor: '' };
    if (s.length < 6)  return { label: 'Fraca', cor: 'bg-red-400' };
    if (s.length < 10) return { label: 'Média', cor: 'bg-yellow-400' };
    return               { label: 'Forte', cor: 'bg-emerald-500' };
  };
  const f = forca(novaSenha);

  const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <div onClick={() => set(!val)}
      className={`relative flex-shrink-0 h-5 w-9 rounded-full cursor-pointer transition-colors ${val ? 'bg-emerald-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </div>
  );

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-gray-400 animate-pulse">Carregando perfil...</p>
    </div>
  );

  const avatar = (user?.name ?? 'U')[0].toUpperCase();
  const totalLivros = orders.reduce((a, p) => a + (p.items?.length ?? 0), 0);
  const entregues   = orders.filter(p => p.status === 'ENTREGUE').length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-5xl px-4">

        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-md">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/25 text-3xl font-extrabold shadow-inner">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{user?.name}</h1>
              <p className="text-sm text-emerald-100">{user?.email}</p>
              {profile?.createdAt && (
                <p className="mt-1 text-xs text-emerald-200">
                  Membro desde {new Date(profile.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xl font-bold">{entregues}</p>
                <p className="text-xs text-emerald-100">Entregues</p>
              </div>
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xl font-bold">{totalLivros}</p>
                <p className="text-xs text-emerald-100">Livros</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                    tab === t.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Painel */}
          <main className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

            {/* DADOS */}
            {tab === 'dados' && (
              <section className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">👤 Informações Pessoais</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Nome completo',       val: nome,       set: setNome,       type: 'text' },
                    { label: 'E-mail',              val: email,      set: setEmail,      type: 'email' },
                    { label: 'Telefone / WhatsApp', val: telefone,   set: setTelefone,   type: 'tel',  ph: '(00) 90000-0000' },
                    { label: 'CPF',                 val: cpf,        set: setCpf,        type: 'text', ph: '000.000.000-00' },
                  ].map(({ label, val, set, type, ph }) => (
                    <div key={label}>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
                      <input className={INPUT} type={type} placeholder={ph} value={val}
                        onChange={e => { (set as any)(e.target.value); setMsgDados(''); }} />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Data de nascimento</label>
                    <input className={INPUT} type="date" value={nascimento}
                      onChange={e => { setNascimento(e.target.value); setMsgDados(''); }} />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button className={BTN} disabled={savingDados} onClick={salvarDados}>
                    {savingDados ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                  <Msg text={msgDados} />
                </div>
              </section>
            )}

            {/* SENHA */}
            {tab === 'senha' && (
              <section className="space-y-5 max-w-md">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">🔑 Alterar Senha</h2>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Senha atual</label>
                  <input className={INPUT} type={mostrarSenhas ? 'text' : 'password'} value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nova senha</label>
                  <input className={INPUT} type={mostrarSenhas ? 'text' : 'password'} value={novaSenha}
                    onChange={e => { setNovaSenha(e.target.value); setMsgSenha(''); }} />
                  {novaSenha && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                        <div className={`h-full rounded-full transition-all ${f.cor}`}
                          style={{ width: f.label === 'Fraca' ? '33%' : f.label === 'Média' ? '66%' : '100%' }} />
                      </div>
                      <span className="text-xs text-gray-500">{f.label}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirmar nova senha</label>
                  <input className={INPUT} type={mostrarSenhas ? 'text' : 'password'} value={confirmar} onChange={e => setConfirmar(e.target.value)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" checked={mostrarSenhas} onChange={e => setMostrarSenhas(e.target.checked)} className="accent-emerald-600" />
                  Mostrar senhas
                </label>
                <div className="flex items-center gap-4">
                  <button className={BTN} disabled={savingSenha} onClick={salvarSenha}>
                    {savingSenha ? 'Salvando...' : 'Alterar senha'}
                  </button>
                  <Msg text={msgSenha} />
                </div>
              </section>
            )}

            {/* PEDIDOS — reutiliza o componente Orders completo */}
            {tab === 'pedidos' && <Orders />}

            {/* ENDEREÇO */}
            {tab === 'endereco' && (
              <section className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">📍 Endereço de Entrega</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Rua / Avenida</label>
                    <input className={INPUT} placeholder="Ex: Rua dos Livros" value={rua} onChange={e => { setRua(e.target.value); setMsgEnd(''); }} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Número</label>
                    <input className={INPUT} placeholder="123" value={numero} onChange={e => { setNumero(e.target.value); setMsgEnd(''); }} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Complemento</label>
                    <input className={INPUT} placeholder="Apto, bloco, sala..." value={complemento} onChange={e => setComplemento(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Bairro</label>
                    <input className={INPUT} placeholder="Centro" value={bairro} onChange={e => { setBairro(e.target.value); setMsgEnd(''); }} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Cidade</label>
                    <input className={INPUT} placeholder="Montes Claros" value={cidade} onChange={e => { setCidade(e.target.value); setMsgEnd(''); }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">UF</label>
                      <input className={INPUT} placeholder="MG" maxLength={2} value={uf}
                        onChange={e => { setUf(e.target.value.toUpperCase()); setMsgEnd(''); }} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">CEP</label>
                      <input className={INPUT} placeholder="00000-000" value={cep} onChange={e => { setCep(e.target.value); setMsgEnd(''); }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button className={BTN} disabled={savingEnd} onClick={salvarEnd}>
                    {savingEnd ? 'Salvando...' : 'Salvar endereço'}
                  </button>
                  <Msg text={msgEnd} />
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
                      { label: 'Atualizações de pedidos por e-mail', val: notifEmail, set: setNotifEmail },
                      { label: 'Notificações via WhatsApp',          val: notifWhats, set: setNotifWhats },
                      { label: 'Newsletter com novidades',           val: newsletter, set: setNewsletter },
                    ].map(({ label, val, set }) => (
                      <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
                        <Toggle val={val} set={set} />
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Gêneros literários favoritos</h3>
                  <div className="flex flex-wrap gap-2">
                    {GENEROS.map(g => (
                      <button key={g}
                        onClick={() => setGeneros(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                          generos.includes(g)
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-emerald-400'
                        }`}>{g}
                      </button>
                    ))}
                  </div>
                  {generos.length > 0 && <p className="mt-2 text-xs text-gray-400">Selecionados: {generos.join(', ')}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <button className={BTN} disabled={savingPref} onClick={salvarPref}>
                    {savingPref ? 'Salvando...' : 'Salvar preferências'}
                  </button>
                  <Msg text={msgPref} />
                </div>
              </section>
            )}

            {/* SEGURANÇA */}
            {tab === 'seguranca' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">🛡️ Segurança da Conta</h2>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="font-medium text-gray-700 text-sm mb-1">Última alteração de senha</p>
                  <p className="text-xs text-gray-400">Para alterar sua senha, acesse a aba <strong>Senha</strong>.</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="font-medium text-red-600 text-sm mb-1">Zona de perigo</p>
                  <p className="text-xs text-gray-500 mb-3">Esta ação é irreversível e apagará todos os seus dados.</p>
                  <button onClick={excluirConta}
                    className="rounded-lg border border-red-400 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors">
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