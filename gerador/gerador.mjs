var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/motor.ts
function ivsDeSoma(soma2) {
  const t = lim(Math.round(soma2 || 6), 6, 192);
  const m = Math.floor(t / 6);
  return Object.fromEntries(CHAVES.map((k, i) => [k, m + (i < t - m * 6 ? 1 : 0)]));
}
function soma(ivs, q, p, shiny, b) {
  return CHAVES.reduce((s, k) => s + Math.round((b[k] + 2 * (ivs[k] || 1)) * lim(q, 0.8, 1.8) ** EXPO[k] * mult(p, shiny)), 0);
}
function liquidoGemas(p) {
  return p - (0.13 * Math.min(p, 500) + 0.1 * Math.max(0, Math.min(p, 5e3) - 500) + 0.075 * Math.max(0, p - 5e3));
}
function mediana(valores) {
  if (!valores.length) return null;
  const v = [...valores].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
var EXPO, CHAVES, BONUS_POTENCIA, REFERENCIA, lim, mult, SMIN, SMAX;
var init_motor = __esm({
  "src/lib/motor.ts"() {
    "use strict";
    EXPO = { hp: 0.95, atk: 0.8, def: 0.8, spAtk: 0.8, spDef: 0.8, speed: 0.95 };
    CHAVES = Object.keys(EXPO);
    BONUS_POTENCIA = [0, 0.05, 0.1, 0.25, 1];
    REFERENCIA = { hp: 80, atk: 80, def: 80, spAtk: 80, spDef: 80, speed: 80 };
    lim = (v, a, b) => Math.min(b, Math.max(a, v));
    mult = (p, shiny) => (1 + BONUS_POTENCIA[lim(Math.round(p || 1), 1, 5) - 1]) * (shiny ? 3 : 1);
    SMIN = Math.max(1, soma(ivsDeSoma(6), 0.8, 1, false, REFERENCIA));
    SMAX = soma(ivsDeSoma(192), 1.8, 5, true, REFERENCIA);
  }
});

// src/lib/mercado-linhas.ts
var mercado_linhas_exports = {};
__export(mercado_linhas_exports, {
  COMISSAO_COINS: () => COMISSAO_COINS,
  MERCADO_DESDE: () => MERCADO_DESDE,
  REGISTRO_DIAS: () => REGISTRO_DIAS,
  VEREDITOS_DO_REGISTRO: () => VEREDITOS_DO_REGISTRO,
  anuncioDe: () => anuncioDe,
  anuncioEmCoinsDe: () => anuncioEmCoinsDe,
  doMercado: () => doMercado,
  maiorAlterado: () => maiorAlterado,
  montarDeLinhas: () => montarDeLinhas,
  ordenarGemas: () => ordenarGemas,
  ordenarRegistro: () => ordenarRegistro,
  registroDaLinha: () => registroDaLinha
});
function maiorAlterado(linhas) {
  let maior = null;
  let ms = 0;
  for (const l of linhas) {
    const t = Date.parse(l.alterado_em);
    if (t > ms) [ms, maior] = [t, l.alterado_em];
  }
  return maior;
}
function anuncioDe(c, vendedor = null) {
  if (!VEREDITOS.has(c.v)) return null;
  const [nivel, ivTotal, nota100] = c.k.split("|").map(Number);
  return {
    nome: c.nome,
    nivel: nivel || 0,
    nota: Number.isFinite(nota100) ? nota100 / 100 : 0,
    potencia: c.pp ?? 1,
    qualidade: c.q ?? 0,
    ivTotal: ivTotal || 0,
    ivUtil: c.iu ?? null,
    shiny: c.sh === 1,
    mega: c.nome.startsWith("Mega "),
    aoe: c.ae === 1,
    z: c.zm === 1,
    preco: c.p,
    veredito: c.v,
    indice: c.i ?? null,
    vsMercado: c.vs ?? 0,
    mediana: c.med ?? 0,
    vendas: c.n ?? 0,
    diasFeira: c.d ?? 0,
    lucro: c.med ? Math.round(liquidoGemas(c.med) - c.p) : null,
    poder100: c.f ?? null,
    custoPorPoder: c.f ? Math.round(c.p / c.f * 100) / 100 : null,
    raridade: c.rar ?? null,
    regua: c.reg ?? null,
    vendedor
  };
}
function anuncioEmCoinsDe(a) {
  const [nivel, ivTotal, nota100] = a.k.split("|").map(Number);
  if (!VEREDITOS.has(a.v) || !Number.isFinite(nivel) || a.med == null) return null;
  return {
    nome: a.nome,
    nivel,
    nota: nota100 / 100,
    potencia: a.pp ?? 1,
    qualidade: 0,
    ivTotal,
    ivUtil: a.iu,
    shiny: a.sh === 1,
    mega: a.nome.startsWith("Mega "),
    aoe: a.ae === 1,
    z: a.zm === 1,
    preco: a.p,
    veredito: a.v,
    indice: a.i,
    vsMercado: a.vs ?? 0,
    mediana: a.med,
    vendas: a.n ?? 0,
    diasFeira: a.d ?? 0,
    lucro: Math.round(a.med * (1 - COMISSAO_COINS) - a.p),
    poder100: a.f,
    custoPorPoder: a.f ? a.p / a.f : null,
    raridade: a.rar,
    regua: a.reg
  };
}
function registroDaLinha(l) {
  const a = anuncioDe(l.dados);
  return a ? { nome: a.nome, nivel: a.nivel, nota: a.nota, shiny: a.shiny, veredito: a.veredito, preco: a.preco, mediana: a.mediana, vsMercado: a.vsMercado, revenda: null, vistoEm: Date.parse(l.alterado_em) } : null;
}
function ordenarGemas(pares) {
  const porVeredito = {};
  for (const p of pares) (porVeredito[p[1].veredito] ??= []).push(p);
  const grupos = Object.values(porVeredito);
  const ordem = grupos.flatMap((lista) => [...lista].sort((x, y) => (y[1].indice ?? 0) - (x[1].indice ?? 0)));
  const contagem = {};
  for (const [v, lista] of Object.entries(porVeredito)) contagem[v] = lista.length;
  return { ids: ordem.map((p) => p[0]), anuncios: ordem.map((p) => p[1]), contagem };
}
function montarDeLinhas(ativos, saidos, vendedores, vistoEm) {
  const pares = [];
  const semVeredito = [];
  const coins = [];
  const especies2 = {};
  for (const l of ativos) {
    especies2[l.dados.nome] = (especies2[l.dados.nome] ?? 0) + 1;
    if (l.dados.m !== "g") {
      coins.push(l.id);
      continue;
    }
    const a = anuncioDe(l.dados, vendedores.get(l.id) ?? null);
    if (a) pares.push([l.id, a]);
    else semVeredito.push(l.id);
  }
  const gemas = ordenarGemas(pares);
  const registro = ordenarRegistro(saidos.flatMap((l) => {
    const r = registroDaLinha(l);
    return r ? [[l.id, r]] : [];
  }));
  const geradoEm = vistoEm ?? ativos.reduce((m, l) => l.visto_em > m ? l.visto_em : m, ativos[0].visto_em);
  const mercado = {
    resumo: { geradoEm, anunciosAbertos: ativos.length, anunciosGemas: pares.length + semVeredito.length, especies: Object.keys(especies2).length, vendedores: 0, contagem: gemas.contagem },
    anuncios: gemas.anuncios,
    // registro: ÓTIMOS e EXCEPCIONAIS em gemas que saíram do mercado nos últimos dias (vendidos ou retirados)
    registro: registro.map((p) => p[1]),
    itens: [],
    aoVivo: true,
    recebidoEm: geradoEm
  };
  return { mercado, vivo: { ids: gemas.ids, registro: registro.map((p) => p[0]), semVeredito, coins, especies: especies2 } };
}
var REGISTRO_DIAS, MERCADO_DESDE, VEREDITOS_DO_REGISTRO, COMISSAO_COINS, VEREDITOS, doMercado, ordenarRegistro;
var init_mercado_linhas = __esm({
  "src/lib/mercado-linhas.ts"() {
    "use strict";
    init_motor();
    REGISTRO_DIAS = 3;
    MERCADO_DESDE = "2026-11-18T03:00:00Z";
    VEREDITOS_DO_REGISTRO = ["otimo", "excepcional"];
    COMISSAO_COINS = 0.15;
    VEREDITOS = /* @__PURE__ */ new Set(["excepcional", "otimo", "bom", "justo", "caro"]);
    doMercado = (l) => l.criado_em != null && Date.parse(l.criado_em) >= Date.parse(MERCADO_DESDE);
    ordenarRegistro = (pares) => [...pares].sort((a, b) => b[1].vistoEm - a[1].vistoEm);
  }
});

// src/lib/ficha.ts
function lerFicha(texto) {
  const especieLinha = campo(texto, "Esp\xE9cie") ?? campo(texto, "Especie");
  const especie = especieLinha?.split(/\s+\(#|\s+—\s+|\s+-\s+/)[0]?.trim() || texto.match(/^#\s*(.+?)\s+—/m)?.[1]?.trim() || null;
  const tiposTexto = especieLinha?.split("\u2014")[1] ?? "";
  const tipos = tiposTexto.split("/").map((t) => t.trim()).filter(Boolean).map((t) => t.charAt(0) + t.slice(1).toLowerCase());
  const ivs = {};
  const refino = {};
  const atuais = {};
  for (const m of texto.matchAll(/^\|\s*(HP|ATK|DEF|SP\.ATK|SP\.DEF|SPD)\s*\|\s*(\d+)\s*\|\s*([+-]?\d+)\s*\|\s*(\d+)\s*\|\s*([\d.,]+)\s*\|/gm)) {
    const k = LINHA_STAT[m[1]];
    refino[k] = Number(m[3]);
    ivs[k] = Number(m[4]);
    atuais[k] = inteiro(m[5]) ?? void 0;
  }
  return {
    especie,
    tipos,
    shiny: /shiny\s*:\s*sim/i.test(texto),
    nivel: inteiro(campo(texto, "N\xEDvel")?.match(/[\d.,]+/)?.[0]),
    potencia: inteiro(campo(texto, "Pot\xEAncia")?.match(/P\s*(\d)/i)?.[1]),
    qualidade: decimal(campo(texto, "Qualidade")?.match(/[\d.,]+/)?.[0]),
    ivTotal: inteiro(campo(texto, "IV somado")?.match(/\d+/)?.[0]),
    nota: decimal(campo(texto, "Nota da Calculadora")?.match(/[\d.,]+/)?.[0]),
    poder: inteiro(campo(texto, "Poder \\(\u2694\\)")?.match(/[\d.,]+/)?.[0]),
    ivs,
    refino,
    atuais
  };
}
var LINHA_STAT, inteiro, decimal, campo;
var init_ficha = __esm({
  "src/lib/ficha.ts"() {
    "use strict";
    LINHA_STAT = {
      HP: "hp",
      ATK: "atk",
      DEF: "def",
      "SP.ATK": "spAtk",
      "SP.DEF": "spDef",
      SPD: "speed"
    };
    inteiro = (s) => {
      if (!s) return null;
      const n2 = Number(s.replace(/[.,\s]/g, ""));
      return Number.isFinite(n2) ? n2 : null;
    };
    decimal = (s) => {
      if (!s) return null;
      const limpo = s.includes(".") ? s.replace(/,/g, "") : s.replace(",", ".");
      const n2 = Number(limpo);
      return Number.isFinite(n2) ? n2 : null;
    };
    campo = (texto, rotulo) => texto.match(new RegExp(`${rotulo}\\s*:\\s*([^\\n]+)`, "i"))?.[1]?.trim();
  }
});

// src/lib/pokedex-dados.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
function regiaoDoDex(dex) {
  if (dex >= 2001 && dex <= 2999) return "Outland";
  const base = dex > 1025 ? dex % 1e3 : dex;
  return REGIOES.find(([fim]) => base <= fim)?.[1] ?? "Outros";
}
function carregar() {
  const linhas = readFileSync(ARQUIVO, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const cab = linhas[0].split(",");
  const porNome = /* @__PURE__ */ new Map();
  for (const l of linhas.slice(1)) {
    const v = l.split(",");
    const r = Object.fromEntries(cab.map((k, i) => [k, v[i]]));
    if (!porNome.has(r.especie)) porNome.set(r.especie, { r, golpes: [] });
    porNome.get(r.especie).golpes.push({
      nome: r.golpe,
      nivel: num(r.nivel_aprende),
      poder: num(r.poder),
      cooldown: num(r.cooldown_s),
      dps: num(r.dano_por_s),
      categoria: r.categoria === "F" ? "f\xEDsico" : r.categoria === "E" ? "especial" : r.categoria,
      tipo: titulo(r.tipo_golpe)
    });
  }
  const megasDe = /* @__PURE__ */ new Map();
  for (const nome of porNome.keys()) {
    const base = baseDaMega(nome);
    if (base && porNome.has(base)) megasDe.set(base, [...megasDe.get(base) ?? [], nome]);
  }
  return [...porNome.entries()].map(([nome, { r, golpes }]) => {
    golpes.sort((a, b) => (b.dps ?? 0) - (a.dps ?? 0));
    const top = golpes.slice(0, GOLPES_PARA_FATIA);
    const totalDps = top.reduce((s, g) => s + (g.dps ?? 0), 0);
    const fisico = totalDps ? top.filter((g) => g.categoria === "f\xEDsico").reduce((s, g) => s + (g.dps ?? 0), 0) / totalDps : null;
    const megaDe = baseDaMega(nome);
    const dex = Number(r.dex);
    return {
      dex,
      nome,
      tipos: [titulo(r.tipo1), titulo(r.tipo2)].filter((t) => Boolean(t)),
      bases: {
        hp: Number(r.hp),
        atk: Number(r.atk),
        def: Number(r.def),
        spAtk: Number(r.spatk),
        spDef: Number(r.spdef),
        speed: Number(r.spd)
      },
      total: Number(r.total),
      regiao: regiaoDoDex(dex),
      nivelHunt: num(r.nivel_hunt),
      captura: r.como_captura || null,
      precoNpc: num(r.preco_npc),
      bolas: Object.fromEntries(
        BOLAS.map((b) => [
          b,
          { pct: num(r[`chance_${b}_ball_pct`]), derrotas: num(r[`derrotas_${b}_ball`]), shiny: num(r[`shiny_1_em_${b}_ball`]) }
        ])
      ),
      fisico,
      megas: megasDe.get(nome) ?? [],
      megaDe: megaDe && porNome.has(megaDe) ? megaDe : null,
      vemDe: null,
      evoluiPara: [],
      golpes
    };
  }).sort((a, b) => a.dex - b.dex || a.nome.localeCompare(b.nome));
}
function buscarEspecie(nome) {
  return porNomeMinusculo.get(nome.trim().toLowerCase()) ?? null;
}
var ARQUIVO, BOLAS, GOLPES_PARA_FATIA, REGIOES, num, titulo, baseDaMega, especies, porNomeMinusculo, pokedexLista, nomesEspecies;
var init_pokedex_dados = __esm({
  "src/lib/pokedex-dados.ts"() {
    "use strict";
    ARQUIVO = process.env.POKEDEX_CSV ?? join(process.cwd(), "dados", "pokeidle-pokedex-2026-10-30.csv");
    BOLAS = ["poke", "great", "super", "ultra", "beast"];
    GOLPES_PARA_FATIA = 4;
    REGIOES = [
      [151, "Kanto"],
      [251, "Johto"],
      [386, "Hoenn"],
      [493, "Sinnoh"],
      [649, "Unova"],
      [721, "Kalos"],
      [809, "Alola"],
      [905, "Galar"],
      [1025, "Paldea"]
    ];
    num = (v) => v === void 0 || v === "" ? null : Number(v);
    titulo = (t) => t ? t.charAt(0) + t.slice(1).toLowerCase() : null;
    baseDaMega = (nome) => {
      const m = nome.match(/^(?:Mega|Primal) (.+?)(?: [XY])?$/);
      return m ? m[1] : null;
    };
    especies = carregar();
    porNomeMinusculo = new Map(especies.map((e) => [e.nome.toLowerCase(), e]));
    pokedexLista = especies.map(({ golpes, evoluiPara, ...e }) => ({
      dex: e.dex,
      nome: e.nome,
      tipos: e.tipos,
      bases: e.bases,
      total: e.total,
      regiao: e.regiao,
      nivelHunt: e.nivelHunt,
      captura: e.captura,
      bolas: e.bolas,
      fisico: e.fisico,
      megas: e.megas,
      melhorGolpe: golpes[0] ? { nome: golpes[0].nome, dps: golpes[0].dps, tipo: golpes[0].tipo } : null,
      evolui: evoluiPara.length > 0
    }));
    nomesEspecies = especies.map((e) => e.nome);
  }
});

// src/lib/config.ts
var MOSTRAR_PLANOS, FILTROS_LIVRES, VAGAS_DESTAQUE;
var init_config = __esm({
  "src/lib/config.ts"() {
    "use strict";
    MOSTRAR_PLANOS = process.env.NEXT_PUBLIC_MOSTRAR_PLANOS === "1";
    FILTROS_LIVRES = process.env.NEXT_PUBLIC_FILTROS_LIVRES === "1";
    VAGAS_DESTAQUE = 5;
  }
});

// src/lib/destaques.ts
var destaques_exports = {};
__export(destaques_exports, {
  VAGAS_DESTAQUE: () => VAGAS_DESTAQUE,
  carregarDestaques: () => carregarDestaques,
  lerFichaDestaque: () => lerFichaDestaque,
  pedirDestaque: () => pedirDestaque,
  previaDestaque: () => previaDestaque
});
async function lerBanco(caminho) {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  const r = await fetch(`${url}/rest/v1/${caminho}`, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` },
    next: { revalidate: ATUALIZA_SEG }
  });
  if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
  return await r.json();
}
async function anunciosComChaves(chaves) {
  if (!chaves.length) return [];
  const lista = chaves.map((k) => encodeURIComponent(`"${k}"`)).join(",");
  return (await lerBanco(`radar_anuncios?select=dados&ativo=is.true&dados->>m=eq.g&dados->>k=in.(${lista})`)).map((l) => l.dados);
}
function avaliarFicha(ficha, precoRef, achados) {
  const chave = chaveDe(ficha);
  const iguais = achados.filter((a2) => a2.k === chave && a2.nome === ficha.especie);
  if (!iguais.length) return { preco: precoRef, avaliacao: null };
  const distancia = (x) => precoRef == null ? x.p : Math.abs(x.p - precoRef);
  const a = [...iguais].sort((x, y) => distancia(x) - distancia(y))[0];
  return {
    preco: a.p,
    avaliacao: {
      veredito: a.v,
      vsMercado: a.vs,
      mediana: a.med,
      lucro: a.med != null ? Math.round(liquidoGemas(a.med) - a.p) : null,
      oportunidade: a.i
    }
  };
}
async function preencherVagas() {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  try {
    await fetch(`${url}/rest/v1/rpc/radar_preencher_vagas`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store"
    });
  } catch (e) {
    console.error("destaques: n\xE3o deu para andar a fila", e);
  }
}
async function carregarDestaques() {
  if (!process.env.RADAR_SUPABASE_URL || !process.env.RADAR_SUPABASE_CHAVE) return [];
  await preencherVagas();
  try {
    const linhas = (await lerBanco(`radar_destaques?select=id,ficha,preco,moeda,vendedor&order=inicio.asc&limit=${VAGAS_DESTAQUE}`)).map((d) => ({ ...d, preco: Number(d.preco) }));
    const achados = await anunciosComChaves(linhas.map((d) => chaveDe(d.ficha)).filter((k) => k != null));
    return linhas.map((d) => {
      const r = avaliarFicha(d.ficha, d.preco, achados);
      return { ...d, preco: r.preco ?? d.preco, avaliacao: r.avaliacao };
    });
  } catch (e) {
    console.error("destaques: o banco n\xE3o respondeu", e);
    return [];
  }
}
function lerFichaDestaque(texto) {
  if (typeof texto !== "string" || !texto.trim()) return { erro: "Cole a ficha do pok\xE9mon." };
  if (texto.length > MAX_TEXTO_FICHA) return { erro: "A ficha est\xE1 grande demais. Cole s\xF3 a ficha do pok\xE9mon." };
  const f = lerFicha(texto);
  if (!f.especie || f.nivel == null || f.ivTotal == null || f.nota == null)
    return { erro: "N\xE3o reconhecemos a ficha. Use o bot\xE3o \u201CCopiar p/ ChatGPT\u201D do pok\xE9mon no jogo e cole aqui." };
  const especie = buscarEspecie(f.especie);
  return {
    ficha: {
      especie: especie?.nome ?? f.especie,
      dex: especie?.dex ?? null,
      tipos: f.tipos.length ? f.tipos : especie?.tipos ?? [],
      shiny: f.shiny,
      nivel: f.nivel,
      potencia: f.potencia,
      qualidade: f.qualidade,
      ivTotal: f.ivTotal,
      nota: f.nota,
      poder: f.poder
    }
  };
}
async function pedirDestaque(ficha, preco, vendedor, prazo) {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  const r = await fetch(`${url}/rest/v1/rpc/radar_pedir_destaque`, {
    method: "POST",
    headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_ficha: ficha, p_preco: preco, p_vendedor: vendedor, p_prazo: prazo }),
    cache: "no-store"
  });
  if (!r.ok) {
    const detalhe = await r.json().catch(() => null);
    throw new Error(detalhe?.message ?? `banco respondeu ${r.status}`);
  }
  return await r.json();
}
async function previaDestaque(ficha) {
  const chave = chaveDe(ficha);
  if (!chave || !process.env.RADAR_SUPABASE_URL || !process.env.RADAR_SUPABASE_CHAVE) return { preco: null, avaliacao: null };
  return avaliarFicha(ficha, null, await anunciosComChaves([chave]));
}
var ATUALIZA_SEG, chaveDe, MAX_TEXTO_FICHA;
var init_destaques = __esm({
  "src/lib/destaques.ts"() {
    "use strict";
    init_motor();
    init_ficha();
    init_pokedex_dados();
    init_config();
    ATUALIZA_SEG = 60;
    chaveDe = (f) => f.ivTotal != null && f.nota != null ? `${f.nivel}|${f.ivTotal}|${Math.round(f.nota * 100)}` : null;
    MAX_TEXTO_FICHA = 8e3;
  }
});

// src/data/amostra.json
var amostra_default;
var init_amostra = __esm({
  "src/data/amostra.json"() {
    amostra_default = { resumo: { geradoEm: 1793498236020, anunciosAbertos: 1042, anunciosGemas: 769, especies: 246, vendedores: 803, contagem: { caro: 348, justo: 195, bom: 45, otimo: 2 } }, anuncios: [{ raridade: 32, regua: 38, nome: "Larvitar", nivel: 20, nota: 5.797, potencia: 1, qualidade: 1.345, ivTotal: 120, ivUtil: 95, shiny: true, mega: false, aoe: false, z: false, preco: 7500, vsMercado: 28, lucro: -2079, veredito: "caro", indice: 0, mediana: 5860, vendas: 30, diasFeira: 3.2, poder100: 535, custoPorPoder: 14.02 }, { raridade: null, regua: 64, nome: "Annihilape", nivel: 2124, nota: 6.281, potencia: 2, qualidade: 1.096, ivTotal: 151, ivUtil: 97, shiny: true, mega: false, aoe: false, z: true, preco: 17502, vsMercado: 38, lucro: -5801, veredito: "caro", indice: 0, mediana: 12650, vendas: 7, diasFeira: 2.5, poder100: 639, custoPorPoder: 27.39 }, { raridade: null, regua: 62, nome: "Mega Alakazam", nivel: 381, nota: 6.006, potencia: 1, qualidade: 1.099, ivTotal: 125, ivUtil: 99, shiny: true, mega: true, aoe: false, z: false, preco: 7500, vsMercado: 26, lucro: -1996, veredito: "caro", indice: 0, mediana: 5950, vendas: 5, diasFeira: 0.6, poder100: 629, custoPorPoder: 11.92 }, { raridade: 92, regua: 64, nome: "Mega Charizard X", nivel: 2195, nota: 6.028, potencia: 3, qualidade: 1.002, ivTotal: 112, ivUtil: 92, shiny: true, mega: true, aoe: true, z: false, preco: 17e3, vsMercado: 80, lucro: -8243, veredito: "caro", indice: 0, mediana: 9467, vendas: 9, diasFeira: 0.1, poder100: 637, custoPorPoder: 26.69 }, { raridade: 60, regua: 43, nome: "Onix", nivel: 60, nota: 5.81, potencia: 3, qualidade: 1.023, ivTotal: 139, ivUtil: 94, shiny: true, mega: false, aoe: false, z: false, preco: 4462, vsMercado: 30, lucro: -1379, veredito: "caro", indice: 0, mediana: 3425, vendas: 7, diasFeira: 3.1, poder100: 558, custoPorPoder: 8 }, { raridade: 32, regua: 37, nome: "Larvitar", nivel: 20, nota: 5.776, potencia: 2, qualidade: 1.146, ivTotal: 142, ivUtil: 100, shiny: true, mega: false, aoe: false, z: false, preco: 11e3, vsMercado: 163, lucro: -7236, veredito: "caro", indice: 0, mediana: 4182, vendas: 13, diasFeira: 0.4, poder100: 533, custoPorPoder: 20.64 }, { raridade: 29, regua: 6, nome: "Sunkern", nivel: 40, nota: 4.791, potencia: 1, qualidade: 1.054, ivTotal: 138, ivUtil: 99, shiny: true, mega: false, aoe: false, z: false, preco: 600, vsMercado: 58, lucro: -269, veredito: "caro", indice: 0, mediana: 380, vendas: 15, diasFeira: 3, poder100: 412, custoPorPoder: 1.46 }, { raridade: null, regua: 45, nome: "Gengar", nivel: 100, nota: 5.575, potencia: 1, qualidade: 1.045, ivTotal: 113, ivUtil: 82, shiny: true, mega: false, aoe: false, z: false, preco: 6e3, vsMercado: 29, lucro: -1810, veredito: "caro", indice: 0, mediana: 4656, vendas: 7, diasFeira: 5.1, poder100: 563, custoPorPoder: 10.66 }, { raridade: 62, regua: 60, nome: "Rhyperior", nivel: 1155, nota: 6.112, potencia: 1, qualidade: 1.098, ivTotal: 150, ivUtil: 99, shiny: true, mega: false, aoe: false, z: false, preco: 9e3, vsMercado: 79, lucro: -4342, veredito: "caro", indice: 0, mediana: 5036, vendas: 10, diasFeira: 0.3, poder100: 623, custoPorPoder: 14.45 }, { raridade: null, regua: 56, nome: "Rhydon", nivel: 100, nota: 6.058, potencia: 1, qualidade: 1.254, ivTotal: 113, ivUtil: 95, shiny: true, mega: false, aoe: false, z: false, preco: 7e3, vsMercado: 243, lucro: -5164, veredito: "caro", indice: 0, mediana: 2040, vendas: 5, diasFeira: 2.8, poder100: 607, custoPorPoder: 11.53 }, { raridade: null, regua: 47, nome: "Rhyhorn", nivel: 49, nota: 6.062, potencia: 1, qualidade: 1.45, ivTotal: 111, ivUtil: 85, shiny: true, mega: false, aoe: false, z: false, preco: 25e3, vsMercado: 564, lucro: -21613, veredito: "caro", indice: 0, mediana: 3763, vendas: 5, diasFeira: 8.3, poder100: 572, custoPorPoder: 43.71 }, { raridade: null, regua: 46, nome: "Rhydon", nivel: 100, nota: 5.654, potencia: 1, qualidade: 1.067, ivTotal: 118, ivUtil: 74, shiny: true, mega: false, aoe: false, z: false, preco: 4500, vsMercado: 55, lucro: -1895, veredito: "caro", indice: 0, mediana: 2894, vendas: 5, diasFeira: 3.3, poder100: 566, custoPorPoder: 7.95 }, { raridade: null, regua: 40, nome: "Rhydon", nivel: 100, nota: 5.424, potencia: 2, qualidade: 0.922, ivTotal: 120, ivUtil: 71, shiny: true, mega: false, aoe: false, z: false, preco: 2500, vsMercado: 54, lucro: -1035, veredito: "caro", indice: 0, mediana: 1628, vendas: 5, diasFeira: 0.9, poder100: 543, custoPorPoder: 4.6 }, { raridade: null, regua: 36, nome: "Rhydon", nivel: 615, nota: 5.269, potencia: 1, qualidade: 0.924, ivTotal: 120, ivUtil: 74, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: 261, lucro: -3753, veredito: "caro", indice: 0, mediana: 1385, vendas: 5, diasFeira: 0.6, poder100: 528, custoPorPoder: 9.47 }, { raridade: 18, regua: 68, nome: "Parasect", nivel: 1009, nota: 6.776, potencia: 1, qualidade: 1.523, ivTotal: 146, ivUtil: 95, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: 222, lucro: -3603, veredito: "caro", indice: 0, mediana: 1552, vendas: 4, diasFeira: 1.4, poder100: 653, custoPorPoder: 7.66 }, { raridade: 12, regua: 77, nome: "Glaceon", nivel: 2064, nota: 6.811, potencia: 1, qualidade: 1.462, ivTotal: 139, ivUtil: 90, shiny: true, mega: false, aoe: true, z: false, preco: 27500, vsMercado: 64, lucro: -11963, veredito: "caro", indice: 0, mediana: 16797, vendas: 8, diasFeira: 0.7, poder100: 689, custoPorPoder: 39.91 }, { raridade: null, regua: 93, nome: "Mega Blastoise", nivel: 4013, nota: 7.287, potencia: 3, qualidade: 1.396, ivTotal: 144, ivUtil: 89, shiny: true, mega: true, aoe: true, z: true, preco: 12e4, vsMercado: 268, lucro: -89836, veredito: "caro", indice: 0, mediana: 32610, vendas: 7, diasFeira: 0.4, poder100: 751, custoPorPoder: 159.79 }, { raridade: 32, regua: 79, nome: "Mega Charizard Y", nivel: 4465, nota: 6.698, potencia: 4, qualidade: 1.055, ivTotal: 115, ivUtil: 84, shiny: true, mega: true, aoe: true, z: true, preco: 45e3, vsMercado: 113, lucro: -25473, veredito: "caro", indice: 0, mediana: 21110, vendas: 11, diasFeira: 0.4, poder100: 696, custoPorPoder: 64.66 }, { raridade: 8, regua: 100, nome: "Mega Dragonite", nivel: 4068, nota: 7.871, potencia: 4, qualidade: 1.381, ivTotal: 137, ivUtil: 93, shiny: true, mega: true, aoe: true, z: true, preco: 2e5, vsMercado: 499, lucro: -169129, veredito: "caro", indice: 0, mediana: 33374, vendas: 8, diasFeira: 0.4, poder100: 810, custoPorPoder: 246.91 }, { raridade: 25, regua: 91, nome: "Mega Charizard X", nivel: 1765, nota: 7.217, potencia: 3, qualidade: 1.403, ivTotal: 130, ivUtil: 84, shiny: true, mega: true, aoe: true, z: false, preco: 32e3, vsMercado: 82, lucro: -15711, veredito: "caro", indice: 0, mediana: 17610, vendas: 4, diasFeira: 0.1, poder100: 744, custoPorPoder: 43.01 }, { raridade: null, regua: 85, nome: "Mega Steelix", nivel: 1325, nota: 6.991, potencia: 1, qualidade: 1.453, ivTotal: 139, ivUtil: 90, shiny: true, mega: true, aoe: false, z: false, preco: 13900, vsMercado: 71, lucro: -6387, veredito: "caro", indice: 0, mediana: 8122, vendas: 4, diasFeira: 2.4, poder100: 719, custoPorPoder: 19.33 }, { raridade: 4, regua: 92, nome: "Mega Tyranitar", nivel: 5295, nota: 7.187, potencia: 3, qualidade: 1.361, ivTotal: 116, ivUtil: 97, shiny: true, mega: true, aoe: true, z: true, preco: 67e3, vsMercado: 225, lucro: -47936, veredito: "caro", indice: 0, mediana: 20610, vendas: 13, diasFeira: 3, poder100: 749, custoPorPoder: 89.45 }, { raridade: null, regua: 0, nome: "Onix", nivel: 60, nota: 3.563, potencia: 5, qualidade: 1.063, ivTotal: 82, ivUtil: 94, shiny: false, mega: false, aoe: false, z: false, preco: 400, vsMercado: 1718, lucro: -381, veredito: "caro", indice: 0, mediana: 22, vendas: 14, diasFeira: 35.9, poder100: 342, custoPorPoder: 1.17 }, { raridade: null, regua: 0, nome: "Beautifly", nivel: 100, nota: 3.843, potencia: 5, qualidade: 1.079, ivTotal: 98, ivUtil: 68, shiny: false, mega: false, aoe: false, z: false, preco: 150, vsMercado: 650, lucro: -133, veredito: "caro", indice: 0, mediana: 20, vendas: 7, diasFeira: 9.4, poder100: 371, custoPorPoder: 0.4 }, { raridade: 7, regua: 0, nome: "Hard Golem", nivel: 100, nota: 3.835, potencia: 5, qualidade: 1.093, ivTotal: 62, ivUtil: 66, shiny: false, mega: false, aoe: false, z: false, preco: 300, vsMercado: 2043, lucro: -288, veredito: "caro", indice: 0, mediana: 14, vendas: 254, diasFeira: 18.2, poder100: 389, custoPorPoder: 0.77 }, { raridade: 4, regua: 22, nome: "Charizard", nivel: 80, nota: 4.572, potencia: 5, qualidade: 1.28, ivTotal: 82, ivUtil: 80, shiny: false, mega: false, aoe: false, z: false, preco: 1500, vsMercado: 475, lucro: -1273, veredito: "caro", indice: 0, mediana: 261, vendas: 37, diasFeira: 17.6, poder100: 473, custoPorPoder: 3.17 }, { raridade: 12, regua: 4, nome: "Furious Scizor", nivel: 100, nota: 3.964, potencia: 5, qualidade: 1.251, ivTotal: 39, ivUtil: 70, shiny: false, mega: false, aoe: false, z: false, preco: 200, vsMercado: 624, lucro: -176, veredito: "caro", indice: 0, mediana: 28, vendas: 62, diasFeira: 17.6, poder100: 404, custoPorPoder: 0.5 }, { raridade: 16, regua: 17, nome: "Tyranitar", nivel: 196, nota: 4.103, potencia: 5, qualidade: 1.066, ivTotal: 83, ivUtil: 75, shiny: false, mega: false, aoe: false, z: false, preco: 500, vsMercado: 92, lucro: -274, veredito: "caro", indice: 0, mediana: 260, vendas: 21, diasFeira: 15.4, poder100: 453, custoPorPoder: 1.1 }, { raridade: 6, regua: 16, nome: "Furious Scizor", nivel: 100, nota: 4.438, potencia: 5, qualidade: 1.273, ivTotal: 78, ivUtil: 75, shiny: false, mega: false, aoe: false, z: false, preco: 200, vsMercado: 280, lucro: -154, veredito: "caro", indice: 0, mediana: 53, vendas: 105, diasFeira: 13.2, poder100: 451, custoPorPoder: 0.44 }, { raridade: 10, regua: 7, nome: "Furious Scizor", nivel: 100, nota: 4.061, potencia: 5, qualidade: 0.987, ivTotal: 113, ivUtil: 81, shiny: false, mega: false, aoe: false, z: false, preco: 116, vsMercado: 279, lucro: -89, veredito: "caro", indice: 0, mediana: 31, vendas: 71, diasFeira: 9.5, poder100: 414, custoPorPoder: 0.28 }, { raridade: null, regua: 0, nome: "Barboach", nivel: 40, nota: 4.009, potencia: 5, qualidade: 1.471, ivTotal: 80, ivUtil: 68, shiny: false, mega: false, aoe: false, z: false, preco: 300, vsMercado: null, lucro: -219, veredito: "justo", indice: 33, mediana: 93, vendas: 2, diasFeira: 2.9, poder100: 368, custoPorPoder: 0.82 }, { raridade: null, regua: 42, nome: "Mega Gyarados", nivel: 1084, nota: 5.059, potencia: 5, qualidade: 1.406, ivTotal: 89, ivUtil: 70, shiny: false, mega: true, aoe: false, z: false, preco: 2300, vsMercado: -21, lucro: 321, veredito: "justo", indice: 27, mediana: 2912, vendas: 7, diasFeira: 2.3, poder100: 551, custoPorPoder: 4.17 }, { raridade: null, regua: 36, nome: "Mega Charizard X", nivel: 1040, nota: 4.812, potencia: 5, qualidade: 1.284, ivTotal: 94, ivUtil: 76, shiny: false, mega: true, aoe: false, z: false, preco: 2e3, vsMercado: -24, lucro: 379, veredito: "justo", indice: 25, mediana: 2643, vendas: 5, diasFeira: 0, poder100: 528, custoPorPoder: 3.79 }, { raridade: null, regua: 8, nome: "Shiftry", nivel: 137, nota: 4.215, potencia: 5, qualidade: 1.23, ivTotal: 68, ivUtil: 70, shiny: false, mega: false, aoe: false, z: false, preco: 69, vsMercado: -65, lucro: 105, veredito: "justo", indice: 24, mediana: 200, vendas: 5, diasFeira: 0.4, poder100: 421, custoPorPoder: 0.16 }, { raridade: 63, regua: 54, nome: "Charizard", nivel: 80, nota: 5.851, potencia: 1, qualidade: 1.119, ivTotal: 116, ivUtil: 74, shiny: true, mega: false, aoe: false, z: false, preco: 4e3, vsMercado: -20, lucro: 633, veredito: "justo", indice: 24, mediana: 5009, vendas: 47, diasFeira: 4.5, poder100: 599, custoPorPoder: 6.68 }, { raridade: 18, regua: 43, nome: "Treecko", nivel: 20, nota: 6.016, potencia: 1, qualidade: 1.344, ivTotal: 131, ivUtil: 84, shiny: true, mega: false, aoe: false, z: false, preco: 8e3, vsMercado: null, lucro: -4096, veredito: "justo", indice: 23, mediana: 4338, vendas: 3, diasFeira: 2.2, poder100: 555, custoPorPoder: 14.41 }, { raridade: null, regua: 27, nome: "Forretress", nivel: 80, nota: 4.951, potencia: 1, qualidade: 0.807, ivTotal: 131, ivUtil: 77, shiny: true, mega: false, aoe: false, z: false, preco: 800, vsMercado: -31, lucro: 247, veredito: "justo", indice: 23, mediana: 1163, vendas: 4, diasFeira: 4.2, poder100: 492, custoPorPoder: 1.63 }, { raridade: 17, regua: 86, nome: "Mega Gengar", nivel: 1e3, nota: 7.039, potencia: 2, qualidade: 1.361, ivTotal: 152, ivUtil: 81, shiny: true, mega: true, aoe: false, z: false, preco: 21e3, vsMercado: -17, lucro: 2384, veredito: "justo", indice: 22, mediana: 25280, vendas: 4, diasFeira: 0.3, poder100: 725, custoPorPoder: 28.97 }, { raridade: 5, regua: 29, nome: "Brave Charizard", nivel: 724, nota: 4.856, potencia: 5, qualidade: 1.384, ivTotal: 90, ivUtil: 71, shiny: false, mega: false, aoe: false, z: false, preco: 500, vsMercado: -48, lucro: 369, veredito: "justo", indice: 22, mediana: 965, vendas: 5, diasFeira: 3, poder100: 502, custoPorPoder: 1 }, { raridade: 41, regua: 6, nome: "Blaziken", nivel: 221, nota: 3.923, potencia: 5, qualidade: 1.094, ivTotal: 65, ivUtil: 68, shiny: false, mega: false, aoe: false, z: false, preco: 100, vsMercado: -63, lucro: 133, veredito: "justo", indice: 22, mediana: 268, vendas: 7, diasFeira: 3.5, poder100: 411, custoPorPoder: 0.24 }, { raridade: null, regua: 77, nome: "Mega Venusaur", nivel: 2097, nota: 6.624, potencia: 1, qualidade: 1.374, ivTotal: 111, ivUtil: 86, shiny: true, mega: true, aoe: false, z: true, preco: 15500, vsMercado: -15, lucro: 1404, veredito: "justo", indice: 19, mediana: 18275, vendas: 7, diasFeira: 2.4, poder100: 689, custoPorPoder: 22.5 }, { raridade: 100, regua: 47, nome: "Exeggutor", nivel: 956, nota: 5.598, potencia: 1, qualidade: 1.031, ivTotal: 114, ivUtil: 91, shiny: true, mega: false, aoe: false, z: false, preco: 1800, vsMercado: -20, lucro: 213, veredito: "justo", indice: 18, mediana: 2237, vendas: 7, diasFeira: 2.4, poder100: 573, custoPorPoder: 3.14 }, { raridade: 58, regua: 85, nome: "Mega Charizard X", nivel: 1059, nota: 6.936, potencia: 1, qualidade: 1.471, ivTotal: 121, ivUtil: 70, shiny: true, mega: true, aoe: false, z: false, preco: 12750, vsMercado: -16, lucro: 1240, veredito: "justo", indice: 17, mediana: 15124, vendas: 7, diasFeira: 2.4, poder100: 719, custoPorPoder: 17.73 }, { raridade: null, regua: 12, nome: "Weavile", nivel: 101, nota: 4.249, potencia: 5, qualidade: 1.132, ivTotal: 90, ivUtil: 69, shiny: false, mega: false, aoe: false, z: false, preco: 95, vsMercado: -25, lucro: 16, veredito: "justo", indice: 17, mediana: 128, vendas: 11, diasFeira: 0.5, poder100: 435, custoPorPoder: 0.22 }, { raridade: 71, regua: 23, nome: "Eevee", nivel: 218, nota: 5.1, potencia: 1, qualidade: 1.057, ivTotal: 114, ivUtil: 73, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: -17, lucro: 290, veredito: "justo", indice: 15, mediana: 4211, vendas: 8, diasFeira: 6.9, poder100: 477, custoPorPoder: 7.34 }, { raridade: 94, regua: 26, nome: "Snover", nivel: 40, nota: 5.236, potencia: 2, qualidade: 0.987, ivTotal: 125, ivUtil: 80, shiny: true, mega: false, aoe: false, z: false, preco: 3200, vsMercado: -20, lucro: 400, veredito: "justo", indice: 15, mediana: 4e3, vendas: 6, diasFeira: 3.3, poder100: 491, custoPorPoder: 6.52 }, { raridade: null, regua: 0, nome: "Combee", nivel: 40, nota: 3.39, potencia: 5, qualidade: 1.058, ivTotal: 123, ivUtil: 91, shiny: false, mega: false, aoe: false, z: false, preco: 116, vsMercado: null, lucro: 86, veredito: "justo", indice: 12, mediana: 232, vendas: 2, diasFeira: 3.7, poder100: 304, custoPorPoder: 0.38 }, { raridade: 3, regua: 30, nome: "Gyarados", nivel: 1459, nota: 4.852, potencia: 5, qualidade: 1.257, ivTotal: 120, ivUtil: 91, shiny: false, mega: false, aoe: false, z: false, preco: 2600, vsMercado: null, lucro: -1512, veredito: "justo", indice: 11, mediana: 1209, vendas: 3, diasFeira: 3.1, poder100: 504, custoPorPoder: 5.16 }, { raridade: 28, regua: 6, nome: "Venusaur", nivel: 132, nota: 3.959, potencia: 5, qualidade: 1.065, ivTotal: 76, ivUtil: 65, shiny: false, mega: false, aoe: false, z: false, preco: 50, vsMercado: -39, lucro: 21, veredito: "justo", indice: 11, mediana: 82, vendas: 11, diasFeira: 3.9, poder100: 412, custoPorPoder: 0.12 }, { raridade: null, regua: 26, nome: "Exeggcute", nivel: 145, nota: 5.227, potencia: 1, qualidade: 1.072, ivTotal: 121, ivUtil: 78, shiny: true, mega: false, aoe: false, z: false, preco: 1100, vsMercado: null, lucro: 4, veredito: "justo", indice: 11, mediana: 1227, vendas: 1, diasFeira: 2.4, poder100: 489, custoPorPoder: 2.25 }, { raridade: null, regua: 44, nome: "Vespiquen", nivel: 638, nota: 5.616, potencia: 1, qualidade: 1.079, ivTotal: 113, ivUtil: 67, shiny: true, mega: false, aoe: false, z: false, preco: 999, vsMercado: -20, lucro: 126, veredito: "justo", indice: 10, mediana: 1250, vendas: 5, diasFeira: 2.5, poder100: 559, custoPorPoder: 1.79 }, { raridade: null, regua: 35, nome: "Graveler", nivel: 67, nota: 5.463, potencia: 1, qualidade: 1.099, ivTotal: 116, ivUtil: 76, shiny: true, mega: false, aoe: false, z: false, preco: 1e3, vsMercado: null, lucro: -44, veredito: "justo", indice: 9, mediana: 1062, vendas: 2, diasFeira: 2.8, poder100: 526, custoPorPoder: 1.9 }, { raridade: 92, regua: 52, nome: "Rhyperior", nivel: 105, nota: 5.784, potencia: 1, qualidade: 1.003, ivTotal: 141, ivUtil: 95, shiny: true, mega: false, aoe: false, z: false, preco: 3990, vsMercado: -14, lucro: 164, veredito: "justo", indice: 7, mediana: 4615, vendas: 6, diasFeira: 2.4, poder100: 590, custoPorPoder: 6.76 }, { raridade: null, regua: 0, nome: "Bagon", nivel: 20, nota: 3.227, potencia: 5, qualidade: 1.176, ivTotal: 66, ivUtil: 78, shiny: false, mega: false, aoe: false, z: false, preco: 180, vsMercado: null, lucro: -117, veredito: "justo", indice: 7, mediana: 72, vendas: 2, diasFeira: 1.5, poder100: 292, custoPorPoder: 0.62 }, { raridade: null, regua: 25, nome: "Exeggcute", nivel: 10, nota: 5.183, potencia: 1, qualidade: 1.018, ivTotal: 130, ivUtil: 82, shiny: true, mega: false, aoe: false, z: false, preco: 1e3, vsMercado: null, lucro: 55, veredito: "justo", indice: 5, mediana: 1172, vendas: 1, diasFeira: 2.4, poder100: 485, custoPorPoder: 2.06 }, { raridade: 13, regua: 14, nome: "Ancient Pupitar", nivel: 100, nota: 4.569, potencia: 5, qualidade: 1.298, ivTotal: 110, ivUtil: 80, shiny: false, mega: false, aoe: false, z: false, preco: 60, vsMercado: -20, lucro: 5, veredito: "justo", indice: 5, mediana: 75, vendas: 19, diasFeira: 1.4, poder100: 444, custoPorPoder: 0.14 }, { raridade: null, regua: 14, nome: "Exeggutor", nivel: 160, nota: 4.261, potencia: 5, qualidade: 1.094, ivTotal: 100, ivUtil: 70, shiny: false, mega: false, aoe: false, z: false, preco: 70, vsMercado: -23, lucro: 9, veredito: "justo", indice: 5, mediana: 91, vendas: 7, diasFeira: 1.4, poder100: 444, custoPorPoder: 0.16 }, { raridade: null, regua: 78, nome: "Mega Camerupt", nivel: 780, nota: 6.77, potencia: 1, qualidade: 1.518, ivTotal: 115, ivUtil: 84, shiny: true, mega: true, aoe: true, z: false, preco: 15e3, vsMercado: -11, lucro: 629, veredito: "justo", indice: 4, mediana: 16896, vendas: 4, diasFeira: 0.5, poder100: 693, custoPorPoder: 21.65 }, { raridade: null, regua: 36, nome: "Magcargo", nivel: 100, nota: 5.414, potencia: 1, qualidade: 1.054, ivTotal: 111, ivUtil: 76, shiny: true, mega: false, aoe: false, z: false, preco: 900, vsMercado: -15, lucro: 48, veredito: "justo", indice: 4, mediana: 1053, vendas: 7, diasFeira: 1.1, poder100: 530, custoPorPoder: 1.7 }, { raridade: null, regua: 38, nome: "Dragonair", nivel: 80, nota: 5.507, potencia: 1, qualidade: 1.01, ivTotal: 136, ivUtil: 85, shiny: true, mega: false, aoe: false, z: false, preco: 5100, vsMercado: null, lucro: 404, veredito: "justo", indice: 2, mediana: 5950, vendas: 1, diasFeira: 2.5, poder100: 538, custoPorPoder: 9.48 }, { raridade: null, regua: 28, nome: "Exeggcute", nivel: 10, nota: 5.323, potencia: 1, qualidade: 1.088, ivTotal: 125, ivUtil: 77, shiny: true, mega: false, aoe: false, z: false, preco: 1500, vsMercado: null, lucro: -240, veredito: "justo", indice: 1, mediana: 1400, vendas: 1, diasFeira: 2.5, poder100: 498, custoPorPoder: 3.01 }, { raridade: 56, regua: 16, nome: "Barboach", nivel: 40, nota: 4.908, potencia: 2, qualidade: 0.977, ivTotal: 116, ivUtil: 84, shiny: true, mega: false, aoe: false, z: false, preco: 600, vsMercado: -31, lucro: 188, veredito: "justo", indice: 1, mediana: 875, vendas: 5, diasFeira: 3.1, poder100: 451, custoPorPoder: 1.33 }, { raridade: null, regua: 49, nome: "Vileplume", nivel: 1311, nota: 5.768, potencia: 1, qualidade: 1.032, ivTotal: 141, ivUtil: 99, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: -11, lucro: 37, veredito: "justo", indice: 1, mediana: 3930, vendas: 5, diasFeira: 2.5, poder100: 579, custoPorPoder: 6.04 }, { raridade: 59, regua: 62, nome: "Tyranitar", nivel: 1950, nota: 5.999, potencia: 1, qualidade: 1.085, ivTotal: 130, ivUtil: 91, shiny: true, mega: false, aoe: true, z: false, preco: 1e4, vsMercado: 17, lucro: -2106, veredito: "justo", indice: 0, mediana: 8534, vendas: 21, diasFeira: 2.9, poder100: 629, custoPorPoder: 15.9 }, { raridade: null, regua: 65, nome: "Mega Lucario", nivel: 1355, nota: 6.133, potencia: 1, qualidade: 1.116, ivTotal: 125, ivUtil: 95, shiny: true, mega: true, aoe: false, z: true, preco: 17351, vsMercado: 26, lucro: -4601, veredito: "justo", indice: 0, mediana: 13784, vendas: 4, diasFeira: 2.5, poder100: 642, custoPorPoder: 27.03 }, { raridade: 27, regua: 40, nome: "Larvitar", nivel: 101, nota: 5.893, potencia: 1, qualidade: 1.343, ivTotal: 127, ivUtil: 91, shiny: true, mega: false, aoe: false, z: false, preco: 8e3, vsMercado: 7, lucro: -1070, veredito: "justo", indice: 0, mediana: 7492, vendas: 26, diasFeira: 2.5, poder100: 544, custoPorPoder: 14.71 }, { raridade: 98, regua: 4, nome: "Bulbasaur", nivel: 20, nota: 4.337, potencia: 1, qualidade: 0.833, ivTotal: 112, ivUtil: 94, shiny: true, mega: false, aoe: false, z: false, preco: 1700, vsMercado: 15, lucro: -373, veredito: "justo", indice: 0, mediana: 1474, vendas: 7, diasFeira: 0.3, poder100: 404, custoPorPoder: 4.21 }, { raridade: 63, regua: 52, nome: "Blastoise", nivel: 1002, nota: 5.762, potencia: 1, qualidade: 1.049, ivTotal: 128, ivUtil: 81, shiny: true, mega: false, aoe: false, z: false, preco: 8150, vsMercado: 22, lucro: -1950, veredito: "justo", indice: 0, mediana: 6703, vendas: 8, diasFeira: 0.1, poder100: 590, custoPorPoder: 13.81 }, { raridade: null, regua: 43, nome: "Tentacruel", nivel: 1835, nota: 5.464, potencia: 1, qualidade: 0.899, ivTotal: 146, ivUtil: 86, shiny: true, mega: false, aoe: false, z: false, preco: 3850, vsMercado: 53, lucro: -1590, veredito: "justo", indice: 0, mediana: 2511, vendas: 4, diasFeira: 0, poder100: 556, custoPorPoder: 6.92 }, { raridade: 42, regua: 56, nome: "Venusaur", nivel: 854, nota: 5.937, potencia: 3, qualidade: 1.036, ivTotal: 115, ivUtil: 78, shiny: true, mega: false, aoe: false, z: false, preco: 7e3, vsMercado: 4, lucro: -756, veredito: "justo", indice: 0, mediana: 6750, vendas: 12, diasFeira: 0, poder100: 605, custoPorPoder: 11.57 }, { raridade: 58, regua: 83, nome: "Mega Dragonite", nivel: 2471, nota: 6.749, potencia: 1, qualidade: 1.287, ivTotal: 130, ivUtil: 92, shiny: true, mega: true, aoe: true, z: true, preco: 14e3, vsMercado: -33, lucro: 5368, veredito: "bom", indice: 100, mediana: 20938, vendas: 10, diasFeira: 3, poder100: 712, custoPorPoder: 19.66 }, { raridade: 44, regua: 29, nome: "Larvitar", nivel: 375, nota: 5.437, potencia: 1, qualidade: 1.145, ivTotal: 129, ivUtil: 91, shiny: true, mega: false, aoe: false, z: false, preco: 4499, vsMercado: -14, lucro: 354, veredito: "bom", indice: 99, mediana: 5247, vendas: 49, diasFeira: 2.2, poder100: 502, custoPorPoder: 8.96 }, { raridade: 32, regua: 63, nome: "Charizard", nivel: 364, nota: 6.238, potencia: 2, qualidade: 1.153, ivTotal: 130, ivUtil: 72, shiny: true, mega: false, aoe: false, z: false, preco: 5500, vsMercado: -50, lucro: 4607, veredito: "bom", indice: 80, mediana: 10926, vendas: 19, diasFeira: 2.5, poder100: 636, custoPorPoder: 8.65 }, { raridade: 37, regua: 75, nome: "Mega Charizard Y", nivel: 3443, nota: 6.524, potencia: 1, qualidade: 1.313, ivTotal: 113, ivUtil: 70, shiny: true, mega: true, aoe: true, z: false, preco: 15500, vsMercado: -35, lucro: 6513, veredito: "bom", indice: 68, mediana: 23798, vendas: 9, diasFeira: 3, poder100: 682, custoPorPoder: 22.73 }, { raridade: 75, regua: 35, nome: "Onix", nivel: 183, nota: 5.452, potencia: 1, qualidade: 1.068, ivTotal: 124, ivUtil: 72, shiny: true, mega: false, aoe: false, z: false, preco: 1250, vsMercado: -48, lucro: 922, veredito: "bom", indice: 65, mediana: 2413, vendas: 9, diasFeira: 2, poder100: 524, custoPorPoder: 2.39 }, { raridade: null, regua: 38, nome: "Mega Scizor", nivel: 1129, nota: 5.078, potencia: 5, qualidade: 1.379, ivTotal: 98, ivUtil: 70, shiny: false, mega: true, aoe: false, z: false, preco: 1128, vsMercado: -36, lucro: 446, veredito: "bom", indice: 64, mediana: 1749, vendas: 9, diasFeira: 3.2, poder100: 537, custoPorPoder: 2.1 }, { raridade: 16, regua: 4, nome: "Camerupt", nivel: 100, nota: 4.083, potencia: 5, qualidade: 1.012, ivTotal: 116, ivUtil: 88, shiny: false, mega: false, aoe: false, z: false, preco: 79, vsMercado: -1, lucro: -9, veredito: "bom", indice: 64, mediana: 80, vendas: 9, diasFeira: 0.5, poder100: 405, custoPorPoder: 0.2 }, { raridade: 92, regua: 14, nome: "Dratini", nivel: 30, nota: 4.785, potencia: 1, qualidade: 0.989, ivTotal: 113, ivUtil: 79, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: null, lucro: -1983, veredito: "bom", indice: 60, mediana: 1686, vendas: 3, diasFeira: 5.1, poder100: 442, custoPorPoder: 7.92 }, { raridade: 16, regua: 4, nome: "Camerupt", nivel: 100, nota: 4.078, potencia: 5, qualidade: 1.03, ivTotal: 110, ivUtil: 85, shiny: false, mega: false, aoe: false, z: false, preco: 80, vsMercado: 0, lucro: -10, veredito: "bom", indice: 59, mediana: 80, vendas: 9, diasFeira: 3.2, poder100: 404, custoPorPoder: 0.2 }, { raridade: 13, regua: 9, nome: "Charizard", nivel: 497, nota: 4.039, potencia: 5, qualidade: 1.001, ivTotal: 104, ivUtil: 88, shiny: false, mega: false, aoe: false, z: false, preco: 200, vsMercado: -22, lucro: 23, veredito: "bom", indice: 59, mediana: 256, vendas: 31, diasFeira: 2.9, poder100: 424, custoPorPoder: 0.47 }, { raridade: 46, regua: 55, nome: "Camerupt", nivel: 100, nota: 6.076, potencia: 1, qualidade: 1.221, ivTotal: 129, ivUtil: 82, shiny: true, mega: false, aoe: false, z: false, preco: 4495, vsMercado: -3, lucro: -332, veredito: "bom", indice: 59, mediana: 4625, vendas: 9, diasFeira: 6, poder100: 602, custoPorPoder: 7.47 }, { raridade: 56, regua: 55, nome: "Jynx", nivel: 664, nota: 6.063, potencia: 2, qualidade: 1.208, ivTotal: 115, ivUtil: 74, shiny: true, mega: false, aoe: false, z: false, preco: 4e3, vsMercado: -29, lucro: 1197, veredito: "bom", indice: 59, mediana: 5618, vendas: 10, diasFeira: 1.1, poder100: 601, custoPorPoder: 6.66 }, { raridade: 63, regua: 29, nome: "Numel", nivel: 50, nota: 5.456, potencia: 2, qualidade: 1.127, ivTotal: 117, ivUtil: 73, shiny: true, mega: false, aoe: false, z: false, preco: 2199, vsMercado: -10, lucro: 2, veredito: "bom", indice: 56, mediana: 2446, vendas: 7, diasFeira: 2.8, poder100: 502, custoPorPoder: 4.38 }, { raridade: null, regua: 10, nome: "Flareon", nivel: 80, nota: 4.102, potencia: 5, qualidade: 1.072, ivTotal: 90, ivUtil: 86, shiny: false, mega: false, aoe: false, z: false, preco: 150, vsMercado: -70, lucro: 285, veredito: "bom", indice: 55, mediana: 500, vendas: 7, diasFeira: 2.4, poder100: 427, custoPorPoder: 0.35 }, { raridade: 36, regua: 60, nome: "Charizard", nivel: 1e3, nota: 6.111, potencia: 1, qualidade: 1.208, ivTotal: 118, ivUtil: 80, shiny: true, mega: false, aoe: false, z: false, preco: 6500, vsMercado: -11, lucro: 248, veredito: "bom", indice: 54, mediana: 7295, vendas: 45, diasFeira: 1.2, poder100: 623, custoPorPoder: 10.43 }, { raridade: 54, regua: 8, nome: "Magikarp", nivel: 30, nota: 4.792, potencia: 2, qualidade: 1.054, ivTotal: 121, ivUtil: 87, shiny: true, mega: false, aoe: false, z: false, preco: 4e3, vsMercado: -2, lucro: -314, veredito: "bom", indice: 54, mediana: 4096, vendas: 4, diasFeira: 1.1, poder100: 418, custoPorPoder: 9.57 }, { raridade: 45, regua: 29, nome: "Larvitar", nivel: 812, nota: 5.425, potencia: 1, qualidade: 1.06, ivTotal: 147, ivUtil: 96, shiny: true, mega: false, aoe: false, z: false, preco: 5499, vsMercado: -1, lucro: -361, veredito: "bom", indice: 54, mediana: 5555, vendas: 50, diasFeira: 0.1, poder100: 501, custoPorPoder: 10.98 }, { raridade: 82, regua: 58, nome: "Glaceon", nivel: 1709, nota: 6.081, potencia: 3, qualidade: 1.088, ivTotal: 113, ivUtil: 83, shiny: true, mega: false, aoe: false, z: false, preco: 7719, vsMercado: -30, lucro: 2479, veredito: "bom", indice: 53, mediana: 11025, vendas: 4, diasFeira: 4, poder100: 616, custoPorPoder: 12.53 }, { raridade: null, regua: 58, nome: "Gengar", nivel: 100, nota: 6.081, potencia: 2, qualidade: 1.065, ivTotal: 146, ivUtil: 76, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: -31, lucro: 1706, veredito: "bom", indice: 53, mediana: 7250, vendas: 6, diasFeira: 2.9, poder100: 613, custoPorPoder: 8.16 }, { raridade: null, regua: 42, nome: "Abomasnow", nivel: 100, nota: 5.491, potencia: 1, qualidade: 1.02, ivTotal: 113, ivUtil: 87, shiny: true, mega: false, aoe: false, z: false, preco: 1950, vsMercado: null, lucro: -53, veredito: "bom", indice: 53, mediana: 2108, vendas: 3, diasFeira: 1.4, poder100: 553, custoPorPoder: 3.53 }, { raridade: 23, regua: 72, nome: "Rhyperior", nivel: 1425, nota: 6.609, potencia: 1, qualidade: 1.43, ivTotal: 119, ivUtil: 74, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: -40, lucro: 2736, veredito: "bom", indice: 52, mediana: 8363, vendas: 6, diasFeira: 2.1, poder100: 671, custoPorPoder: 7.45 }, { raridade: 73, regua: 57, nome: "Tyranitar", nivel: 543, nota: 5.833, potencia: 1, qualidade: 1.042, ivTotal: 123, ivUtil: 78, shiny: true, mega: false, aoe: false, z: false, preco: 4500, vsMercado: -14, lucro: 339, veredito: "bom", indice: 49, mediana: 5231, vendas: 27, diasFeira: 8.3, poder100: 612, custoPorPoder: 7.35 }, { raridade: 48, regua: 3, nome: "Gyarados", nivel: 104, nota: 3.765, potencia: 5, qualidade: 1.054, ivTotal: 59, ivUtil: 71, shiny: false, mega: false, aoe: false, z: false, preco: 500, vsMercado: null, lucro: -404, veredito: "bom", indice: 48, mediana: 110, vendas: 3, diasFeira: 15.3, poder100: 399, custoPorPoder: 1.25 }, { raridade: 10, regua: 19, nome: "Tyranitar", nivel: 649, nota: 4.188, potencia: 5, qualidade: 1.054, ivTotal: 96, ivUtil: 70, shiny: false, mega: false, aoe: false, z: false, preco: 315, vsMercado: -10, lucro: -10, veredito: "bom", indice: 48, mediana: 351, vendas: 24, diasFeira: 1.8, poder100: 461, custoPorPoder: 0.68 }, { raridade: 5, regua: 32, nome: "Brave Charizard", nivel: 100, nota: 4.975, potencia: 5, qualidade: 1.382, ivTotal: 105, ivUtil: 89, shiny: false, mega: false, aoe: false, z: false, preco: 250, vsMercado: -72, lucro: 561, veredito: "bom", indice: 48, mediana: 901, vendas: 5, diasFeira: 0.3, poder100: 515, custoPorPoder: 0.49 }, { raridade: 25, regua: 19, nome: "Sceptile", nivel: 284, nota: 4.443, potencia: 5, qualidade: 1.082, ivTotal: 124, ivUtil: 84, shiny: false, mega: false, aoe: false, z: false, preco: 260, vsMercado: -73, lucro: 597, veredito: "bom", indice: 47, mediana: 952, vendas: 8, diasFeira: 0.6, poder100: 462, custoPorPoder: 0.56 }, { raridade: null, regua: 0, nome: "Carvanha", nivel: 40, nota: 3.408, potencia: 5, qualidade: 1.017, ivTotal: 110, ivUtil: 86, shiny: false, mega: false, aoe: false, z: false, preco: 345, vsMercado: null, lucro: null, veredito: "bom", indice: 46, mediana: null, vendas: 0, diasFeira: 0.8, poder100: 316, custoPorPoder: 1.09 }, { raridade: 56, regua: 56, nome: "Charizard", nivel: 1040, nota: 5.933, potencia: 3, qualidade: 1.013, ivTotal: 121, ivUtil: 76, shiny: true, mega: false, aoe: false, z: false, preco: 9e3, vsMercado: -27, lucro: 2442, veredito: "bom", indice: 46, mediana: 12370, vendas: 4, diasFeira: 0.6, poder100: 607, custoPorPoder: 14.83 }, { raridade: 50, regua: 24, nome: "Mega Charizard Y", nivel: 1079, nota: 4.315, potencia: 5, qualidade: 1.062, ivTotal: 104, ivUtil: 68, shiny: false, mega: true, aoe: false, z: false, preco: 900, vsMercado: -53, lucro: 815, veredito: "bom", indice: 45, mediana: 1906, vendas: 5, diasFeira: 1.4, poder100: 483, custoPorPoder: 1.86 }, { raridade: 87, regua: 18, nome: "Numel", nivel: 182, nota: 4.991, potencia: 2, qualidade: 0.922, ivTotal: 128, ivUtil: 84, shiny: true, mega: false, aoe: false, z: false, preco: 1150, vsMercado: -56, lucro: 1190, veredito: "bom", indice: 45, mediana: 2600, vendas: 7, diasFeira: 1.6, poder100: 460, custoPorPoder: 2.5 }, { raridade: 6, regua: 17, nome: "Charizard", nivel: 80, nota: 4.368, potencia: 5, qualidade: 1.152, ivTotal: 95, ivUtil: 69, shiny: false, mega: false, aoe: false, z: false, preco: 248, vsMercado: -19, lucro: 18, veredito: "bom", indice: 43, mediana: 306, vendas: 40, diasFeira: 2.3, poder100: 456, custoPorPoder: 0.54 }, { raridade: 13, regua: 9, nome: "Charizard", nivel: 171, nota: 4.011, potencia: 5, qualidade: 1.063, ivTotal: 82, ivUtil: 67, shiny: false, mega: false, aoe: false, z: false, preco: 100, vsMercado: -56, lucro: 97, veredito: "bom", indice: 43, mediana: 226, vendas: 30, diasFeira: 0.5, poder100: 422, custoPorPoder: 0.24 }, { raridade: 75, regua: 0, nome: "Camerupt", nivel: 233, nota: 3.581, potencia: 5, qualidade: 0.975, ivTotal: 77, ivUtil: 72, shiny: false, mega: false, aoe: false, z: false, preco: 35, vsMercado: -7, lucro: -2, veredito: "bom", indice: 43, mediana: 38, vendas: 5, diasFeira: 2.1, poder100: 355, custoPorPoder: 0.1 }, { raridade: 12, regua: 73, nome: "Venusaur", nivel: 1685, nota: 6.664, potencia: 1, qualidade: 1.452, ivTotal: 120, ivUtil: 91, shiny: true, mega: false, aoe: false, z: false, preco: 12e3, vsMercado: -21, lucro: 2049, veredito: "bom", indice: 43, mediana: 15188, vendas: 8, diasFeira: 6.7, poder100: 672, custoPorPoder: 17.86 }, { raridade: 6, regua: 30, nome: "Tyranitar", nivel: 140, nota: 4.683, potencia: 5, qualidade: 1.283, ivTotal: 87, ivUtil: 69, shiny: false, mega: false, aoe: false, z: false, preco: 395, vsMercado: -44, lucro: 235, veredito: "bom", indice: 42, mediana: 700, vendas: 18, diasFeira: 0.4, poder100: 507, custoPorPoder: 0.78 }, { raridade: 10, regua: 20, nome: "Tyranitar", nivel: 168, nota: 4.249, potencia: 5, qualidade: 1.074, ivTotal: 97, ivUtil: 69, shiny: false, mega: false, aoe: false, z: false, preco: 319, vsMercado: -4, lucro: -31, veredito: "bom", indice: 41, mediana: 331, vendas: 25, diasFeira: 2.5, poder100: 466, custoPorPoder: 0.68 }, { raridade: 6, regua: 29, nome: "Dragonite", nivel: 114, nota: 4.629, potencia: 5, qualidade: 1.377, ivTotal: 57, ivUtil: 80, shiny: false, mega: false, aoe: false, z: false, preco: 350, vsMercado: -26, lucro: 62, veredito: "bom", indice: 40, mediana: 474, vendas: 5, diasFeira: 3.1, poder100: 501, custoPorPoder: 0.7 }, { raridade: null, regua: 0, nome: "Numel", nivel: 40, nota: 3.263, potencia: 5, qualidade: 1.154, ivTotal: 71, ivUtil: 74, shiny: false, mega: false, aoe: false, z: false, preco: 400, vsMercado: null, lucro: -367, veredito: "bom", indice: 40, mediana: 38, vendas: 2, diasFeira: 0, poder100: 298, custoPorPoder: 1.34 }, { raridade: 63, regua: 54, nome: "Charizard", nivel: 80, nota: 5.855, potencia: 2, qualidade: 1.011, ivTotal: 131, ivUtil: 78, shiny: true, mega: false, aoe: false, z: false, preco: 4250, vsMercado: -24, lucro: 944, veredito: "bom", indice: 40, mediana: 5615, vendas: 19, diasFeira: 2.9, poder100: 600, custoPorPoder: 7.08 }, { raridade: 100, regua: 5, nome: "Numel", nivel: 40, nota: 4.413, potencia: 1, qualidade: 0.808, ivTotal: 127, ivUtil: 98, shiny: true, mega: false, aoe: false, z: false, preco: 1e3, vsMercado: null, lucro: -290, veredito: "bom", indice: 40, mediana: 789, vendas: 3, diasFeira: 3.1, poder100: 406, custoPorPoder: 2.46 }, { raridade: null, regua: 63, nome: "Mega Blaziken", nivel: 1836, nota: 6.034, potencia: 1, qualidade: 1.06, ivTotal: 132, ivUtil: 92, shiny: true, mega: true, aoe: true, z: true, preco: 15e3, vsMercado: -22, lucro: 2677, veredito: "bom", indice: 38, mediana: 19110, vendas: 4, diasFeira: 1.3, poder100: 635, custoPorPoder: 23.62 }, { raridade: null, regua: 50, nome: "Rhydon", nivel: 100, nota: 5.826, potencia: 2, qualidade: 1.055, ivTotal: 123, ivUtil: 75, shiny: true, mega: false, aoe: false, z: false, preco: 1700, vsMercado: -31, lucro: 525, veredito: "bom", indice: 37, mediana: 2472, vendas: 5, diasFeira: 0.2, poder100: 584, custoPorPoder: 2.91 }, { raridade: 92, regua: 20, nome: "Dratini", nivel: 30, nota: 5.059, potencia: 1, qualidade: 1.092, ivTotal: 111, ivUtil: 82, shiny: true, mega: false, aoe: false, z: false, preco: 1800, vsMercado: null, lucro: 167, veredito: "bom", indice: 37, mediana: 2185, vendas: 3, diasFeira: 0.3, poder100: 467, custoPorPoder: 3.85 }, { raridade: null, regua: 32, nome: "Pikachu", nivel: 73, nota: 5.506, potencia: 1, qualidade: 1.085, ivTotal: 143, ivUtil: 81, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: null, lucro: -2857, veredito: "bom", indice: 36, mediana: 2381, vendas: 2, diasFeira: 0.5, poder100: 514, custoPorPoder: 9.73 }, { raridade: 28, regua: 32, nome: "Barboach", nivel: 40, nota: 5.606, potencia: 1, qualidade: 1.274, ivTotal: 120, ivUtil: 62, shiny: true, mega: false, aoe: false, z: false, preco: 1100, vsMercado: -12, lucro: 25, veredito: "bom", indice: 35, mediana: 1250, vendas: 4, diasFeira: 2.3, poder100: 515, custoPorPoder: 2.14 }, { raridade: 92, regua: 72, nome: "Mega Dragonite", nivel: 891, nota: 6.222, potencia: 1, qualidade: 1.086, ivTotal: 134, ivUtil: 98, shiny: true, mega: true, aoe: false, z: false, preco: 8800, vsMercado: -31, lucro: 2920, veredito: "otimo", indice: 77, mediana: 12670, vendas: 5, diasFeira: 0.1, poder100: 668, custoPorPoder: 13.17 }, { raridade: 17, regua: 73, nome: "Tyranitar", nivel: 1628, nota: 6.5, potencia: 1, qualidade: 1.284, ivTotal: 129, ivUtil: 69, shiny: true, mega: false, aoe: true, z: false, preco: 11500, vsMercado: -21, lucro: 1905, veredito: "otimo", indice: 72, mediana: 14492, vendas: 21, diasFeira: 1.2, poder100: 675, custoPorPoder: 17.04 }, { raridade: null, regua: 58, nome: "Mega Venusaur", nivel: 1137, nota: 5.81, potencia: 1, qualidade: 1.054, ivTotal: 111, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 5600, vsMercado: -72, lucro: 12900, veredito: "otimo", indice: null, mediana: 2e4, vendas: 5, diasFeira: 0.35084601851851854, poder100: 616, custoPorPoder: 9.09 }, { raridade: 66, regua: 0, nome: "Gengar", nivel: 372, nota: 3.547, potencia: 2, qualidade: 1.739, ivTotal: 115, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 35, vsMercado: -39, lucro: 15, veredito: "otimo", indice: null, mediana: 58, vendas: 34, diasFeira: 0.17699429398148148, poder100: 362, custoPorPoder: 0.1 }, { raridade: null, regua: 0, nome: "Honchkrow", nivel: 100, nota: 3.517, potencia: 2, qualidade: 1.8, ivTotal: 100, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 24, vsMercado: -95, lucro: 445, veredito: "otimo", indice: null, mediana: 521, vendas: 8, diasFeira: 0.27739230324074077, poder100: 361, custoPorPoder: 0.07 }, { raridade: null, regua: 64, nome: "Mega Gyarados", nivel: 2474, nota: 6.057, potencia: 1, qualidade: 1.117, ivTotal: 114, ivUtil: null, shiny: true, mega: true, aoe: false, z: true, preco: 8e3, vsMercado: -48, lucro: 6343, veredito: "otimo", indice: null, mediana: 15506, vendas: 6, diasFeira: 0.03341, poder100: 640, custoPorPoder: 12.5 }, { raridade: null, regua: 2, nome: "Mega Gengar", nivel: 617, nota: 3.62, potencia: 3, qualidade: 1.345, ivTotal: 180, ivUtil: null, shiny: false, mega: true, aoe: false, z: false, preco: 1e3, vsMercado: -59, lucro: 1192, veredito: "otimo", indice: null, mediana: 2436, vendas: 5, diasFeira: 0.2684209953703704, poder100: 395, custoPorPoder: 2.53 }, { raridade: 58, regua: 83, nome: "Mega Dragonite", nivel: 2471, nota: 6.749, potencia: 1, qualidade: 1.287, ivTotal: 130, ivUtil: null, shiny: true, mega: true, aoe: true, z: false, preco: 14e3, vsMercado: -32, lucro: 10587, veredito: "otimo", indice: null, mediana: 26580, vendas: 6, diasFeira: 0, poder100: 712, custoPorPoder: 19.66 }, { raridade: null, regua: 13, nome: "Mega Garchomp", nivel: 814, nota: 3.667, potencia: 4, qualidade: 1.358, ivTotal: 127, ivUtil: null, shiny: false, mega: true, aoe: false, z: false, preco: 600, vsMercado: -69, lucro: 1425, veredito: "otimo", indice: null, mediana: 2250, vendas: 4, diasFeira: 0.21970756944444444, poder100: 438, custoPorPoder: 1.37 }, { raridade: 64, regua: 48, nome: "Exeggutor", nivel: 1189, nota: 5.621, potencia: 1, qualidade: 1.013, ivTotal: 121, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2250, vsMercado: -37, lucro: 675, veredito: "otimo", indice: null, mediana: 3250, vendas: 8, diasFeira: 0.3653008101851852, poder100: 574, custoPorPoder: 3.92 }, { raridade: null, regua: 17, nome: "Mega Gengar", nivel: 776, nota: 4.153, potencia: 4, qualidade: 1.711, ivTotal: 113, ivUtil: null, shiny: false, mega: true, aoe: false, z: false, preco: 1550, vsMercado: -32, lucro: 761, veredito: "otimo", indice: null, mediana: 2568, vendas: 6, diasFeira: 0.0590880787037037, poder100: 455, custoPorPoder: 3.41 }, { raridade: null, regua: 5, nome: "Mega Gengar", nivel: 150, nota: 3.727, potencia: 4, qualidade: 1.288, ivTotal: 156, ivUtil: null, shiny: false, mega: true, aoe: false, z: false, preco: 1128, vsMercado: -54, lucro: 1064, veredito: "otimo", indice: null, mediana: 2436, vendas: 8, diasFeira: 0.8021337268518518, poder100: 408, custoPorPoder: 2.76 }, { raridade: 81, regua: 0, nome: "Gyarados", nivel: 110, nota: 3.557, potencia: 3, qualidade: 1.71, ivTotal: 105, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 10, vsMercado: -51, lucro: 7, veredito: "otimo", indice: null, mediana: 20, vendas: 5, diasFeira: 0.056376863425925926, poder100: 381, custoPorPoder: 0.03 }, { raridade: 86, regua: 0, nome: "Gengar", nivel: 340, nota: 3.518, potencia: 2, qualidade: 1.777, ivTotal: 106, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 45, vsMercado: -69, lucro: 96, veredito: "otimo", indice: null, mediana: 162, vendas: 24, diasFeira: 1.2214524768518518, poder100: 360, custoPorPoder: 0.13 }, { raridade: 78, regua: 0, nome: "Gengar", nivel: 229, nota: 3.526, potencia: 1, qualidade: 1.8, ivTotal: 119, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 25, vsMercado: -54, lucro: 32, veredito: "otimo", indice: null, mediana: 65, vendas: 28, diasFeira: 1.2558841319444445, poder100: 359, custoPorPoder: 0.07 }, { raridade: 92, regua: 72, nome: "Mega Dragonite", nivel: 1522, nota: 6.26, potencia: 2, qualidade: 1.077, ivTotal: 119, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 12e3, vsMercado: -30, lucro: 3950, veredito: "otimo", indice: null, mediana: 17243, vendas: 4, diasFeira: 0.014141064814814815, poder100: 671, custoPorPoder: 17.88 }, { raridade: 87, regua: 18, nome: "Numel", nivel: 181, nota: 4.991, potencia: 2, qualidade: 0.922, ivTotal: 128, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1200, vsMercado: -12, lucro: 24, veredito: "otimo", indice: null, mediana: 1360, vendas: 7, diasFeira: 0.09442854166666667, poder100: 459, custoPorPoder: 2.61 }, { raridade: 26, regua: 2, nome: "Charizard", nivel: 1010, nota: 3.767, potencia: 4, qualidade: 1.473, ivTotal: 126, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 90, vsMercado: -21, lucro: 9, veredito: "otimo", indice: null, mediana: 114, vendas: 20, diasFeira: 0.1412464699074074, poder100: 397, custoPorPoder: 0.23 }, { raridade: null, regua: 27, nome: "Forretress", nivel: 80, nota: 4.951, potencia: 1, qualidade: 0.807, ivTotal: 131, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 800, vsMercado: -70, lucro: 2192, veredito: "otimo", indice: null, mediana: 3324, vendas: 4, diasFeira: 0.09463805555555556, poder100: 492, custoPorPoder: 1.63 }, { raridade: 54, regua: 63, nome: "Tyranitar", nivel: 685, nota: 6.056, potencia: 1, qualidade: 1.131, ivTotal: 122, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: -23, lucro: 2513, veredito: "otimo", indice: null, mediana: 6500, vendas: 14, diasFeira: 0.1564156597222222, poder100: 634, custoPorPoder: 5.52 }, { raridade: 63, regua: 0, nome: "Larvitar", nivel: 22, nota: 3.225, potencia: 5, qualidade: 1.015, ivTotal: 99, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 150, vsMercado: -21, lucro: 14, veredito: "otimo", indice: null, mediana: 189, vendas: 14, diasFeira: 0.059849733796296295, poder100: 297, custoPorPoder: 0.51 }, { raridade: 17, regua: 73, nome: "Tyranitar", nivel: 1628, nota: 6.5, potencia: 1, qualidade: 1.284, ivTotal: 129, ivUtil: null, shiny: true, mega: false, aoe: true, z: false, preco: 11500, vsMercado: -21, lucro: 1905, veredito: "otimo", indice: null, mediana: 14492, vendas: 37, diasFeira: 0.10006224537037037, poder100: 675, custoPorPoder: 17.04 }, { raridade: 91, regua: 15, nome: "Larvitar", nivel: 236, nota: 4.822, potencia: 1, qualidade: 0.919, ivTotal: 133, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1900, vsMercado: 33, lucro: -550, veredito: "otimo", indice: null, mediana: 1500, vendas: 5, diasFeira: 0.17299614583333334, poder100: 445, custoPorPoder: 4.27 }, { raridade: 67, regua: 33, nome: "Snover", nivel: 40, nota: 5.516, potencia: 1, qualidade: 1.147, ivTotal: 126, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 4999, vsMercado: 32, lucro: -1511, veredito: "otimo", indice: null, mediana: 3875, vendas: 6, diasFeira: 0.17360177083333334, poder100: 518, custoPorPoder: 9.65 }, { raridade: 5, regua: 22, nome: "Charizard", nivel: 358, nota: 4.545, potencia: 5, qualidade: 1.264, ivTotal: 85, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 450, vsMercado: -27, lucro: 101, veredito: "otimo", indice: null, mediana: 612, vendas: 7, diasFeira: 0.146408125, poder100: 473, custoPorPoder: 0.95 }, { raridade: 94, regua: 26, nome: "Snover", nivel: 40, nota: 5.236, potencia: 2, qualidade: 0.987, ivTotal: 125, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3200, vsMercado: -10, lucro: 288, veredito: "otimo", indice: null, mediana: 3875, vendas: 6, diasFeira: 0.09407241898148148, poder100: 491, custoPorPoder: 6.52 }, { raridade: null, regua: 64, nome: "Mega Venusaur", nivel: 728, nota: 6.049, potencia: 1, qualidade: 1.124, ivTotal: 117, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 5e3, vsMercado: -70, lucro: 13500, veredito: "otimo", indice: null, mediana: 2e4, vendas: 5, diasFeira: 0.10097570601851852, poder100: 638, custoPorPoder: 7.84 }, { raridade: 62, regua: 51, nome: "Venusaur", nivel: 1332, nota: 5.764, potencia: 1, qualidade: 1.072, ivTotal: 121, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 5950, vsMercado: -25, lucro: 1450, veredito: "otimo", indice: null, mediana: 8e3, vendas: 4, diasFeira: 0.035416747685185185, poder100: 588, custoPorPoder: 10.12 }, { raridade: 69, regua: 27, nome: "Dratini", nivel: 30, nota: 5.364, potencia: 1, qualidade: 1.026, ivTotal: 150, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1e7, vsMercado: -42, lucro: -9994450, veredito: "otimo", indice: null, mediana: 6e3, vendas: 7, diasFeira: 0.1798690162037037, poder100: 495, custoPorPoder: 20202.02 }, { raridade: null, regua: 16, nome: "Mankey", nivel: 124, nota: 4.852, potencia: 1, qualidade: 0.988, ivTotal: 117, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1100, lucro: -290, veredito: "otimo", indice: null, mediana: 900, vendas: 3, diasFeira: 0.09356990740740741, poder100: 449, custoPorPoder: 2.45 }, { raridade: 58, regua: 85, nome: "Mega Charizard X", nivel: 1059, nota: 6.936, potencia: 1, qualidade: 1.471, ivTotal: 121, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 12200, vsMercado: -28, lucro: 4913, veredito: "otimo", indice: null, mediana: 18500, vendas: 8, diasFeira: 0.36578471064814816, poder100: 719, custoPorPoder: 16.97 }, { raridade: 94, regua: 20, nome: "Snover", nivel: 280, nota: 4.963, potencia: 1, qualidade: 0.935, ivTotal: 130, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2400, vsMercado: -38, lucro: 1088, veredito: "otimo", indice: null, mediana: 3875, vendas: 6, diasFeira: 0.22252150462962964, poder100: 466, custoPorPoder: 5.15 }, { raridade: 44, regua: 46, nome: "Snover", nivel: 400, nota: 6.072, potencia: 1, qualidade: 1.414, ivTotal: 119, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: -39, lucro: 3325, veredito: "otimo", indice: null, mediana: 9e3, vendas: 6, diasFeira: 0.050300717592592595, poder100: 569, custoPorPoder: 8.79 }, { raridade: null, regua: 53, nome: "Annihilape", nivel: 1901, nota: 5.854, potencia: 1, qualidade: 1.107, ivTotal: 116, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 4e3, vsMercado: -54, lucro: 7100, veredito: "otimo", indice: null, mediana: 12e3, vendas: 4, diasFeira: 0.09277665509259259, poder100: 597, custoPorPoder: 6.7 }, { raridade: 61, regua: 23, nome: "Gastly", nivel: 495, nota: 5.124, potencia: 1, qualidade: 1.021, ivTotal: 129, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2199, vsMercado: -14, lucro: 95, veredito: "otimo", indice: null, mediana: 2549, vendas: 8, diasFeira: 0.2908896180555556, poder100: 476, custoPorPoder: 4.62 }, { raridade: null, regua: 54, nome: "Mega Alakazam", nivel: 849, nota: 5.677, potencia: 1, qualidade: 1.021, ivTotal: 112, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 4400, vsMercado: -74, lucro: 11325, veredito: "excepcional", indice: null, mediana: 17e3, vendas: 5, diasFeira: 0.2946814583333333, poder100: 598, custoPorPoder: 7.36 }, { raridade: null, regua: 44, nome: "Rhyhorn", nivel: 30, nota: 5.95, potencia: 2, qualidade: 1.302, ivTotal: 113, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: 89, lucro: -1835, veredito: "otimo", indice: null, mediana: 1850, vendas: 4, diasFeira: 0.2977886111111111, poder100: 561, custoPorPoder: 6.24 }, { raridade: 54, regua: 61, nome: "Rhyperior", nivel: 488, nota: 6.126, potencia: 1, qualidade: 1.156, ivTotal: 135, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 4130, vsMercado: -42, lucro: 2576, veredito: "otimo", indice: null, mediana: 7250, vendas: 10, diasFeira: 0.016698125, poder100: 625, custoPorPoder: 6.61 }, { raridade: 93, regua: 9, nome: "Larvitar", nivel: 66, nota: 4.589, potencia: 1, qualidade: 0.872, ivTotal: 127, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2e3, vsMercado: 67, lucro: -920, veredito: "otimo", indice: null, mediana: 1200, vendas: 16, diasFeira: 0.09398664351851851, poder100: 423, custoPorPoder: 4.73 }, { raridade: 56, regua: 23, nome: "Gastly", nivel: 20, nota: 5.151, potencia: 1, qualidade: 1.048, ivTotal: 125, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2e3, vsMercado: 18, lucro: 294, veredito: "otimo", indice: null, mediana: 2549, vendas: 8, diasFeira: 0.2897535185185185, poder100: 478, custoPorPoder: 4.18 }, { raridade: 76, regua: 19, nome: "Larvitar", nivel: 20, nota: 4.995, potencia: 1, qualidade: 1.055, ivTotal: 114, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2500, vsMercado: 20, lucro: -250, veredito: "otimo", indice: null, mediana: 2500, vendas: 10, diasFeira: 0.06465736111111112, poder100: 461, custoPorPoder: 5.42 }, { raridade: 28, regua: 32, nome: "Barboach", nivel: 40, nota: 5.606, potencia: 1, qualidade: 1.274, ivTotal: 120, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1100, vsMercado: -30, lucro: 957, veredito: "otimo", indice: null, mediana: 2285, vendas: 4, diasFeira: 0.21014454861111112, poder100: 514, custoPorPoder: 2.14 }, { raridade: 100, regua: 4, nome: "Numel", nivel: 40, nota: 4.413, potencia: 1, qualidade: 0.808, ivTotal: 127, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1050, vsMercado: -22, lucro: 226, veredito: "otimo", indice: null, mediana: 1418, vendas: 4, diasFeira: 0.09642753472222222, poder100: 405, custoPorPoder: 2.59 }, { raridade: 30, regua: 39, nome: "Numel", nivel: 40, nota: 5.859, potencia: 1, qualidade: 1.367, ivTotal: 116, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2900, vsMercado: -22, lucro: 430, veredito: "otimo", indice: null, mediana: 3700, vendas: 16, diasFeira: 0, poder100: 539, custoPorPoder: 5.38 }, { raridade: 32, regua: 63, nome: "Charizard", nivel: 364, nota: 6.238, potencia: 2, qualidade: 1.153, ivTotal: 130, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 5500, vsMercado: -29, lucro: 1669, veredito: "otimo", indice: null, mediana: 7750, vendas: 8, diasFeira: 0.15624364583333333, poder100: 636, custoPorPoder: 8.65 }, { raridade: null, regua: 35, nome: "Gengar", nivel: 105, nota: 5.189, potencia: 2, qualidade: 0.829, ivTotal: 125, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3500, vsMercado: -61, lucro: 4825, veredito: "excepcional", indice: null, mediana: 9e3, vendas: 9, diasFeira: 0.28991648148148147, poder100: 525, custoPorPoder: 6.67 }, { raridade: 42, regua: 29, nome: "Larvitar", nivel: 1204, nota: 5.446, potencia: 2, qualidade: 1.109, ivTotal: 124, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3200, vsMercado: 14, lucro: -50, veredito: "otimo", indice: null, mediana: 3500, vendas: 36, diasFeira: 0.2988167476851852, poder100: 503, custoPorPoder: 6.36 }, { raridade: null, regua: 58, nome: "Gengar", nivel: 100, nota: 6.081, potencia: 2, qualidade: 1.065, ivTotal: 146, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 5e3, vsMercado: -36, lucro: 2978, veredito: "otimo", indice: null, mediana: 8625, vendas: 6, diasFeira: 0.10987259259259259, poder100: 613, custoPorPoder: 8.16 }, { raridade: null, regua: 52, nome: "Beautifly", nivel: 703, nota: 6.132, potencia: 1, qualidade: 1.363, ivTotal: 118, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2500, vsMercado: -41, lucro: 1292, veredito: "otimo", indice: null, mediana: 4213, vendas: 4, diasFeira: 0.027947939814814814, poder100: 591, custoPorPoder: 4.23 }, { raridade: null, regua: 43, nome: "Primeape", nivel: 30, nota: 5.603, potencia: 1, qualidade: 1.084, ivTotal: 116, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2240, lucro: -147, veredito: "otimo", indice: null, mediana: 2326, vendas: 1, diasFeira: 0.06562081018518519, poder100: 555, custoPorPoder: 4.04 }, { raridade: 5, regua: 31, nome: "Tyranitar", nivel: 115, nota: 4.709, potencia: 5, qualidade: 1.272, ivTotal: 92, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 300, vsMercado: -56, lucro: 353, veredito: "otimo", indice: null, mediana: 725, vendas: 5, diasFeira: 0.02746314814814815, poder100: 509, custoPorPoder: 0.59 }, { raridade: 100, regua: 5, nome: "Dratini", nivel: 30, nota: 4.419, potencia: 1, qualidade: 0.875, ivTotal: 113, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3200, lucro: -50, veredito: "otimo", indice: null, mediana: 3500, vendas: 3, diasFeira: 0.2896621643518518, poder100: 407, custoPorPoder: 7.86 }, { raridade: 84, regua: 62, nome: "Mega Charizard Y", nivel: 1218, nota: 5.972, potencia: 1, qualidade: 1.035, ivTotal: 135, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 8200, vsMercado: -46, lucro: 6138, veredito: "otimo", indice: null, mediana: 15500, vendas: 5, diasFeira: 0.10368071759259259, poder100: 632, custoPorPoder: 12.97 }, { raridade: 88, regua: 16, nome: "Larvitar", nivel: 20, nota: 4.868, potencia: 1, qualidade: 0.982, ivTotal: 121, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 1900, vsMercado: -5, lucro: -100, veredito: "otimo", indice: null, mediana: 2e3, vendas: 15, diasFeira: 0.09362383101851852, poder100: 449, custoPorPoder: 4.23 }, { raridade: 92, regua: 6, nome: "Dratini", nivel: 30, nota: 4.457, potencia: 1, qualidade: 0.842, ivTotal: 125, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3e3, vsMercado: -30, lucro: 1500, veredito: "otimo", indice: null, mediana: 5e3, vendas: 5, diasFeira: 0.09382486111111112, poder100: 411, custoPorPoder: 7.3 }, { raridade: 92, regua: 19, nome: "Dratini", nivel: 30, nota: 5.017, potencia: 1, qualidade: 1.055, ivTotal: 116, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3490, vsMercado: -42, lucro: 2060, veredito: "otimo", indice: null, mediana: 6e3, vendas: 7, diasFeira: 0.29336572916666664, poder100: 464, custoPorPoder: 7.52 }, { raridade: 44, regua: 46, nome: "Snover", nivel: 411, nota: 6.035, potencia: 2, qualidade: 1.361, ivTotal: 113, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 5100, vsMercado: -39, lucro: 3225, veredito: "otimo", indice: null, mediana: 9e3, vendas: 6, diasFeira: 0.2097101851851852, poder100: 567, custoPorPoder: 8.99 }, { raridade: 53, regua: 7, nome: "Tyranitar", nivel: 127, nota: 3.72, potencia: 4, qualidade: 1.472, ivTotal: 119, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 20, vsMercado: -43, lucro: 10, veredito: "otimo", indice: null, mediana: 35, vendas: 148, diasFeira: 0, poder100: 417, custoPorPoder: 0.05 }, { raridade: 94, regua: 53, nome: "Glaceon", nivel: 469, nota: 5.857, potencia: 1, qualidade: 1.039, ivTotal: 143, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 6e3, vsMercado: -33, lucro: 2325, veredito: "otimo", indice: null, mediana: 9e3, vendas: 6, diasFeira: 0.12252947916666666, poder100: 597, custoPorPoder: 10.05 }, { raridade: 76, regua: 4, nome: "Garchomp", nivel: 128, nota: 3.584, potencia: 1, qualidade: 1.8, ivTotal: 121, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 10, vsMercado: -41, lucro: 5, veredito: "otimo", indice: null, mediana: 17, vendas: 7, diasFeira: 0.05669232638888889, poder100: 403, custoPorPoder: 0.02 }, { raridade: null, regua: 0, nome: "Charmander", nivel: 20, nota: 3.802, potencia: 5, qualidade: 1.224, ivTotal: 97, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 560, vsMercado: -41, lucro: 293, veredito: "otimo", indice: null, mediana: 948, vendas: 6, diasFeira: 0.008014652777777779, poder100: 353, custoPorPoder: 1.59 }, { raridade: 14, regua: 11, nome: "Garchomp", nivel: 177, nota: 3.887, potencia: 4, qualidade: 1.574, ivTotal: 113, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 50, vsMercado: -35, lucro: 17, veredito: "otimo", indice: null, mediana: 77, vendas: 12, diasFeira: 0.05984956018518518, poder100: 432, custoPorPoder: 0.12 }, { raridade: 89, regua: 29, nome: "Snover", nivel: 40, nota: 5.344, potencia: 1, qualidade: 1.145, ivTotal: 112, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 3200, vsMercado: 3, lucro: 288, veredito: "otimo", indice: null, mediana: 3875, vendas: 6, diasFeira: 0.21212322916666668, poder100: 501, custoPorPoder: 6.39 }, { raridade: 24, regua: 9, nome: "Garchomp", nivel: 207, nota: 3.774, potencia: 2, qualidade: 1.781, ivTotal: 129, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 30, vsMercado: -63, lucro: 41, veredito: "otimo", indice: null, mediana: 82, vendas: 8, diasFeira: 0.05669552083333333, poder100: 422, custoPorPoder: 0.07 }, { raridade: 42, regua: 31, nome: "Bulbasaur", nivel: 20, nota: 5.472, potencia: 1, qualidade: 1.121, ivTotal: 132, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2500, vsMercado: -29, lucro: 650, veredito: "otimo", indice: null, mediana: 3500, vendas: 13, diasFeira: 0.15614331018518518, poder100: 510, custoPorPoder: 4.9 }, { raridade: 61, regua: 0, nome: "Gyarados", nivel: 100, nota: 3.649, potencia: 1, qualidade: 1.753, ivTotal: 142, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 13, vsMercado: -61, lucro: 16, veredito: "otimo", indice: null, mediana: 33, vendas: 7, diasFeira: 0.05713237268518519, poder100: 388, custoPorPoder: 0.03 }, { raridade: 42, regua: 0, nome: "Gengar", nivel: 112, nota: 3.622, potencia: 1, qualidade: 1.795, ivTotal: 132, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 10, vsMercado: -26, lucro: 1, veredito: "otimo", indice: null, mediana: 13, vendas: 18, diasFeira: 0.060657395833333336, poder100: 370, custoPorPoder: 0.03 }, { raridade: null, regua: 49, nome: "Abomasnow", nivel: 100, nota: 5.758, potencia: 1, qualidade: 1.042, ivTotal: 136, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 2500, vsMercado: -62, lucro: 4396, veredito: "otimo", indice: null, mediana: 7455, vendas: 5, diasFeira: 0.44119153935185185, poder100: 579, custoPorPoder: 4.32 }, { raridade: 24, regua: 0, nome: "Gengar", nivel: 100, nota: 3.718, potencia: 3, qualidade: 1.706, ivTotal: 122, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 50, vsMercado: -61, lucro: 62, veredito: "otimo", indice: null, mediana: 129, vendas: 10, diasFeira: 0.05908300925925926, poder100: 378, custoPorPoder: 0.13 }, { raridade: 48, regua: 3, nome: "Gyarados", nivel: 100, nota: 3.745, potencia: 2, qualidade: 1.775, ivTotal: 130, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 50, vsMercado: -46, lucro: 31, veredito: "otimo", indice: null, mediana: 93, vendas: 8, diasFeira: 0.056101157407407405, poder100: 398, custoPorPoder: 0.13 }, { raridade: 92, regua: 72, nome: "Mega Dragonite", nivel: 891, nota: 6.222, potencia: 1, qualidade: 1.086, ivTotal: 134, ivUtil: null, shiny: true, mega: true, aoe: false, z: false, preco: 8800, vsMercado: -31, lucro: 2920, veredito: "otimo", indice: null, mediana: 12670, vendas: 9, diasFeira: 0.06683130787037037, poder100: 668, custoPorPoder: 13.17 }, { raridade: 90, regua: 0, nome: "Gyarados", nivel: 100, nota: 3.509, potencia: 4, qualidade: 1.315, ivTotal: 134, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 20, vsMercado: -54, lucro: 17, veredito: "otimo", indice: null, mediana: 43, vendas: 4, diasFeira: 0.03622189814814815, poder100: 374, custoPorPoder: 0.05 }, { raridade: 45, regua: 3, nome: "Gyarados", nivel: 100, nota: 3.772, potencia: 2, qualidade: 1.8, ivTotal: 128, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 70, vsMercado: -25, lucro: 12, veredito: "otimo", indice: null, mediana: 94, vendas: 8, diasFeira: 0.020467546296296296, poder100: 400, custoPorPoder: 0.18 }, { raridade: 45, regua: 3, nome: "Gyarados", nivel: 100, nota: 3.775, potencia: 2, qualidade: 1.764, ivTotal: 135, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 15, vsMercado: -84, lucro: 67, veredito: "otimo", indice: null, mediana: 94, vendas: 8, diasFeira: 0.02429082175925926, poder100: 400, custoPorPoder: 0.04 }, { raridade: 21, regua: 13, nome: "Dragonite", nivel: 100, nota: 3.957, potencia: 4, qualidade: 1.554, ivTotal: 126, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 90, vsMercado: -68, lucro: 158, veredito: "otimo", indice: null, mediana: 285, vendas: 15, diasFeira: 0.005166122685185185, poder100: 438, custoPorPoder: 0.21 }, { raridade: 14, regua: 13, nome: "Garchomp", nivel: 152, nota: 3.939, potencia: 3, qualidade: 1.8, ivTotal: 125, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 100, vsMercado: -64, lucro: 143, veredito: "otimo", indice: null, mediana: 279, vendas: 7, diasFeira: 0.060052314814814815, poder100: 437, custoPorPoder: 0.23 }, { raridade: 58, regua: 0, nome: "Gyarados", nivel: 100, nota: 3.669, potencia: 2, qualidade: 1.714, ivTotal: 132, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 46, vsMercado: -47, lucro: 29, veredito: "otimo", indice: null, mediana: 86, vendas: 8, diasFeira: 0.056648796296296294, poder100: 390, custoPorPoder: 0.12 }, { raridade: 58, regua: 0, nome: "Gyarados", nivel: 100, nota: 3.671, potencia: 1, qualidade: 1.797, ivTotal: 135, ivUtil: null, shiny: false, mega: false, aoe: false, z: false, preco: 15, vsMercado: -56, lucro: 15, veredito: "otimo", indice: null, mediana: 34, vendas: 7, diasFeira: 0.02429798611111111, poder100: 389, custoPorPoder: 0.04 }, { raridade: null, regua: 13, nome: "Mankey", nivel: 10, nota: 4.735, potencia: 2, qualidade: 0.853, ivTotal: 129, ivUtil: null, shiny: true, mega: false, aoe: false, z: false, preco: 900, lucro: -90, veredito: "otimo", indice: null, mediana: 900, vendas: 3, diasFeira: 0.2900493402777778, poder100: 438, custoPorPoder: 2.05 }], registro: [{ nome: "Mega Dragonite", nivel: 891, nota: 6.222, shiny: true, veredito: "otimo", preco: 8800, mediana: 12670, vsMercado: -31, revenda: null, vistoEm: 1793490751591 }, { nome: "Mega Gyarados", nivel: 2474, nota: 6.057, shiny: true, veredito: "otimo", preco: 8e3, mediana: 15506, vsMercado: -48, revenda: null, vistoEm: 1793488816425 }, { nome: "Tyranitar", nivel: 1628, nota: 6.5, shiny: true, veredito: "otimo", preco: 11500, mediana: 14492, vsMercado: -21, revenda: null, vistoEm: 1793488052758 }, { nome: "Gyarados", nivel: 100, nota: 3.775, shiny: false, veredito: "otimo", preco: 15, mediana: 94, vsMercado: -84, revenda: null, vistoEm: 1793485481586 }, { nome: "Gyarados", nivel: 100, nota: 3.671, shiny: false, veredito: "otimo", preco: 15, mediana: 34, vsMercado: -56, revenda: null, vistoEm: 1793485480967 }, { nome: "Gyarados", nivel: 100, nota: 3.509, shiny: false, veredito: "otimo", preco: 20, mediana: 43, vsMercado: -54, revenda: null, vistoEm: 1793484927384 }, { nome: "Gyarados", nivel: 100, nota: 3.772, shiny: false, veredito: "otimo", preco: 70, mediana: 94, vsMercado: -25, revenda: null, vistoEm: 1793484913191 }, { nome: "Larvitar", nivel: 22, nota: 3.225, shiny: false, veredito: "otimo", preco: 150, mediana: 189, vsMercado: -21, revenda: null, vistoEm: 1793483683919 }, { nome: "Gyarados", nivel: 100, nota: 3.745, shiny: false, veredito: "otimo", preco: 50, mediana: 93, vsMercado: -46, revenda: null, vistoEm: 1793482952873 }, { nome: "Gyarados", nivel: 110, nota: 3.557, shiny: false, veredito: "otimo", preco: 10, mediana: 20, vsMercado: -51, revenda: null, vistoEm: 1793482834697 }, { nome: "Gyarados", nivel: 100, nota: 3.649, shiny: false, veredito: "otimo", preco: 13, mediana: 33, vsMercado: -61, revenda: null, vistoEm: 1793482774242 }, { nome: "Gyarados", nivel: 100, nota: 3.669, shiny: false, veredito: "otimo", preco: 46, mediana: 86, vsMercado: -47, revenda: null, vistoEm: 1793482732349 }, { nome: "Garchomp", nivel: 128, nota: 3.584, shiny: false, veredito: "otimo", preco: 10, mediana: 17, vsMercado: -41, revenda: null, vistoEm: 1793482720595 }, { nome: "Garchomp", nivel: 207, nota: 3.774, shiny: false, veredito: "otimo", preco: 30, mediana: 82, vsMercado: -63, revenda: null, vistoEm: 1793482720319 }, { nome: "Gengar", nivel: 100, nota: 3.718, shiny: false, veredito: "otimo", preco: 50, mediana: 129, vsMercado: -61, revenda: null, vistoEm: 1793482679169 }, { nome: "Garchomp", nivel: 177, nota: 3.887, shiny: false, veredito: "otimo", preco: 50, mediana: 77, vsMercado: -35, revenda: null, vistoEm: 1793482573892 }, { nome: "Garchomp", nivel: 152, nota: 3.939, shiny: false, veredito: "otimo", preco: 100, mediana: 279, vsMercado: -64, revenda: null, vistoEm: 1793482544164 }, { nome: "Gengar", nivel: 112, nota: 3.622, shiny: false, veredito: "otimo", preco: 10, mediana: 13, vsMercado: -26, revenda: null, vistoEm: 1793482483717 }, { nome: "Dragonite", nivel: 100, nota: 3.957, shiny: false, veredito: "otimo", preco: 90, mediana: 285, vsMercado: -68, revenda: null, vistoEm: 1793482295170 }, { nome: "Beautifly", nivel: 703, nota: 6.132, shiny: true, veredito: "otimo", preco: 2500, mediana: 4213, vsMercado: -41, revenda: null, vistoEm: 1793480974793 }, { nome: "Charizard", nivel: 358, nota: 4.545, shiny: false, veredito: "otimo", preco: 450, mediana: 612, vsMercado: -27, revenda: null, vistoEm: 1793480718099 }, { nome: "Venusaur", nivel: 1332, nota: 5.764, shiny: true, veredito: "otimo", preco: 5950, mediana: 8e3, vsMercado: -25, revenda: null, vistoEm: 1793471970953 }, { nome: "Gengar", nivel: 372, nota: 3.547, shiny: false, veredito: "otimo", preco: 35, mediana: 58, vsMercado: -39, revenda: null, vistoEm: 1793470756523 }, { nome: "Tyranitar", nivel: 115, nota: 4.709, shiny: false, veredito: "otimo", preco: 300, mediana: 725, vsMercado: -56, revenda: null, vistoEm: 1793467078135 }, { nome: "Tyranitar", nivel: 127, nota: 3.72, shiny: false, veredito: "otimo", preco: 20, mediana: 35, vsMercado: -43, revenda: null, vistoEm: 1793457872341 }, { nome: "Charizard", nivel: 1010, nota: 3.767, shiny: false, veredito: "otimo", preco: 90, mediana: 114, vsMercado: -21, revenda: null, vistoEm: 1793457738201 }, { nome: "Rhyperior", nivel: 488, nota: 6.126, shiny: true, veredito: "otimo", preco: 4130, mediana: 7250, vsMercado: -42, revenda: null, vistoEm: 1793457683562 }, { nome: "Abomasnow", nivel: 100, nota: 5.758, shiny: true, veredito: "otimo", preco: 2500, mediana: 7455, vsMercado: -62, revenda: 4500, vistoEm: 1793457491870 }, { nome: "Numel", nivel: 40, nota: 5.859, shiny: true, veredito: "otimo", preco: 2900, mediana: 3700, vsMercado: -22, revenda: null, vistoEm: 1793393272795 }, { nome: "Charmander", nivel: 20, nota: 3.802, shiny: false, veredito: "otimo", preco: 560, mediana: 948, vsMercado: -41, revenda: null, vistoEm: 1793391665380 }, { nome: "Mega Dragonite", nivel: 1522, nota: 6.26, shiny: true, veredito: "otimo", preco: 12e3, mediana: 17243, vsMercado: -30, revenda: null, vistoEm: 1793391215023 }, { nome: "Mega Charizard Y", nivel: 1218, nota: 5.972, shiny: true, veredito: "otimo", preco: 8200, mediana: 15500, vsMercado: -46, revenda: null, vistoEm: 1793383491396 }, { nome: "Gengar", nivel: 100, nota: 6.081, shiny: true, veredito: "otimo", preco: 5e3, mediana: 8625, vsMercado: -36, revenda: null, vistoEm: 1793382970812 }, { nome: "Gengar", nivel: 340, nota: 3.518, shiny: false, veredito: "otimo", preco: 45, mediana: 162, vsMercado: -69, revenda: null, vistoEm: 1793382138656 }, { nome: "Glaceon", nivel: 469, nota: 5.857, shiny: true, veredito: "otimo", preco: 6e3, mediana: 9e3, vsMercado: -33, revenda: null, vistoEm: 1793381886544 }, { nome: "Gengar", nivel: 229, nota: 3.526, shiny: false, veredito: "otimo", preco: 25, mediana: 65, vsMercado: -54, revenda: null, vistoEm: 1793379526628 }, { nome: "Bulbasaur", nivel: 20, nota: 5.472, shiny: true, veredito: "otimo", preco: 2500, mediana: 3500, vsMercado: -29, revenda: null, vistoEm: 1793378949834 }, { nome: "Charizard", nivel: 364, nota: 6.238, shiny: true, veredito: "otimo", preco: 5500, mediana: 7750, vsMercado: -29, revenda: null, vistoEm: 1793378945476 }, { nome: "Tyranitar", nivel: 685, nota: 6.056, shiny: true, veredito: "otimo", preco: 3500, mediana: 6500, vsMercado: -23, revenda: null, vistoEm: 1793378944485 }, { nome: "Snover", nivel: 411, nota: 6.035, shiny: true, veredito: "otimo", preco: 5100, mediana: 9e3, vsMercado: -39, revenda: null, vistoEm: 1793374314511 }, { nome: "Barboach", nivel: 40, nota: 5.606, shiny: true, veredito: "otimo", preco: 1100, mediana: 2285, vsMercado: -30, revenda: null, vistoEm: 1793374297431 }, { nome: "Mega Dragonite", nivel: 2471, nota: 6.749, shiny: true, veredito: "otimo", preco: 14e3, mediana: 26580, vsMercado: -32, revenda: null, vistoEm: 1793319726469 }, { nome: "Larvitar", nivel: 20, nota: 4.995, shiny: true, veredito: "otimo", preco: 2500, mediana: 2500, vsMercado: 20, revenda: null, vistoEm: 1793310074328 }, { nome: "Primeape", nivel: 30, nota: 5.603, shiny: true, veredito: "otimo", preco: 2240, mediana: 2326, revenda: null, vistoEm: 1793309991086 }, { nome: "Mega Gengar", nivel: 776, nota: 4.153, shiny: false, veredito: "otimo", preco: 1550, mediana: 2568, vsMercado: -32, revenda: null, vistoEm: 1793305785679 }, { nome: "Mega Gengar", nivel: 150, nota: 3.727, shiny: false, veredito: "otimo", preco: 1128, mediana: 2436, vsMercado: -54, revenda: 800, vistoEm: 1793305707878 }, { nome: "Snover", nivel: 40, nota: 5.516, shiny: true, veredito: "otimo", preco: 4999, mediana: 3875, vsMercado: 32, revenda: null, vistoEm: 1793295916694 }, { nome: "Snover", nivel: 400, nota: 6.072, shiny: true, veredito: "otimo", preco: 5e3, mediana: 9e3, vsMercado: -39, revenda: null, vistoEm: 1793294308998 }, { nome: "Snover", nivel: 40, nota: 5.344, shiny: true, veredito: "otimo", preco: 3200, mediana: 3875, vsMercado: 3, revenda: null, vistoEm: 1793292657714 }, { nome: "Mega Gengar", nivel: 617, nota: 3.62, shiny: false, veredito: "otimo", preco: 1e3, mediana: 2436, vsMercado: -59, revenda: null, vistoEm: 1793292029201 }, { nome: "Mega Garchomp", nivel: 814, nota: 3.667, shiny: false, veredito: "otimo", preco: 600, mediana: 2250, vsMercado: -69, revenda: 600, vistoEm: 1793291995871 }, { nome: "Honchkrow", nivel: 100, nota: 3.517, shiny: false, veredito: "otimo", preco: 24, mediana: 521, vsMercado: -95, revenda: 20, vistoEm: 1793291318178 }, { nome: "Annihilape", nivel: 1901, nota: 5.854, shiny: true, veredito: "otimo", preco: 4e3, mediana: 12e3, vsMercado: -54, revenda: null, vistoEm: 1793290631897 }, { nome: "Dratini", nivel: 30, nota: 4.419, shiny: true, veredito: "otimo", preco: 3200, mediana: 3500, revenda: null, vistoEm: 1793290619166 }, { nome: "Gastly", nivel: 20, nota: 5.151, shiny: true, veredito: "otimo", preco: 2e3, mediana: 2549, vsMercado: 18, revenda: null, vistoEm: 1793290611273 }, { nome: "Gastly", nivel: 495, nota: 5.124, shiny: true, veredito: "otimo", preco: 2199, mediana: 2549, vsMercado: -14, revenda: null, vistoEm: 1793290604700 }, { nome: "Gengar", nivel: 105, nota: 5.189, shiny: true, veredito: "excepcional", preco: 3500, mediana: 9e3, vsMercado: -61, revenda: null, vistoEm: 1793290600395 }, { nome: "Snover", nivel: 280, nota: 4.963, shiny: true, veredito: "otimo", preco: 2400, mediana: 3875, vsMercado: -38, revenda: 2350, vistoEm: 1793290591075 }, { nome: "Mankey", nivel: 10, nota: 4.735, shiny: true, veredito: "otimo", preco: 900, mediana: 900, revenda: null, vistoEm: 1793290577748 }, { nome: "Mankey", nivel: 124, nota: 4.852, shiny: true, veredito: "otimo", preco: 1100, mediana: 900, revenda: 3800, vistoEm: 1793290566569 }, { nome: "Larvitar", nivel: 20, nota: 4.868, shiny: true, veredito: "otimo", preco: 1900, mediana: 2e3, vsMercado: -5, revenda: null, vistoEm: 1793290561910 }, { nome: "Dratini", nivel: 30, nota: 5.364, shiny: true, veredito: "otimo", preco: 1e7, mediana: 6e3, vsMercado: -42, revenda: null, vistoEm: 1793290556454 }, { nome: "Dratini", nivel: 30, nota: 4.457, shiny: true, veredito: "otimo", preco: 3e3, mediana: 5e3, vsMercado: -30, revenda: null, vistoEm: 1793290548512 }, { nome: "Larvitar", nivel: 66, nota: 4.589, shiny: true, veredito: "otimo", preco: 2e3, mediana: 1200, vsMercado: 67, revenda: 1800, vistoEm: 1793290538534 }, { nome: "Larvitar", nivel: 236, nota: 4.822, shiny: true, veredito: "otimo", preco: 1900, mediana: 1500, vsMercado: 33, revenda: 1500, vistoEm: 1793290537438 }, { nome: "Snover", nivel: 40, nota: 5.236, shiny: true, veredito: "otimo", preco: 3200, mediana: 3875, vsMercado: -10, revenda: null, vistoEm: 1793290531123 }, { nome: "Numel", nivel: 181, nota: 4.991, shiny: true, veredito: "otimo", preco: 1200, mediana: 1360, vsMercado: -12, revenda: 1150, vistoEm: 1793290504628 }, { nome: "Forretress", nivel: 80, nota: 4.951, shiny: true, veredito: "otimo", preco: 800, mediana: 3324, vsMercado: -70, revenda: null, vistoEm: 1793290494509 }, { nome: "Numel", nivel: 40, nota: 4.413, shiny: true, veredito: "otimo", preco: 1050, mediana: 1418, vsMercado: -22, revenda: 1e3, vistoEm: 1793290319670 }, { nome: "Dratini", nivel: 30, nota: 5.017, shiny: true, veredito: "otimo", preco: 3490, mediana: 6e3, vsMercado: -42, revenda: null, vistoEm: 1793290302380 }, { nome: "Larvitar", nivel: 1204, nota: 5.446, shiny: true, veredito: "otimo", preco: 3200, mediana: 3500, vsMercado: 14, revenda: null, vistoEm: 1793289919796 }, { nome: "Rhyhorn", nivel: 30, nota: 5.95, shiny: true, veredito: "otimo", preco: 3500, mediana: 1850, vsMercado: 89, revenda: null, vistoEm: 1793289909075 }, { nome: "Mega Venusaur", nivel: 728, nota: 6.049, shiny: true, veredito: "otimo", preco: 5e3, mediana: 2e4, vsMercado: -70, revenda: null, vistoEm: 1793289892980 }, { nome: "Mega Venusaur", nivel: 1137, nota: 5.81, shiny: true, veredito: "otimo", preco: 5600, mediana: 2e4, vsMercado: -72, revenda: 6e3, vistoEm: 1793285316623 }, { nome: "Mega Alakazam", nivel: 849, nota: 5.677, shiny: true, veredito: "excepcional", preco: 4400, mediana: 17e3, vsMercado: -74, revenda: null, vistoEm: 1793284073337 }, { nome: "Exeggutor", nivel: 1189, nota: 5.621, shiny: true, veredito: "otimo", preco: 2250, mediana: 3250, vsMercado: -37, revenda: null, vistoEm: 1793284072467 }, { nome: "Mega Charizard X", nivel: 1059, nota: 6.936, shiny: true, veredito: "otimo", preco: 12200, mediana: 18500, vsMercado: -28, revenda: 14e3, vistoEm: 1793284025398 }], itens: [{ nome: "Ancient Stone", categoria: "stone", menor: 2, anuncios: 503, unidades: 42856, media7d: 48, volume7d: 463, vsMedia: -96, vendaDia: 66, diasEstoque: 88 }, { nome: "Cocoon Stone", categoria: "stone", menor: 2, anuncios: 1515, unidades: 422490, media7d: 10, volume7d: 4259, vsMedia: -80, vendaDia: null, diasEstoque: null }, { nome: "Darkness Stone", categoria: "stone", menor: 2, anuncios: 664, unidades: 78908, media7d: 24, volume7d: 421, vsMedia: -92, vendaDia: null, diasEstoque: null }, { nome: "Earth Stone", categoria: "stone", menor: 2, anuncios: 1717, unidades: 268939, media7d: 19, volume7d: 897, vsMedia: -89, vendaDia: null, diasEstoque: null }, { nome: "Enigma Stone", categoria: "stone", menor: 2, anuncios: 716, unidades: 65e3, media7d: 20, volume7d: 145, vsMedia: -90, vendaDia: null, diasEstoque: null }, { nome: "Feather Stone", categoria: "stone", menor: 2, anuncios: 779, unidades: 157058, media7d: 8, volume7d: 2391, vsMedia: -75, vendaDia: null, diasEstoque: null }, { nome: "Fire Stone", categoria: "stone", menor: 2, anuncios: 871, unidades: 260221, media7d: 17, volume7d: 1075, vsMedia: -88, vendaDia: null, diasEstoque: null }, { nome: "Heart Stone", categoria: "stone", menor: 2, anuncios: 315, unidades: 26936, media7d: 1984, volume7d: 7, vsMedia: -100, vendaDia: 1, diasEstoque: 3843 }, { nome: "Ice Stone", categoria: "stone", menor: 2, anuncios: 594, unidades: 34416, media7d: 25, volume7d: 587, vsMedia: -92, vendaDia: 84, diasEstoque: 59 }, { nome: "Leaf Stone", categoria: "stone", menor: 2, anuncios: 1247, unidades: 112471, media7d: 8, volume7d: 1709, vsMedia: -75, vendaDia: null, diasEstoque: null }, { nome: "Metal Stone", categoria: "stone", menor: 2, anuncios: 893, unidades: 366593, media7d: 19, volume7d: 917, vsMedia: -89, vendaDia: null, diasEstoque: null }, { nome: "Punch Stone", categoria: "stone", menor: 2, anuncios: 337, unidades: 38920, media7d: 17, volume7d: 316, vsMedia: -88, vendaDia: null, diasEstoque: null }, { nome: "Rock Stone", categoria: "stone", menor: 2, anuncios: 1644, unidades: 235740, media7d: 14, volume7d: 895, vsMedia: -86, vendaDia: null, diasEstoque: null }, { nome: "Thunder Stone", categoria: "stone", menor: 2, anuncios: 471, unidades: 15392, media7d: 164, volume7d: 46, vsMedia: -99, vendaDia: 3, diasEstoque: 1546 }, { nome: "Venom Stone", categoria: "stone", menor: 2, anuncios: 1272, unidades: 66888, media7d: 28, volume7d: 577, vsMedia: -93, vendaDia: 82, diasEstoque: 48 }, { nome: "Water Stone", categoria: "stone", menor: 2, anuncios: 810, unidades: 57920, media7d: 7, volume7d: 2596, vsMedia: -71, vendaDia: null, diasEstoque: null }, { nome: "Sun Stone", categoria: "stone", menor: 2, anuncios: 556, unidades: 10644, media7d: 33, volume7d: 246, vsMedia: -94, vendaDia: 35, diasEstoque: 3 }, { nome: "AoE TM Disk Piece", categoria: "fragment", menor: 249, anuncios: 73, unidades: 113, media7d: 323, volume7d: 2851, vsMedia: -23, vendaDia: 388, diasEstoque: 0 }, { nome: "TM Disk Piece", categoria: "fragment", menor: 249, anuncios: 61, unidades: 107, media7d: 301, volume7d: 1052, vsMedia: -17, vendaDia: null, diasEstoque: null }, { nome: "Bronze Boss Token", categoria: "boss", menor: 3, anuncios: 3077, unidades: 79894, media7d: 5, volume7d: 311040, vsMedia: -40, vendaDia: null, diasEstoque: null }, { nome: "Key Fragment", categoria: "fragment", menor: 166, anuncios: 362, unidades: 479, media7d: 223, volume7d: 4287, vsMedia: -26, vendaDia: null, diasEstoque: null }, { nome: "Shiny Stone Fragment", categoria: "fragment", menor: 56, anuncios: 529, unidades: 739, media7d: 83, volume7d: 3911, vsMedia: -33, vendaDia: null, diasEstoque: null }, { nome: "Bicycle Fragment", categoria: "fragment", menor: 113, anuncios: 244, unidades: 297, media7d: 143, volume7d: 3990, vsMedia: -21, vendaDia: null, diasEstoque: null }, { nome: "Mega Stone Fragment", categoria: "fragment", menor: 50, anuncios: 80, unidades: 151, media7d: 56, volume7d: 4406, vsMedia: -11, vendaDia: null, diasEstoque: null }, { nome: "Mega Shiny Stone Fragment", categoria: "fragment", menor: 88, anuncios: 122, unidades: 248, media7d: 148, volume7d: 2092, vsMedia: -41, vendaDia: null, diasEstoque: null }, { nome: "Shiny Egg Fragment", categoria: "fragment", menor: 2e3, anuncios: 1, unidades: 2, media7d: 874, volume7d: 9, vsMedia: 129, vendaDia: 1, diasEstoque: 2 }, { nome: "Common House", categoria: "casa", menor: 1150, anuncios: 16, unidades: 16, media7d: 1223, volume7d: 230, vsMedia: -6, vendaDia: 32, diasEstoque: 1 }, { nome: "Uncommon House", categoria: "casa", menor: 3400, anuncios: 2, unidades: 2, media7d: 3026, volume7d: 54, vsMedia: 12, vendaDia: 8, diasEstoque: 0 }, { nome: "Rare House", categoria: "casa", menor: 9200, anuncios: 5, unidades: 5, media7d: 12872, volume7d: 18, vsMedia: -29, vendaDia: 2, diasEstoque: 2 }, { nome: "Common Bicycle", categoria: "bicicleta", menor: 835, anuncios: 25, unidades: 25, media7d: 1037, volume7d: 161, vsMedia: -19, vendaDia: 22, diasEstoque: 1 }, { nome: "Uncommon Bicycle", categoria: "bicicleta", menor: 1925, anuncios: 8, unidades: 8, media7d: 2169, volume7d: 35, vsMedia: -11, vendaDia: 5, diasEstoque: 2 }, { nome: "Rare Bicycle", categoria: "bicicleta", menor: 8500, anuncios: 4, unidades: 4, media7d: 7450, volume7d: 11, vsMedia: 14, vendaDia: 2, diasEstoque: 3 }, { nome: "Mythic Bicycle", categoria: "bicicleta", menor: 6e4, anuncios: 1, unidades: 1, media7d: null, volume7d: null, vsMedia: null, vendaDia: null, diasEstoque: null }, { nome: "Mystic Ticket", categoria: "ticket", menor: 15e3, anuncios: 1, unidades: 1, media7d: 7500, volume7d: 2, vsMedia: 100, vendaDia: null, diasEstoque: null }, { nome: "Safari Ticket", categoria: "ticket", menor: 21, anuncios: 67, unidades: 174, media7d: 23, volume7d: 1423, vsMedia: -9, vendaDia: null, diasEstoque: null }, { nome: "Mythic House", categoria: "casa", menor: null, anuncios: null, unidades: null, media7d: 5e4, volume7d: 2, vsMedia: null, vendaDia: null, diasEstoque: null }] };
  }
});

// src/lib/mercado-dados.ts
async function lerLinhas(url, chave, filtro) {
  const todas = [];
  for (let pagina = 0; pagina < MAX_PAGINAS; pagina++) {
    const r = await fetch(`${url}/rest/v1/radar_anuncios?select=id,dados,alterado_em,visto_em&${filtro}&order=id.asc&limit=${POR_PAGINA}&offset=${pagina * POR_PAGINA}`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` },
      next: { revalidate: ATUALIZA_SEG2 }
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
    const parte = await r.json();
    todas.push(...parte);
    if (parte.length < POR_PAGINA) break;
  }
  return todas;
}
async function lerVendedores(url, chave) {
  try {
    const r = await fetch(`${url}/rest/v1/rpc/radar_vendedores_mercado`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_desde: MERCADO_DESDE }),
      next: { revalidate: ATUALIZA_SEG2 }
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
    const porId = await r.json() ?? {};
    return new Map(Object.entries(porId).map(([id, vendedor]) => [Number(id), vendedor]));
  } catch (e) {
    console.error("mercado: sem os vendedores agora", e);
    return /* @__PURE__ */ new Map();
  }
}
function montarMercado(ativos, saidos, vendedores, vistoEm) {
  if (!ativos.length) return { ...reserva, aoVivo: false, recebidoEm: null };
  return montarDeLinhas(ativos, saidos, vendedores, vistoEm).mercado;
}
async function carregarMercado() {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  if (!url || !chave) return { ...reserva, aoVivo: false, recebidoEm: null };
  try {
    const ativos = await lerLinhas(url, chave, `ativo=is.true&criado_em=gte.${MERCADO_DESDE}`);
    if (!ativos.length) return { ...reserva, aoVivo: false, recebidoEm: null };
    const vendedores = await lerVendedores(url, chave);
    const limite = new Date(Date.now() - REGISTRO_DIAS * 864e5).toISOString();
    const saidos = await lerLinhas(url, chave, `ativo=is.false&alterado_em=gt.${limite}&dados->>m=eq.g&dados->>v=in.(${VEREDITOS_DO_REGISTRO.join(",")})`);
    return montarMercado(ativos, saidos, vendedores);
  } catch (e) {
    console.error("mercado: usando a amostra, o banco n\xE3o respondeu", e);
    return { ...reserva, aoVivo: false, recebidoEm: null };
  }
}
var ATUALIZA_SEG2, POR_PAGINA, MAX_PAGINAS, reserva;
var init_mercado_dados = __esm({
  "src/lib/mercado-dados.ts"() {
    "use strict";
    init_amostra();
    init_mercado_linhas();
    ATUALIZA_SEG2 = 60;
    POR_PAGINA = 1e3;
    MAX_PAGINAS = 20;
    reserva = amostra_default;
  }
});

// src/lib/pokedex-link.ts
var init_pokedex_link = __esm({
  "src/lib/pokedex-link.ts"() {
    "use strict";
  }
});

// src/lib/pokedex.ts
function tipoAtaque(fisico) {
  if (fisico == null) return null;
  return fisico >= 0.65 ? "f\xEDsico" : fisico <= 0.35 ? "especial" : "misto";
}
var init_pokedex = __esm({
  "src/lib/pokedex.ts"() {
    "use strict";
    init_pokedex_link();
  }
});

// src/lib/torneios.ts
function ehLendario(dex) {
  return LENDARIOS.has(dex >= PRIMEIRA_FORMA ? dex % 1e3 : dex);
}
var LENDARIOS, PRIMEIRA_FORMA;
var init_torneios = __esm({
  "src/lib/torneios.ts"() {
    "use strict";
    LENDARIOS = /* @__PURE__ */ new Set([
      144,
      145,
      146,
      150,
      151,
      243,
      244,
      245,
      249,
      250,
      251,
      377,
      378,
      379,
      380,
      381,
      382,
      383,
      384,
      385,
      386,
      480,
      481,
      482,
      483,
      484,
      485,
      486,
      487,
      488,
      489,
      490,
      491,
      492,
      493,
      494,
      638,
      639,
      640,
      641,
      642,
      643,
      644,
      645,
      646,
      647,
      648,
      649,
      716,
      717,
      718,
      719,
      720,
      721,
      772,
      773,
      785,
      786,
      787,
      788,
      789,
      790,
      791,
      792,
      793,
      794,
      795,
      796,
      797,
      798,
      799,
      800,
      801,
      802,
      803,
      804,
      805,
      806,
      807,
      808,
      809,
      888,
      889,
      890,
      891,
      892,
      893,
      894,
      895,
      896,
      897,
      898,
      905,
      1001,
      1002,
      1003,
      1004,
      1005,
      1006,
      1007,
      1008,
      1009,
      1010,
      1011,
      1012,
      1013,
      1014,
      1015,
      1016,
      1017,
      1018,
      1019,
      1020,
      1021,
      1022,
      1023,
      1024,
      1025
    ]);
    PRIMEIRA_FORMA = 3e3;
  }
});

// src/lib/anuncios.ts
var anuncios_exports = {};
__export(anuncios_exports, {
  anunciosEmCoins: () => anunciosEmCoins,
  anunciosEmCoinsDe: () => anunciosEmCoinsDe,
  candidatosDoTime: () => candidatosDoTime,
  candidatosDoTimeDe: () => candidatosDoTimeDe,
  comPokedex: () => comPokedex
});
async function anunciosEmCoins() {
  return anunciosEmCoinsDe(await lerCoins());
}
function anunciosEmCoinsDe(lista) {
  return comPokedex(
    lista.flatMap((a) => {
      const [nivel, ivTotal, nota100] = a.k.split("|").map(Number);
      if (!VEREDITOS_VALIDOS.has(a.v) || !Number.isFinite(nivel) || a.med == null) return [];
      return [
        {
          nome: a.nome,
          nivel,
          nota: nota100 / 100,
          potencia: a.pp ?? 1,
          qualidade: 0,
          ivTotal,
          ivUtil: a.iu,
          shiny: a.sh === 1,
          mega: a.nome.startsWith("Mega "),
          aoe: a.ae === 1,
          z: a.zm === 1,
          preco: a.p,
          veredito: a.v,
          indice: a.i,
          vsMercado: a.vs ?? 0,
          mediana: a.med,
          vendas: a.n ?? 0,
          diasFeira: a.d ?? 0,
          lucro: Math.round(a.med * (1 - COMISSAO_COINS2) - a.p),
          poder100: a.f,
          custoPorPoder: a.f ? a.p / a.f : null,
          raridade: a.rar,
          regua: a.reg
        }
      ];
    })
  );
}
function deCompacto(a) {
  const [nivel, ivTotal, nota100] = a.k.split("|").map(Number);
  if (a.f == null || !Number.isFinite(nivel) || !(a.p > 0)) return null;
  const e = DA_POKEDEX.get(a.nome);
  return {
    nome: a.nome,
    dex: e?.dex ?? null,
    tipos: e?.tipos ?? [],
    nivel,
    potencia: a.pp ?? null,
    shiny: a.sh === 1,
    preco: a.p,
    poder100: a.f,
    lendario: e?.lendario,
    outland: e?.outland,
    z: a.zm === 1,
    aoe: a.ae === 1,
    nota: Number.isFinite(nota100) ? nota100 / 100 : null,
    ivTotal: Number.isFinite(ivTotal) ? ivTotal : null,
    qualidade: a.q ?? null
  };
}
async function lerCoins() {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  if (!url || !chave) return [];
  const POR_PAGINA4 = 1e3;
  const todos = [];
  try {
    for (let de = 0; de < 20 * POR_PAGINA4; de += POR_PAGINA4) {
      const r = await fetch(`${url}/rest/v1/radar_anuncios?select=dados&ativo=is.true&dados->>m=eq.c&order=id`, {
        headers: { apikey: chave, Authorization: `Bearer ${chave}`, Range: `${de}-${de + POR_PAGINA4 - 1}` },
        next: { revalidate: ATUALIZA_SEG3 }
      });
      if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
      const pagina = await r.json();
      todos.push(...pagina.map((l) => l.dados));
      if (pagina.length < POR_PAGINA4) break;
    }
  } catch (e) {
    console.error("an\xFAncios em coins: o banco n\xE3o respondeu", e);
  }
  return todos;
}
function candidatosGemasDe(anuncios) {
  return comPokedex(anuncios).flatMap(
    (a) => a.poder100 == null ? [] : [
      {
        nome: a.nome,
        dex: a.dex ?? null,
        tipos: a.tipos ?? [],
        nivel: a.nivel,
        potencia: a.potencia,
        shiny: a.shiny,
        preco: a.preco,
        poder100: a.poder100,
        lendario: a.lendario,
        outland: a.outland,
        z: a.z,
        aoe: a.aoe,
        nota: a.nota || null,
        ivTotal: a.ivTotal || null,
        qualidade: a.qualidade || null,
        vendedor: a.vendedor ?? null
      }
    ]
  );
}
async function candidatosDoTime() {
  const [mercado, coins] = await Promise.all([carregarMercado(), lerCoins()]);
  return candidatosDoTimeDe(mercado.anuncios, coins);
}
function candidatosDoTimeDe(anunciosGemas, coins) {
  return { g: candidatosGemasDe(anunciosGemas), c: coins.flatMap((a) => deCompacto(a) ?? []) };
}
var ATUALIZA_SEG3, DA_POKEDEX, comPokedex, COMISSAO_COINS2, VEREDITOS_VALIDOS;
var init_anuncios = __esm({
  "src/lib/anuncios.ts"() {
    "use strict";
    init_mercado_dados();
    init_pokedex_dados();
    init_pokedex();
    init_torneios();
    ATUALIZA_SEG3 = 60;
    DA_POKEDEX = new Map(
      pokedexLista.map((e) => [
        e.nome,
        {
          dex: e.dex,
          tipos: e.tipos,
          outland: e.dex >= 2001 && e.dex <= 2999,
          ataque: tipoAtaque(e.fisico),
          lendario: ehLendario(e.dex)
        }
      ])
    );
    comPokedex = (lista) => lista.map((a) => ({ ...a, ...DA_POKEDEX.get(a.nome) ?? {} }));
    COMISSAO_COINS2 = 0.15;
    VEREDITOS_VALIDOS = /* @__PURE__ */ new Set(["excepcional", "otimo", "bom", "justo", "caro"]);
  }
});

// src/lib/vendas.ts
var vendas_exports = {};
__export(vendas_exports, {
  carregarVendas: () => carregarVendas,
  carregarVendasTodas: () => carregarVendasTodas,
  exportarCacheVendas: () => exportarCacheVendas,
  historicoDe: () => historicoDe,
  importarCacheVendas: () => importarCacheVendas,
  limparCacheVendas: () => limparCacheVendas
});
function exportarCacheVendas() {
  return cache ? { cheioEm: cache.cheioEm, ate: cache.ate, dados: cache.dados } : null;
}
function importarCacheVendas(estado, opcoes = {}) {
  if (!Array.isArray(estado.dados) || typeof estado.ate !== "string" || !Number.isFinite(estado.cheioEm)) return;
  if (opcoes.releituraCompletaMs != null) releituraCompletaMs = opcoes.releituraCompletaMs;
  cache = { em: 0, cheioEm: estado.cheioEm, ate: estado.ate, dados: juntar(estado.dados, []) };
}
function limparCacheVendas() {
  if (cache) cache.em = 0;
}
function juntar(velhas, novas) {
  const limite = Date.now() - DIAS * 864e5;
  const ids = new Set(novas.map((v) => v.id));
  return [...novas, ...velhas.filter((v) => !ids.has(v.id))].filter((v) => v.em >= limite).sort((a, b) => b.em - a.em);
}
async function carregarVendasTodas() {
  if (cache && Date.now() - cache.em < CACHE_VENDAS_MS) return cache.dados;
  lendo ??= lerVendas().finally(() => {
    lendo = null;
  });
  return lendo;
}
async function lerVendas() {
  const agora = Date.now();
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  if (!url || !chave) return [];
  const cab = { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" };
  try {
    if (cache && agora - cache.cheioEm < releituraCompletaMs) {
      const r = await fetch(`${url}/rest/v1/rpc/radar_vendas_novas`, {
        method: "POST",
        headers: cab,
        body: JSON.stringify({ p_desde: cache.ate, p_dias: DIAS }),
        cache: "no-store"
      });
      if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
      const j = await r.json();
      const dados2 = j.linhas.length ? juntar(cache.dados, j.linhas.map(vendaDaLinha)) : cache.dados;
      cache = { ...cache, em: agora, ate: j.ate ?? cache.ate, dados: dados2 };
      return dados2;
    }
    const ate = new Date(agora - 6e4).toISOString();
    const linhas = [];
    for (let offset = 0; offset < 2e5; offset += POR_PAGINA2) {
      const r = await fetch(`${url}/rest/v1/rpc/radar_vendas_pagina?p_dias=${DIAS}&p_offset=${offset}&p_limite=${POR_PAGINA2}`, {
        headers: cab,
        cache: "no-store"
      });
      if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
      const pagina = await r.json();
      linhas.push(...pagina);
      if (pagina.length < POR_PAGINA2) break;
    }
    const dados = juntar([], linhas.map(vendaDaLinha));
    cache = { em: agora, cheioEm: agora, ate, dados };
    return dados;
  } catch (e) {
    console.error("vendas do jogo: o banco n\xE3o respondeu", e);
    return cache?.dados ?? [];
  }
}
async function carregarVendas() {
  const limite = Date.now() - 30 * 864e5;
  return (await carregarVendasTodas()).filter((v) => v.moeda === "orb" && v.nota != null && v.em >= limite).map((v) => ({ em: v.em, nome: v.nome, preco: v.preco, nivel: v.nivel, shiny: v.shiny, pot: v.pot, iv: v.iv, nota: v.nota }));
}
function porDia(vendas) {
  const dias = /* @__PURE__ */ new Map();
  for (const v of vendas) {
    const d = diaDe(v.em);
    dias.set(d, [...dias.get(d) ?? [], v.preco]);
  }
  return [...dias.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([dia, precos]) => ({ dia, mediana: Math.round(mediana(precos) ?? 0), vendas: precos.length }));
}
async function historicoDe(especie) {
  const daEspecie = (await carregarVendas()).filter((v) => v.nome === especie);
  return { normal: porDia(daEspecie.filter((v) => !v.shiny)), shiny: porDia(daEspecie.filter((v) => v.shiny)) };
}
var CACHE_VENDAS_MS, DIAS, FUSO, RELEITURA_COMPLETA_MS, cache, num2, releituraCompletaMs, vendaDaLinha, POR_PAGINA2, lendo, diaDe;
var init_vendas = __esm({
  "src/lib/vendas.ts"() {
    "use strict";
    init_motor();
    CACHE_VENDAS_MS = 10 * 6e4;
    DIAS = 45;
    FUSO = "America/Sao_Paulo";
    RELEITURA_COMPLETA_MS = 24 * 60 * 6e4;
    cache = null;
    num2 = (v) => v == null ? null : Number(v);
    releituraCompletaMs = RELEITURA_COMPLETA_MS;
    vendaDaLinha = (l) => ({
      id: l.id,
      em: l.em,
      nome: l.nome,
      moeda: l.moeda === "gold" ? "gold" : "orb",
      preco: Number(l.preco),
      nivel: l.nivel ?? 1,
      shiny: Boolean(l.shiny),
      pot: l.pot ?? 1,
      q: num2(l.q),
      iv: l.iv ?? null,
      nota: num2(l.nota),
      tmAoe: Boolean(l.tmAoe),
      tmZ: l.tmZ ?? null
    });
    POR_PAGINA2 = 5e3;
    lendo = null;
    diaDe = (em) => new Date(em).toLocaleDateString("sv-SE", { timeZone: FUSO });
  }
});

// src/lib/movimento.ts
var movimento_exports = {};
__export(movimento_exports, {
  carregarMovimento: () => carregarMovimento
});
function mediana2(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function juntar2(itens, chave) {
  const mapa = /* @__PURE__ */ new Map();
  for (const x of itens) {
    const k = chave(x);
    mapa.set(k, [...mapa.get(k) ?? [], x]);
  }
  return mapa;
}
async function carregarMovimento(moeda, quantos = 10) {
  const agora = Date.now();
  const vendas = (await carregarVendasTodas()).filter((v) => v.moeda === moeda && v.preco > 0);
  const comparaveis = vendas.filter((v) => (v.shiny || v.pot === 5) && agora - v.em <= 2 * JANELA_DIAS * DIA_MS);
  const variacoes = [];
  for (const [k, lista] of juntar2(comparaveis, (v) => `${v.nome}|${v.shiny ? "shiny" : "p5"}`)) {
    const [nome, grupo] = k.split("|");
    const semana = lista.filter((v) => agora - v.em <= JANELA_DIAS * DIA_MS).map((v) => v.preco);
    const antes = lista.filter((v) => agora - v.em > JANELA_DIAS * DIA_MS).map((v) => v.preco);
    if (semana.length < MINIMO_POR_SEMANA || antes.length < MINIMO_POR_SEMANA) continue;
    const med = mediana2(semana);
    const medAntes = mediana2(antes);
    if (!(medAntes > 0)) continue;
    variacoes.push({
      nome,
      grupo,
      vendas: semana.length,
      vendasAntes: antes.length,
      mediana: Math.round(med),
      medianaAntes: Math.round(medAntes),
      variacao: med / medAntes - 1
    });
  }
  const ordenadas = [...variacoes].sort((a, b) => b.variacao - a.variacao);
  const inicio = Math.max(agora - JANELA_DIAS * DIA_MS, VENDAS_COMPLETAS_DESDE);
  const recentes = vendas.filter((v) => v.em >= inicio);
  const maisVendidas = [...juntar2(recentes, (v) => v.nome)].map(([nome, lista]) => ({
    nome,
    vendas: lista.length,
    shiny: lista.filter((v) => v.shiny).length,
    mediana: Math.round(mediana2(lista.map((v) => v.preco)))
  })).sort((a, b) => b.vendas - a.vendas).slice(0, quantos * 2);
  return {
    subiram: ordenadas.filter((v) => v.variacao >= VARIACAO_MINIMA).slice(0, quantos),
    cairam: ordenadas.filter((v) => v.variacao <= -VARIACAO_MINIMA).reverse().slice(0, quantos),
    maisVendidas,
    diasMaisVendidas: Math.max(0.1, Math.round((agora - inicio) / DIA_MS * 10) / 10),
    vendasNoPeriodo: recentes.length,
    especiesNoPeriodo: new Set(recentes.map((v) => v.nome)).size
  };
}
var DIA_MS, JANELA_DIAS, MINIMO_POR_SEMANA, VARIACAO_MINIMA, VENDAS_COMPLETAS_DESDE;
var init_movimento = __esm({
  "src/lib/movimento.ts"() {
    "use strict";
    init_vendas();
    DIA_MS = 864e5;
    JANELA_DIAS = 7;
    MINIMO_POR_SEMANA = 6;
    VARIACAO_MINIMA = 0.05;
    VENDAS_COMPLETAS_DESDE = Date.parse("2026-11-15T03:00:00Z");
  }
});

// src/lib/itens-linhas.ts
function lerResumoItens(linhas) {
  return (linhas ?? []).map((l) => ({
    id: Number(l.id),
    nome: String(l.nome),
    categoria: l.categoria == null ? null : String(l.categoria),
    moeda: l.moeda === "gold" ? "gold" : "orb",
    em: Number(l.em),
    menor: n(l.menor),
    anuncios: n(l.anuncios),
    unidades: n(l.unidades),
    media7d: n(l.media7d),
    volume7d: n(l.volume7d),
    min24: n(l.min24),
    max24: n(l.max24),
    min7: n(l.min7),
    max7: n(l.max7),
    media7dOntem: n(l.media7dOntem),
    media7dSemana: n(l.media7dSemana),
    desde: Number(l.desde)
  }));
}
function lerSerieItem(pontos) {
  return (pontos ?? []).map((p) => ({ t: Number(p.t), lo: n(p.lo), hi: n(p.hi), menor: n(p.menor), media7d: n(p.media7d), unidades: n(p.unidades) }));
}
function lerCambio(pontos) {
  return (pontos ?? []).map((p) => ({ dia: String(p.dia), cambio: Number(p.cambio), itens: Number(p.itens) })).filter((p) => p.cambio > 0);
}
var n;
var init_itens_linhas = __esm({
  "src/lib/itens-linhas.ts"() {
    "use strict";
    n = (v) => v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null;
  }
});

// src/lib/itens-dados.ts
var itens_dados_exports = {};
__export(itens_dados_exports, {
  carregarCambio: () => carregarCambio,
  carregarResumoItens: () => carregarResumoItens,
  carregarSerieItem: () => carregarSerieItem
});
async function rpc(funcao, args) {
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  if (!url || !chave) return null;
  try {
    const r = await fetch(`${url}/rest/v1/rpc/${funcao}`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      next: { revalidate: ATUALIZA_SEG4 }
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
    return await r.json();
  } catch (e) {
    console.error(`itens: ${funcao} falhou`, e);
    return null;
  }
}
async function carregarResumoItens() {
  return lerResumoItens(await rpc("radar_itens_resumo", {}));
}
async function carregarSerieItem(id, moeda, dias) {
  return lerSerieItem(await rpc("radar_itens_serie", { p_item: id, p_moeda: moeda, p_dias: dias }));
}
async function carregarCambio(dias) {
  return lerCambio(await rpc("radar_cambio_serie", { p_dias: dias }));
}
var ATUALIZA_SEG4;
var init_itens_dados = __esm({
  "src/lib/itens-dados.ts"() {
    "use strict";
    init_itens_linhas();
    ATUALIZA_SEG4 = 300;
  }
});

// scripts/estado-anuncios.ts
var estado_anuncios_exports = {};
__export(estado_anuncios_exports, {
  RELEITURA_COMPLETA_MS: () => RELEITURA_COMPLETA_MS2,
  atualizarAnuncios: () => atualizarAnuncios,
  gravarArquivo: () => gravarArquivo,
  lerEstado: () => lerEstado,
  partesDoEstado: () => partesDoEstado,
  ultimoVisto: () => ultimoVisto
});
import { existsSync, mkdirSync, readFileSync as readFileSync2, renameSync, writeFileSync } from "node:fs";
import { join as join2 } from "node:path";
async function lerTabela(b, filtro) {
  const todas = [];
  for (let pagina = 0; pagina < MAX_PAGINAS2; pagina++) {
    const r = await fetch(`${b.url}/rest/v1/radar_anuncios?select=${COLUNAS}&${filtro}&order=id.asc&limit=${POR_PAGINA3}&offset=${pagina * POR_PAGINA3}`, {
      headers: cabecalhos(b),
      cache: "no-store"
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status} (${await r.text()})`);
    const parte = await r.json();
    todas.push(...parte);
    if (parte.length < POR_PAGINA3) return todas;
  }
  throw new Error(`radar_anuncios: mais de ${MAX_PAGINAS2 * POR_PAGINA3} linhas com ${filtro}`);
}
async function lerVendedores2(b, desde) {
  const r = await fetch(`${b.url}/rest/v1/rpc/radar_vendedores_mercado`, {
    method: "POST",
    headers: { ...cabecalhos(b), "Content-Type": "application/json" },
    body: JSON.stringify({ p_desde: desde }),
    cache: "no-store"
  });
  if (!r.ok) throw new Error(`radar_vendedores_mercado respondeu ${r.status}`);
  return await r.json() ?? {};
}
function guardar(l, limiteRegistro) {
  if (l.ativo) return l.dados.m === "c" || doMercado2(l);
  return l.dados.m === "g" && VEREDITOS_DO_REGISTRO.includes(l.dados.v) && Date.parse(l.alterado_em) > limiteRegistro;
}
function novaMarca(linhas, anterior) {
  const maior = linhas.reduce((m, l) => Math.max(m, Date.parse(l.alterado_em) || 0), 0);
  if (!maior) return anterior ?? new Date(Date.now() - FOLGA_MARCA_MS).toISOString();
  const recuada = maior - FOLGA_MARCA_MS;
  return anterior && Date.parse(anterior) > recuada ? anterior : new Date(recuada).toISOString();
}
function podar(linhas, vendedores) {
  const limiteRegistro = Date.now() - REGISTRO_DIAS * 864e5;
  const ficam = [...linhas].filter((l) => guardar(l, limiteRegistro)).sort((a, b) => a.id - b.id);
  const comVendedor = new Set(ficam.filter(precisaVendedor).map((l) => String(l.id)));
  return { linhas: ficam, vendedores: Object.fromEntries(Object.entries(vendedores).filter(([id]) => comVendedor.has(id))) };
}
async function lerTudo(b) {
  const limite = new Date(Date.now() - REGISTRO_DIAS * 864e5).toISOString();
  const [ativos, saidos, vendedores] = await Promise.all([
    lerTabela(b, `ativo=is.true&or=(criado_em.gte.${MERCADO_DESDE},dados->>m.eq.c)`),
    lerTabela(b, `ativo=is.false&alterado_em=gt.${limite}&dados->>m=eq.g&dados->>v=in.(${VEREDITOS_DO_REGISTRO.join(",")})`),
    lerVendedores2(b, MERCADO_DESDE)
  ]);
  const todas = [...ativos, ...saidos];
  return { versao: VERSAO, cheioEm: Date.now(), marca: novaMarca(todas, null), ...podar(todas, vendedores) };
}
async function lerDiferenca(b, estado) {
  const novas = await lerTabela(b, `alterado_em=gt.${estado.marca}`);
  const porId = new Map(estado.linhas.map((l) => [l.id, l]));
  for (const l of novas) porId.set(l.id, l);
  const podado = podar(porId.values(), estado.vendedores);
  const semVendedor = podado.linhas.filter((l) => precisaVendedor(l) && !(String(l.id) in podado.vendedores));
  const idsNovos = new Set(novas.map((l) => l.id));
  const buscar = semVendedor.filter((l) => idsNovos.has(l.id));
  let vendedores = podado.vendedores;
  if (buscar.length) {
    const desde = Math.min(...buscar.map((l) => Date.parse(l.criado_em)));
    const chegaram = await lerVendedores2(b, new Date(desde).toISOString());
    const faltam = new Set(semVendedor.map((l) => String(l.id)));
    vendedores = { ...vendedores, ...Object.fromEntries(Object.entries(chegaram).filter(([id]) => faltam.has(id))) };
  }
  return {
    estado: { ...estado, marca: novaMarca(novas, estado.marca), linhas: podado.linhas, vendedores },
    mudaram: novas.length
  };
}
function lerArquivo(arquivo) {
  if (!existsSync(arquivo)) return null;
  try {
    return JSON.parse(readFileSync2(arquivo, "utf8"));
  } catch (e) {
    console.error(`estado: ${arquivo} ileg\xEDvel, lendo tudo do banco`, e);
    return null;
  }
}
function gravarArquivo(pasta, nome, dados) {
  mkdirSync(pasta, { recursive: true });
  const arq = join2(pasta, nome);
  writeFileSync(`${arq}.tmp`, JSON.stringify(dados));
  renameSync(`${arq}.tmp`, arq);
}
function lerEstado(pasta, nome) {
  return lerArquivo(join2(pasta, nome));
}
async function atualizarAnuncios(b, anterior) {
  if (!estadoValido(anterior)) {
    const estado2 = await lerTudo(b);
    return { estado: estado2, modo: `leitura completa (${estado2.linhas.length} an\xFAncios)` };
  }
  const { estado, mudaram } = await lerDiferenca(b, anterior);
  return { estado, modo: `s\xF3 a diferen\xE7a (${mudaram} linhas mudaram desde ${anterior.marca}; ${estado.linhas.length} an\xFAncios)` };
}
async function ultimoVisto(b) {
  try {
    const r = await fetch(`${b.url}/rest/v1/radar_anuncios?select=visto_em&ativo=is.true&criado_em=gte.${MERCADO_DESDE}&order=visto_em.desc&limit=1`, {
      headers: cabecalhos(b),
      cache: "no-store"
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
    const [l] = await r.json();
    return l?.visto_em;
  } catch (e) {
    console.error("estado: sem o \xFAltimo visto_em", e);
    return void 0;
  }
}
function partesDoEstado(e) {
  return {
    ativos: e.linhas.filter((l) => l.ativo && doMercado2(l)),
    saidos: e.linhas.filter((l) => !l.ativo),
    coins: e.linhas.filter((l) => l.ativo && l.dados.m === "c")
  };
}
var VERSAO, POR_PAGINA3, MAX_PAGINAS2, RELEITURA_COMPLETA_MS2, FOLGA_MARCA_MS, COLUNAS, cabecalhos, doMercado2, precisaVendedor, estadoValido;
var init_estado_anuncios = __esm({
  "scripts/estado-anuncios.ts"() {
    "use strict";
    init_mercado_dados();
    VERSAO = 1;
    POR_PAGINA3 = 1e3;
    MAX_PAGINAS2 = 40;
    RELEITURA_COMPLETA_MS2 = 24 * 60 * 6e4;
    FOLGA_MARCA_MS = 2 * 6e4;
    COLUNAS = "id,dados,ativo,alterado_em,visto_em,criado_em";
    cabecalhos = (b) => ({ apikey: b.chave, Authorization: `Bearer ${b.chave}` });
    doMercado2 = (l) => l.criado_em != null && Date.parse(l.criado_em) >= Date.parse(MERCADO_DESDE);
    precisaVendedor = (l) => l.ativo && l.dados.m === "g" && doMercado2(l);
    estadoValido = (e) => e != null && e.versao === VERSAO && Array.isArray(e.linhas) && typeof e.marca === "string" && Date.now() - e.cheioEm < RELEITURA_COMPLETA_MS2;
  }
});

// scripts/gerar-dados.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync3, renameSync as renameSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join3 } from "node:path";
var ESTADO_ANUNCIOS = "anuncios.json";
var ESTADO_VENDAS = "vendas.json";
function lerEnvLocal() {
  if (process.env.RADAR_SUPABASE_URL || !existsSync2(".env.local")) return;
  for (const l of readFileSync3(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^([A-Z_]+)=(.*)$/.exec(l);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}
function gravar(pasta, nome, dados) {
  const texto = JSON.stringify(dados);
  const arq = join3(pasta, `${nome}.json`);
  writeFileSync2(`${arq}.tmp`, texto);
  renameSync2(`${arq}.tmp`, arq);
  return texto.length;
}
var ESPERAS_MS = [1e4, 3e4];
var instavel = (status) => status === 500 || status >= 502 && status <= 504 || status >= 520 && status <= 524;
var dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function comNovaTentativa(original, entrada, opcoes) {
  for (let i = 0; ; i++) {
    const ultima = i >= ESPERAS_MS.length;
    try {
      const r = await original(entrada, opcoes);
      if (ultima || !instavel(r.status)) return r;
      console.warn(`banco respondeu ${r.status}; nova tentativa em ${ESPERAS_MS[i] / 1e3} s`);
    } catch (e) {
      if (ultima) throw e;
      console.warn(`banco n\xE3o respondeu (${e.message}); nova tentativa em ${ESPERAS_MS[i] / 1e3} s`);
    }
    await dormir(ESPERAS_MS[i]);
  }
}
function contarLeituras(base) {
  const original = globalThis.fetch;
  const porCaminho = /* @__PURE__ */ new Map();
  globalThis.fetch = async (entrada, opcoes) => {
    const endereco = typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
    if (!endereco.startsWith(base)) return original(entrada, opcoes);
    const r = await comNovaTentativa(original, entrada, opcoes);
    const corpo = await r.arrayBuffer();
    const caminho = new URL(endereco).pathname.replace(/^\/rest\/v1\//, "");
    porCaminho.set(caminho, (porCaminho.get(caminho) ?? 0) + corpo.byteLength);
    return new Response(corpo, { status: r.status, statusText: r.statusText, headers: r.headers });
  };
  return {
    total: () => [...porCaminho.values()].reduce((s, n2) => s + n2, 0),
    porCaminho: () => [...porCaminho.entries()].sort((a, b) => b[1] - a[1])
  };
}
var kb = (n2) => `${Math.round(n2 / 1024)} KB`;
async function lerVisitas(url, chave) {
  try {
    const r = await fetch(`${url}/rest/v1/rpc/radar_visitas_total`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: "{}"
    });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.visitas === "number" && typeof j.pessoas === "number" && typeof j.desde === "string" ? { visitas: j.visitas, pessoas: j.pessoas, desde: j.desde } : null;
  } catch {
    return null;
  }
}
async function principal() {
  lerEnvLocal();
  const pasta = process.argv[2] || "public/dados";
  const pastaEstado = process.env.RADAR_ESTADO_DIR || "estado";
  mkdirSync2(pasta, { recursive: true });
  const url = process.env.RADAR_SUPABASE_URL;
  const chave = process.env.RADAR_SUPABASE_CHAVE;
  if (!url || !chave) throw new Error("faltam RADAR_SUPABASE_URL e RADAR_SUPABASE_CHAVE");
  const banco = { url, chave };
  const leituras = contarLeituras(url);
  const { maiorAlterado: maiorAlterado2, montarDeLinhas: montarDeLinhas2 } = await Promise.resolve().then(() => (init_mercado_linhas(), mercado_linhas_exports));
  const { carregarDestaques: carregarDestaques2 } = await Promise.resolve().then(() => (init_destaques(), destaques_exports));
  const { anunciosEmCoinsDe: anunciosEmCoinsDe2, candidatosDoTimeDe: candidatosDoTimeDe2 } = await Promise.resolve().then(() => (init_anuncios(), anuncios_exports));
  const { carregarMovimento: carregarMovimento2 } = await Promise.resolve().then(() => (init_movimento(), movimento_exports));
  const { carregarCambio: carregarCambio2 } = await Promise.resolve().then(() => (init_itens_dados(), itens_dados_exports));
  const { historicoDe: historicoDe2, carregarVendas: carregarVendas2, exportarCacheVendas: exportarCacheVendas2, importarCacheVendas: importarCacheVendas2 } = await Promise.resolve().then(() => (init_vendas(), vendas_exports));
  const estadoMod = await Promise.resolve().then(() => (init_estado_anuncios(), estado_anuncios_exports));
  const vendasGuardadas = estadoMod.lerEstado(pastaEstado, ESTADO_VENDAS);
  if (vendasGuardadas) importarCacheVendas2(vendasGuardadas, { releituraCompletaMs: estadoMod.RELEITURA_COMPLETA_MS });
  const anterior = estadoMod.lerEstado(pastaEstado, ESTADO_ANUNCIOS);
  const { estado, modo } = await estadoMod.atualizarAnuncios(banco, anterior);
  console.log(`an\xFAncios: ${modo}`);
  const { ativos, saidos, coins } = estadoMod.partesDoEstado(estado);
  const vendedores = new Map(Object.entries(estado.vendedores).map(([id, v]) => [Number(id), v]));
  const geradoEm = (/* @__PURE__ */ new Date()).toISOString();
  const tamanhos = {};
  const [vistoEm, destaques] = await Promise.all([estadoMod.ultimoVisto(banco), carregarDestaques2()]);
  if (!ativos.length) throw new Error("o banco n\xE3o trouxe an\xFAncios (mercado viria da amostra): n\xE3o publica dados velhos");
  const { mercado, vivo } = montarDeLinhas2(ativos, saidos, vendedores, vistoEm);
  const marca = maiorAlterado2(estado.linhas) ?? geradoEm;
  tamanhos.mercado = gravar(pasta, "mercado", { geradoEm, marca, mercado, destaques, vivo });
  tamanhos.destaques = gravar(pasta, "destaques", { geradoEm, destaques });
  const compactosCoins = coins.map((l) => l.dados);
  const paresCoins = coins.flatMap((l) => {
    const [a] = anunciosEmCoinsDe2([l.dados]);
    return a ? [[l.id, a]] : [];
  });
  tamanhos.coins = gravar(pasta, "coins", { geradoEm, marca, anuncios: paresCoins.map((p) => p[1]), ids: paresCoins.map((p) => p[0]) });
  tamanhos.pvp = gravar(pasta, "pvp", { geradoEm, ...candidatosDoTimeDe2(mercado.anuncios, compactosCoins) });
  const [g, c, cambio] = await Promise.all([carregarMovimento2("orb"), carregarMovimento2("gold"), carregarCambio2(30)]);
  tamanhos["em-alta"] = gravar(pasta, "em-alta", { geradoEm, g, c, cambio });
  const especies2 = [...new Set((await carregarVendas2()).map((v) => v.nome))];
  const historico = {};
  for (const nome of especies2) historico[nome] = await historicoDe2(nome);
  tamanhos.historico = gravar(pasta, "historico", { geradoEm, especies: historico });
  const visitas = await lerVisitas(url, chave);
  if (visitas) tamanhos.visitas = gravar(pasta, "visitas", { geradoEm, ...visitas });
  gravar(pasta, "gerado", { geradoEm, tamanhos });
  estadoMod.gravarArquivo(pastaEstado, ESTADO_ANUNCIOS, estado);
  const vendas = exportarCacheVendas2();
  if (vendas) estadoMod.gravarArquivo(pastaEstado, ESTADO_VENDAS, vendas);
  console.log(`dados gerados em ${pasta}:`, Object.entries(tamanhos).map(([n2, t]) => `${n2} ${kb(t)}`).join(", "));
  console.log(`lido do banco: ${kb(leituras.total())} (${leituras.porCaminho().map(([p, n2]) => `${p} ${kb(n2)}`).join(", ")})`);
}
principal().catch((e) => {
  console.error("gerar-dados falhou:", e);
  process.exit(1);
});
