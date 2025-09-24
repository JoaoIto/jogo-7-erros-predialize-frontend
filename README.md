# 📄 README — Frontend (Angular 8)

## Visão geral

Frontend do **“Jogo dos 7 Erros”** em **Angular 8**, consumindo a API do backend:

* Mostra as duas imagens (original x alterada);
* Converte cliques do usuário em **coordenadas relativas (0..1)**;
* Chama o endpoint `POST /levels/:id/attempt` para validar acertos e desenha **marcadores**;
* Extras sugeridos: **timer**, **limite de tentativas**, **reset**, **persistência local**;
* (Opcional) Placar ao vivo via **WebSocket**.

> Observação: a CLI 8/webpack 4 é antiga; veja a seção “Compatibilidade com Node 20” abaixo.

## Requisitos

* **Angular CLI 8.3.29**
* Node.js

  * **Opção A (clássica):** Node 12 (compatibilidade total com Angular 8), ou
  * **Opção B (mantendo Node 20):** usar bandeira `--openssl-legacy-provider` e contornar peer deps antigos

## Setup de dependências (npm)

Como o Angular 8 foi lançado na era do npm 6, o npm moderno pode travar peer deps. Duas formas práticas de instalar:

- Por causa da incompatibilidade, você pode somente rodar um comando:
 
E isso vai dar uma dependência antiga ao openssl e assin você poderá rodar o projeto?
   ```
   NODE_OPTIONS=--openssl-legacy-provider npx ng serve -o
   ```
- Porém essas dependências e problemas também foi usado uma ferramenta, uma lib, ``cross-env``, que no caso faz o cruzamento
de variáveis e dependências para você usar, e assim é só preciso rodar o comando de:

```cmd
npm start
```

---

> Se usar Angular Material, lembre-se de importar `BrowserAnimationsModule` e os módulos necessários do Material.

## Compatibilidade com Node 20 (OpenSSL 3)

O webpack 4 (Angular 8) quebra com Node 17+ por causa do provedor de hash antigo. Há três jeitos simples de rodar:

**CMD (Prompt):**

```bat
set NODE_OPTIONS=--openssl-legacy-provider && npx ng serve -o
```

**PowerShell:**

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; npx ng serve -o
```

**Script de projeto (recomendado):**

* Instale `cross-env` como dev dep e crie um script “start” que define `NODE_OPTIONS=--openssl-legacy-provider`.
* Depois, rode `npm run start`.

> Alternativa: rodar via **Docker** com imagem `node:12` apenas para o dev server.

## Como rodar

1. Instalar dependências (com uma das opções acima).
2. Configurar **endpoints** no arquivo de environment (sem colar código aqui):

  * `apiBase`: `http://localhost:3333`
  * `wsBase`: `ws://localhost:3333/ws`
3. Subir:

  * `npm run start` (se você criou o script com `cross-env`), ou
  * `npx ng serve -o` após setar `NODE_OPTIONS` na sessão.

## Arquitetura (organização sugerida)

* **Feature Module**: `GameModule` (isola tudo do jogo).
* **Página**: `PlayPageComponent` (exibe as imagens, captura cliques e aciona o service).
* **Componente**: `ScoreboardComponent` (acertos/total, tentativas, timer, reset).
* **Service**: `GameStateService`

  * Busca `GET /levels` e `GET /levels/:id`;
  * Mantém **estado** com `BehaviorSubject`/`Observable` (diffs encontrados, contador, timer, tentativas);
  * Método `attempt(xPct, yPct)` → chama `POST /attempt` e atualiza estado;
  * (Opcional) Abre conexão **WebSocket** para ouvir `{ type: 'hit' }` e refletir no placar.
* **Detecção de mudanças**: `ChangeDetectionStrategy.OnPush` nos componentes.
* **Acessibilidade**: feedback por `aria-live` no contador; considerar navegação por teclado.

## Fluxo funcional (UI → API → UI)

1. Carregar level: app chama `GET /levels` → escolhe um id → `GET /levels/:id` (URLs das imagens + diffs esperados).
2. Usuário clica: a UI calcula `xPct` e `yPct` (clique relativo à dimensão renderizada).
3. Chamada ao backend: `POST /levels/:id/attempt` com `{ xPct, yPct }`.
4. Resposta:

  * `hit: true` → marcar visual na UI (círculo/realce), incrementar acertos;
  * `hit: false` → decrementar tentativas, feedback ao usuário.
5. (Opcional) WS: quando qualquer cliente acerta, uma mensagem `{ type:'hit' }` chega e a UI atualiza placar compartilhado.

## Boas práticas e módulos comuns

* Importar **`HttpClientModule`** no `AppModule` (ou no Core).
* Em modules de feature, importar **`CommonModule`** (para `*ngIf`/`*ngFor`).
* Se usar `[(ngModel)]`, importar **`FormsModule`**.
* Se usar Angular Material, importar **`BrowserAnimationsModule`** e os módulos do Material utilizados.
* Em Angular 8, `@ViewChild` precisa de `{ static: true/false }` de acordo com o ciclo de vida.

## Troubleshooting

* **Erro OpenSSL (ERR\_OSSL\_EVP\_UNSUPPORTED)** → definir `NODE_OPTIONS=--openssl-legacy-provider` (ver seção acima).
* **Peer deps do npm** → `.npmrc` com `legacy-peer-deps=true` ou `npm i --legacy-peer-deps`.
* **`*ngIf/*ngFor unknown`** → faltou `CommonModule` no module da feature.
* **`ngModel` não funciona** → faltou `FormsModule`.
* **Angular Material “mudo”** → faltou `BrowserAnimationsModule` e/ou módulos específicos do Material.
* **CORS bloqueado** → ajuste `ALLOWED_ORIGIN` no `.env` do backend.

## Como foi criado (resumo do setup)

1. Projeto gerado com `@angular/cli@8.3.29` (Angular 8).
2. Instalação com `legacy-peer-deps` para evitar conflitos de peer deps antigos.
3. Ajuste para Node 20 usando `NODE_OPTIONS=--openssl-legacy-provider`.
4. Definição de `apiBase`/`wsBase` no environment.
5. Criação de um módulo de feature (`GameModule`), página (`PlayPage`) e service (`GameStateService`) para isolar responsabilidades.

## Próximos passos (extensões)

* Timer regressivo + bloqueio quando zera.
* Limite de tentativas e feedback sonoro/visual para erros.
* Persistência no `localStorage` (restaura progresso).
* Responsividade total (coordenadas percentuais já ajudam).
* Testes unitários (Karma/Jasmine) para lógica do service.

---

# PredializeSevenErrors

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
