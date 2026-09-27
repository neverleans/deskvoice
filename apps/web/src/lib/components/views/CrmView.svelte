<script lang="ts">
  import { telephony } from '../../stores/telephony.svelte.js';
  import {
    Users,
    Search,
    Plus,
    Building2,
    Phone,
    Mail,
    Star,
    PhoneCall,
    FileText,
    Check,
    X
  } from 'lucide-svelte';

  let searchQuery = $state('');
  let filterVipOnly = $state(false);
  let isAddModalOpen = $state(false);

  // Formulário de Novo Cliente
  let newName = $state('');
  let newCompany = $state('');
  let newPhone = $state('');
  let newEmail = $state('');
  let newNotes = $state('');
  let newIsVip = $state(false);

  let filteredCustomers = $derived(
    telephony.customers.filter((c) => {
      const matchVip = !filterVipOnly || c.isVip;
      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchVip && matchQuery;
    })
  );

  function handleCreateCustomer() {
    if (!newName || !newPhone) return;

    telephony.addCustomer({
      name: newName,
      company: newCompany,
      phone: newPhone,
      email: newEmail,
      notes: newNotes,
      isVip: newIsVip,
    });

    // Limpa form
    newName = '';
    newCompany = '';
    newPhone = '';
    newEmail = '';
    newNotes = '';
    newIsVip = false;
    isAddModalOpen = false;
  }

  function handleCallCustomer(phone: string) {
    // Muda para tela de chamadas e disca
    telephony.activeView = 'calls';
    telephony.simulateIncomingCall(0);
  }
</script>

<div class="flex-1 bg-slate-950 p-6 overflow-y-auto select-none">
  <!-- Cabeçalho -->
  <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
    <div>
      <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <Users class="w-5 h-5 text-emerald-400" /> CRM & Gestão de Clientes
      </h1>
      <p class="text-xs text-slate-400 mt-1">
        Base de contatos, empresas, histórico e integração com telefonia em tempo real.
      </p>
    </div>

    <button
      onclick={() => (isAddModalOpen = true)}
      class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-95"
    >
      <Plus class="w-4 h-4" /> Novo Cliente
    </button>
  </div>

  <!-- Barra de Busca e Filtro VIP -->
  <div class="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 mb-6 flex items-center justify-between gap-4">
    <div class="relative flex-1 max-w-md">
      <Search class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Buscar cliente por nome, telefone, empresa ou e-mail..."
        class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
    </div>

    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          bind:checked={filterVipOnly}
          class="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
        />
        <span>Apenas Clientes VIP</span>
      </label>

      <span class="text-xs text-slate-400 font-mono pl-3 border-l border-slate-800">
        Total: {filteredCustomers.length}
      </span>
    </div>
  </div>

  <!-- Grade de Clientes -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each filteredCustomers as customer}
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group">
        <div>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 class="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  {customer.name}
                </h3>
                <span class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 class="w-3 h-3 text-slate-500" />
                  {customer.company || 'Pessoa Física'}
                </span>
              </div>
            </div>

            {#if customer.isVip}
              <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
                <Star class="w-2.5 h-2.5 fill-current" /> VIP
              </span>
            {/if}
          </div>

          <div class="mt-4 space-y-2 text-xs text-slate-300">
            <div class="flex items-center gap-2">
              <Phone class="w-3.5 h-3.5 text-slate-500" />
              <span class="font-mono">{customer.phone}</span>
            </div>
            {#if customer.email}
              <div class="flex items-center gap-2">
                <Mail class="w-3.5 h-3.5 text-slate-500" />
                <span class="truncate">{customer.email}</span>
              </div>
            {/if}
          </div>

          {#if customer.notes}
            <div class="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 line-clamp-2">
              {customer.notes}
            </div>
          {/if}
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[10px] text-slate-500 font-mono">
            Desde {customer.createdAt.slice(0, 10)}
          </span>
          <button
            onclick={() => handleCallCustomer(customer.phone)}
            class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PhoneCall class="w-3 h-3" /> Discar
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Modal: Novo Cliente -->
  {#if isAddModalOpen}
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Plus class="w-4 h-4 text-emerald-400" /> Cadastrar Novo Cliente
          </h2>
          <button onclick={() => (isAddModalOpen = false)} class="p-1 text-slate-400 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label for="custName" class="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
            <input
              id="custName"
              type="text"
              bind:value={newName}
              placeholder="Ex: Beatriz Albuquerque"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label for="custCompany" class="block text-xs font-medium text-slate-300 mb-1">Empresa / Razão Social</label>
            <input
              id="custCompany"
              type="text"
              bind:value={newCompany}
              placeholder="Ex: Inova Soluções Digitais"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label for="custPhone" class="block text-xs font-medium text-slate-300 mb-1">Telefone Principal *</label>
            <input
              id="custPhone"
              type="text"
              bind:value={newPhone}
              placeholder="Ex: 31999998888"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label for="custEmail" class="block text-xs font-medium text-slate-300 mb-1">E-mail de Contato</label>
            <input
              id="custEmail"
              type="email"
              bind:value={newEmail}
              placeholder="Ex: beatriz@inova.com.br"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label for="custNotes" class="block text-xs font-medium text-slate-300 mb-1">Observações Internas</label>
            <textarea
              id="custNotes"
              bind:value={newNotes}
              rows="2"
              placeholder="Preferências, particularidades..."
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isVipCheck"
              bind:checked={newIsVip}
              class="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
            />
            <label for="isVipCheck" class="text-xs text-slate-300 cursor-pointer">
              Marcar como Cliente VIP (Prioridade de Fila)
            </label>
          </div>

          <div class="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              onclick={() => (isAddModalOpen = false)}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onclick={handleCreateCustomer}
              disabled={!newName || !newPhone}
              class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow"
            >
              Salvar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
