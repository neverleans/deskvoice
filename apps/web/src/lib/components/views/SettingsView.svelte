<script lang="ts">
  import { telephony } from '../../stores/telephony.svelte.js';
  import { sounds } from '../../audio/chime.js';
  import {
    Settings,
    Phone,
    Volume2,
    Building2,
    Shield,
    Plus,
    CheckCircle2,
    Sliders,
    Headphones,
    GitBranch,
    Clock,
    Play
  } from 'lucide-svelte';

  let activeTab = $state<'telephony' | 'ivr' | 'audio' | 'company'>('telephony');

  // Formulário para novo número DID
  let isAddNumOpen = $state(false);
  let newNum = $state('');
  let newLabel = $state('');
  let newType = $state<'LANDLINE' | 'MOBILE' | 'TOLL_FREE' | 'WHATSAPP'>('LANDLINE');
  let newQueue = $state('Suporte N1');

  // Configurações de Áudio (ADR-005)
  let ringerDevice = $state('Alto-falantes (Realtek High Definition Audio)');
  let headsetDevice = $state('Headset USB Jabra Evolve 40 (Saída)');
  let micDevice = $state('Headset USB Jabra Evolve 40 (Microfone)');
  let micVolume = $state(85);
  let isTestingRinger = $state(false);

  function testRingtone() {
    if (isTestingRinger) {
      sounds.stopRingtone();
      isTestingRinger = false;
    } else {
      sounds.startRingtone();
      isTestingRinger = true;
      setTimeout(() => {
        sounds.stopRingtone();
        isTestingRinger = false;
      }, 3500);
    }
  }

  function handleSaveNumber() {
    if (!newNum || !newLabel) return;
    telephony.addCompanyNumber({
      number: newNum,
      label: newLabel,
      type: newType,
      channel: newType === 'WHATSAPP' ? 'WHATSAPP' : 'VOICE',
      assignedQueue: newQueue,
      status: 'ACTIVE',
      provider: 'Tronco SIP Virtual',
    });
    newNum = '';
    newLabel = '';
    isAddNumOpen = false;
  }
</script>

