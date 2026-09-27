<script lang="ts">
  import { telephony } from '../stores/telephony.svelte.js';
  import { PhoneCall, Play, Headphones, Sun, Moon, Shield, UserCheck, ShieldCheck } from 'lucide-svelte';

  let isDark = $state(true);

  function toggleTheme() {
    isDark = !isDark;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }

  const roleLabels = {
    OPERATOR: { label: 'Atendente', desc: 'Ramal 101 • Suporte N1', icon: Headphones },
    SUPERVISOR: { label: 'Supervisor', desc: 'Monitoria & Relatórios', icon: UserCheck },
    ADMIN: { label: 'Administrador', desc: 'Gestão Completa & PABX', icon: ShieldCheck },
  };
</script>

<header class="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between text-slate-100 select-none">
  <!-- Marca e Ramal -->
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
      <PhoneCall class="w-4 h-4 text-white" />
    </div>
    <div class="flex flex-col">
      <span class="font-bold tracking-tight text-sm flex items-center gap-1.5">
        DeskVoice
        <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">BSL 1.1</span>
      </span>
      <span class="text-[11px] text-slate-400 font-mono flex items-center gap-1">
        <Headphones class="w-3 h-3 text-slate-500" /> {roleLabels[telephony.userRole].desc}
      </span>
    </div>
  </div>

  <!-- Botão Central: Simulador de Demonstração (Showroom / ADR-003) -->
  <div class="flex items-center gap-2">
    {#if telephony.state === 'IDLE'}
      <div class="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 shadow-inner">
        <button
          onclick={() => telephony.simulateIncomingCall(0)}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow cursor-pointer active:scale-95"
        >
          <Play class="w-3 h-3 fill-current" />
          Simular Chamada (VIP)
        </button>
        <button
          onclick={() => telephony.simulateIncomingCall(1)}
          class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-all cursor-pointer"
        >
          Cliente 2
        </button>
      </div>
    {:else}
      <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs">
        <span class="w-2 h-2 rounded-full {telephony.state === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}"></span>
        <span class="font-mono text-slate-300">Status: <strong class="text-white">{telephony.state}</strong></span>
        {#if telephony.state === 'CONNECTED'}
          <span class="text-emerald-400 font-mono font-bold ml-1">{telephony.formattedDuration}</span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Controles, Seletor de Papel (Role Switcher Demo) e Perfil -->
  <div class="flex items-center gap-3">
    <!-- Alternador de Papéis na Demo (Requisito do Usuário) -->
    <div class="flex items-center gap-1 bg-slate-950/60 border border-slate-800 rounded-lg p-1">
      <span class="text-[10px] text-slate-400 px-1 font-semibold uppercase">Modo Demo:</span>
      <select
        value={telephony.userRole}
        onchange={(e) => telephony.setRole(e.currentTarget.value as any)}
        class="bg-slate-900 border border-slate-700 text-[11px] rounded px-2 py-0.5 text-emerald-400 font-semibold focus:outline-none cursor-pointer"
      >
        <option value="OPERATOR">Atendente</option>
        <option value="SUPERVISOR">Supervisor</option>
        <option value="ADMIN">Administrador</option>
      </select>
    </div>

    <!-- Seletor de Status de Presença do Operador -->
    <select
      bind:value={telephony.agentStatus}
      class="bg-slate-800 border border-slate-700 text-xs rounded-md px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
    >
      <option value="AVAILABLE">🟢 Disponível</option>
      <option value="BUSY">🔴 Em Atendimento</option>
      <option value="PAUSE_LUNCH">🟡 Pausa Almoço</option>
      <option value="PAUSE_TRAINING">⚪ Treinamento</option>
      <option value="OFFLINE">⚫ Desconectado</option>
    </select>

    <!-- Alternador de Tema -->
    <button
      onclick={toggleTheme}
      class="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
      title="Alternar Tema"
    >
      {#if isDark}
        <Sun class="w-4 h-4" />
      {:else}
        <Moon class="w-4 h-4" />
      {/if}
    </button>

    <!-- Avatar do Operador / Usuário -->
    <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
      <div class="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-emerald-400">
        LA
      </div>
      <div class="hidden md:flex flex-col text-left">
        <span class="text-xs font-medium leading-none text-slate-200">Lucas</span>
        <span class="text-[10px] text-emerald-400 leading-tight font-semibold">
          {roleLabels[telephony.userRole].label}
        </span>
      </div>
    </div>
  </div>
</header>
