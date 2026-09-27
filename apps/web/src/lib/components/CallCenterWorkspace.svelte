<script lang="ts">
  import { telephony } from '../stores/telephony.svelte.js';
  import {
    Phone,
    PhoneIncoming,
    PhoneOff,
    Mic,
    MicOff,
    Pause,
    Play,
    Share2,
    CheckCircle2,
    FileText,
    TrendingUp,
    Clock,
    PhoneCall,
    Sparkles
  } from 'lucide-svelte';

  let wrapUpCategory = $state('Suporte Técnico');
  let wrapUpNotes = $state('');
  let createTicket = $state(true);

  function handleAnswer() {
    telephony.answer();
  }

  function handleHangup() {
    telephony.hangup();
  }

  function handleWrapUpSubmit() {
    telephony.completeWrapUp({
      callId: telephony.session?.callId || 'call-1',
      category: wrapUpCategory,
      notes: wrapUpNotes || 'Atendimento concluído com sucesso.',
      createTicket,
    });
    wrapUpNotes = '';
  }

  // Atalhos de teclado (ADR-005)
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'F8' || (e.ctrlKey && e.key === 'Enter')) {
      if (telephony.state === 'RINGING_IN') {
        e.preventDefault();
        handleAnswer();
      }
    }
    if (e.key === 'Escape' && (telephony.state === 'CONNECTED' || telephony.state === 'ON_HOLD')) {
      e.preventDefault();
      handleHangup();
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="flex-1 bg-slate-950/60 p-6 flex flex-col justify-between overflow-y-auto">
  <!-- ESTADO 1: RINGING_IN (Chamada Entrante - Screen-Pop) -->
  {#if telephony.state === 'RINGING_IN'}
    <div class="flex-1 flex flex-col items-center justify-center animate-fade-in">
      <div class="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 flex flex-col items-center text-center relative overflow-hidden">
        <!-- Indicador animado de chamada recebida -->
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
          <PhoneIncoming class="w-10 h-10" />
        </div>

        <span class="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-1">Chamada Recebida</span>
        <h2 class="text-2xl font-bold text-white tracking-tight">{telephony.currentCustomer?.name}</h2>
        <span class="text-base font-mono text-slate-300 mt-1">{telephony.session?.remoteNumber}</span>
        {#if telephony.currentCustomer?.company}
          <span class="text-xs text-slate-400 mt-0.5">Empresa: <strong class="text-slate-200">{telephony.currentCustomer.company}</strong></span>
        {/if}

        <div class="mt-8 flex items-center gap-4 w-full">
          <button
            onclick={() => telephony.hangup('REJECTED')}
            class="flex-1 py-3.5 bg-rose-600/90 hover:bg-rose-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20"
          >
            <PhoneOff class="w-4 h-4" /> Recusar
          </button>
          <button
            onclick={handleAnswer}
            class="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-emerald-500/30 scale-105 active:scale-100"
          >
            <Phone class="w-5 h-5 fill-current" /> Atender (F8)
          </button>
        </div>
      </div>
    </div>

  <!-- ESTADO 2: CONNECTED / ON_HOLD (Chamada em Curso) -->
  {:else if telephony.state === 'CONNECTED' || telephony.state === 'ON_HOLD' || telephony.state === 'TRANSFERRING'}
    <div class="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full">
      <!-- Cabeçalho da Chamada Conectada -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl {telephony.state === 'ON_HOLD' ? 'bg-amber-500/20 border-amber-500/60' : 'bg-emerald-500/20 border-emerald-500/60'} border flex items-center justify-center font-bold text-xl text-white">
            {telephony.currentCustomer?.name?.slice(0, 2).toUpperCase() || 'CL'}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight">{telephony.currentCustomer?.name}</h2>
              {#if telephony.currentCustomer?.isVip}
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">VIP</span>
              {/if}
            </div>
            <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{telephony.session?.remoteNumber}</span>
              <span>•</span>
              <span>{telephony.currentCustomer?.company || 'Pessoa Física'}</span>
            </div>
          </div>
        </div>

        <!-- Cronômetro e Áudio VU Meter -->
        <div class="flex flex-col items-end">
          <div class="text-3xl font-mono font-bold tracking-wider {telephony.state === 'ON_HOLD' ? 'text-amber-400' : 'text-emerald-400'}">
            {telephony.formattedDuration}
          </div>
          <div class="flex items-center gap-1.5 mt-1">
            {#if telephony.state === 'ON_HOLD'}
              <span class="text-xs text-amber-400 font-medium animate-pulse">⏸ Em Espera</span>
            {:else}
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-xs text-slate-400 font-mono">Áudio HD (Opus 48kHz)</span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Barra de Controles Ergonômicos (ADR-005) -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-6 flex items-center justify-center gap-4 shadow-xl">
        <!-- Silenciar (Mute) -->
        <button
          onclick={() => telephony.toggleMute()}
          class="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border transition-all cursor-pointer {telephony.session?.isMuted ? 'bg-rose-500/20 border-rose-500/60 text-rose-300' : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'}"
        >
          {#if telephony.session?.isMuted}
            <MicOff class="w-5 h-5" />
            <span class="text-[11px] font-semibold">Mudo Ativo</span>
          {:else}
            <Mic class="w-5 h-5 text-slate-400" />
            <span class="text-[11px] font-medium">Mudo (Ctrl+M)</span>
          {/if}
        </button>

        <!-- Em Espera (Hold) -->
        <button
          onclick={() => telephony.toggleHold()}
          class="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border transition-all cursor-pointer {telephony.state === 'ON_HOLD' ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse' : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'}"
        >
          {#if telephony.state === 'ON_HOLD'}
            <Play class="w-5 h-5 fill-current" />
            <span class="text-[11px] font-semibold">Retomar</span>
          {:else}
            <Pause class="w-5 h-5 text-slate-400" />
            <span class="text-[11px] font-medium">Espera (Ctrl+H)</span>
          {/if}
        </button>

        <!-- Transferir -->
        <button
          class="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer"
        >
          <Share2 class="w-5 h-5 text-slate-400" />
          <span class="text-[11px] font-medium">Transferir</span>
        </button>

        <!-- Desligar / Encerrar -->
        <button
          onclick={handleHangup}
          class="flex flex-col items-center gap-1.5 px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
        >
          <PhoneOff class="w-5 h-5" />
          <span class="text-[11px]">Desligar (Esc)</span>
        </button>
      </div>

      <!-- Bloco de Notas em Tempo Real -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex-1 flex flex-col">
        <span class="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <FileText class="w-3.5 h-3.5 text-emerald-400" /> Anotações Durante o Atendimento
        </span>
        <textarea
          bind:value={wrapUpNotes}
          placeholder="Digite detalhes da conversa, pendências do cliente ou termos acordados..."
          class="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
        ></textarea>
      </div>
    </div>

  <!-- ESTADO 3: WRAP_UP (Pós-Atendimento e Tabulação) -->
  {:else if telephony.state === 'WRAP_UP'}
    <div class="flex-1 flex flex-col items-center justify-center animate-fade-in">
      <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-emerald-400" /> Tabulação de Pós-Atendimento
            </h2>
            <span class="text-xs text-slate-400">Classifique o contato para registrar métricas de TMA e SLA.</span>
          </div>
          <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            Duração: {telephony.formattedDuration}
          </span>
        </div>

        <div class="mt-4 space-y-4">
          <div>
            <label for="wrapUpCategorySelect" class="block text-xs font-medium text-slate-300 mb-1.5">Categoria / Motivo do Contato</label>
            <select
              id="wrapUpCategorySelect"
              bind:value={wrapUpCategory}
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Suporte Técnico">Suporte Técnico - Dúvida Operacional</option>
              <option value="Financeiro / Faturamento">Financeiro - 2ª Via / Fatura</option>
              <option value="Comercial / Vendas">Comercial - Upgrade de Plano</option>
              <option value="Cancelamento">Cancelamento / Retenção</option>
              <option value="Outros">Outros Assuntos</option>
            </select>
          </div>

          <div>
            <label for="wrapUpNotesTextarea" class="block text-xs font-medium text-slate-300 mb-1.5">Resumo / Parecer do Atendente</label>
            <textarea
              id="wrapUpNotesTextarea"
              bind:value={wrapUpNotes}
              rows="3"
              placeholder="Descreva o que foi solucionado..."
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ticketCheck"
              bind:checked={createTicket}
              class="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <label for="ticketCheck" class="text-xs text-slate-300 cursor-pointer">
              Gerar Ticket com protocolo para o cliente
            </label>
          </div>

          <div class="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onclick={handleWrapUpSubmit}
              class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              <CheckCircle2 class="w-4 h-4" /> Concluir e Ficar Disponível
            </button>
          </div>
        </div>
      </div>
    </div>

  <!-- ESTADO 4: IDLE (Repouso - Dashboard Operacional) -->
  {:else}
    <div class="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-8">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium mb-3">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Central de Voz Online • Ramal 101
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Pronto para Atendimento</h1>
        <p class="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Aguardando chamadas da fila de suporte. Utilize o botão acima para simular ligações na demonstração.
        </p>
      </div>

      <!-- Cards de Métricas Operacionais do Dia (ADR-004) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <PhoneCall class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Atendimentos Hoje</span>
            <div class="text-xl font-bold font-mono text-white mt-0.5">{telephony.cdrHistory.length + 8} chamadas</div>
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Clock class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">TMA Médio</span>
            <div class="text-xl font-bold font-mono text-white mt-0.5">03m 45s</div>
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 rounded-lg bg-purple-500/10 text-purple-400">
            <TrendingUp class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Resolução 1º Contato</span>
            <div class="text-xl font-bold font-mono text-white mt-0.5">94.2%</div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