<div class="flex-1 bg-slate-950 p-6 overflow-y-auto select-none">
  <!-- Cabeçalho -->
  <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings class="w-5 h-5 text-emerald-400" /> Configurações de Sistema & PABX
        </h1>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          Nível Administrador
        </span>
      </div>
      <p class="text-xs text-slate-400 mt-1">
        Gestão de infraestrutura SIP, números DIDs da empresa, árvore de atendimento (URA), áudio e regras de fila.
      </p>
    </div>

    <!-- Abas de Configuração -->
    <div class="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
      <button
        onclick={() => (activeTab = 'telephony')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {activeTab === 'telephony' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        <Phone class="w-3.5 h-3.5 inline mr-1" /> Telefonia & DIDs
      </button>
      <button
        onclick={() => (activeTab = 'ivr')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {activeTab === 'ivr' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        <GitBranch class="w-3.5 h-3.5 inline mr-1" /> URA & Menus
      </button>
      <button
        onclick={() => (activeTab = 'audio')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {activeTab === 'audio' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        <Volume2 class="w-3.5 h-3.5 inline mr-1" /> Áudio Saída Dupla
      </button>
      <button
        onclick={() => (activeTab = 'company')}
        class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all {activeTab === 'company' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
      >
        <Building2 class="w-3.5 h-3.5 inline mr-1" /> Empresa & Horários
      </button>
    </div>
  </div>

  {#if activeTab === 'telephony'}
    <!-- Seção: Números e DIDs -->
    <div class="max-w-4xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-white">Linhas e Números Cadastrados</h2>
          <span class="text-xs text-slate-400">Números fixos, celulares, 0800 e canais de WhatsApp ativos.</span>
        </div>
        <button
          onclick={() => (isAddNumOpen = !isAddNumOpen)}
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
        >
          <Plus class="w-3.5 h-3.5" /> Adicionar Linha
        </button>
      </div>

      {#if isAddNumOpen}
        <div class="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
          <h3 class="text-xs font-bold text-white">Cadastrar Novo Número / DID</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="numInput" class="block text-[11px] text-slate-400 mb-1">Número</label>
              <input
                id="numInput"
                type="text"
                bind:value={newNum}
                placeholder="Ex: (31) 3456-7890"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label for="labelInput" class="block text-[11px] text-slate-400 mb-1">Identificação / Uso</label>
              <input
                id="labelInput"
                type="text"
                bind:value={newLabel}
                placeholder="Ex: Suporte 24h"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button
              onclick={() => (isAddNumOpen = false)}
              class="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs"
            >
              Cancelar
            </button>
            <button
              onclick={handleSaveNumber}
              class="px-4 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-xs"
            >
              Salvar
            </button>
          </div>
        </div>
      {/if}

      <!-- Tabela de Números -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
            <tr>
              <th class="py-3 px-4">Número</th>
              <th class="py-3 px-4">Identificação</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4">Fila de Destino</th>
              <th class="py-3 px-4">Provedor</th>
              <th class="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-slate-300">
            {#each telephony.numbers as num}
              <tr class="hover:bg-slate-800/40">
                <td class="py-3 px-4 font-mono font-bold text-white">{num.number}</td>
                <td class="py-3 px-4">{num.label}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                    {num.type}
                  </span>
                </td>
                <td class="py-3 px-4 text-emerald-400 font-medium">{num.assignedQueue}</td>
                <td class="py-3 px-4 text-slate-400 text-[11px]">{num.provider}</td>
                <td class="py-3 px-4 text-center">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                    Ativo
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

  {:else if activeTab === 'ivr'}
    <!-- Seção: URA (Interactive Voice Response) & Árvore de Atendimento -->
    <div class="max-w-3xl space-y-6">
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch class="w-4 h-4 text-emerald-400" /> URA Principal (Menu Telefônico Interativo)
            </h2>
            <span class="text-xs text-slate-400">
              Estrutura de áudio inicial executada quando o cliente liga para o número principal da empresa.
            </span>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
            Status: Ativa
          </span>
        </div>

        <!-- Áudio de Saudação -->
        <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <Play class="w-4 h-4" />
            </div>
            <div>
              <span class="text-xs font-semibold text-slate-200">Mensagem de Boas-Vindas</span>
              <span class="text-[11px] text-slate-400 block">"Olá, você ligou para a DeskVoice. Digite 1 para..."</span>
            </div>
          </div>
          <span class="text-xs font-mono text-slate-500">00:14s (Opus HD)</span>
        </div>

        <!-- Opções de Roteamento -->
        <div class="space-y-2 pt-2">
          <h3 class="text-xs font-bold text-slate-300">Destino por Tecla Discada (DTMF)</h3>

          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center">1</span>
              <div>
                <span class="font-semibold text-white">Suporte Técnico N1</span>
                <span class="text-[11px] text-slate-400 block">Encaminha para a fila de atendimento técnico</span>
              </div>
            </div>
            <span class="text-slate-400 font-mono text-[11px]">Timeout: 15s</span>
          </div>

          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold flex items-center justify-center">2</span>
              <div>
                <span class="font-semibold text-white">Comercial & Vendas</span>
                <span class="text-[11px] text-slate-400 block">Encaminha para consultores de vendas e upgrades</span>
              </div>
            </div>
            <span class="text-slate-400 font-mono text-[11px]">Timeout: 15s</span>
          </div>

          <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-mono font-bold flex items-center justify-center">3</span>
              <div>
                <span class="font-semibold text-white">Financeiro & Cobrança</span>
                <span class="text-[11px] text-slate-400 block">Segunda via de boletos e confirmações de faturamento</span>
              </div>
            </div>
            <span class="text-slate-400 font-mono text-[11px]">Timeout: 15s</span>
          </div>
        </div>
      </div>
    </div>

  {:else if activeTab === 'audio'}
    <!-- Seção: Ergonomia de Áudio (ADR-005 Saída Dupla) -->
    <div class="max-w-3xl space-y-6">
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 class="w-4 h-4 text-emerald-400" /> Configuração de Saída Dupla (Dual-Output)
          </h2>
          <span class="text-xs text-slate-400">
            Conforme padrão de call center (ADR-005): a campainha toca no alto-falante principal e a conversa sai no fone/headset.
          </span>
        </div>

        <div class="space-y-4 pt-2">
          <!-- Dispositivo de Campainha -->
          <div>
            <label for="ringerDevSelect" class="block text-xs font-semibold text-slate-300 mb-1">
              🔔 Saída da Campainha (Ringtone Output)
            </label>
            <div class="flex items-center gap-3">
              <select
                id="ringerDevSelect"
                bind:value={ringerDevice}
                class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="Alto-falantes (Realtek High Definition Audio)">Alto-falantes do Computador (Realtek HD Audio)</option>
                <option value="Monitor HDMI / DisplayPort">Saída de Áudio do Monitor HDMI</option>
              </select>
              <button
                onclick={testRingtone}
                class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                {isTestingRinger ? 'Tocando...' : 'Testar Toque'}
              </button>
            </div>
          </div>

          <!-- Dispositivo de Conversa -->
          <div>
            <label for="headsetDevSelect" class="block text-xs font-semibold text-slate-300 mb-1">
              🎧 Fone de Conversa com o Cliente (Voice Output)
            </label>
            <select
              id="headsetDevSelect"
              bind:value={headsetDevice}
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
            >
              <option value="Headset USB Jabra Evolve 40 (Saída)">Headset USB Jabra Evolve 40 (Recomendado)</option>
              <option value="Fone Bluetooth">Fone de Ouvido Bluetooth</option>
            </select>
          </div>

          <!-- Microfone -->
          <div>
            <label for="micDevSelect" class="block text-xs font-semibold text-slate-300 mb-1">
              🎙️ Microfone de Entrada (Voice Input)
            </label>
            <select
              id="micDevSelect"
              bind:value={micDevice}
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
            >
              <option value="Headset USB Jabra Evolve 40 (Microfone)">Microfone Headset USB Jabra (Cancelamento de Ruído)</option>
              <option value="Microfone Integrado">Microfone Integrado do Notebook</option>
            </select>
          </div>

          <!-- Sensibilidade e Teste de Volume -->
          <div>
            <div class="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Sensibilidade do Microfone</span>
              <span class="font-mono text-emerald-400 font-semibold">{micVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              bind:value={micVolume}
              class="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>

  {:else}
    <!-- Seção: Dados da Empresa & Horários -->
    <div class="max-w-2xl bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 class="text-sm font-bold text-white">Dados da Empresa & Horários</h2>
      <div class="grid grid-cols-2 gap-4 text-xs">
        <div>
          <label for="companyName" class="block text-slate-400 mb-1">Razão Social</label>
          <input id="companyName" type="text" value="DeskVoice Tecnologia Ltda" readonly class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label for="companyCnpj" class="block text-slate-400 mb-1">CNPJ</label>
          <input id="companyCnpj" type="text" value="48.123.456/0001-78" readonly class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" />
        </div>
        <div class="col-span-2">
          <label for="companyHours" class="block text-slate-400 mb-1">Horário de Atendimento da URA</label>
          <input id="companyHours" type="text" value="Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" />
        </div>
      </div>
    </div>
  {/if}
</div>
