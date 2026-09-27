<script lang="ts">
  import { telephony } from '../../stores/telephony.svelte.js';
  import { getTicketPriorityLabel } from '@deskvoice/shared';
  import {
    Ticket as TicketIcon,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    User,
    Calendar
  } from 'lucide-svelte';

  let statusFilter = $state<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  let searchQuery = $state('');

  let filteredTickets = $derived(
    telephony.tickets.filter((t) => {
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchQuery =
        !searchQuery ||
        t.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    })
  );

  function toggleStatus(ticketId: string) {
    const t = telephony.tickets.find((item) => item.id === ticketId);
    if (!t) return;
    const nextStatus = t.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED';
    telephony.updateTicketStatus(ticketId, nextStatus);
  }
</script>

<div class="flex-1 bg-slate-950 p-6 overflow-y-auto select-none">
  <!-- Cabeçalho -->
  <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
    <div>
      <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <TicketIcon class="w-5 h-5 text-emerald-400" /> Gestão de Tickets & Chamados
      </h1>
      <p class="text-xs text-slate-400 mt-1">
        Protocolos gerados no pós-atendimento telefônico e chamados de suporte em andamento.
      </p>
    </div>

    <!-- Filtros de Status em Tabs -->
    <div class="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
      <button
        onclick={() => (statusFilter = 'ALL')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {statusFilter === 'ALL' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        Todos ({telephony.tickets.length})
      </button>
      <button
        onclick={() => (statusFilter = 'OPEN')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {statusFilter === 'OPEN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        Abertos ({telephony.tickets.filter((t) => t.status !== 'RESOLVED').length})
      </button>
      <button
        onclick={() => (statusFilter = 'RESOLVED')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {statusFilter === 'RESOLVED' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        Resolvidos ({telephony.tickets.filter((t) => t.status === 'RESOLVED').length})
      </button>
    </div>
  </div>

  <!-- Barra de Busca -->
  <div class="relative max-w-md mb-6">
    <Search class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Filtrar por protocolo (DV-...), cliente ou assunto..."
      class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
    />
  </div>

  <!-- Lista de Tickets -->
  <div class="space-y-3">
    {#if filteredTickets.length === 0}
      <div class="text-center py-16 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-slate-500 text-xs">
        Nenhum chamado encontrado para os critérios selecionados.
      </div>
    {:else}
      {#each filteredTickets as ticket}
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2.5 mb-1.5">
              <span class="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {ticket.protocol}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold {ticket.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'}">
                Prioridade {getTicketPriorityLabel(ticket.priority)}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs text-slate-400">{ticket.category}</span>
            </div>

            <h3 class="text-sm font-bold text-white mb-1">{ticket.subject}</h3>
            <p class="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>

            <div class="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
              <span class="flex items-center gap-1 text-slate-400">
                <User class="w-3 h-3 text-slate-500" /> {ticket.customerName}
              </span>
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3 text-slate-500" /> Atendente: {ticket.agentName}
              </span>
              <span class="flex items-center gap-1 font-mono">
                <Calendar class="w-3 h-3 text-slate-500" /> {ticket.createdAt.slice(0, 10)}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              onclick={() => toggleStatus(ticket.id)}
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer {ticket.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow'}"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              {ticket.status === 'RESOLVED' ? 'Resolvido (Reabrir)' : 'Marcar como Resolvido'}
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
