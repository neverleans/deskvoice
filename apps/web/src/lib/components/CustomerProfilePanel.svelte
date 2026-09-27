<script lang="ts">
  import { telephony } from '../stores/telephony.svelte.js';
  import {
    User,
    Building2,
    Mail,
    Phone,
    Ticket as TicketIcon,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Star,
    ExternalLink
  } from 'lucide-svelte';

  // Se houver chamada em andamento com cliente identificado, exibe ele; caso contrário exibe o primeiro cliente de demonstração
  let displayedCustomer = $derived(telephony.currentCustomer || telephony.customers[0]);
  let customerTickets = $derived(telephony.tickets.filter((t) => t.customerId === displayedCustomer?.id));
</script>

<aside class="w-88 border-l border-slate-800 bg-slate-900/60 flex flex-col select-none overflow-y-auto">
  {#if displayedCustomer}
    <!-- Cabeçalho do Perfil -->
    <div class="p-5 border-b border-slate-800 bg-slate-950/30">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-emerald-400">
            {displayedCustomer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 class="font-bold text-sm text-white tracking-tight">{displayedCustomer.name}</h3>
            <span class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Building2 class="w-3 h-3 text-slate-500" />
              {displayedCustomer.company || 'Pessoa Física'}
            </span>
          </div>
        </div>

        {#if displayedCustomer.isVip}
          <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
            <Star class="w-2.5 h-2.5 fill-current" /> VIP
          </span>
        {/if}
      </div>

      <!-- Informações Rápidas -->
      <div class="mt-4 space-y-1.5 text-xs text-slate-300">
        <div class="flex items-center gap-2">
          <Phone class="w-3.5 h-3.5 text-slate-500" />
          <span class="font-mono">{displayedCustomer.phone}</span>
        </div>
        {#if displayedCustomer.email}
          <div class="flex items-center gap-2">
            <Mail class="w-3.5 h-3.5 text-slate-500" />
            <span class="truncate">{displayedCustomer.email}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Notas Internas / Alertas do CRM -->
    {#if displayedCustomer.notes}
      <div class="p-4 border-b border-slate-800/80 bg-amber-500/5">
        <span class="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mb-1">
          <AlertCircle class="w-3 h-3" /> Observações do Cliente
        </span>
        <p class="text-xs text-slate-300 leading-relaxed font-sans">
          {displayedCustomer.notes}
        </p>
      </div>
    {/if}

    <!-- Histórico de Chamados / Tickets do Cliente -->
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <TicketIcon class="w-3.5 h-3.5 text-emerald-400" /> Histórico de Chamados ({customerTickets.length})
        </span>
      </div>

      {#if customerTickets.length === 0}
        <div class="text-center py-8 text-slate-500 text-xs">
          Nenhum chamado aberto para este cliente.
        </div>
      {:else}
        <div class="space-y-2.5">
          {#each customerTickets as ticket}
            <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs hover:border-slate-700 transition-colors">
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono text-[10px] text-slate-400 font-semibold">{ticket.protocol}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium {ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}">
                  {ticket.status === 'RESOLVED' ? 'Resolvido' : 'Aberto'}
                </span>
              </div>
              <h4 class="font-semibold text-slate-200 line-clamp-1">{ticket.subject}</h4>
              <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">{ticket.description}</p>
              <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>{ticket.category}</span>
                <span class="font-mono">{ticket.createdAt.slice(0, 10)}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <div class="p-6 text-center text-slate-500 text-xs">
      Nenhum contato selecionado.
    </div>
  {/if}
</aside>
