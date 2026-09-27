<script lang="ts">
  import { telephony } from '../../stores/telephony.svelte.js';
  import {
    BarChart3,
    Clock,
    PhoneCall,
    PhoneMissed,
    CheckCircle2,
    Download,
    Filter,
    Search,
    UserCheck,
    Volume2
  } from 'lucide-svelte';

  let filterOperator = $state('ALL');
  let searchQuery = $state('');

  // Filtro de chamadas
  let filteredCdrs = $derived(
    telephony.cdrHistory.filter((cdr) => {
      const matchOp = filterOperator === 'ALL' || cdr.agentId === filterOperator;
      const matchQuery =
        !searchQuery ||
        cdr.callerNumber.includes(searchQuery) ||
        cdr.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cdr.disposition && cdr.disposition.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchOp && matchQuery;
    })
  );

  // Cálculos de Métricas
  let totalCalls = $derived(telephony.cdrHistory.length);
  let answeredCalls = $derived(telephony.cdrHistory.filter((c) => c.talkDurationSeconds > 0).length);
  let missedCalls = $derived(telephony.cdrHistory.filter((c) => c.endReason === 'TIMEOUT_MISSED' || c.talkDurationSeconds === 0).length);

  let averageTalkTime = $derived.by(() => {
    if (answeredCalls === 0) return '00:00';
    const totalSecs = telephony.cdrHistory.reduce((acc, curr) => acc + curr.talkDurationSeconds, 0);
    const avg = Math.round(totalSecs / answeredCalls);
    const mins = Math.floor(avg / 60);
    const secs = avg % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  let averageWaitTime = $derived.by(() => {
    if (totalCalls === 0) return '00:00';
    const totalRing = telephony.cdrHistory.reduce((acc, curr) => acc + curr.ringDurationSeconds, 0);
    const avg = Math.round(totalRing / totalCalls);
    return `00:${avg.toString().padStart(2, '0')}s`;
  });

  let slaComplianceRate = $derived.by(() => {
    if (totalCalls === 0) return '100%';
    // SLA Meta: Atender em menos de 20 segundos
    const compliant = telephony.cdrHistory.filter((c) => c.ringDurationSeconds <= 20).length;
    return `${((compliant / totalCalls) * 100).toFixed(1)}%`;
  });

  function exportCsv() {
    const headers = 'ID,Data/Hora,Origem,Destino,Atendente,Fila,Espera(s),Conversa(s),Motivo\n';
    const rows = filteredCdrs
      .map(
        (c) =>
          `"${c.id}","${c.startedAt}","${c.callerNumber}","${c.calleeNumber}","${c.agentName}","${c.queueName || ''}",${c.ringDurationSeconds},${c.talkDurationSeconds},"${c.disposition || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `deskvoice-relatorio-chamadas-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="flex-1 bg-slate-950 p-6 overflow-y-auto select-none">
  <!-- Cabeçalho do Relatório -->
  <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 class="w-5 h-5 text-emerald-400" /> Relatórios Operacionais & SLA
        </h1>
        <span class="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
          Hoje ({new Date().toLocaleDateString('pt-BR')})
        </span>
      </div>
      <p class="text-xs text-slate-400 mt-1">
        Consolidação de TMA (Tempo Médio de Atendimento), TME (Espera), registros de CDRs e auditoria de chamadas.
      </p>
    </div>

    <button
      onclick={exportCsv}
      class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow active:scale-95"
    >
      <Download class="w-4 h-4 text-emerald-400" /> Exportar Dados (CSV)
    </button>
  </div>

  <!-- Cards de KPIs e SLA -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>TMA Médio</span>
        <Clock class="w-4 h-4 text-blue-400" />
      </div>
      <div class="text-2xl font-bold font-mono text-white">{averageTalkTime}</div>
      <span class="text-[11px] text-slate-500 mt-1 block">Meta de operação: &lt; 05:00</span>
    </div>

    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>TME Médio (Espera)</span>
        <Clock class="w-4 h-4 text-amber-400" />
      </div>
      <div class="text-2xl font-bold font-mono text-white">{averageWaitTime}</div>
      <span class="text-[11px] text-slate-500 mt-1 block">Tempo antes do atendimento</span>
    </div>

    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>Aderência ao SLA</span>
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
      </div>
      <div class="text-2xl font-bold font-mono text-emerald-400">{slaComplianceRate}</div>
      <span class="text-[11px] text-emerald-500/80 mt-1 block">Atendidas em &lt; 20 segundos</span>
    </div>

    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>Total de Chamadas</span>
        <PhoneCall class="w-4 h-4 text-purple-400" />
      </div>
      <div class="text-2xl font-bold font-mono text-white">{totalCalls}</div>
      <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
        <span class="text-emerald-400">{answeredCalls} atendidas</span>
        <span>•</span>
        <span class="text-rose-400">{missedCalls} perdidas</span>
      </div>
    </div>
  </div>

  <!-- Barra de Filtros e Busca -->
  <div class="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 mb-4 flex items-center justify-between gap-4">
    <div class="flex items-center gap-3 flex-1">
      <div class="relative flex-1 max-w-xs">
        <Search class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Buscar por número, atendente ou motivo..."
          class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <Filter class="w-3.5 h-3.5 text-slate-500" />
        <select
          bind:value={filterOperator}
          class="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Todos os Atendentes</option>
          {#each telephony.agents as agent}
            <option value={agent.id}>{agent.name} (Ramal {agent.extension})</option>
          {/each}
        </select>
      </div>
    </div>

    <span class="text-xs text-slate-400 font-mono">
      Exibindo {filteredCdrs.length} de {telephony.cdrHistory.length} registros
    </span>
  </div>

  <!-- Tabela Analítica de CDRs (Call Detail Records) -->
  <div class="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
          <tr>
            <th class="py-3 px-4">Horário</th>
            <th class="py-3 px-4">Origem (Cliente)</th>
            <th class="py-3 px-4">Atendente & Ramal</th>
            <th class="py-3 px-4">Fila</th>
            <th class="py-3 px-4">Espera</th>
            <th class="py-3 px-4">Duração</th>
            <th class="py-3 px-4">Motivo / Tabulação</th>
            <th class="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 text-slate-300">
          {#if filteredCdrs.length === 0}
            <tr>
              <td colspan="8" class="text-center py-8 text-slate-500">
                Nenhum registro encontrado com os filtros selecionados.
              </td>
            </tr>
          {:else}
            {#each filteredCdrs as cdr}
              <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-[11px] text-slate-400">
                  {cdr.startedAt.slice(11, 19)}
                </td>
                <td class="py-3 px-4 font-medium text-white flex items-center gap-1.5">
                  <PhoneCall class="w-3 h-3 text-emerald-400" />
                  {cdr.callerNumber}
                </td>
                <td class="py-3 px-4">
                  <span class="font-medium text-slate-200">{cdr.agentName}</span>
                  <span class="text-[10px] text-slate-500 block">{cdr.calleeNumber}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                    {cdr.queueName || 'Direta'}
                  </span>
                </td>
                <td class="py-3 px-4 font-mono {cdr.ringDurationSeconds > 20 ? 'text-rose-400 font-semibold' : 'text-slate-400'}">
                  {cdr.ringDurationSeconds}s
                </td>
                <td class="py-3 px-4 font-mono font-medium text-slate-200">
                  {Math.floor(cdr.talkDurationSeconds / 60)}m {cdr.talkDurationSeconds % 60}s
                </td>
                <td class="py-3 px-4 text-slate-300 font-medium">
                  {cdr.disposition || 'Não Tabulado'}
                </td>
                <td class="py-3 px-4 text-center">
                  {#if cdr.talkDurationSeconds > 0}
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                      Atendida
                    </span>
                  {:else}
                    <span class="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-medium">
                      Perdida
                    </span>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
