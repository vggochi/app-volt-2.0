import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const Icon = ({ name, size = 20, className = "" }) => {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  return (
    <i
      data-lucide={name}
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
      }}
    />
  );
};

const formatarPreco = (valor) => {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos");

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [carrinho, setCarrinho] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("volt_carrinho")) || [];
    } catch {
      return [];
    }
  });

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("volt_favoritos")) || [];
    } catch {
      return [];
    }
  });

  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const [notificacao, setNotificacao] = useState("");

  /* =========================================================
     CARREGAR DADOS DO SUPABASE
  ========================================================= */

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      const { data: produtosData, error: produtosError } = await supabase
        .from("produtos")
        .select(`
          *,
          categorias (
            id,
            nome,
            slug,
            imagem
          )
        `)
        .eq("ativo", true)
        .order("id", { ascending: true });

      if (produtosError) {
        throw produtosError;
      }

      const { data: categoriasData, error: categoriasError } =
        await supabase
          .from("categorias")
          .select("*")
          .eq("ativo", true)
          .order("id", { ascending: true });

      if (categoriasError) {
        throw categoriasError;
      }

      setProdutos(produtosData || []);
      setCategorias(categoriasData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);

      setErro(
        error?.message ||
          "Não foi possível carregar os produtos do VOLT."
      );
    } finally {
      setCarregando(false);
    }
  };

  /* =========================================================
     SALVAR CARRINHO / FAVORITOS
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "volt_carrinho",
      JSON.stringify(carrinho)
    );
  }, [carrinho]);

  useEffect(() => {
    localStorage.setItem(
      "volt_favoritos",
      JSON.stringify(favoritos)
    );
  }, [favoritos]);

  /* =========================================================
     NOTIFICAÇÃO
  ========================================================= */

  const mostrarNotificacao = (mensagem) => {
    setNotificacao(mensagem);

    setTimeout(() => {
      setNotificacao("");
    }, 2200);
  };

  /* =========================================================
     FILTRO DOS PRODUTOS
  ========================================================= */

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const nome = String(produto.nome || "").toLowerCase();
      const plataforma = String(
        produto.plataforma || ""
      ).toLowerCase();

      const termo = busca.toLowerCase().trim();

      const correspondeBusca =
        !termo ||
        nome.includes(termo) ||
        plataforma.includes(termo);

      const correspondeCategoria =
        categoriaSelecionada === "todos" ||
        produto.categorias?.slug === categoriaSelecionada;

      return correspondeBusca && correspondeCategoria;
    });
  }, [
    produtos,
    busca,
    categoriaSelecionada,
  ]);

  /* =========================================================
     CARRINHO
  ========================================================= */

  const adicionarAoCarrinho = (produto) => {
    const estoque = Number(produto.estoque ?? 999);

    if (estoque <= 0) {
      mostrarNotificacao("Produto sem estoque.");
      return;
    }

    setCarrinho((atual) => {
      const existente = atual.find(
        (item) => item.id === produto.id
      );

      if (existente) {
        if (existente.quantidade >= estoque) {
          mostrarNotificacao(
            "Quantidade máxima disponível atingida."
          );

          return atual;
        }

        return atual.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
              }
            : item
        );
      }

      return [
        ...atual,
        {
          ...produto,
          quantidade: 1,
        },
      ];
    });

    mostrarNotificacao("Produto adicionado ao carrinho.");
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((atual) =>
      atual.filter((item) => item.id !== id)
    );
  };

  const alterarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }

    setCarrinho((atual) =>
      atual.map((item) => {
        if (item.id !== id) return item;

        const estoque = Number(item.estoque ?? 999);

        if (novaQuantidade > estoque) {
          mostrarNotificacao(
            "Quantidade máxima disponível atingida."
          );

          return item;
        }

        return {
          ...item,
          quantidade: novaQuantidade,
        };
      })
    );
  };

  const quantidadeCarrinho = carrinho.reduce(
    (total, item) => total + Number(item.quantidade || 0),
    0
  );

  const totalCarrinho = carrinho.reduce(
    (total, item) =>
      total +
      Number(item.preco || 0) *
        Number(item.quantidade || 0),
    0
  );

  /* =========================================================
     FAVORITOS
  ========================================================= */

  const alternarFavorito = (produto) => {
    setFavoritos((atual) => {
      const existe = atual.some(
        (item) => item.id === produto.id
      );

      if (existe) {
        mostrarNotificacao("Removido dos favoritos.");

        return atual.filter(
          (item) => item.id !== produto.id
        );
      }

      mostrarNotificacao("Adicionado aos favoritos.");

      return [...atual, produto];
    });
  };

  const ehFavorito = (produtoId) => {
    return favoritos.some(
      (item) => item.id === produtoId
    );
  };

  /* =========================================================
     CATEGORIA
  ========================================================= */

  const selecionarCategoria = (slug) => {
    setCategoriaSelecionada(slug);

    setTimeout(() => {
      document
        .getElementById("produtos")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);

    setMenuAberto(false);
  };

  /* =========================================================
     PRODUTO
  ========================================================= */

  const abrirProduto = (produto) => {
    setProdutoSelecionado(produto);
    document.body.style.overflow = "hidden";
  };

  const fecharProduto = () => {
    setProdutoSelecionado(null);
    document.body.style.overflow = "";
  };

  /* =========================================================
     SCROLL
  ========================================================= */

  const irPara = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMenuAberto(false);
  };

  /* =========================================================
     COMPONENTE PRODUTO
  ========================================================= */

  const ProdutoCard = ({ produto }) => {
    const favorito = ehFavorito(produto.id);

    return (
      <article
        className="
          group
          overflow-hidden
          rounded-[28px]
          border border-white/10
          bg-[#0d1016]
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-[#d9ff00]/40
          hover:shadow-[0_20px_70px_rgba(217,255,0,0.08)]
        "
      >
        {/* IMAGEM DO CARD */}

        <div
          className="
            relative
            h-56
            w-full
            overflow-hidden
            bg-[#080a0f]
            cursor-pointer
          "
          onClick={() => abrirProduto(produto)}
        >
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {produto.destaque && (
            <span
              className="
                absolute
                left-4
                top-4
                rounded-full
                bg-[#d9ff00]
                px-3
                py-1
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-black
              "
            >
              Destaque
            </span>
          )}

          <button
            onClick={(event) => {
              event.stopPropagation();
              alternarFavorito(produto);
            }}
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/50
              backdrop-blur-md
              transition
              hover:scale-110
            "
          >
            <Icon
              name="heart"
              size={19}
              className={
                favorito
                  ? "fill-[#d9ff00] text-[#d9ff00]"
                  : "text-white"
              }
            />
          </button>
        </div>

        {/* INFORMAÇÕES */}

        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9ff00]">
              {produto.categorias?.nome ||
                produto.plataforma ||
                "Gaming"}
            </span>

            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Icon
                name="star"
                size={13}
                className="fill-[#d9ff00] text-[#d9ff00]"
              />

              {Number(produto.avaliacao || 0).toFixed(1)}
            </div>
          </div>

          <h3 className="min-h-[52px] text-lg font-extrabold leading-tight text-white">
            {produto.nome}
          </h3>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                A partir de
              </span>

              <strong className="text-xl font-black text-white">
                {formatarPreco(produto.preco)}
              </strong>
            </div>

            <button
              onClick={() => adicionarAoCarrinho(produto)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-[#d9ff00]
                text-black
                transition
                hover:scale-105
                hover:shadow-[0_0_25px_rgba(217,255,0,0.25)]
              "
            >
              <Icon name="shopping-cart" size={19} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d9ff00] text-black shadow-[0_0_40px_rgba(217,255,0,0.18)]">
            <Icon name="zap" size={30} />
          </div>

          <h1 className="text-2xl font-black">
            VOLT
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Carregando seu universo gamer...
          </p>

          <div className="mx-auto mt-5 h-1 w-32 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d9ff00]" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07090d] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/5 bg-[#07090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}

          <button
            onClick={() => irPara("inicio")}
            className="group flex items-center gap-3"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#d9ff00]
                text-black
                shadow-[0_0_25px_rgba(217,255,0,0.12)]
                transition
                group-hover:rotate-6
              "
            >
              <Icon name="zap" size={22} />
            </div>

            <div className="text-left">
              <div className="text-xl font-black tracking-tight">
                VOLT
              </div>

              <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Power Your Game
              </div>
            </div>
          </button>

          {/* NAV DESKTOP */}

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => irPara("inicio")}
              className="text-sm font-semibold text-zinc-300 transition hover:text-[#d9ff00]"
            >
              Início
            </button>

            <button
              onClick={() => irPara("categorias")}
              className="text-sm font-semibold text-zinc-300 transition hover:text-[#d9ff00]"
            >
              Categorias
            </button>

            <button
              onClick={() => irPara("produtos")}
              className="text-sm font-semibold text-zinc-300 transition hover:text-[#d9ff00]"
            >
              Produtos
            </button>
          </nav>

          {/* AÇÕES */}

          <div className="flex items-center gap-2">

            <button
              onClick={() => {
                const favoritosSection =
                  document.getElementById("produtos");

                favoritosSection?.scrollIntoView({
                  behavior: "smooth",
                });

                setBusca("");
              }}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#d9ff00]/30 hover:text-[#d9ff00] sm:flex"
            >
              <Icon name="heart" size={18} />
            </button>

            <button
              onClick={() => setCarrinhoAberto(true)}
              className="
                relative
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-[#d9ff00]
                px-4
                font-black
                text-black
                transition
                hover:scale-[1.03]
              "
            >
              <Icon name="shopping-cart" size={18} />

              <span className="hidden sm:inline">
                Carrinho
              </span>

              {quantidadeCarrinho > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-black text-[#d9ff00]">
                  {quantidadeCarrinho}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 md:hidden"
            >
              <Icon
                name={menuAberto ? "x" : "menu"}
                size={21}
              />
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}

        {menuAberto && (
          <div className="border-t border-white/5 bg-[#090b10] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => irPara("inicio")}
                className="rounded-xl p-3 text-left text-sm font-semibold text-zinc-300 hover:bg-white/5"
              >
                Início
              </button>

              <button
                onClick={() => irPara("categorias")}
                className="rounded-xl p-3 text-left text-sm font-semibold text-zinc-300 hover:bg-white/5"
              >
                Categorias
              </button>

              <button
                onClick={() => irPara("produtos")}
                className="rounded-xl p-3 text-left text-sm font-semibold text-zinc-300 hover:bg-white/5"
              >
                Produtos
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main id="inicio" className="pt-[76px]">

        <section className="relative overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#d9ff00]/5 blur-[140px]" />

          <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9ff00]/20 bg-[#d9ff00]/5 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9ff00]" />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d9ff00]">
                  Seu próximo nível começa aqui
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                POWER
                <br />
                <span className="text-[#d9ff00]">
                  YOUR GAME.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Games, consoles e acessórios para quem
                leva o gameplay a sério.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  onClick={() => irPara("produtos")}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[#d9ff00]
                    px-6
                    py-4
                    text-sm
                    font-black
                    text-black
                    transition
                    hover:scale-105
                    hover:shadow-[0_0_40px_rgba(217,255,0,0.2)]
                  "
                >
                  Explorar produtos

                  <Icon
                    name="arrow-up-right"
                    size={17}
                  />
                </button>

                <button
                  onClick={() => irPara("categorias")}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-6
                    py-4
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:border-[#d9ff00]/30
                    hover:bg-white/[0.06]
                  "
                >
                  Ver categorias
                </button>
              </div>

              <div className="mt-12 flex flex-wrap gap-8">
                <div>
                  <strong className="block text-2xl font-black">
                    {produtos.length}+
                  </strong>

                  <span className="text-xs text-zinc-500">
                    Produtos
                  </span>
                </div>

                <div>
                  <strong className="block text-2xl font-black">
                    100%
                  </strong>

                  <span className="text-xs text-zinc-500">
                    Gaming
                  </span>
                </div>

                <div>
                  <strong className="block text-2xl font-black">
                    VOLT
                  </strong>

                  <span className="text-xs text-zinc-500">
                    Power Your Game
                  </span>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="relative hidden lg:block">
              <div className="absolute -inset-10 rounded-full bg-[#d9ff00]/5 blur-[90px]" />

              <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0c0f15] p-3 shadow-2xl">
                <div className="relative overflow-hidden rounded-[30px]">
                  {produtos[0]?.imagem ? (
                    <img
                      src={produtos[0].imagem}
                      alt="VOLT Gaming"
                      className="h-[520px] w-full object-cover object-center transition duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="h-[520px] bg-gradient-to-br from-[#161b23] to-[#080a0e]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9ff00]">
                      VOLT
                    </span>

                    <h2 className="mt-2 text-4xl font-black">
                      POWER YOUR GAME
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORIAS
        ===================================================== */}

        <section
          id="categorias"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8"
        >
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d9ff00]">
                Explore
              </span>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Escolha seu universo
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Encontre games, consoles e acessórios
              separados para você encontrar exatamente
              o que procura.
            </p>
          </div>

          {categorias.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <button
                onClick={() => selecionarCategoria("todos")}
                className={`
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  text-left
                  transition-all
                  duration-300
                  ${
                    categoriaSelecionada === "todos"
                      ? "border-[#d9ff00]/50 bg-[#d9ff00]/10"
                      : "border-white/10 bg-[#0d1016] hover:border-white/20"
                  }
                `}
              >
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#151a21] to-[#080a0e]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      name="grid-2x2"
                      size={42}
                      className="text-[#d9ff00]"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-sm font-black">
                    Todos
                  </span>
                </div>
              </button>

              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() =>
                    selecionarCategoria(
                      categoria.slug
                    )
                  }
                  className={`
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    text-left
                    transition-all
                    duration-300
                    ${
                      categoriaSelecionada ===
                      categoria.slug
                        ? "border-[#d9ff00]/50 bg-[#d9ff00]/10"
                        : "border-white/10 bg-[#0d1016] hover:-translate-y-1 hover:border-white/20"
                    }
                  `}
                >
                  <div className="relative h-40 overflow-hidden bg-[#0b0e13]">
                    {categoria.imagem ? (
                      <img
                        src={categoria.imagem}
                        alt={categoria.nome}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icon
                          name="gamepad-2"
                          size={38}
                          className="text-[#d9ff00]"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="p-4">
                    <span className="text-sm font-black">
                      {categoria.nome}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#0d1016] p-10 text-center text-zinc-500">
              Nenhuma categoria encontrada.
            </div>
          )}
        </section>

        {/* =====================================================
            PRODUTOS
        ===================================================== */}

        <section
          id="produtos"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8"
        >
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d9ff00]">
                Store
              </span>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Produtos em destaque
              </h2>
            </div>

            {/* BUSCA */}

            <div className="relative w-full lg:max-w-sm">
              <Icon
                name="search"
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Buscar produto..."
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0d1016]
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-[#d9ff00]/40
                "
              />
            </div>
          </div>

          {/* FILTROS */}

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() =>
                setCategoriaSelecionada("todos")
              }
              className={`
                whitespace-nowrap
                rounded-full
                px-5
                py-2.5
                text-xs
                font-black
                transition
                ${
                  categoriaSelecionada === "todos"
                    ? "bg-[#d9ff00] text-black"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }
              `}
            >
              Todos
            </button>

            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() =>
                  setCategoriaSelecionada(
                    categoria.slug
                  )
                }
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-5
                  py-2.5
                  text-xs
                  font-black
                  transition
                  ${
                    categoriaSelecionada ===
                    categoria.slug
                      ? "bg-[#d9ff00] text-black"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                  }
                `}
              >
                {categoria.nome}
              </button>
            ))}
          </div>

          {erro ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <Icon
                name="triangle-alert"
                size={32}
                className="mx-auto text-red-400"
              />

              <h3 className="mt-4 font-black">
                Não foi possível carregar os produtos
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {erro}
              </p>

              <button
                onClick={carregarDados}
                className="mt-5 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/15"
              >
                Tentar novamente
              </button>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#0d1016] px-5 py-20 text-center">
              <Icon
                name="search-x"
                size={40}
                className="mx-auto text-zinc-600"
              />

              <h3 className="mt-5 text-xl font-black">
                Nenhum produto encontrado
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Tente buscar outro produto ou categoria.
              </p>

              <button
                onClick={() => {
                  setBusca("");
                  setCategoriaSelecionada("todos");
                }}
                className="mt-5 rounded-xl bg-[#d9ff00] px-5 py-3 text-sm font-black text-black"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {produtosFiltrados.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/5 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9ff00] text-black">
                  <Icon name="zap" size={21} />
                </div>

                <div>
                  <div className="font-black">
                    VOLT
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                    Power Your Game
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-zinc-600">
              © {new Date().getFullYear()} VOLT.
              Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================
          NOTIFICAÇÃO
      ===================================================== */}

      {notificacao && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#d9ff00]/20 bg-[#10141a]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9ff00] text-black">
              <Icon name="check" size={17} />
            </div>

            <span className="whitespace-nowrap text-sm font-bold">
              {notificacao}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL DO PRODUTO
      ===================================================== */}

      {produtoSelecionado && (
        <div
          className="
            fixed
            inset-0
            z-[80]
            flex
            items-center
            justify-center
            bg-black/80
            p-3
            backdrop-blur-md
            sm:p-6
          "
          onClick={fecharProduto}
        >
          <div
            className="
              relative
              max-h-[94vh]
              w-full
              max-w-6xl
              overflow-y-auto
              overflow-x-hidden
              rounded-[30px]
              border
              border-white/10
              bg-[#090c11]
              shadow-[0_30px_120px_rgba(0,0,0,0.7)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* FECHAR */}

            <button
              onClick={fecharProduto}
              className="
                absolute
                right-5
                top-5
                z-30
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/60
                text-white
                backdrop-blur-xl
                transition
                hover:scale-105
                hover:bg-black/80
              "
            >
              <Icon name="x" size={21} />
            </button>

            {/* =================================================
                WALLPAPER / IMAGEM DE DETALHE
            ================================================= */}

            <div className="relative w-full overflow-hidden bg-black">

              <img
                src={
                  produtoSelecionado.imagem_detalhe ||
                  produtoSelecionado.imagem
                }
                alt={produtoSelecionado.nome}
                className="
                  h-[260px]
                  w-full
                  object-cover
                  object-center
                  sm:h-[360px]
                  lg:h-[480px]
                "
              />

              {/* DEGRADÊ */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090c11] via-black/10 to-transparent" />

              {/* BRILHO */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#d9ff00]/5 via-transparent to-transparent" />

              {/* CATEGORIA SOBRE A IMAGEM */}

              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <span className="rounded-full border border-[#d9ff00]/20 bg-black/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d9ff00] backdrop-blur-md">
                  {produtoSelecionado.categorias?.nome ||
                    produtoSelecionado.plataforma ||
                    "Gaming"}
                </span>
              </div>
            </div>

            {/* =================================================
                CONTEÚDO DO MODAL
            ================================================= */}

            <div className="grid gap-10 px-6 pb-8 pt-2 sm:px-10 lg:grid-cols-[1fr_320px]">

              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {produtoSelecionado.plataforma ||
                      "Gaming"}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <Icon
                      name="star"
                      size={14}
                      className="fill-[#d9ff00] text-[#d9ff00]"
                    />

                    {Number(
                      produtoSelecionado.avaliacao || 0
                    ).toFixed(1)}
                  </span>
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                  {produtoSelecionado.nome}
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {produtoSelecionado.descricao ||
                    "Prepare-se para elevar sua experiência de gameplay com este produto da VOLT."}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                      Plataforma
                    </span>

                    <strong className="mt-1 block text-sm font-black">
                      {produtoSelecionado.plataforma ||
                        "Universal"}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                      Avaliação
                    </span>

                    <strong className="mt-1 block text-sm font-black">
                      {Number(
                        produtoSelecionado.avaliacao || 0
                      ).toFixed(1)}{" "}
                      / 5
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                      Estoque
                    </span>

                    <strong
                      className={`mt-1 block text-sm font-black ${
                        Number(
                          produtoSelecionado.estoque || 0
                        ) > 0
                          ? "text-[#d9ff00]"
                          : "text-red-400"
                      }`}
                    >
                      {Number(
                        produtoSelecionado.estoque || 0
                      ) > 0
                        ? `${produtoSelecionado.estoque} disponíveis`
                        : "Esgotado"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* =================================================
                  COMPRA
              ================================================= */}

              <aside className="self-start rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Preço
                </span>

                <div className="mt-2 text-3xl font-black">
                  {formatarPreco(
                    produtoSelecionado.preco
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/[0.03] px-4 py-3">
                  <Icon
                    name={
                      Number(
                        produtoSelecionado.estoque || 0
                      ) > 0
                        ? "package-check"
                        : "package-x"
                    }
                    size={17}
                    className={
                      Number(
                        produtoSelecionado.estoque || 0
                      ) > 0
                        ? "text-[#d9ff00]"
                        : "text-red-400"
                    }
                  />

                  <span className="text-xs font-semibold text-zinc-400">
                    {Number(
                      produtoSelecionado.estoque || 0
                    ) > 0
                      ? "Produto disponível"
                      : "Produto indisponível"}
                  </span>
                </div>

                <button
                  disabled={
                    Number(
                      produtoSelecionado.estoque || 0
                    ) <= 0
                  }
                  onClick={() => {
                    adicionarAoCarrinho(
                      produtoSelecionado
                    );
                  }}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#d9ff00]
                    px-5
                    py-4
                    text-sm
                    font-black
                    text-black
                    transition
                    hover:scale-[1.02]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Icon
                    name="shopping-cart"
                    size={18}
                  />

                  Adicionar ao carrinho
                </button>

                <button
                  onClick={() =>
                    alternarFavorito(
                      produtoSelecionado
                    )
                  }
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-5
                    py-4
                    text-sm
                    font-bold
                    transition
                    hover:border-[#d9ff00]/30
                  "
                >
                  <Icon
                    name="heart"
                    size={17}
                    className={
                      ehFavorito(
                        produtoSelecionado.id
                      )
                        ? "fill-[#d9ff00] text-[#d9ff00]"
                        : ""
                    }
                  />

                  {ehFavorito(
                    produtoSelecionado.id
                  )
                    ? "Nos favoritos"
                    : "Adicionar aos favoritos"}
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CARRINHO
      ===================================================== */}

      {carrinhoAberto && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={() => setCarrinhoAberto(false)}
        >
          <aside
            className="
              absolute
              bottom-0
              right-0
              top-0
              flex
              w-full
              max-w-md
              flex-col
              border-l
              border-white/10
              bg-[#090c11]
              shadow-[-20px_0_80px_rgba(0,0,0,0.5)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9ff00]">
                  VOLT Store
                </span>

                <h2 className="mt-1 text-2xl font-black">
                  Seu carrinho
                </h2>
              </div>

              <button
                onClick={() =>
                  setCarrinhoAberto(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
              >
                <Icon name="x" size={19} />
              </button>
            </div>

            {/* ITENS */}

            <div className="flex-1 overflow-y-auto p-5">
              {carrinho.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.03]">
                    <Icon
                      name="shopping-cart"
                      size={34}
                      className="text-zinc-700"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Seu carrinho está vazio
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-600">
                    Adicione seus produtos favoritos
                    para começar.
                  </p>

                  <button
                    onClick={() => {
                      setCarrinhoAberto(false);
                      irPara("produtos");
                    }}
                    className="mt-6 rounded-xl bg-[#d9ff00] px-5 py-3 text-sm font-black text-black"
                  >
                    Explorar produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {carrinho.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] p-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="h-20 w-20 rounded-xl object-cover object-center"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-black">
                            {item.nome}
                          </h3>

                          <p className="mt-1 text-sm font-bold text-[#d9ff00]">
                            {formatarPreco(item.preco)}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center rounded-xl border border-white/10">
                              <button
                                onClick={() =>
                                  alterarQuantidade(
                                    item.id,
                                    item.quantidade - 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white"
                              >
                                <Icon
                                  name="minus"
                                  size={14}
                                />
                              </button>

                              <span className="w-8 text-center text-xs font-black">
                                {item.quantidade}
                              </span>

                              <button
                                onClick={() =>
                                  alterarQuantidade(
                                    item.id,
                                    item.quantidade + 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white"
                              >
                                <Icon
                                  name="plus"
                                  size={14}
                                />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                removerDoCarrinho(
                                  item.id
                                )
                              }
                              className="text-zinc-600 transition hover:text-red-400"
                            >
                              <Icon
                                name="trash-2"
                                size={17}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOTAL */}

            {carrinho.length > 0 && (
              <div className="border-t border-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">
                    Total
                  </span>

                  <strong className="text-2xl font-black">
                    {formatarPreco(totalCarrinho)}
                  </strong>
                </div>

                <button
                  onClick={() =>
                    mostrarNotificacao(
                      "Checkout disponível em breve."
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#d9ff00]
                    px-5
                    py-4
                    text-sm
                    font-black
                    text-black
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Finalizar compra

                  <Icon
                    name="arrow-right"
                    size={18}
                  />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* =====================================================
          ANIMAÇÕES
      ===================================================== */}

      <style>{`
        @keyframes voltFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes voltPulse {
          0%, 100% {
            opacity: .45;
          }

          50% {
            opacity: 1;
          }
        }

        .volt-float {
          animation: voltFloat 5s ease-in-out infinite;
        }

        .volt-pulse {
          animation: voltPulse 2s ease-in-out infinite;
        }

        ::selection {
          background: #d9ff00;
          color: #07090d;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #07090d;
        }

        ::-webkit-scrollbar-thumb {
          background: #d9ff00;
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #efff75;
        }
      `}</style>
    </div>
  );
}

export default App;