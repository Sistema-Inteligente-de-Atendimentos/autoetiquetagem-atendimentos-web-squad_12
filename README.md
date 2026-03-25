# 🧠 Autoetiquetagem de Atendimentos — Frontend

## 📦 Arquitetura do Projeto

Este projeto utiliza uma arquitetura baseada em:

* Separação de responsabilidades (UI, lógica, serviços)
* Organização por domínio (**features**)
* Uso de **hooks** para lógica (sem misturar com componentes)

---

## 🏗️ Estrutura de Pastas

```
src/
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
│
├── features/
│   └── dashboard/
│       ├── hooks/
│       │   └── useDashboard.ts
│       ├── services.ts
│       └── types.ts
│
├── services/
│   └── api.ts
│
├── views/
│   ├── Atendimentos/
│   │   └── index.tsx
│   ├── Dashboard/
│   │   └── index.tsx
│   ├── Revisao/
│   │   └── index.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🧩 Conceitos da Arquitetura

---

### 🖥️ `views/` → Telas (Páginas)

Responsável por renderizar a interface do usuário.

Cada pasta representa uma página do sistema:

* Dashboard
* Atendimentos
* Revisão

📌 **Responsabilidades:**

* Renderizar UI
* Usar hooks
* Compor componentes

📌 **Não deve conter:**

* Lógica complexa
* Chamadas diretas de API

---

### 🧠 `features/` → Lógica do Sistema

Cada feature representa um domínio do sistema.

Exemplo:

```
features/dashboard/
```

---

#### 🔹 `hooks/`

Contém a lógica da aplicação:

* Estado (useState)
* Fluxo de dados
* Regras de negócio
* Orquestração de chamadas

---

#### 🔹 `services.ts`

Responsável por chamadas de API da feature.

Exemplo:

* buscar dados do dashboard
* enviar requisições específicas

---

#### 🔹 `types.ts`

Define os tipos utilizados na feature.

Exemplo:

* estrutura de dados do backend
* tipagem do JSON retornado

---

### 🔌 `services/` → Infraestrutura Global

Contém configurações globais da API.

Exemplo:

```
services/api.ts
```

Responsável por:

* configuração do Axios
* baseURL
* headers

📌 **Importante:**

* `services/api.ts` → COMO conectar
* `features/services.ts` → O QUE chamar

---

### 🧩 `components/` → UI Reutilizável

Componentes genéricos utilizados em várias telas.

Estrutura:

```
components/
├── layout/
└── ui/
```

---

#### 🔹 `layout/`

Componentes estruturais:

* Sidebar
* Layout base

---

#### 🔹 `ui/`

Componentes básicos:

* Button
* Card
* Input (futuro)

---

📌 **Regra:**

* Sem lógica de negócio
* Sem chamadas de API

---

## 🔄 Fluxo da Aplicação

```
View (views/)
   ↓
Hook (features/.../hooks)
   ↓
Service da feature
   ↓
API global (services/api.ts)
   ↓
Backend
```

---

## 🧠 Princípios adotados

* Separação clara entre UI e lógica
* Componentes reutilizáveis
* Código organizado por domínio
* Fácil manutenção e escalabilidade

---

## ⚠️ Boas práticas

✔ Não colocar lógica dentro de views
✔ Não chamar API diretamente nas páginas
✔ Usar hooks para lógica
✔ Manter components genéricos
✔ Organizar código por feature

---

## 🚀 Evolução futura

A arquitetura permite crescer facilmente para:

* Feature de atendimento
* Feature de revisão
* Relatórios analíticos
* Integração com backend de IA (LLM)
* Estado global (se necessário)

---

## 📌 Resumo

| Camada     | Responsabilidade    |
| ---------- | ------------------- |
| views      | Interface (telas)   |
| components | UI reutilizável     |
| hooks      | Lógica              |
| services   | Comunicação com API |
| types      | Tipagem de dados    |

---

## 💡 Filosofia

> "Views mostram. Hooks controlam. Services conectam."

---
