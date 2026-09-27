<script lang="ts">
  import { telephony } from '../../stores/telephony.svelte.js';
  import {
    Users,
    Headphones,
    Clock,
    PhoneCall,
    Star,
    Shield,
    Radio,
    Ear,
    Mic,
    Zap,
    X,
    Activity,
    AlertCircle
  } from 'lucide-svelte';

  const statusLabels = {
    AVAILABLE: { label: 'Disponível', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    IN_CALL: { label: 'Em Chamada', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    PAUSE_LUNCH: { label: 'Pausa Almoço', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    PAUSE_TRAINING: { label: 'Treinamento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    OFFLINE: { label: 'Desconectado', color: 'bg-slate-800 text-slate-400 border-slate-700' },
  };

  const isSupervisorOrAdmin = $derived(telephony.userRole === 'SUPERVISOR' || telephony.userRole === 'ADMIN');
</script>

<div class="flex-1 bg-slate-950 p-6 overflow-y-auto select-none">
  <!-- Cabeçalho -->
  <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users class="w-5 h-5 text-emerald-400" /> Equipe de Atendimento & Ramais PABX
        </h1>
        {#if isSupervisorOrAdmin}
          <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            Modo Supervisão Ativo
          </span>
        {/if}
      </div>
      <p class="text-xs text-slate-400 mt-1">
        Monitoria em tempo real da disponibilidade dos atendentes, ramais internos e métricas individuais.
      </p>
    </div>

    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
      <Radio class="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
      <span>Ao Vivo: {telephony.agents.filter((a) => a.status === 'AVAILABLE' || a.status === 'IN_CALL').length} operadores ativos</span>
    </div>
  </div>

  <!-- Barra Flutuante de Monitoria Ativa (Quando o Supervisor clica em Escutar/Sussurrar/Intervir) -->
  {#if telephony.activeMonitoring}
    <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-slate-900 border-2 border-blue-500/60 shadow-2xl flex items-center justify-between animate-fade-in">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400 animate-pulse">
          {#if telephony.activeMonitoring.mode === 'LISTEN'}
            <Ear class="w-6 h-6" />
          {:else if telephony.activeMonitoring.mode === 'WHISPER'}
            <Mic class="w-6 h-6" />
          {:else}
            <Zap class="w-6 h-6" />
          {/if}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400">
              {#if telephony.activeMonitoring.mode === 'LISTEN'}
                🎧 Escuta Silenciosa Ativa
              {:else if telephony.activeMonitoring.mode === 'WHISPER'}
                🗣️ Sussurro (Whisper Coaching) Ativo
              {:else}
                ⚡ Intervenção em Conferência Ativa
              {/if}
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <h3 class="text-base font-bold text-white tracking-tight mt-0.5">
            Monitorando Ramal {telephony.activeMonitoring.extension} ({telephony.activeMonitoring.agentName})
          </h3>
          <p class="text-xs text-slate-300 mt-0.5">
            {#if telephony.activeMonitoring.mode === 'LISTEN'}
              Você está ouvindo o áudio da chamada. Nem o cliente nem o atendente sabem que você está na linha.
            {:else if telephony.activeMonitoring.mode === 'WHISPER'}
              Sua voz está saindo apenas no headset do atendente para orientação; o cliente não te ouve.
            {:else}
              Você entrou na conversa em conferência tripla com o cliente e o atendente.
            {/if}
          </p>
        </div>
      </div>

      <!-- Equalizador de Áudio Simulado e Botão Encerrar -->
      <div class="flex items-center gap-4">
        <div class="flex items-end gap-1 h-6">
          <span class="w-1 bg-emerald-400 rounded-full animate-bounce h-3"></span>
          <span class="w-1 bg-emerald-400 rounded-full animate-bounce h-5 delay-75"></span>
          <span class="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-150"></span>
          <span class="w-1 bg-emerald-400 rounded-full animate-bounce h-6 delay-100"></span>
          <span class="w-1 bg-emerald-400 rounded-full animate-bounce h-4 delay-200"></span>
        </div>

        <button
          onclick={() => telephony.stopMonitoring()}
          class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
        >
          <X class="w-4 h-4" /> Desconectar Monitoria
        </button>
      </div>
    </div>
  {/if}

  <!-- Banner Informativo para o Supervisor -->
  {#if isSupervisorOrAdmin && !telephony.activeMonitoring}
    <div class="mb-6 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-xs text-blue-300">
      <div class="flex items-center gap-2">
        <Shield class="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          <strong>Permissões de Supervisão Ativas:</strong> Utilize as ações de áudio nos atendentes em chamada para escuta silenciosa, orientação ou intervenção direta.
        </span>
      </div>
    </div>
  {/if}

  <!-- Grade de Atendentes -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each telephony.agents as agent}
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between group">
        <div>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400">
                {agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-sm text-white">{agent.name}</h3>
                  <span class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                    Ramal {agent.extension}
                  </span>
                </div>
                <span class="text-xs text-slate-400 mt-0.5 block">{agent.department}</span>
              </div>
            </div>

            <!-- Status do Atendente -->
            <span class="px-2.5 py-1 rounded-full text-[11px] font-medium border {statusLabels[agent.status].color}">
              {statusLabels[agent.status].label}
            </span>
          </div>

          <!-- Estatísticas Individuais -->
          <div class="grid grid-cols-3 gap-2 mt-5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <div>
              <span class="text-[10px] text-slate-500 uppercase tracking-wider block">Chamadas</span>
              <span class="text-sm font-bold font-mono text-white mt-0.5 block">{agent.callsHandledToday}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-500 uppercase tracking-wider block">TMA Médio</span>
              <span class="text-sm font-bold font-mono text-white mt-0.5 block">
                {Math.floor(agent.averageTalkTimeSeconds / 60)}m {agent.averageTalkTimeSeconds % 60}s
              </span>
            </div>
            <div>
              <span class="text-[10px] text-slate-500 uppercase tracking-wider block">CSAT (Nota)</span>
              <span class="text-sm font-bold font-mono text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Star class="w-3 h-3 fill-current" /> {agent.csatScore}
              </span>
            </div>
          </div>
        </div>

        <!-- Se estiver no modo Supervisor e o operador estiver EM CHAMADA, exibe ações de voz! -->
        {#if isSupervisorOrAdmin && agent.status === 'IN_CALL'}
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 bg-slate-950/40 -mx-5 -mb-5 p-3 rounded-b-xl border-t border-slate-800">
            <span class="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <PhoneCall class="w-3.5 h-3.5 animate-pulse" /> Chamada ativa (04:12)
            </span>
            <div class="flex items-center gap-1.5">
              <button
                onclick={() => telephony.startMonitoring(agent, 'LISTEN')}
                class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Escutar chamada sem ser ouvido"
              >
                <Ear class="w-3.5 h-3.5 text-blue-400" /> Escutar
              </button>
              <button
                onclick={() => telephony.startMonitoring(agent, 'WHISPER')}
                class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Falar apenas com o atendente"
              >
                <Mic class="w-3.5 h-3.5 text-amber-400" /> Sussurrar
              </button>
              <button
                onclick={() => telephony.startMonitoring(agent, 'BARGE')}
                class="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Entrar na ligação em conferência tripla"
              >
                <Zap class="w-3.5 h-3.5" /> Intervir
              </button>
            </div>
          </div>
        {:else}
          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span class="flex items-center gap-1 text-[11px]">
              <Clock class="w-3 h-3 text-slate-500" /> Neste status desde {agent.statusSince}
            </span>
            <span class="text-[10px] font-mono text-slate-500">
              {agent.role === 'SUPERVISOR' ? 'Supervisor' : 'Atendente N1'}
            </span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
