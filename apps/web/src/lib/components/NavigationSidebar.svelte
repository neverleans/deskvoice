<script lang="ts">
  import { telephony, type AppView } from '../stores/telephony.svelte.js';
  import {
    Phone,
    Users,
    Ticket as TicketIcon,
    BarChart3,
    UserCheck,
    Settings
  } from 'lucide-svelte';

  const menuItems: { id: AppView; label: string; icon: typeof Phone; badge?: () => number }[] = [
    {
      id: 'calls',
      label: 'Chamadas',
      icon: Phone,
      badge: () => (telephony.state === 'RINGING_IN' ? 1 : 0),
    },
    {
      id: 'crm',
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: TicketIcon,
      badge: () => telephony.tickets.filter((t) => t.status === 'OPEN').length,
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
    },
    {
      id: 'team',
      label: 'Equipe',
      icon: UserCheck,
    },
    {
      id: 'settings',
      label: 'Config.',
      icon: Settings,
    },
  ];

  let visibleMenuItems = $derived.by(() => {
    if (telephony.userRole === 'OPERATOR') {
      return menuItems.filter((i) => i.id === 'calls' || i.id === 'crm' || i.id === 'tickets');
    }
    if (telephony.userRole === 'SUPERVISOR') {
      return menuItems.filter((i) => i.id !== 'settings');
    }
    return menuItems; // ADMIN tem acesso irrestrito
  });
</script>

<aside class="w-16 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-3 justify-between select-none z-10">
  <div class="flex flex-col gap-2 w-full px-2">
    {#each visibleMenuItems as item}
      {@const isActive = telephony.activeView === item.id}
      {@const badgeCount = item.badge ? item.badge() : 0}
      <button
        onclick={() => (telephony.activeView = item.id)}
        class="relative w-full h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group {isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}"
        title={item.label}
      >
        <item.icon class="w-4 h-4 transition-transform group-hover:scale-110" />
        <span class="text-[9px] font-medium leading-none">{item.label}</span>

        {#if badgeCount > 0}
          <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-pulse">
            {badgeCount}
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="text-[10px] text-slate-600 font-mono">
    v0.1
  </div>
</aside>
